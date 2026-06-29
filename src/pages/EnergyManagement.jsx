import React, { useState, useEffect } from 'react';
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
  Zap, TrendingDown, Lightbulb, Coffee, Moon, Sun, Sunset,
  Calendar, CheckCircle2, Activity, Plus, TrendingUp,
  AlertCircle, Thermometer, Clock
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import AddRecordDialog from '../components/records/AddRecordDialog';
import AISymptomInsights from '../components/symptoms/AISymptomInsights';
import BottomSheetSelect from '@/components/ui/bottom-sheet-select';

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
      queryClient.invalidateQueries(['userProgress']);
      toast.success('Daily wellness log saved!');
    },
    onError: (error) => toast.error('Failed to save: ' + error.message)
  });

  const getEnergyColor = (level) => {
    if (level <= 3) return 'text-red-400';
    if (level <= 6) return 'text-amber-400';
    return 'text-green-400';
  };
  const getEnergyLabel = (level) => {
    if (level <= 3) return 'Low';
    if (level <= 6) return 'Moderate';
    return 'High';
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Daily Log */}
      <div className="lg:col-span-1">
        <Card className="bg-slate-800 border-slate-600 sticky top-24">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-amber-600" />
              <span>Daily Wellness Log</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} max={format(new Date(), 'yyyy-MM-dd')} />
            </div>

            {[
              { key: 'morning', icon: Sun, iconColor: 'text-amber-500', label: 'Morning' },
              { key: 'afternoon', icon: Sunset, iconColor: 'text-orange-500', label: 'Afternoon' },
              { key: 'evening', icon: Moon, iconColor: 'text-indigo-500', label: 'Evening' },
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
                <span className={`text-sm font-bold ${stressLevel >= 7 ? 'text-red-400' : stressLevel >= 4 ? 'text-amber-400' : 'text-green-400'}`}>
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
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600"
              disabled={saveEnergyLogMutation.isPending || !progress?.id}>
              {saveEnergyLogMutation.isPending ? 'Saving...' : 'Save Wellness Log'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Tips + History */}
      <div className="lg:col-span-2 space-y-6">
        {energyTips.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.title} className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-${category.color}-100`}>
                    <Icon className={`h-6 w-6 text-${category.color}-600`} />
                  </div>
                  <span className="text-slate-100">{category.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {category.tips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle2 className={`h-5 w-5 text-${category.color}-600 flex-shrink-0 mt-0.5`} />
                      <span className="text-slate-200 leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}

        {progress?.energy_logs && progress.energy_logs.length > 0 && (
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle className="text-slate-100">Recent Energy Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {progress.energy_logs
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 7)
                  .map((log, index) => {
                    const avg = ((log.morning_energy + log.afternoon_energy + log.evening_energy) / 3).toFixed(1);
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                        <span className="text-sm font-medium text-slate-200">
                          {format(new Date(log.date), 'MMM d, yyyy')}
                        </span>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs text-slate-400">M:{log.morning_energy} A:{log.afternoon_energy} E:{log.evening_energy}</span>
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

function SymptomTab({ progress }) {
  const queryClient = useQueryClient();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const { data: symptomRecords, isLoading } = useQuery({
    queryKey: ['symptomRecords'],
    queryFn: async () => await base44.entities.Record.filter({ type: 'symptom' }, '-date', 50)
  });

  const deleteRecordMutation = useMutation({
    mutationFn: async (id) => await base44.entities.Record.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['symptomRecords'])
  });

  const getSeverityColor = (severity) => {
    if (severity >= 8) return 'bg-red-500';
    if (severity >= 6) return 'bg-orange-500';
    if (severity >= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const stats = (() => {
    if (!symptomRecords || symptomRecords.length === 0) return null;
    const recent7 = symptomRecords.slice(0, 7);
    const avgSev = (recent7.reduce((s, r) => s + (r.symptom_details?.severity || 0), 0) / recent7.length).toFixed(1);
    const symptomTypes = [...new Set(symptomRecords.flatMap(r => r.symptom_details?.symptom_type || []))];
    return { totalLogs: symptomRecords.length, recentAvgSeverity: avgSev, uniqueSymptoms: symptomTypes.length, mostRecent: symptomRecords[0] };
  })();

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setShowAddDialog(true)}
          className="bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700">
          <Plus className="h-4 w-4 mr-2" />
          Log Symptom
        </Button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-rose-900/40 to-pink-900/40 border-2 border-rose-600">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Activity className="h-8 w-8 text-rose-400" />
                <TrendingUp className="h-5 w-5 text-rose-400" />
              </div>
              <div className="text-3xl font-bold text-rose-400">{stats.totalLogs}</div>
              <p className="text-sm text-slate-300 mt-1">Total Symptom Logs</p>
              <p className="text-xs text-slate-500 mt-1">{stats.uniqueSymptoms} unique types</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-900/40 to-amber-900/40 border-2 border-orange-600">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Thermometer className="h-8 w-8 text-orange-400" />
                <div className={`h-3 w-3 rounded-full ${getSeverityColor(parseFloat(stats.recentAvgSeverity))}`} />
              </div>
              <div className="text-3xl font-bold text-orange-400">{stats.recentAvgSeverity}/10</div>
              <p className="text-sm text-slate-300 mt-1">Avg Severity (7 days)</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-900/40 to-violet-900/40 border-2 border-purple-600">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="h-8 w-8 text-purple-400" />
                <Clock className="h-5 w-5 text-purple-400" />
              </div>
              <div className="text-lg font-bold text-purple-400">
                {stats.mostRecent ? format(parseISO(stats.mostRecent.date), 'MMM d') : 'N/A'}
              </div>
              <p className="text-sm text-slate-300 mt-1">Last Logged</p>
              {stats.mostRecent?.symptom_details?.symptom_type && (
                <p className="text-xs text-slate-500 mt-1 truncate">
                  {stats.mostRecent.symptom_details.symptom_type.slice(0, 2).join(', ')}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {symptomRecords && symptomRecords.length > 0 && (
        <AISymptomInsights symptomRecords={symptomRecords} progress={progress} />
      )}

      <Card className="bg-slate-800/90 border-2 border-rose-600">
        <CardHeader>
          <CardTitle className="text-slate-200 flex items-center space-x-2">
            <Activity className="h-5 w-5 text-rose-400" />
            <span>Recent Symptom Logs</span>
            <Badge className="bg-rose-600">{symptomRecords?.length || 0}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-slate-400">Loading...</div>
          ) : !symptomRecords || symptomRecords.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <AlertCircle className="h-16 w-16 text-slate-600 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-slate-300 mb-2">No Symptoms Logged Yet</h3>
                <p className="text-slate-400 mb-4">Start tracking to receive AI-powered insights</p>
                <Button onClick={() => setShowAddDialog(true)} className="bg-gradient-to-r from-rose-600 to-orange-600">
                  <Plus className="h-4 w-4 mr-2" /> Log Your First Symptom
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {symptomRecords.slice(0, 10).map((record) => (
                <div key={record.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 hover:border-rose-500 transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-slate-200">{record.title}</h4>
                        <Badge className={`${getSeverityColor(record.symptom_details?.severity)} text-white`}>
                          Severity: {record.symptom_details?.severity}/10
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400">{format(parseISO(record.date), 'MMM d, yyyy')}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => deleteRecordMutation.mutate(record.id)} className="text-slate-500 hover:text-red-400">
                      Delete
                    </Button>
                  </div>
                  {record.symptom_details?.symptom_type && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {record.symptom_details.symptom_type.map((type, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-rose-600 text-rose-400">{type}</Badge>
                      ))}
                    </div>
                  )}
                  {record.symptom_details?.triggers && (
                    <div className="text-sm text-slate-400 mb-1"><span className="text-orange-400">Triggers:</span> {record.symptom_details.triggers}</div>
                  )}
                  {record.symptom_details?.duration && (
                    <div className="text-sm text-slate-400 mb-1"><span className="text-cyan-400">Duration:</span> {record.symptom_details.duration}</div>
                  )}
                  {record.symptom_details?.relief_measures && (
                    <div className="text-sm text-slate-400"><span className="text-green-400">Relief:</span> {record.symptom_details.relief_measures}</div>
                  )}
                  {record.content && (
                    <p className="text-sm text-slate-300 mt-2 pt-2 border-t border-slate-700">{record.content}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddRecordDialog open={showAddDialog} onClose={() => setShowAddDialog(false)} initialType="symptom" />
    </div>
  );
}

export default function EnergyManagement() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('energy');

  const { data: progress } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const progressList = await base44.entities.UserProgress.list();
      if (progressList.length > 0) return progressList[0];
      return await base44.entities.UserProgress.create({ energy_logs: [] });
    }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">
          Energy, Fatigue & Symptoms
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Track your daily energy levels, mood, and symptoms to identify patterns and manage your well-being
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-800 p-1 rounded-xl border border-slate-600">
        <button
          onClick={() => setActiveTab('energy')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'energy' ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="h-4 w-4" />
          Energy & Fatigue
        </button>
        <button
          onClick={() => setActiveTab('symptoms')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'symptoms' ? 'bg-gradient-to-r from-rose-600 to-orange-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="h-4 w-4" />
          Symptom Tracking
        </button>
      </div>

      {activeTab === 'energy' && <EnergyTab progress={progress} queryClient={queryClient} />}
      {activeTab === 'symptoms' && <SymptomTab progress={progress} />}
    </div>
  );
}