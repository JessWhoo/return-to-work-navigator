import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, TrendingUp, AlertCircle, CheckCircle2, 
  ExternalLink, Bookmark, BookmarkCheck, Loader2, Brain
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AIPersonalizedEngine({ 
  progress, 
  resources, 
  onBookmark, 
  isBookmarked
}) {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeUserData = async () => {
    // Extract key data points for AI analysis
    const recentEnergyLogs = progress?.energy_logs?.slice(-7) || [];
    const avgEnergy = recentEnergyLogs.length > 0
      ? recentEnergyLogs.reduce((sum, log) => {
          const avg = ((log.morning_energy || 0) + (log.afternoon_energy || 0) + (log.evening_energy || 0)) / 3;
          return sum + avg;
        }, 0) / recentEnergyLogs.length
      : 0;

    const avgStress = recentEnergyLogs.length > 0
      ? recentEnergyLogs.reduce((sum, log) => sum + (log.stress_level || 0), 0) / recentEnergyLogs.length
      : 0;

    // Fetch recent symptoms
    const symptomRecords = await base44.entities.Record.filter({ type: 'symptom' }, '-date', 10);
    const recentSymptoms = symptomRecords.slice(0, 5).map(s => ({
      title: s.title,
      severity: s.symptom_details?.severity,
      types: s.symptom_details?.symptom_type || []
    }));

    const avgSymptomSeverity = recentSymptoms.length > 0
      ? recentSymptoms.reduce((sum, s) => sum + (s.severity || 0), 0) / recentSymptoms.length
      : 0;

    const commonMoods = recentEnergyLogs
      .map(log => log.mood)
      .filter(Boolean)
      .reduce((acc, mood) => {
        acc[mood] = (acc[mood] || 0) + 1;
        return acc;
      }, {});

    const dominantMood = Object.entries(commonMoods).sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown';

    const checklistProgress = {
      total: progress?.completed_checklist_items?.length || 0,
      percentage: 0
    };

    const accommodations = progress?.accommodations_requested || [];
    const upcomingEvents = progress?.calendar_events || [];
    
    const daysToReturn = progress?.return_date 
      ? Math.ceil((new Date(progress.return_date) - new Date()) / (1000 * 60 * 60 * 24))
      : null;

    return {
      journey_stage: progress?.journey_stage || 'planning',
      avg_energy_level: avgEnergy.toFixed(1),
      avg_stress_level: avgStress.toFixed(1),
      dominant_mood: dominantMood,
      checklist_completed: checklistProgress.total,
      accommodations_count: accommodations.length,
      accommodations_types: accommodations.map(a => a.type).join(', '),
      days_to_return: daysToReturn,
      upcoming_events_count: upcomingEvents.length,
      recent_notes: recentEnergyLogs.map(log => log.notes).filter(Boolean).join('; '),
      bookmarked_count: progress?.bookmarked_resources?.length || 0,
      current_streak: progress?.gamification?.current_streak || 0,
      symptom_count: recentSymptoms.length,
      avg_symptom_severity: avgSymptomSeverity.toFixed(1),
      symptom_types: [...new Set(recentSymptoms.flatMap(s => s.types))].join(', ')
    };
  };

  const generateRecommendations = async () => {
    setLoading(true);
    setError(null);

    try {
      const userData = await analyzeUserData();
      
      // Fetch all resource reviews for community feedback
      const allReviews = await base44.entities.ResourceReview.list();
      
      // Calculate average ratings and review counts for each resource
      const resourceRatings = {};
      allReviews.forEach(review => {
        if (!resourceRatings[review.resource_id]) {
          resourceRatings[review.resource_id] = {
            ratings: [],
            reviews: [],
            helpful_for: []
          };
        }
        resourceRatings[review.resource_id].ratings.push(review.rating);
        if (review.review_text) {
          resourceRatings[review.resource_id].reviews.push(review.review_text);
        }
        if (review.helpful_for) {
          resourceRatings[review.resource_id].helpful_for.push(...review.helpful_for);
        }
      });

      // Prepare resource data for AI with ratings
      const resourceSummary = resources.map(category => ({
        category: category.category,
        resources: category.items.map((r, idx) => {
          const resourceId = `${category.category}-${idx}`;
          const ratings = resourceRatings[resourceId];
          const avgRating = ratings?.ratings.length > 0
            ? (ratings.ratings.reduce((sum, r) => sum + r, 0) / ratings.ratings.length).toFixed(1)
            : null;
          
          return {
            name: r.name,
            type: r.type,
            topics: r.topics,
            stages: r.stages,
            description: r.description,
            avg_rating: avgRating,
            review_count: ratings?.ratings.length || 0,
            helpful_for: ratings?.helpful_for || [],
            recent_feedback: ratings?.reviews.slice(-3) || []
          };
        })
      }));

      const userDataText = `USER DATA:
- Journey Stage: ${userData.journey_stage}
- Average Energy Level (1-10): ${userData.avg_energy_level}
- Average Stress Level (1-10): ${userData.avg_stress_level}
- Dominant Mood: ${userData.dominant_mood}
- Checklist Items Completed: ${userData.checklist_completed}
- Accommodations Requested: ${userData.accommodations_count} (${userData.accommodations_types || 'none'})
- Days Until Return: ${userData.days_to_return || 'not set'}
- Recent Notes: ${userData.recent_notes || 'none'}
- Engagement Streak: ${userData.current_streak} days
- Recent Symptoms Logged: ${userData.symptom_count}
- Average Symptom Severity (1-10): ${userData.avg_symptom_severity}
- Symptom Types Reported: ${userData.symptom_types || 'none'}`;
      const response = (await base44.functions.invoke('aiGateway', {
        operation: 'personalized_recommendations',
        data: { userDataText, resourcesJson: JSON.stringify(resourceSummary, null, 2) },
      })).data.result;

      setRecommendations(response);
    } catch (err) {
      console.error('Error generating recommendations:', err);
      setError('Failed to generate recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const findResourceByName = (resourceName, categoryName) => {
    const category = resources.find(cat => 
      cat.category.toLowerCase() === categoryName.toLowerCase()
    );
    if (!category) return null;
    
    return category.items.find(res => 
      res.name.toLowerCase().includes(resourceName.toLowerCase()) ||
      resourceName.toLowerCase().includes(res.name.toLowerCase())
    );
  };

  const priorityConfig = {
    high: { color: 'bg-brand-primary text-primary-foreground border-brand-primary', icon: AlertCircle },
    medium: { color: 'bg-brand-cream text-brand-text border-brand-border', icon: TrendingUp },
    low: { color: 'bg-brand-sky text-brand-text border-brand-border', icon: CheckCircle2 }
  };

  if (!recommendations) {
    return (
      <Card className="nv-card--muted">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-brand-primary shrink-0"><Brain className="h-6 w-6 text-primary-foreground" /></div>
            <div className="min-w-0"><CardTitle className="text-xl">AI-Powered Personalized Recommendations</CardTitle><p className="text-sm text-brand-muted-foreground mt-1">Get smart resource suggestions based on your unique journey</p></div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="nv-card p-4 space-y-3">
            <h4 className="font-semibold text-brand-text flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand-primary shrink-0" /><span>What makes this special?</span></h4>
            <ul className="text-sm text-brand-muted-foreground space-y-2 ml-6">
              <li className="flex items-start gap-2"><span className="text-brand-primary font-bold">•</span><span>Analyzes your journey stage, energy patterns, and stress levels</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-primary font-bold">•</span><span>Considers your upcoming return date and accommodations</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-primary font-bold">•</span><span>Prioritizes resources based on your immediate needs</span></li>
              <li className="flex items-start gap-2"><span className="text-brand-primary font-bold">•</span><span>Provides actionable guidance on how to use each resource</span></li>
            </ul>
          </div>
          <Button onClick={generateRecommendations} disabled={loading} className="w-full !whitespace-normal">
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyzing Your Journey...</> : <><Brain className="h-4 w-4 mr-2" />Generate Personalized Recommendations</>}
          </Button>
          {error && <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 p-3 rounded-brand">{error}</div>}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="nv-card--muted">
        <CardHeader>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-brand-primary shrink-0" /><span>Your Journey Insights</span></CardTitle>
            <Button variant="outline" size="sm" onClick={generateRecommendations} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.user_insights?.primary_challenges && recommendations.user_insights.primary_challenges.length > 0 && <div><h4 className="font-semibold text-brand-text mb-2">Primary Challenges Identified:</h4><div className="flex flex-wrap gap-2">{recommendations.user_insights.primary_challenges.map((challenge, idx) => <Badge key={idx} className="bg-brand-cream text-brand-text">{challenge}</Badge>)}</div></div>}
          {recommendations.user_insights?.key_focus_areas && recommendations.user_insights.key_focus_areas.length > 0 && <div><h4 className="font-semibold text-brand-text mb-2">Key Focus Areas:</h4><div className="flex flex-wrap gap-2">{recommendations.user_insights.key_focus_areas.map((area, idx) => <Badge key={idx} className="bg-brand-sky text-brand-text">{area}</Badge>)}</div></div>}
          {recommendations.user_insights?.readiness_assessment && <div className="nv-card p-3"><p className="text-sm text-brand-text"><strong>Assessment:</strong> {recommendations.user_insights.readiness_assessment}</p></div>}
        </CardContent>
      </Card>
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-brand-text flex items-center gap-2"><Sparkles className="h-6 w-6 text-brand-primary shrink-0" /><span>Personalized Recommendations</span></h3>
        {recommendations.recommendations && recommendations.recommendations.length > 0 ? recommendations.recommendations.map((rec, idx) => {
          const resource = findResourceByName(rec.resource_name, rec.resource_category);
          const config = priorityConfig[rec.priority] || priorityConfig.medium;
          const Icon = config.icon;
          return (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-2"><Badge className={`${config.color} border`}><Icon className="h-3 w-3 mr-1" />{rec.priority.toUpperCase()} PRIORITY</Badge><Badge variant="outline">{rec.resource_category}</Badge></div>
                      <h4 className="text-xl font-bold text-brand-text">{rec.resource_name}</h4>
                    </div>
                    <div className="bg-brand-muted border-l-4 border-brand-accent p-3 rounded-brand"><p className="text-sm font-semibold text-brand-text mb-1">Addresses Your Challenge:</p><p className="text-sm text-brand-text">{rec.addresses_challenge}</p></div>
                    <div className="bg-brand-muted border-l-4 border-brand-sky p-3 rounded-brand"><p className="text-sm font-semibold text-brand-text mb-1">Why This Matters Now:</p><p className="text-sm text-brand-text">{rec.why_now}</p></div>
                    <div className="bg-brand-muted border-l-4 border-brand-secondary p-3 rounded-brand"><p className="text-sm font-semibold text-brand-text mb-1">How to Use This Resource:</p><p className="text-sm text-brand-text">{rec.how_to_use}</p></div>
                    <div className="bg-brand-muted border-l-4 border-brand-primary p-3 rounded-brand"><p className="text-sm font-semibold text-brand-text mb-1">Expected Benefit:</p><p className="text-sm text-brand-text">{rec.expected_benefit}</p></div>
                    {rec.community_validation && <div className="bg-brand-muted border-l-4 border-brand-secondary p-3 rounded-brand"><p className="text-sm font-semibold text-brand-text mb-1">Community Feedback:</p><p className="text-sm text-brand-text">{rec.community_validation}</p></div>}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {resource ? <><Button variant="outline" size="sm" onClick={() => onBookmark(resource)}>{isBookmarked(resource) ? <><BookmarkCheck className="h-4 w-4 mr-2" />Saved</> : <><Bookmark className="h-4 w-4 mr-2" />Save</>}</Button><Button variant="outline" size="sm" asChild><a href={resource.url} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4 mr-2" />Open Resource</a></Button></> : <p className="text-sm text-brand-muted-foreground italic">Resource not found in library</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        }) : <Card className="border-dashed"><CardContent className="pt-6 text-center"><p className="text-brand-muted-foreground">No recommendations available at this time. Try again later.</p></CardContent></Card>}
      </div>
      {recommendations.next_steps && recommendations.next_steps.length > 0 && (
        <Card className="nv-card--muted">
          <CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-brand-primary shrink-0" /><span>Recommended Next Steps</span></CardTitle></CardHeader>
          <CardContent><ul className="space-y-2">{recommendations.next_steps.map((step, idx) => <li key={idx} className="flex items-start gap-2"><span className="text-brand-primary font-bold mt-0.5">{idx + 1}.</span><span className="text-brand-text">{step}</span></li>)}</ul></CardContent>
        </Card>
      )}
    </div>
  );
}