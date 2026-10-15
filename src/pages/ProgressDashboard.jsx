import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';
import PullToRefresh from '../components/PullToRefresh';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { useUserProgress } from '@/hooks/useUserProgress';
import { checklistData, getChecklistTotalItems, getPhaseItems, getCompletedChecklistIds } from '@/components/checklist/checklistData';
import BottomSheetSelect from '@/components/ui/bottom-sheet-select';
import useSEO from '@/hooks/useSEO';

export default function ProgressDashboard({ embedded = false }) {
  useSEO({
    title: 'Return-to-Work Energy, Mood & Milestone Analytics',
    description:
      'Visualize your daily workday energy trends, mood distribution, and four-phase checklist completion as you transition back to work.',
    path: '/ProgressDashboard',
    enabled: !embedded,
  });
  const [dateRange, setDateRange] = useState('7'); // days
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleRefresh = async () => {
    await queryClient.invalidateQueries();
  };

  const { data: progress } = useUserProgress();

  // Calculate metrics
  const getMetrics = () => {
    if (!progress) return null;

    const totalChecklistItems = getChecklistTotalItems();

    // Count only this checklist's ids — the same UserProgress array also holds
    // Legal Rights and Disclosure Guide items.
    const completedItems = getCompletedChecklistIds(progress.completed_checklist_items).length;
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
      const phaseItems = getPhaseItems(phase);
      const phaseCompleted = phaseItems.filter(item =>
        progress.completed_checklist_items?.includes(item.id)
      ).length;

      return {
        phase: phase.phase,
        shortPhase: phase.phase.split(':')[0],
        completed: phaseCompleted,
        remaining: phaseItems.length - phaseCompleted
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

    // Track export
    base44.analytics.track({
      eventName: 'progress_data_exported',
      properties: {
        journey_stage: progress.journey_stage,
        days_tracked: progress.energy_logs?.length || 0,
        checklist_completion: getMetrics().completionRate
      }
    });

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

  const COLORS = ['#B5413F', '#E3A9B2', '#C9CCE2', '#8FB79A', '#6B5F7E'];

  const HeadingTag = embedded ? 'h2' : 'h1';

  if (!progress) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <p className="nv-eyebrow nv-eyebrow--primary">Your journey</p>
          <HeadingTag className="mt-1 font-heading text-3xl font-bold text-brand-text">Return-to-Work Progress &amp; Energy Analytics Dashboard</HeadingTag>
          <p className="mt-2 text-brand-muted-foreground">Visualize your daily energy trends, mood distribution, and four-phase preparation checklist completion.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {checklistData.map((phase, idx) => {
            const phaseItems = getPhaseItems(phase);
            return (
              <Card key={phase.phase}>
                <CardContent className="p-5 space-y-2">
                  <span className="nv-eyebrow nv-eyebrow--primary">Phase {idx + 1}</span>
                  <h3 className="font-heading text-base font-bold text-brand-text">
                    {phase.phase.replace(/^Phase \d+:\s*/, '')}
                  </h3>
                  <p className="text-xs font-semibold text-brand-primary">{phaseItems.length} guided milestones</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <Card className="nv-card--muted">
          <CardContent className="pt-10 pb-10 text-center space-y-3">
            <Activity className="mx-auto h-12 w-12 text-brand-primary" />
            <h3 className="font-heading text-xl font-bold text-brand-text">Track Your Personal Return-to-Work Analytics</h3>
            <p className="mx-auto max-w-2xl text-sm text-brand-muted-foreground">
              Log your morning, afternoon, and evening workday energy levels, check off preparation milestones, and export printable PDF summaries for your records or HR meetings.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="nv-eyebrow nv-eyebrow--primary">Your journey</p>
          <HeadingTag className="mt-1 font-heading text-3xl font-bold text-brand-text">Return-to-Work Progress &amp; Energy Analytics Dashboard</HeadingTag>
          <p className="mt-2 text-brand-muted-foreground">Visualize your daily energy trends, mood distribution, and checklist completion</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <BottomSheetSelect
            value={dateRange}
            onValueChange={setDateRange}
            ariaLabel="Date range"
            title="Date range"
            className="text-sm"
            options={[
              { value: '7', label: 'Last 7 days' },
              { value: '14', label: 'Last 14 days' },
              { value: '30', label: 'Last 30 days' },
              { value: '90', label: 'Last 90 days' },
            ]}
          />
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
          <Button onClick={() => setShareDialogOpen(true)}>
            <Share2 className="h-4 w-4" />
            Share Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-pill bg-brand-muted p-2 text-brand-primary">
                <CheckCircle2 className="h-6 w-6" />
              </span>
              {metrics.completionRate > 50 ? (
                <TrendingUp className="h-5 w-5 text-brand-muted-foreground" />
              ) : (
                <TrendingDown className="h-5 w-5 text-brand-muted-foreground" />
              )}
            </div>
            <div className="font-heading text-3xl font-bold text-brand-text">{metrics.completionRate}%</div>
            <p className="mt-1 text-sm text-brand-muted-foreground">Checklist Complete</p>
            <p className="mt-1 text-xs text-brand-muted-foreground">
              {metrics.completedItems} of {metrics.totalChecklistItems} items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-pill bg-brand-muted p-2 text-brand-primary">
                <Zap className="h-6 w-6" />
              </span>
              {parseFloat(metrics.avgEnergy) >= 6 ? (
                <TrendingUp className="h-5 w-5 text-brand-muted-foreground" />
              ) : (
                <TrendingDown className="h-5 w-5 text-brand-muted-foreground" />
              )}
            </div>
            <div className="font-heading text-3xl font-bold text-brand-text">{metrics.avgEnergy}/10</div>
            <p className="mt-1 text-sm text-brand-muted-foreground">Avg Energy Level</p>
            <p className="mt-1 text-xs text-brand-muted-foreground">
              {metrics.daysTracked} days tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-pill bg-brand-muted p-2 text-brand-primary">
                <Heart className="h-6 w-6" />
              </span>
              {parseFloat(metrics.avgStress) <= 5 ? (
                <TrendingUp className="h-5 w-5 text-brand-muted-foreground" />
              ) : (
                <TrendingDown className="h-5 w-5 text-brand-muted-foreground" />
              )}
            </div>
            <div className="font-heading text-3xl font-bold text-brand-text">{metrics.avgStress}/10</div>
            <p className="mt-1 text-sm text-brand-muted-foreground">Avg Stress Level</p>
            <p className="mt-1 text-xs text-brand-muted-foreground">
              Lower is better
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-pill bg-brand-muted p-2 text-brand-primary">
                <BookOpen className="h-6 w-6" />
              </span>
              <Sparkles className="h-5 w-5 text-brand-muted-foreground" />
            </div>
            <div className="font-heading text-3xl font-bold text-brand-text">{metrics.bookmarkedCount}</div>
            <p className="mt-1 text-sm text-brand-muted-foreground">Resources Saved</p>
            <p className="mt-1 text-xs text-brand-muted-foreground">
              {metrics.ratedCount} rated
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Return Date Countdown */}
      {metrics.daysUntilReturn !== null && (
        <Card className="nv-card--muted">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Calendar className="h-10 w-10 text-brand-primary" />
                <div>
                  <p className="nv-eyebrow">Return to work in</p>
                  <p className="font-heading text-3xl font-bold text-brand-text">
                    {metrics.daysUntilReturn > 0 ? `${metrics.daysUntilReturn} days` : 'Today!'}
                  </p>
                  <p className="mt-1 text-xs text-brand-muted-foreground">
                    {format(parseISO(progress.return_date), 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>
              <span className="nv-chip self-start capitalize sm:self-auto">
                {progress.journey_stage.replace('_', ' ')}
              </span>
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
              <Zap className="h-5 w-5 text-brand-primary" />
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
                  <Line type="monotone" dataKey="morning" stroke="#6B5F7E" name="Morning" strokeWidth={2} />
                  <Line type="monotone" dataKey="afternoon" stroke="#8FB79A" name="Afternoon" strokeWidth={2} />
                  <Line type="monotone" dataKey="evening" stroke="#E3A9B2" name="Evening" strokeWidth={2} />
                  <Line type="monotone" dataKey="stress" stroke="#B5413F" name="Stress" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-brand-muted-foreground">
                <p>No energy data tracked yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mood Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-brand-primary" />
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
              <div className="h-[300px] flex items-center justify-center text-brand-muted-foreground">
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
            <CheckCircle2 className="h-5 w-5 text-brand-primary" />
            <span>Checklist Progress by Phase</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {checklistProgressData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={checklistProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="shortPhase" />
                <YAxis />
                <Tooltip labelFormatter={(label) => checklistProgressData.find(d => d.shortPhase === label)?.phase || label} />
                <Legend />
                <Bar dataKey="completed" stackId="a" fill="#8FB79A" name="Completed" />
                <Bar dataKey="remaining" stackId="a" fill="#ECE8F0" name="Remaining" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-brand-muted-foreground">
              <p>No checklist data available</p>
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
    </PullToRefresh>
  );
}