import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ComparativeInsights({ progress }) {
  if (!progress || !progress.energy_logs || progress.energy_logs.length < 14) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-brand-muted-foreground text-sm">
          Log at least 14 days of data to see comparative insights
        </CardContent>
      </Card>
    );
  }

  const energyLogs = progress.energy_logs;
  
  // Get current week (last 7 days) vs previous week (8-14 days ago)
  const currentWeek = energyLogs.slice(-7);
  const previousWeek = energyLogs.slice(-14, -7);

  const calculateAverage = (logs, field) => {
    if (logs.length === 0) return 0;
    return logs.reduce((sum, log) => sum + (log[field] || 0), 0) / logs.length;
  };

  const calculateEnergyAverage = (logs) => {
    if (logs.length === 0) return 0;
    return logs.reduce((sum, log) => {
      const avg = ((log.morning_energy || 0) + (log.afternoon_energy || 0) + (log.evening_energy || 0)) / 3;
      return sum + avg;
    }, 0) / logs.length;
  };

  const currentAvgEnergy = calculateEnergyAverage(currentWeek);
  const previousAvgEnergy = calculateEnergyAverage(previousWeek);
  const energyChange = currentAvgEnergy - previousAvgEnergy;

  const currentAvgStress = calculateAverage(currentWeek, 'stress_level');
  const previousAvgStress = calculateAverage(previousWeek, 'stress_level');
  const stressChange = currentAvgStress - previousAvgStress;

  const currentMoods = currentWeek.map(l => l.mood).filter(Boolean);
  const previousMoods = previousWeek.map(l => l.mood).filter(Boolean);

  const moodScore = (mood) => {
    const scores = { very_low: 1, low: 2, neutral: 3, good: 4, excellent: 5 };
    return scores[mood] || 3;
  };

  const currentAvgMood = currentMoods.length > 0
    ? currentMoods.reduce((sum, m) => sum + moodScore(m), 0) / currentMoods.length
    : 0;
  const previousAvgMood = previousMoods.length > 0
    ? previousMoods.reduce((sum, m) => sum + moodScore(m), 0) / previousMoods.length
    : 0;
  const moodChange = currentAvgMood - previousAvgMood;

  const getChangeIndicator = (change, inverse = false) => {
    const threshold = 0.3;
    const isPositive = inverse ? change < -threshold : change > threshold;
    const isNegative = inverse ? change > threshold : change < -threshold;
    
    if (isPositive) {
      return {
        icon: TrendingUp,
        color: 'text-brand-text',
        bg: 'bg-brand-secondary/20',
        border: '!border-brand-secondary',
        text: inverse ? 'Decreased' : 'Improved'
      };
    } else if (isNegative) {
      return {
        icon: TrendingDown,
        color: 'text-destructive',
        bg: 'bg-destructive/10',
        border: '!border-destructive',
        text: inverse ? 'Increased' : 'Declined'
      };
    } else {
      return {
        icon: Minus,
        color: 'text-brand-muted-foreground',
        bg: 'bg-brand-muted',
        border: 'border-brand-border',
        text: 'Stable'
      };
    }
  };

  const energyIndicator = getChangeIndicator(energyChange);
  const stressIndicator = getChangeIndicator(stressChange, true); // inverse: lower stress is better
  const moodIndicator = getChangeIndicator(moodChange);

  const metrics = [
    {
      name: 'Average Energy',
      current: currentAvgEnergy.toFixed(1),
      previous: previousAvgEnergy.toFixed(1),
      change: energyChange,
      indicator: energyIndicator,
      unit: '/10'
    },
    {
      name: 'Stress Level',
      current: currentAvgStress.toFixed(1),
      previous: previousAvgStress.toFixed(1),
      change: stressChange,
      indicator: stressIndicator,
      unit: '/10'
    },
    {
      name: 'Overall Mood',
      current: currentAvgMood.toFixed(1),
      previous: previousAvgMood.toFixed(1),
      change: moodChange,
      indicator: moodIndicator,
      unit: '/5'
    }
  ];

  return (
    <Card className="nv-card--muted">
      <CardHeader>
        <CardTitle className="flex min-w-0 flex-wrap items-center gap-2 text-lg sm:text-xl">
          <Calendar className="h-5 w-5 text-brand-primary" />
          <span className="text-brand-text">Week-over-Week Comparison</span>
          <Badge variant="secondary" className="rounded-pill">
            Trends
          </Badge>
        </CardTitle>
        <p className="text-xs text-brand-muted-foreground mt-1">
          This week vs last week performance
        </p>
      </CardHeader>

      <CardContent className="space-y-3 [overflow-wrap:anywhere]">
        {metrics.map((metric, idx) => {
          const Icon = metric.indicator.icon;
          const changeAbs = Math.abs(metric.change);
          const changePercent = metric.previous > 0 
            ? ((metric.change / metric.previous) * 100).toFixed(0)
            : '0';

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`nv-card ${metric.indicator.border} p-4`}
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-brand-text text-sm">{metric.name}</p>
                <Badge variant="outline" className={`${metric.indicator.bg} ${metric.indicator.color} rounded-pill border-0`}>
                  <Icon className="h-3 w-3 mr-1" />
                  {metric.indicator.text}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-3">
                <div>
                  <p className="text-xs text-brand-muted-foreground mb-1">Previous Week</p>
                  <p className="text-lg font-bold text-brand-text">
                    {metric.previous}<span className="text-xs">{metric.unit}</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-brand-muted-foreground mb-1">This Week</p>
                  <p className="text-lg font-bold text-brand-text">
                    {metric.current}<span className="text-xs">{metric.unit}</span>
                  </p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-xs text-brand-muted-foreground mb-1">Change</p>
                  <p className={`text-lg font-bold ${metric.indicator.color}`}>
                    {metric.change > 0 ? '+' : ''}{changeAbs.toFixed(1)}
                    <span className="text-xs ml-1">({changePercent}%)</span>
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Overall Summary */}
        <div className="nv-card mt-4 p-4">
          <p className="text-xs font-semibold text-brand-text mb-2">Summary:</p>
          <p className="text-xs text-brand-muted-foreground">
            {energyIndicator.text === 'Improved' && 'Your energy levels are trending upward. '}
            {energyIndicator.text === 'Declined' && 'Your energy has decreased this week. Consider reviewing your activity levels and rest periods. '}
            {stressIndicator.text === 'Decreased' && 'Great job managing stress! '}
            {stressIndicator.text === 'Increased' && 'Stress levels have increased. Try stress reduction techniques or adjust your workload. '}
            {moodIndicator.text === 'Improved' && 'Your mood is improving. '}
            {moodIndicator.text === 'Declined' && 'Mood has decreased. Reach out for support if needed. '}
            Keep tracking to identify longer-term patterns.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}