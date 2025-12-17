import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { awardPoints, POINTS } from './GamificationSystem';
import { toast } from 'sonner';

export function useGamification() {
  const queryClient = useQueryClient();
  const [showQuickPoints, setShowQuickPoints] = useState(false);
  const [quickPointsAmount, setQuickPointsAmount] = useState(0);
  const [celebration, setCelebration] = useState({ show: false, type: 'points', data: {} });
  
  const awardPointsMutation = useMutation({
    mutationFn: async ({ progress, pointsToAdd, achievementId }) => {
      const result = awardPoints(progress, pointsToAdd, achievementId);
      
      await base44.entities.UserProgress.update(progress.id, {
        gamification: result.gamification
      });
      
      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries(['userProgress']);
      
      // Show quick points notification
      setQuickPointsAmount(result.gamification.achievements[result.gamification.achievements.length - 1]?.points_awarded || 0);
      setShowQuickPoints(true);
      
      // Show celebrations for special events
      if (result.leveledUp) {
        setTimeout(() => {
          setCelebration({
            show: true,
            type: 'levelup',
            data: { newLevel: result.newLevel }
          });
        }, 500);
      } else if (result.newBadges.length > 0) {
        setTimeout(() => {
          setCelebration({
            show: true,
            type: 'badge',
            data: {
              badgeId: result.newBadges[0].id,
              badgeName: result.newBadges[0].name,
              badgeDescription: result.newBadges[0].description
            }
          });
        }, 500);
      }
    }
  });
  
  const trackAction = async (progress, actionType, metadata = {}) => {
    if (!progress) return;
    
    const pointsMap = {
      'checklist_complete': POINTS.CHECKLIST_ITEM,
      'energy_log': POINTS.ENERGY_LOG,
      'resource_bookmark': POINTS.RESOURCE_BOOKMARK,
      'resource_rate': POINTS.RESOURCE_RATE,
      'coach_message': POINTS.COACH_MESSAGE,
      'accommodation_request': POINTS.ACCOMMODATION_REQUEST,
      'calendar_event': POINTS.CALENDAR_EVENT,
      'return_date_set': POINTS.RETURN_DATE_SET,
      'daily_login': POINTS.DAILY_LOGIN,
      'resource_review': POINTS.REVIEW_RESOURCE
    };
    
    const points = pointsMap[actionType];
    if (points) {
      awardPointsMutation.mutate({
        progress,
        pointsToAdd: points,
        achievementId: actionType
      });
    }
  };
  
  const checkStreak = async (progress) => {
    if (!progress?.gamification) return;
    
    const streak = progress.gamification.current_streak;
    
    // Show streak celebration at milestones
    if (streak > 0 && streak % 7 === 0) {
      setCelebration({
        show: true,
        type: 'streak',
        data: { streak }
      });
    }
  };
  
  return {
    trackAction,
    checkStreak,
    showQuickPoints,
    quickPointsAmount,
    setShowQuickPoints,
    celebration,
    setCelebration
  };
}