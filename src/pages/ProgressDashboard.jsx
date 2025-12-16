import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, TrendingDown, Download, Calendar, CheckCircle2,
  Zap, Heart, BookOpen, Sparkles, Activity, Share2
} from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { toast } from 'sonner';
import ShareReportDialog from '../components/dashboard/ShareReportDialog';

export default function ProgressDashboard() {
  const [dateRange, setDateRange] = useState('7'); // days
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const { data: progress } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const progressList = await base44.entities.UserProgress.list();
      return progressList[0] || null;
    }
  });

  const { data: checklistData } = useQuery({
    queryKey: ['checklistData'],
    queryFn: async () => {
      // Checklist structure from Checklist page
      return [
        {
          phase: 'Before You Return',
          sections: [
            { title: 'Understand Your Rights', items: 6 },
            { title: 'Document Everything', items: 4 },
            { title: 'Assess Your Needs', items: 5 }
          ]
        },
        {
          phase: 'Planning Your Return',
          sections: [
            { title: 'Communicate with Your Employer', items: 5 },
            { title: 'Request Accommodations', items: 4 },
            { title: 'Prepare Yourself', items: 4 }
          ]
        },
        {
          phase: 'Your First Week Back',
          sections: [
            { title: 'Manage Expectations', items: 4 },
            { title: 'Practice Self-Care', items: 5 },
            { title: 'Monitor & Adjust', items: 3 }
          ]
        },
        {
          phase: 'Ongoing Success',
          sections: [
            { title: 'Maintain Your Health', items: 4 },
            { title: 'Advocate for Yourself', items: 3 },
            { title: 'Build Support Systems', items: 3 }
          ]
        }
      ];
    }
  });

  // Calculate metrics
  const getMetrics = () => {
    if (!progress) return null;

    const totalChecklistItems = checklistData?.reduce((sum, phase) => 
      sum + phase.sections.reduce((s, section) => s + section.items, 0), 0
    ) || 0;

    const completedItems = progress.completed_checklist_items?.length || 0;
    const completionRate = totalChecklistItems > 0 
      ? Math.round((completedItems / totalChecklistItems) * 100)
      : 0;

    const recentLogs = progress.energy_logs?.slice(-parseInt(dateRange)) || [];
    const avgEnergy = recentLogs.length > 0
      ? recentLogs.reduce((sum, log) => 
          sum + ((log.morning_energy + log.afternoon_energy + log.evening_energy) / 3), 0
        ) / recentLogs.length
      : 0;

    const avgStress = recentLogs.length > 0
      ? recentLogs.reduce((sum, log) => sum + (log.stress_level || 5), 0) / recentLogs.length
      : 0;

    const moodDistribution = recentLogs.reduce((acc, log) => {
      acc[log.mood] = (acc[log.mood] || 0) + 1;
      return acc;
    }, {});

    const daysTracked = progress.energy_logs?.length || 0;
    const bookmarkedCount = progress.bookmarked_resources?.length || 0;
    const ratedCount = Object.keys(progress.resource_ratings || {}).length;

    const returnDate = progress.return_date ? parseISO(progress.return_date) : null;
    const daysUntilReturn = returnDate ? differenceInDays(returnDate, new Date()) : null;

    return {
      completedItems,
      completionRate,
      avgEnergy: avgEnergy.toFixed(1),
      avgStress: avgStress.toFixed(1),
      moodDistribution,
      daysTracked,
      bookmarkedCount,
      ratedCount,
      daysUntilReturn,
      totalChecklistItems
    };
  };

  // Prepare energy trend data
  const getEnergyTrendData = () => {
    if (!progress?.energy_logs) return [];
    
    const logs = progress.energy_logs.slice(-parseInt(dateRange));
    return logs.map(log => ({
      date: format(parseISO(log.date), 'MM/dd'),
      morning: log.morning_energy,
      afternoon: log.afternoon_energy,
      evening: log.evening_energy,
      stress: log.stress_level
    }));
  };

  // Prepare mood distribution data
  const getMoodDistributionData = () => {
    const metrics = getMetrics();
    if (!metrics) return [];

    const moodLabels = {
      very_low: 'Very Low',
      low: 'Low',
      neutral: 'Neutral',
      good: 'Good',
      excellent: 'Excellent'
    };

    return Object.entries(metrics.moodDistribution).map(([mood, count]) => ({
      name: moodLabels[mood] || mood,
      value: count
    }));
  };

  // Prepare checklist progress by phase
  const getChecklistProgressData = () => {
    if (!checklistData || !progress) return [];

    return checklistData.map(phase => {
      const phaseTotal = phase.sections.reduce((sum, section) => sum + section.items, 0);
      const phaseCompleted = progress.completed_checklist_items?.filter(id => 
        id.startsWith(phase.phase.toLowerCase().replace(/\s+/g, '-'))
      ).length || 0;

      return {
        phase: phase.phase,
        completed: phaseCompleted,
        remaining: phaseTotal - phaseCompleted
      };
    });
  };

  // Export data
  const handleExport = () => {
    if (!progress) return;

    const exportData = {
      exportDate: new Date().toISOString(),
      summary: getMetrics(),
      energyLogs: progress.energy_logs,
      completedChecklistItems: progress.completed_checklist_items,
      bookmarkedResources: progress.bookmarked_resources,
      resourceRatings: progress.resource_ratings,
      accommodations: progress.accommodations_requested,
      journeyStage: progress.journey_stage,
      returnDate: progress.return_date,
      calendarEvents: progress.calendar_events
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `progress-dashboard-${format(new Date(), 'yyyy-MM-dd')}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Progress data exported successfully');
  };

  const metrics = getMetrics();
  const energyTrendData = getEnergyTrendData();
  const moodData = getMoodDistributionData();
  const checklistProgressData = getChecklistProgressData();

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'];

  if (!progress) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50">
          <CardContent className="pt-16 pb-16 text-center">
            <Activity className="h-16 w-16 text-indigo-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Progress Data Yet</h3>
            <p className="text-gray-600">Start tracking your energy and completing checklist items to see your progress!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Progress Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Track your return-to-work journey</p>
        </div>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border-2 border-indigo-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="7">Last 7 days</option>
            <option value="14">Last 14 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <Button
            onClick={handleExport}
            variant="outline"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button
            onClick={() => setShareDialogOpen(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="h-8 w-8 text-blue-600" />
              {metrics.completionRate > 50 ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-orange-600" />
              )}
            </div>
            <div className="text-3xl font-bold text-blue-600">{metrics.completionRate}%</div>
            <p className="text-sm text-gray-600 mt-1">Checklist Complete</p>
            <p className="text-xs text-gray-500 mt-1">
              {metrics.completedItems} of {metrics.totalChecklistItems} items
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Zap className="h-8 w-8 text-amber-600" />
              {parseFloat(metrics.avgEnergy) >= 6 ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-orange-600" />
              )}
            </div>
            <div className="text-3xl font-bold text-amber-600">{metrics.avgEnergy}/10</div>
            <p className="text-sm text-gray-600 mt-1">Avg Energy Level</p>
            <p className="text-xs text-gray-500 mt-1">
              {metrics.daysTracked} days tracked
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Heart className="h-8 w-8 text-rose-600" />
              {parseFloat(metrics.avgStress) <= 5 ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-orange-600" />
              )}
            </div>
            <div className="text-3xl font-bold text-rose-600">{metrics.avgStress}/10</div>
            <p className="text-sm text-gray-600 mt-1">Avg Stress Level</p>
            <p className="text-xs text-gray-500 mt-1">
              Lower is better
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="h-8 w-8 text-purple-600" />
              <Sparkles className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600">{metrics.bookmarkedCount}</div>
            <p className="text-sm text-gray-600 mt-1">Resources Saved</p>
            <p className="text-xs text-gray-500 mt-1">
              {metrics.ratedCount} rated
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Return Date Countdown */}
      {metrics.daysUntilReturn !== null && (
        <Card className="bg-gradient-to-r from-teal-50 via-emerald-50 to-green-50 border-2 border-teal-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Calendar className="h-12 w-12 text-teal-600" />
                <div>
                  <p className="text-sm text-gray-600">Return to Work In</p>
                  <p className="text-4xl font-bold text-teal-600">
                    {metrics.daysUntilReturn > 0 ? `${metrics.daysUntilReturn} days` : 'Today!'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {format(parseISO(progress.return_date), 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>
              <Badge className="bg-teal-500 text-white capitalize text-lg px-4 py-2">
                {progress.journey_stage.replace('_', ' ')}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Energy Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-amber-600" />
              <span>Energy & Stress Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {energyTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={energyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="morning" stroke="#f59e0b" name="Morning" strokeWidth={2} />
                  <Line type="monotone" dataKey="afternoon" stroke="#3b82f6" name="Afternoon" strokeWidth={2} />
                  <Line type="monotone" dataKey="evening" stroke="#8b5cf6" name="Evening" strokeWidth={2} />
                  <Line type="monotone" dataKey="stress" stroke="#ef4444" name="Stress" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                <p>No energy data tracked yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mood Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-rose-600" />
              <span>Mood Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {moodData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={moodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {moodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                <p>No mood data tracked yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Checklist Progress by Phase */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
            <span>Checklist Progress by Phase</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {checklistProgressData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={checklistProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="phase" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" stackId="a" fill="#22c55e" name="Completed" />
                <Bar dataKey="remaining" stackId="a" fill="#e5e7eb" name="Remaining" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              <p>No checklist data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            <span>Key Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {parseFloat(metrics.avgEnergy) < 5 && (
            <div className="flex items-start space-x-3 p-3 bg-amber-100 rounded-lg">
              <TrendingDown className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900">Low Energy Pattern</p>
                <p className="text-sm text-amber-700">Your average energy is below 5. Consider workplace accommodations and pacing strategies.</p>
              </div>
            </div>
          )}
          
          {parseFloat(metrics.avgStress) >= 7 && (
            <div className="flex items-start space-x-3 p-3 bg-rose-100 rounded-lg">
              <TrendingDown className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-900">High Stress Levels</p>
                <p className="text-sm text-rose-700">Your stress is elevated. Explore stress management techniques in the Wellness Resources section.</p>
              </div>
            </div>
          )}
          
          {metrics.completionRate >= 75 && (
            <div className="flex items-start space-x-3 p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900">Great Progress!</p>
                <p className="text-sm text-green-700">You've completed {metrics.completionRate}% of your checklist. Keep up the excellent work!</p>
              </div>
            </div>
          )}
          
          {metrics.daysTracked >= 7 && (
            <div className="flex items-start space-x-3 p-3 bg-blue-100 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900">Consistent Tracking</p>
                <p className="text-sm text-blue-700">You've tracked {metrics.daysTracked} days of energy data. This helps identify patterns!</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Share Report Dialog */}
      <ShareReportDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        progress={progress}
        metrics={metrics}
      />
    </div>
  );
}