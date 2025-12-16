import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Zap, TrendingDown, TrendingUp, Lightbulb, 
  Coffee, Moon, Sun, Sunset, Calendar, CheckCircle2,
  Smile, Frown, Meh, AlertTriangle, Cloud
} from 'lucide-react';
import { format } from 'date-fns';

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

export default function EnergyManagement() {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [energyLevels, setEnergyLevels] = useState({
    morning: 5,
    afternoon: 5,
    evening: 5
  });
  const [mood, setMood] = useState('neutral');
  const [stressLevel, setStressLevel] = useState(5);
  const [notes, setNotes] = useState('');

  const { data: progress } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const progressList = await base44.entities.UserProgress.list();
      if (progressList.length > 0) return progressList[0];
      
      return await base44.entities.UserProgress.create({
        energy_logs: []
      });
    }
  });

  const saveEnergyLogMutation = useMutation({
    mutationFn: async () => {
      if (!progress?.id) {
        throw new Error('Progress record not found');
      }

      const existingLogs = progress?.energy_logs || [];
      const logIndex = existingLogs.findIndex(log => log.date === selectedDate);
      
      const newLog = {
        date: selectedDate,
        morning_energy: energyLevels.morning,
        afternoon_energy: energyLevels.afternoon,
        evening_energy: energyLevels.evening,
        mood: mood,
        stress_level: stressLevel,
        notes: notes
      };

      let updatedLogs;
      if (logIndex >= 0) {
        updatedLogs = [...existingLogs];
        updatedLogs[logIndex] = newLog;
      } else {
        updatedLogs = [...existingLogs, newLog];
      }

      return await base44.entities.UserProgress.update(progress.id, {
        energy_logs: updatedLogs
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userProgress']);
      toast.success('Daily wellness log saved!');
    },
    onError: (error) => {
      toast.error('Failed to save wellness log: ' + error.message);
    }
  });

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

  const getEnergyColor = (level) => {
    if (level <= 3) return 'text-red-600';
    if (level <= 6) return 'text-amber-600';
    return 'text-green-600';
  };

  const getEnergyLabel = (level) => {
    if (level <= 3) return 'Low';
    if (level <= 6) return 'Moderate';
    return 'High';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
          Energy & Wellness Tracking
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Track your energy, mood, and stress levels to identify patterns and manage well-being
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Energy Tracker */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-amber-600" />
                <span>Daily Wellness Tracker</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  max={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sun className="h-5 w-5 text-amber-500" />
                      <span className="text-sm font-medium">Morning</span>
                    </div>
                    <Badge className={getEnergyColor(energyLevels.morning)}>
                      {getEnergyLabel(energyLevels.morning)}
                    </Badge>
                  </div>
                  <Slider
                    value={[energyLevels.morning]}
                    onValueChange={([value]) => setEnergyLevels({ ...energyLevels, morning: value })}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 text-right">{energyLevels.morning}/10</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sunset className="h-5 w-5 text-orange-500" />
                      <span className="text-sm font-medium">Afternoon</span>
                    </div>
                    <Badge className={getEnergyColor(energyLevels.afternoon)}>
                      {getEnergyLabel(energyLevels.afternoon)}
                    </Badge>
                  </div>
                  <Slider
                    value={[energyLevels.afternoon]}
                    onValueChange={([value]) => setEnergyLevels({ ...energyLevels, afternoon: value })}
                    max={10}
                    step={1}
                  />
                  <p className="text-xs text-gray-500 text-right">{energyLevels.afternoon}/10</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Moon className="h-5 w-5 text-indigo-500" />
                      <span className="text-sm font-medium">Evening</span>
                    </div>
                    <Badge className={getEnergyColor(energyLevels.evening)}>
                      {getEnergyLabel(energyLevels.evening)}
                    </Badge>
                  </div>
                  <Slider
                    value={[energyLevels.evening]}
                    onValueChange={([value]) => setEnergyLevels({ ...energyLevels, evening: value })}
                    max={10}
                    step={1}
                  />
                  <p className="text-xs text-gray-500 text-right">{energyLevels.evening}/10</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Overall Mood</Label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="very_low">😢 Very Low</option>
                  <option value="low">😕 Low</option>
                  <option value="neutral">😐 Neutral</option>
                  <option value="good">🙂 Good</option>
                  <option value="excellent">😊 Excellent</option>
                </select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Stress Level</Label>
                  <Badge className={stressLevel >= 7 ? 'bg-red-500' : stressLevel >= 4 ? 'bg-amber-500' : 'bg-green-500'}>
                    {stressLevel >= 7 ? 'High' : stressLevel >= 4 ? 'Moderate' : 'Low'}
                  </Badge>
                </div>
                <Slider
                  value={[stressLevel]}
                  onValueChange={([value]) => setStressLevel(value)}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 text-right">{stressLevel}/10</p>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What affected your energy, mood, or stress today? Any patterns?"
                  rows={3}
                />
              </div>

              <Button
                onClick={() => saveEnergyLogMutation.mutate()}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600"
                disabled={saveEnergyLogMutation.isPending || !progress?.id}
              >
                {saveEnergyLogMutation.isPending ? 'Saving...' : 'Save Wellness Log'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Energy Management Tips */}
        <div className="lg:col-span-2 space-y-6">
          {energyTips.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.title} className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-${category.color}-100`}>
                      <Icon className={`h-6 w-6 text-${category.color}-600`} />
                    </div>
                    <span>{category.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.tips.map((tip, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle2 className={`h-5 w-5 text-${category.color}-600 flex-shrink-0 mt-0.5`} />
                        <span className="text-gray-700 leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}

          {/* Past Logs Summary */}
          {progress?.energy_logs && progress.energy_logs.length > 0 && (
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Recent Energy Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {progress.energy_logs
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 7)
                    .map((log, index) => {
                      const avg = ((log.morning_energy + log.afternoon_energy + log.evening_energy) / 3).toFixed(1);
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">
                            {format(new Date(log.date), 'MMM d, yyyy')}
                          </span>
                          <div className="flex items-center space-x-3">
                            <span className="text-xs text-gray-500">
                              M:{log.morning_energy} A:{log.afternoon_energy} E:{log.evening_energy}
                            </span>
                            <Badge className={getEnergyColor(parseFloat(avg))}>
                              Avg: {avg}
                            </Badge>
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
    </div>
  );
}