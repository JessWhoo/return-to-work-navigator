import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, TrendingUp, ExternalLink, Bookmark, BookmarkCheck,
  MessageCircle, ChevronDown, ChevronUp, Star
} from 'lucide-react';
import { parseISO, differenceInDays, isBefore, addDays } from 'date-fns';

export default function AdvancedRecommendations({ 
  progress, 
  allResources, 
  onBookmark, 
  onDiscussWithCoach,
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
        }).map((item) => ({
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



  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="nv-card--muted">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 min-w-0"><Sparkles className="h-5 w-5 text-brand-primary shrink-0" /><CardTitle className="text-lg">Personalized for You</CardTitle><Badge>{recommendations.length}</Badge></div>
          <Button variant="ghost" size="icon" onClick={() => setExpanded(!expanded)} aria-expanded={expanded} aria-label={expanded ? 'Collapse recommendations' : 'Expand recommendations'}>{expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</Button>
        </div>
        <p className="text-sm text-brand-muted-foreground mt-2">Based on your journey stage, energy patterns, and upcoming events</p>
      </CardHeader>
      {expanded && (
        <CardContent className="space-y-4">
          {recommendations.map(resource => {
            const bookmarked = isBookmarked(resource.id);
            const rating = getRating(resource.id);
            return (
              <div key={resource.id} className="nv-card p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="bg-brand-sky text-brand-text text-xs">{resource.type}</Badge><Badge variant="outline" className="text-xs">{resource.category}</Badge>
                      {resource.priority === 'high' && <Badge className="text-xs">Recommended</Badge>}
                      {bookmarked && <Badge variant="secondary" className="text-xs"><BookmarkCheck className="h-3 w-3 mr-1" />Saved</Badge>}
                    </div>
                    <h4 className="font-bold text-brand-text">{resource.name}</h4><p className="text-xs text-brand-muted-foreground">{resource.org}</p><p className="text-sm text-brand-text">{resource.description}</p>
                    <div className="flex items-start gap-2 pt-2 border-t border-brand-border"><TrendingUp className="h-3 w-3 text-brand-primary mt-1 shrink-0" /><p className="text-xs font-semibold text-brand-primary">{resource.reason}</p></div>
                    {rating > 0 && <div className="flex items-center gap-1">{[1, 2, 3, 4, 5].map(star => <Star key={star} className={`h-3 w-3 ${star <= rating ? 'text-brand-primary fill-brand-primary' : 'text-brand-border'}`} />)}</div>}
                  </div>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${resource.name}`} className="nv-btn nv-btn--outline nv-btn--icon shrink-0"><ExternalLink className="h-4 w-4" /></a>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button variant={bookmarked ? 'default' : 'outline'} size="sm" onClick={() => onBookmark(resource.id)} className="flex-1 !whitespace-normal">{bookmarked ? <BookmarkCheck className="h-3 w-3 mr-1" /> : <Bookmark className="h-3 w-3 mr-1" />}{bookmarked ? 'Saved' : 'Save'}</Button>
                  <Button variant="outline" size="sm" onClick={() => onDiscussWithCoach(resource)} className="flex-1 !whitespace-normal"><MessageCircle className="h-3 w-3 mr-1" />Ask Coach</Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      )}
    </Card>
  );
}