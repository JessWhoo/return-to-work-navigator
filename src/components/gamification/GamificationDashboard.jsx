import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Award, TrendingUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import LevelDisplay from './LevelDisplay';
import BadgeDisplay from './BadgeDisplay';
import { BADGES } from './GamificationSystem';

export default function GamificationDashboard({ progress }) {
  const gamification = progress?.gamification || {
    total_points: 0,
    level: 1,
    badges: [],
    current_streak: 0,
    longest_streak: 0
  };
  
  const earnedBadges = gamification.badges || [];
  const allBadgeIds = Object.keys(BADGES);
  const lockedBadges = allBadgeIds.filter(id => !earnedBadges.includes(id));

  return (
    <div className="space-y-6">
      <LevelDisplay points={gamification.total_points} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Current Streak', value: gamification.current_streak, note: 'days in a row', icon: Flame },
          { label: 'Badges Earned', value: earnedBadges.length, note: `of ${allBadgeIds.length} total`, icon: Award },
          { label: 'Longest Streak', value: gamification.longest_streak, note: 'personal best', icon: TrendingUp }
        ].map(({ label, value, note, icon: Icon }) => <motion.div key={label} whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}><Card className="nv-card--muted"><CardContent className="pt-6"><div className="flex items-center justify-between gap-2"><div><p className="text-sm text-brand-muted-foreground">{label}</p><p className="text-3xl font-bold text-brand-primary">{value}</p><p className="text-xs text-brand-muted-foreground">{note}</p></div><Icon className="h-12 w-12 text-brand-primary shrink-0" /></div></CardContent></Card></motion.div>)}
      </div>
      <Card>
        <CardHeader><CardTitle className="text-xl text-brand-text flex items-center gap-2 flex-wrap"><Award className="h-6 w-6 text-brand-primary" /><span>Your Badges</span><Badge className="ml-auto">{earnedBadges.length}</Badge></CardTitle></CardHeader>
        <CardContent>{earnedBadges.length === 0 ? <div className="text-center py-8"><Zap className="h-12 w-12 text-brand-primary mx-auto mb-3" /><p className="text-brand-muted-foreground">Complete actions to earn your first badge!</p></div> : <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">{earnedBadges.map(badgeId => <BadgeDisplay key={badgeId} badgeId={badgeId} size="md" />)}</div>}</CardContent>
      </Card>
      {lockedBadges.length > 0 && <Card className="nv-card--muted"><CardHeader><CardTitle className="text-xl text-brand-text flex items-center gap-2 flex-wrap"><span>Badges to Unlock</span><Badge variant="outline" className="ml-auto">{lockedBadges.length} remaining</Badge></CardTitle></CardHeader><CardContent><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">{lockedBadges.slice(0, 8).map(badgeId => <BadgeDisplay key={badgeId} badgeId={badgeId} size="md" locked />)}</div></CardContent></Card>}
    </div>
  );
}