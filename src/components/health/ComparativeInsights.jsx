import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ComparativeInsights({ progress }) {
  if (!progress || !progress.energy_logs || progress.energy_logs.length < 14) {
    return (
      <Card className="bg-slate-800/90 border-2 border-slate-600">
        <CardContent className="py-8 text-center text-slate-400 text-sm">
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
        color: 'text-green-400',
        bg: 'bg-green-500/20',
        border: 'border-green-500',
        text: inverse ? 'Decreased' : 'Improved'
      };
    } else if (isNegative) {
      return {
        icon: TrendingDown,
        color: 'text-red-400',
        bg: 'bg-red-500/20',
        border: 'border-red-500',
        text: inverse ? 'Increased' : 'Declined'
      };
    } else {
      return {
        icon: Minus,
        color: 'text-slate-400',
        bg: 'bg-slate-500/20',
        border: 'border-slate-500',
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
    <Card className="bg-gradient-to-br from-teal-900/40 to-green-900/40 border-2 border-teal-600 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-teal-400" />
          <span className="text-slate-200">Week-over-Week Comparison</span>
          <Badge className="bg-gradient-to-r from-teal-600 to-green-600 text-white">
            Trends
          </Badge>
        </CardTitle>
        <p className="text-xs text-slate-400 mt-1">
          This week vs last week performance
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
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
              className={`bg-slate-800/70 rounded-lg p-4 border-2 ${metric.indicator.border}`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-slate-200 text-sm">{metric.name}</p>
                <Badge className={`${metric.indicator.bg} ${metric.indicator.color} border-0`}>
                  <Icon className="h-3 w-3 mr-1" />
                  {metric.indicator.text}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Previous Week</p>
                  <p className="text-lg font-bold text-slate-300">
                    {metric.previous}<span className="text-xs">{metric.unit}</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">This Week</p>
                  <p className="text-lg font-bold text-slate-200">
                    {metric.current}<span className="text-xs">{metric.unit}</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Change</p>
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
        <div className="bg-slate-800/90 rounded-lg p-3 border border-slate-600 mt-4">
          <p className="text-xs font-semibold text-slate-300 mb-2">Summary:</p>
          <p className="text-xs text-slate-400 leading-relaxed">
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