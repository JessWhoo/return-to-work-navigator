import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, TrendingUp, ExternalLink, Bookmark, BookmarkCheck,
  MessageCircle, RefreshCw, ChevronDown, ChevronUp, Star
} from 'lucide-react';
import { parseISO, differenceInDays, isBefore, addDays } from 'date-fns';

export default function AdvancedRecommendations({ 
  progress, 
  allResources, 
  onBookmark, 
  onDiscussWithCoach,
  onRate,
  isBookmarked,
  getRating
}) {
  const [expanded, setExpanded] = useState(true);

  const getRecommendations = () => {
    if (!progress) return [];
    
    const recommendations = [];
    const today = new Date();
    
    // Stage-based recommendations
    const stageResources = allResources.flatMap(cat => 
      cat.items.filter(item => 
        item.stages && item.stages.includes(progress.journey_stage)
      ).map(item => ({
        ...item,
        id: `${cat.category}-${cat.items.indexOf(item)}`,
        category: cat.category,
        color: cat.color,
        reason: `Relevant for your ${progress.journey_stage.replace('_', ' ')} stage`
      }))
    );

    // Energy-based recommendations
    if (progress.energy_logs && progress.energy_logs.length > 0) {
      const recentLogs = progress.energy_logs.slice(-7);
      const avgEnergy = recentLogs.reduce((sum, log) => {
        const dayAvg = (log.morning_energy + log.afternoon_energy + log.evening_energy) / 3;
        return sum + dayAvg;
      }, 0) / recentLogs.length;

      if (avgEnergy < 5) {
        const fatigueResources = allResources.flatMap(cat =>
          cat.items.filter(item =>
            item.topics && item.topics.some(topic => 
              topic.includes('fatigue') || 
              topic.includes('energy') || 
              topic.includes('pacing')
            )
          ).map(item => ({
            ...item,
            id: `${cat.category}-${cat.items.indexOf(item)}`,
            category: cat.category,
            color: cat.color,
            reason: `Low energy detected (avg: ${avgEnergy.toFixed(1)}/10) - this can help`,
            priority: 'high'
          }))
        );
        recommendations.push(...fatigueResources.slice(0, 3));
      }

      // Stress-based recommendations
      const avgStress = recentLogs.reduce((sum, log) => sum + (log.stress_level || 5), 0) / recentLogs.length;
      if (avgStress >= 7) {
        const stressResources = allResources.flatMap(cat =>
          cat.items.filter(item =>
            item.topics && item.topics.some(topic => 
              topic.includes('anxiety') || 
              topic.includes('stress') || 
              topic.includes('mental health') ||
              topic.includes('mindfulness')
            )
          ).map(item => ({
            ...item,
            id: `${cat.category}-${cat.items.indexOf(item)}`,
            category: cat.category,
            color: cat.color,
            reason: `High stress detected (avg: ${avgStress.toFixed(1)}/10) - find relief here`,
            priority: 'high'
          }))
        );
        recommendations.push(...stressResources.slice(0, 3));
      }
    }

    // Calendar event-based recommendations
    if (progress.calendar_events) {
      const upcomingEvents = progress.calendar_events.filter(event => {
        const eventDate = parseISO(event.date);
        return !isBefore(eventDate, today) && isBefore(eventDate, addDays(today, 7));
      });

      upcomingEvents.forEach(event => {
        if (event.type === 'medical') {
          const medicalResources = allResources.flatMap(cat =>
            cat.items.filter(item =>
              item.topics && item.topics.some(topic => 
                topic.includes('communication') || topic.includes('doctor')
              )
            ).map(item => ({
              ...item,
              id: `${cat.category}-${cat.items.indexOf(item)}`,
              category: cat.category,
              color: cat.color,
              reason: `Upcoming medical appointment - prepare with this`,
              priority: 'medium'
            }))
          );
          recommendations.push(...medicalResources.slice(0, 2));
        }

        if (event.type === 'meeting') {
          const meetingResources = allResources.flatMap(cat =>
            cat.items.filter(item =>
              item.topics && item.topics.some(topic => 
                topic.includes('communication') || 
                topic.includes('workplace') ||
                topic.includes('energy management')
              )
            ).map(item => ({
              ...item,
              id: `${cat.category}-${cat.items.indexOf(item)}`,
              category: cat.category,
              color: cat.color,
              reason: `Upcoming meeting - helpful preparation`,
              priority: 'medium'
            }))
          );
          recommendations.push(...meetingResources.slice(0, 2));
        }
      });
    }

    // Return date proximity
    if (progress.return_date) {
      const returnDate = parseISO(progress.return_date);
      const daysUntil = differenceInDays(returnDate, today);
      
      if (daysUntil >= 0 && daysUntil <= 14) {
        const returnResources = allResources.flatMap(cat =>
          cat.items.filter(item =>
            item.topics && item.topics.some(topic => 
              topic.includes('return to work') || 
              topic.includes('first day') ||
              topic.includes('first week')
            )
          ).map(item => ({
            ...item,
            id: `${cat.category}-${cat.items.indexOf(item)}`,
            category: cat.category,
            color: cat.color,
            reason: `Your return date is in ${daysUntil} days - prepare now`,
            priority: 'high'
          }))
        );
        recommendations.push(...returnResources.slice(0, 3));
      }
    }

    // Accommodation-based recommendations
    if (progress.accommodations_requested && progress.accommodations_requested.length > 0) {
      const hasUpcomingReview = progress.accommodations_requested.some(acc => {
        if (!acc.review_date) return false;
        const reviewDate = parseISO(acc.review_date);
        const daysUntil = differenceInDays(reviewDate, today);
        return daysUntil >= 0 && daysUntil <= 7;
      });

      if (hasUpcomingReview) {
        const accResources = allResources.flatMap(cat =>
          cat.items.filter(item =>
            item.topics && item.topics.some(topic => 
              topic.includes('accommodations') || topic.includes('ADA')
            )
          ).map(item => ({
            ...item,
            id: `${cat.category}-${cat.items.indexOf(item)}`,
            category: cat.category,
            color: cat.color,
            reason: `Accommodation review coming up - document your needs`,
            priority: 'high'
          }))
        );
        recommendations.push(...accResources.slice(0, 2));
      }
    } else if (progress.journey_stage === 'planning') {
      // No accommodations yet but in planning stage
      const accResources = allResources.flatMap(cat =>
        cat.items.filter(item =>
          item.topics && item.topics.some(topic => 
            topic.includes('accommodations') || topic.includes('ADA')
          )
        ).map(item => ({
          ...item,
          id: `${cat.category}-${cat.items.indexOf(item)}`,
          category: cat.category,
          color: cat.color,
          reason: `Learn about accommodations you might need`,
          priority: 'medium'
        }))
      );
      recommendations.push(...accResources.slice(0, 2));
    }

    // Add highly-rated resources not yet viewed
    const ratings = progress.resource_ratings || {};
    const highlyRatedIds = Object.keys(ratings).filter(id => ratings[id] >= 4);
    
    // Find similar resources to highly rated ones
    if (highlyRatedIds.length > 0) {
      const highlyRatedTopics = new Set();
      allResources.forEach(cat => {
        cat.items.forEach((item, idx) => {
          const itemId = `${cat.category}-${idx}`;
          if (highlyRatedIds.includes(itemId) && item.topics) {
            item.topics.forEach(topic => highlyRatedTopics.add(topic));
          }
        });
      });

      const similarResources = allResources.flatMap(cat =>
        cat.items.filter((item, idx) => {
          const itemId = `${cat.category}-${idx}`;
          return !ratings[itemId] && item.topics && 
                 item.topics.some(topic => highlyRatedTopics.has(topic));
        }).map((item, idx) => ({
          ...item,
          id: `${cat.category}-${cat.items.indexOf(item)}`,
          category: cat.category,
          color: cat.color,
          reason: `Similar to resources you rated highly`,
          priority: 'low'
        }))
      );
      recommendations.push(...similarResources.slice(0, 3));
    }

    // Add stage resources at the end
    recommendations.push(...stageResources.slice(0, 5));

    // Remove duplicates and prioritize
    const uniqueRecs = Array.from(new Map(
      recommendations.map(item => [item.id, item])
    ).values());

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return uniqueRecs
      .sort((a, b) => {
        const priorityA = priorityOrder[a.priority] ?? 3;
        const priorityB = priorityOrder[b.priority] ?? 3;
        return priorityA - priorityB;
      })
      .slice(0, 10);
  };

  const recommendations = getRecommendations();

  const colorMap = {
    purple: { gradient: 'from-purple-500 to-violet-500', bg: 'bg-purple-50', border: 'border-purple-200' },
    green: { gradient: 'from-green-500 to-emerald-500', bg: 'bg-green-50', border: 'border-green-200' },
    blue: { gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50', border: 'border-blue-200' },
    indigo: { gradient: 'from-indigo-500 to-purple-500', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    rose: { gradient: 'from-rose-500 to-pink-500', bg: 'bg-rose-50', border: 'border-rose-200' },
    amber: { gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', border: 'border-amber-200' },
    teal: { gradient: 'from-teal-500 to-cyan-500', bg: 'bg-teal-50', border: 'border-teal-200' },
    cyan: { gradient: 'from-cyan-500 to-blue-500', bg: 'bg-cyan-50', border: 'border-cyan-200' },
    pink: { gradient: 'from-pink-500 to-rose-500', bg: 'bg-pink-50', border: 'border-pink-200' }
  };

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 border-2 border-purple-200 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-lg">Personalized for You</CardTitle>
            <Badge className="bg-purple-500">{recommendations.length}</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Based on your journey stage, energy patterns, and upcoming events
        </p>
      </CardHeader>
      
      {expanded && (
        <CardContent className="space-y-4">
          {recommendations.map((resource) => {
            const colors = colorMap[resource.color] || colorMap.purple;
            const bookmarked = isBookmarked(resource.id);
            const rating = getRating(resource.id);
            
            return (
              <div
                key={resource.id}
                className={`p-4 rounded-lg ${colors.bg} border-2 ${colors.border} space-y-3 hover:shadow-md transition-all`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <Badge className={`bg-gradient-to-r ${colors.gradient} text-white text-xs`}>
                        {resource.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {resource.category}
                      </Badge>
                      {resource.priority === 'high' && (
                        <Badge className="bg-red-500 text-white text-xs">Recommended</Badge>
                      )}
                      {bookmarked && (
                        <Badge className="bg-amber-100 text-amber-700 text-xs">
                          <BookmarkCheck className="h-3 w-3 mr-1" />
                          Saved
                        </Badge>
                      )}
                    </div>
                    
                    <h4 className="font-bold text-gray-800">{resource.name}</h4>
                    <p className="text-xs text-gray-600">{resource.org}</p>
                    <p className="text-sm text-gray-700">{resource.description}</p>
                    
                    <div className="flex items-center space-x-2 pt-2 border-t border-gray-200">
                      <TrendingUp className="h-3 w-3 text-purple-600" />
                      <p className="text-xs font-medium text-purple-700">{resource.reason}</p>
                    </div>

                    {rating > 0 && (
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              star <= rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`ml-4 p-3 rounded-lg bg-gradient-to-br ${colors.gradient} hover:opacity-90 transition-all shadow-md hover:shadow-lg flex-shrink-0`}
                  >
                    <ExternalLink className="h-4 w-4 text-white" />
                  </a>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant={bookmarked ? "default" : "outline"}
                    size="sm"
                    onClick={() => onBookmark(resource.id)}
                    className="flex-1 text-xs"
                  >
                    {bookmarked ? <BookmarkCheck className="h-3 w-3 mr-1" /> : <Bookmark className="h-3 w-3 mr-1" />}
                    {bookmarked ? 'Saved' : 'Save'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDiscussWithCoach(resource)}
                    className="flex-1 text-xs"
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Ask Coach
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      )}
    </Card>
  );
}