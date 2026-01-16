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
  isBookmarked,
  onDiscuss 
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
        category: category.name,
        resources: category.resources.map((r, idx) => {
          const resourceId = `${category.name}-${idx}`;
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

      const prompt = `You are an expert advisor for cancer survivors returning to work. Analyze this user's data and recommend the most relevant resources.

USER DATA:
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
- Symptom Types Reported: ${userData.symptom_types || 'none'}

AVAILABLE RESOURCES WITH COMMUNITY FEEDBACK:
${JSON.stringify(resourceSummary, null, 2)}

INSTRUCTIONS:
Provide 5-7 personalized resource recommendations with detailed reasoning. For each recommendation:
1. Identify the specific user challenge/need it addresses (consider symptoms, energy, stress)
2. Explain why it's timely and relevant now
3. Suggest how to use it effectively
4. Rate priority (high/medium/low) - prioritize HIGH if symptoms severe (7+) or stress high (7+)

IMPORTANT: Prioritize resources with:
- Higher average ratings (4+ stars are proven effective)
- More reviews (shows wider user validation)
- "Helpful for" tags matching the user's current challenges
- Recent positive feedback from similar users

Avoid recommending resources with:
- Average rating below 2.5 stars
- Consistent negative feedback
- No reviews (unless exceptionally relevant)

Return recommendations sorted by priority (high first).`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            user_insights: {
              type: "object",
              properties: {
                primary_challenges: { type: "array", items: { type: "string" } },
                key_focus_areas: { type: "array", items: { type: "string" } },
                readiness_assessment: { type: "string" }
              }
            },
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  resource_name: { type: "string" },
                  resource_category: { type: "string" },
                  priority: { type: "string", enum: ["high", "medium", "low"] },
                  addresses_challenge: { type: "string" },
                  why_now: { type: "string" },
                  how_to_use: { type: "string" },
                  expected_benefit: { type: "string" },
                  community_validation: { type: "string" }
                }
              }
            },
            next_steps: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

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
      cat.name.toLowerCase() === categoryName.toLowerCase()
    );
    if (!category) return null;
    
    return category.resources.find(res => 
      res.name.toLowerCase().includes(resourceName.toLowerCase()) ||
      resourceName.toLowerCase().includes(res.name.toLowerCase())
    );
  };

  const priorityConfig = {
    high: { color: 'bg-red-100 text-red-800 border-red-300', icon: AlertCircle },
    medium: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: TrendingUp },
    low: { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: CheckCircle2 }
  };

  if (!recommendations) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">AI-Powered Personalized Recommendations</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Get smart resource suggestions based on your unique journey
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-gray-800 flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span>What makes this special?</span>
            </h4>
            <ul className="text-sm text-gray-600 space-y-2 ml-6">
              <li className="flex items-start space-x-2">
                <span className="text-purple-600 font-bold">•</span>
                <span>Analyzes your journey stage, energy patterns, and stress levels</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-600 font-bold">•</span>
                <span>Considers your upcoming return date and accommodations</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-600 font-bold">•</span>
                <span>Prioritizes resources based on your immediate needs</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-600 font-bold">•</span>
                <span>Provides actionable guidance on how to use each resource</span>
              </li>
            </ul>
          </div>

          <Button
            onClick={generateRecommendations}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Your Journey...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Generate Personalized Recommendations
              </>
            )}
          </Button>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Insights */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span>Your Journey Insights</span>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={generateRecommendations}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.user_insights?.primary_challenges && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Primary Challenges Identified:</h4>
              <div className="flex flex-wrap gap-2">
                {recommendations.user_insights.primary_challenges.map((challenge, idx) => (
                  <Badge key={idx} className="bg-orange-100 text-orange-800">
                    {challenge}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {recommendations.user_insights?.key_focus_areas && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Key Focus Areas:</h4>
              <div className="flex flex-wrap gap-2">
                {recommendations.user_insights.key_focus_areas.map((area, idx) => (
                  <Badge key={idx} className="bg-blue-100 text-blue-800">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {recommendations.user_insights?.readiness_assessment && (
            <div className="bg-white rounded-lg p-3">
              <p className="text-sm text-gray-700">
                <strong>Assessment:</strong> {recommendations.user_insights.readiness_assessment}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-purple-600" />
          <span>Personalized Recommendations</span>
        </h3>

        {recommendations.recommendations?.map((rec, idx) => {
          const resource = findResourceByName(rec.resource_name, rec.resource_category);
          const config = priorityConfig[rec.priority] || priorityConfig.medium;
          const Icon = config.icon;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="hover:shadow-xl transition-all border-2">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={`${config.color} border`}>
                            <Icon className="h-3 w-3 mr-1" />
                            {rec.priority.toUpperCase()} PRIORITY
                          </Badge>
                          <Badge variant="outline">{rec.resource_category}</Badge>
                        </div>
                        <h4 className="text-xl font-bold text-gray-800">
                          {rec.resource_name}
                        </h4>
                      </div>
                    </div>

                    {/* Challenge Addressed */}
                    <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
                      <p className="text-sm font-semibold text-red-800 mb-1">
                        Addresses Your Challenge:
                      </p>
                      <p className="text-sm text-red-700">{rec.addresses_challenge}</p>
                    </div>

                    {/* Why Now */}
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                      <p className="text-sm font-semibold text-blue-800 mb-1">
                        Why This Matters Now:
                      </p>
                      <p className="text-sm text-blue-700">{rec.why_now}</p>
                    </div>

                    {/* How to Use */}
                    <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded">
                      <p className="text-sm font-semibold text-green-800 mb-1">
                        How to Use This Resource:
                      </p>
                      <p className="text-sm text-green-700">{rec.how_to_use}</p>
                    </div>

                    {/* Expected Benefit */}
                    <div className="bg-purple-50 border-l-4 border-purple-400 p-3 rounded">
                      <p className="text-sm font-semibold text-purple-800 mb-1">
                        Expected Benefit:
                      </p>
                      <p className="text-sm text-purple-700">{rec.expected_benefit}</p>
                    </div>

                    {/* Community Validation */}
                    {rec.community_validation && (
                      <div className="bg-teal-50 border-l-4 border-teal-400 p-3 rounded">
                        <p className="text-sm font-semibold text-teal-800 mb-1">
                          Community Feedback:
                        </p>
                        <p className="text-sm text-teal-700">{rec.community_validation}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {resource && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onBookmark(resource)}
                          >
                            {isBookmarked(resource) ? (
                              <>
                                <BookmarkCheck className="h-4 w-4 mr-2" />
                                Saved
                              </>
                            ) : (
                              <>
                                <Bookmark className="h-4 w-4 mr-2" />
                                Save
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Open Resource
                            </a>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Next Steps */}
      {recommendations.next_steps && recommendations.next_steps.length > 0 && (
        <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-teal-600" />
              <span>Recommended Next Steps</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recommendations.next_steps.map((step, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-teal-600 font-bold mt-0.5">{idx + 1}.</span>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}