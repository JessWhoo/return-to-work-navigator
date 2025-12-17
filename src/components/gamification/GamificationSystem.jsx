// Gamification System - Points, Badges, and Achievements
import { 
  Award, Trophy, Star, Zap, Heart, BookOpen, MessageSquare, 
  Target, Calendar, CheckCircle2, TrendingUp, Flame
} from 'lucide-react';

// Points awarded for different actions
export const POINTS = {
  CHECKLIST_ITEM: 10,
  ENERGY_LOG: 5,
  RESOURCE_BOOKMARK: 3,
  RESOURCE_RATE: 5,
  COACH_MESSAGE: 5,
  ACCOMMODATION_REQUEST: 15,
  CALENDAR_EVENT: 5,
  RETURN_DATE_SET: 20,
  DAILY_LOGIN: 2,
  REVIEW_RESOURCE: 10
};

// Level thresholds
export const LEVELS = [
  { level: 1, minPoints: 0, maxPoints: 49, title: 'Getting Started' },
  { level: 2, minPoints: 50, maxPoints: 99, title: 'Early Explorer' },
  { level: 3, minPoints: 100, maxPoints: 199, title: 'Active Participant' },
  { level: 4, minPoints: 200, maxPoints: 349, title: 'Dedicated Planner' },
  { level: 5, minPoints: 350, maxPoints: 549, title: 'Journey Champion' },
  { level: 6, minPoints: 550, maxPoints: 799, title: 'Resilience Builder' },
  { level: 7, minPoints: 800, maxPoints: 1099, title: 'Progress Master' },
  { level: 8, minPoints: 1100, maxPoints: 1499, title: 'Empowerment Leader' },
  { level: 9, minPoints: 1500, maxPoints: 1999, title: 'Transformation Guide' },
  { level: 10, minPoints: 2000, maxPoints: Infinity, title: 'Inspiring Warrior' }
];

// Badge definitions
export const BADGES = {
  FIRST_STEP: {
    id: 'FIRST_STEP',
    name: 'First Step',
    description: 'Complete your first checklist item',
    icon: CheckCircle2,
    color: 'from-blue-400 to-blue-600',
    requirement: (progress) => progress.completed_checklist_items?.length >= 1
  },
  CHECKLIST_WARRIOR: {
    id: 'CHECKLIST_WARRIOR',
    name: 'Checklist Warrior',
    description: 'Complete 10 checklist items',
    icon: Target,
    color: 'from-purple-400 to-purple-600',
    requirement: (progress) => progress.completed_checklist_items?.length >= 10
  },
  ENERGY_TRACKER: {
    id: 'ENERGY_TRACKER',
    name: 'Energy Tracker',
    description: 'Log energy for 7 days',
    icon: Zap,
    color: 'from-amber-400 to-orange-600',
    requirement: (progress) => progress.energy_logs?.length >= 7
  },
  RESOURCE_EXPLORER: {
    id: 'RESOURCE_EXPLORER',
    name: 'Resource Explorer',
    description: 'Bookmark 5 resources',
    icon: BookOpen,
    color: 'from-green-400 to-emerald-600',
    requirement: (progress) => progress.bookmarked_resources?.length >= 5
  },
  COACH_COMPANION: {
    id: 'COACH_COMPANION',
    name: 'Coach Companion',
    description: 'Have 3 conversations with AI Coach',
    icon: MessageSquare,
    color: 'from-pink-400 to-rose-600',
    requirement: (progress) => progress.gamification?.achievements?.filter(a => a.id === 'coach_message').length >= 3
  },
  WEEK_STREAK: {
    id: 'WEEK_STREAK',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: Flame,
    color: 'from-red-400 to-orange-600',
    requirement: (progress) => progress.gamification?.current_streak >= 7
  },
  ACCOMMODATION_ADVOCATE: {
    id: 'ACCOMMODATION_ADVOCATE',
    name: 'Accommodation Advocate',
    description: 'Request workplace accommodations',
    icon: Award,
    color: 'from-indigo-400 to-purple-600',
    requirement: (progress) => progress.accommodations_requested?.length >= 1
  },
  PLANNER_PRO: {
    id: 'PLANNER_PRO',
    name: 'Planner Pro',
    description: 'Set return date and create 5 calendar events',
    icon: Calendar,
    color: 'from-cyan-400 to-blue-600',
    requirement: (progress) => progress.return_date && progress.calendar_events?.length >= 5
  },
  LEVEL_5: {
    id: 'LEVEL_5',
    name: 'Journey Champion',
    description: 'Reach Level 5',
    icon: Trophy,
    color: 'from-yellow-400 to-amber-600',
    requirement: (progress) => progress.gamification?.level >= 5
  },
  LEVEL_10: {
    id: 'LEVEL_10',
    name: 'Inspiring Warrior',
    description: 'Reach Level 10',
    icon: Star,
    color: 'from-gradient-to-r from-purple-500 via-pink-500 to-red-500',
    requirement: (progress) => progress.gamification?.level >= 10
  },
  SELF_CARE: {
    id: 'SELF_CARE',
    name: 'Self-Care Champion',
    description: 'Explore wellness resources',
    icon: Heart,
    color: 'from-rose-400 to-pink-600',
    requirement: (progress) => progress.bookmarked_resources?.some(id => id.includes('Wellness'))
  },
  CONSISTENCY: {
    id: 'CONSISTENCY',
    name: 'Consistency Star',
    description: 'Maintain a 14-day streak',
    icon: TrendingUp,
    color: 'from-teal-400 to-cyan-600',
    requirement: (progress) => progress.gamification?.current_streak >= 14
  }
};

// Calculate level from points
export const calculateLevel = (points) => {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].minPoints) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
};

// Calculate progress to next level
export const calculateLevelProgress = (points) => {
  const currentLevel = calculateLevel(points);
  if (currentLevel.level === 10) {
    return { percent: 100, pointsToNext: 0, currentLevel };
  }
  
  const pointsInLevel = points - currentLevel.minPoints;
  const pointsNeeded = currentLevel.maxPoints - currentLevel.minPoints;
  const percent = (pointsInLevel / pointsNeeded) * 100;
  const pointsToNext = currentLevel.maxPoints - points;
  
  return { percent, pointsToNext, currentLevel };
};

// Check which badges should be awarded
export const checkNewBadges = (progress) => {
  const earnedBadges = progress.gamification?.badges || [];
  const newBadges = [];
  
  Object.values(BADGES).forEach(badge => {
    if (!earnedBadges.includes(badge.id) && badge.requirement(progress)) {
      newBadges.push(badge);
    }
  });
  
  return newBadges;
};

// Check and update streak
export const updateStreak = (progress) => {
  const today = new Date().toISOString().split('T')[0];
  const lastActivity = progress.gamification?.last_activity_date;
  
  if (!lastActivity) {
    return { current_streak: 1, longest_streak: 1 };
  }
  
  const lastDate = new Date(lastActivity);
  const todayDate = new Date(today);
  const daysDiff = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
  
  let currentStreak = progress.gamification?.current_streak || 0;
  let longestStreak = progress.gamification?.longest_streak || 0;
  
  if (daysDiff === 0) {
    // Same day, no change
    return { current_streak: currentStreak, longest_streak: longestStreak };
  } else if (daysDiff === 1) {
    // Consecutive day, increment
    currentStreak += 1;
  } else {
    // Streak broken, restart
    currentStreak = 1;
  }
  
  longestStreak = Math.max(longestStreak, currentStreak);
  
  return { current_streak: currentStreak, longest_streak: longestStreak };
};

// Award points and check for level up
export const awardPoints = (progress, pointsToAdd, achievementId = null) => {
  const currentPoints = progress.gamification?.total_points || 0;
  const newPoints = currentPoints + pointsToAdd;
  
  const oldLevel = calculateLevel(currentPoints);
  const newLevel = calculateLevel(newPoints);
  const leveledUp = newLevel.level > oldLevel.level;
  
  const streakData = updateStreak(progress);
  
  const newAchievements = [...(progress.gamification?.achievements || [])];
  if (achievementId) {
    newAchievements.push({
      id: achievementId,
      earned_date: new Date().toISOString(),
      points_awarded: pointsToAdd
    });
  }
  
  const updatedGamification = {
    ...progress.gamification,
    total_points: newPoints,
    level: newLevel.level,
    achievements: newAchievements,
    current_streak: streakData.current_streak,
    longest_streak: streakData.longest_streak,
    last_activity_date: new Date().toISOString().split('T')[0]
  };
  
  // Check for new badges
  const tempProgress = { ...progress, gamification: updatedGamification };
  const newBadges = checkNewBadges(tempProgress);
  
  if (newBadges.length > 0) {
    updatedGamification.badges = [
      ...(updatedGamification.badges || []),
      ...newBadges.map(b => b.id)
    ];
  }
  
  return {
    gamification: updatedGamification,
    leveledUp,
    newLevel: newLevel.level,
    newBadges
  };
};