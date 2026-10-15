import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { 
  Zap, TrendingDown, Lightbulb, Coffee, Moon, Sun, Sunset,
  Calendar, CheckCircle2
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import BottomSheetSelect from '@/components/ui/bottom-sheet-select';
import DownloadPlannerButton from '../components/planner/DownloadPlannerButton';
import { useUserProgress } from '@/hooks/useUserProgress';
import useSEO from '@/hooks/useSEO';

// Static class maps — Tailwind purges dynamically built class names.
const TIP_BG = { amber: 'bg-muted', blue: 'bg-muted', teal: 'bg-muted', rose: 'bg-muted' };
const TIP_TEXT = { amber: 'text-primary', blue: 'text-primary', teal: 'text-brand-secondary', rose: 'text-brand-destructive' };

const energyTips = [
  {
    title: 'Pacing Strategies',
    icon: Zap,
    color: 'amber',
    tips: [
      'Break tasks into smaller chunks with rest periods in between',
      'Schedule demanding tasks during your highest energy times',
      'Use the "spoon theory" - you have limited energy units each day',
      'Plan important meetings when you typically feel best',
      'Build in buffer time between activities',
      'Learn to say no to non-essential tasks'
    ]
  },
  {
    title: 'Energy Conservation',
    icon: Lightbulb,
    color: 'blue',
    tips: [
      'Sit rather than stand when possible',
      'Keep frequently used items within easy reach',
      'Use voice-to-text for long emails',
      'Delegate tasks when appropriate',
      'Combine trips (physical and virtual)',
      'Prep meals and outfits the night before work'
    ]
  },
  {
    title: 'Workplace Adjustments',
    icon: Coffee,
    color: 'teal',
    tips: [
      'Request a flexible start time to avoid rush hour',
      'Take short "energy breaks" every 90 minutes',
      'Work from home on high-fatigue days',
      'Keep healthy snacks at your desk',
      'Stay hydrated throughout the day',
      'Use lunch break for actual rest, not errands'
    ]
  },
  {
    title: 'Recognize Warning Signs',
    icon: TrendingDown,
    color: 'rose',
    tips: [
      'Difficulty concentrating or "chemo brain"',
      'Needing extra time to complete usual tasks',
      'Feeling irritable or emotionally drained',
      'Physical exhaustion that rest doesn\'t fix',
      'Wanting to cancel commitments',
      'These signs mean you need to adjust your pace'
    ]
  }
];

function EnergyTab({ progress, queryClient }) {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [energyLevels, setEnergyLevels] = useState({ morning: 5, afternoon: 5, evening: 5 });
  const [mood, setMood] = useState('neutral');
  const [stressLevel, setStressLevel] = useState(5);
  const [notes, setNotes] = useState('');

  const todayLog = progress?.energy_logs?.find(log => log.date === selectedDate);

  React.useEffect(() => {
    if (todayLog) {
      setEnergyLevels({
        morning: todayLog.morning_energy,
        afternoon: todayLog.afternoon_energy,
        evening: todayLog.evening_energy
      });
      setMood(todayLog.mood || 'neutral');
      setStressLevel(todayLog.stress_level || 5);
      setNotes(todayLog.notes || '');
    } else {
      setEnergyLevels({ morning: 5, afternoon: 5, evening: 5 });
      setMood('neutral');
      setStressLevel(5);
      setNotes('');
    }
  }, [selectedDate, todayLog]);

  const saveEnergyLogMutation = useMutation({
    mutationFn: async () => {
      if (!progress?.id) throw new Error('Progress record not found');
      const existingLogs = progress?.energy_logs || [];
      const logIndex = existingLogs.findIndex(log => log.date === selectedDate);
      const newLog = {
        date: selectedDate,
        morning_energy: energyLevels.morning,
        afternoon_energy: energyLevels.afternoon,
        evening_energy: energyLevels.evening,
        mood, stress_level: stressLevel, notes
      };
      const updatedLogs = logIndex >= 0
        ? existingLogs.map((l, i) => i === logIndex ? newLog : l)
        : [...existingLogs, newLog];
      return await base44.entities.UserProgress.update(progress.id, { energy_logs: updatedLogs });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
      toast.success('Daily wellness log saved!');
    },
    onError: (error) => toast.error('Failed to save: ' + error.message)
  });

  const getEnergyColor = (level) => {
    if (level <= 3) return 'text-brand-destructive';
    if (level <= 6) return 'text-primary';
    return 'text-brand-secondary';
  };
  const getEnergyLabel = (level) => {
    if (level <= 3) return 'Low';
    if (level <= 6) return 'Moderate';
    return 'High';
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Daily Log */}
      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Daily Wellness Log</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} max={format(new Date(), 'yyyy-MM-dd')} />
            </div>

            {[
              { key: 'morning', icon: Sun, iconColor: 'text-primary', label: 'Morning' },
              { key: 'afternoon', icon: Sunset, iconColor: 'text-primary', label: 'Afternoon' },
              { key: 'evening', icon: Moon, iconColor: 'text-primary', label: 'Evening' },
            ].map(({ key, icon: Icon, iconColor, label }) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className={`h-4 w-4 ${iconColor}`} />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  <span className={`text-sm font-bold ${getEnergyColor(energyLevels[key])}`}>
                    {getEnergyLabel(energyLevels[key])} ({energyLevels[key]}/10)
                  </span>
                </div>
                <Slider value={[energyLevels[key]]} onValueChange={([v]) => setEnergyLevels({ ...energyLevels, [key]: v })} max={10} step={1} />
              </div>
            ))}

            <div className="space-y-2">
              <Label>Overall Mood</Label>
              <BottomSheetSelect
                value={mood}
                onValueChange={setMood}
                title="How are you feeling overall?"
                options={[
                  { value: 'very_low', label: '😢 Very Low' },
                  { value: 'low', label: '😕 Low' },
                  { value: 'neutral', label: '😐 Neutral' },
                  { value: 'good', label: '🙂 Good' },
                  { value: 'excellent', label: '😊 Excellent' },
                ]}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Stress Level</Label>
                <span className={`text-sm font-bold ${stressLevel >= 7 ? 'text-brand-destructive' : stressLevel >= 4 ? 'text-primary' : 'text-brand-secondary'}`}>
                  {stressLevel >= 7 ? 'High' : stressLevel >= 4 ? 'Moderate' : 'Low'} ({stressLevel}/10)
                </span>
              </div>
              <Slider value={[stressLevel]} onValueChange={([v]) => setStressLevel(v)} max={10} step={1} />
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                placeholder="What affected your energy or mood today?" rows={3} />
            </div>

            <Button onClick={() => saveEnergyLogMutation.mutate()}
              className="w-full"
              disabled={saveEnergyLogMutation.isPending || !progress?.id}>
              {saveEnergyLogMutation.isPending ? 'Saving...' : 'Save Wellness Log'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Tips + History */}
      <div className="space-y-6 lg:col-span-2">
        {energyTips.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.title}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className={`rounded-brand p-2 ${TIP_BG[category.color]}`}>
                    <Icon className={`h-6 w-6 ${TIP_TEXT[category.color]}`} />
                  </div>
                  <span className="text-foreground">{category.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {category.tips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle2 className={`mt-0.5 h-5 w-5 flex-shrink-0 ${TIP_TEXT[category.color]}`} />
                      <span className="leading-relaxed text-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}

        {progress?.energy_logs && progress.energy_logs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Recent Energy Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[...progress.energy_logs]
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 7)
                  .map((log, index) => {
                    const avg = ((log.morning_energy + log.afternoon_energy + log.evening_energy) / 3).toFixed(1);
                    return (
                      <div key={index} className="flex items-center justify-between rounded-brand bg-muted p-3">
                        <span className="text-sm font-medium text-foreground">
                          {format(parseISO(log.date), 'MMM d, yyyy')}
                        </span>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs text-muted-foreground">M:{log.morning_energy} A:{log.afternoon_energy} E:{log.evening_energy}</span>
                          <span className={`text-sm font-bold ${getEnergyColor(parseFloat(avg))}`}>Avg: {avg}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function EnergyManagement({ embedded = false }) {
  useSEO({
    title: 'Daily Workday Energy & Fatigue Pacing Tracker',
    description:
      'Log morning, afternoon, and evening energy levels and uncover daily patterns to pace your workday without burnout.',
    path: '/EnergyManagement',
    enabled: !embedded,
  });
  const queryClient = useQueryClient();

  const { data: progress } = useUserProgress({ energy_logs: [] });

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="space-y-4 text-center">
        {embedded ? (
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Daily Workday Energy &amp; Fatigue Pacing Tracker
          </h2>
        ) : (
          <h1 className="font-heading text-4xl font-bold text-foreground">
            Daily Workday Energy &amp; Fatigue Pacing Tracker
          </h1>
        )}
        <p className="mx-auto max-w-2xl text-lg font-medium text-muted-foreground">
          Track your morning, afternoon, and evening energy levels and mood to pace your workday and conserve energy
        </p>
        <div className="flex justify-center pt-2">
          <DownloadPlannerButton weeks={1} />
        </div>
      </div>

      <EnergyTab progress={progress} queryClient={queryClient} />
    </div>
  );
}