import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ChevronRight, Loader2, ExternalLink, Bookmark, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function SmartRecommendations({ 
  progress, 
  allResources, 
  onBookmark, 
  onDiscussWithCoach,
  isBookmarked 
}) {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    generateRecommendations();
  }, [progress]);

  const generateRecommendations = async () => {
    if (!progress) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Prepare user context
      const completedItems = progress.completed_checklist_items?.length || 0;
      const recentEnergyLogs = progress.energy_logs?.slice(-7) || [];
      const avgEnergy = recentEnergyLogs.length > 0
        ? recentEnergyLogs.reduce((sum, log) => 
            sum + (log.morning_energy + log.afternoon_energy + log.evening_energy) / 3, 0
          ) / recentEnergyLogs.length
        : null;

      const userContext = `
User's Return-to-Work Journey Status:
- Journey Stage: ${progress.journey_stage || 'planning'}
- Checklist Items Completed: ${completedItems}
- Average Energy Level (past week): ${avgEnergy ? avgEnergy.toFixed(1) + '/10' : 'Not tracked'}
- Accommodations Requested: ${progress.accommodations_requested?.length || 0}
- Return Date: ${progress.return_date || 'Not set'}
- Bookmarked Resources: ${progress.bookmarked_resources?.length || 0}

Energy Pattern:
${recentEnergyLogs.length > 0 ? recentEnergyLogs.map(log => 
  `- ${log.date}: Morning ${log.morning_energy}, Afternoon ${log.afternoon_energy}, Evening ${log.evening_energy}`
).join('\n') : 'No energy logs yet'}

Available Resources (select from these ONLY):
${allResources.map(cat => 
  cat.items.map(item => `- "${item.name}" (${cat.category}): ${item.description}`).join('\n')
).join('\n')}
      `;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert return-to-work advisor for cancer survivors. Analyze the user's journey data and recommend 3-4 highly relevant resources from the provided list.

${userContext}

Based on their stage, energy levels, and progress, which resources would be MOST helpful RIGHT NOW?

Return your recommendations as a JSON array with this exact structure:
{
  "recommendations": [
    {
      "resource_name": "exact name from the list",
      "category": "category name",
      "priority": "high" or "medium",
      "reason": "short explanation (1-2 sentences) why this is relevant to their current situation"
    }
  ]
}

IMPORTANT: Only recommend resources from the provided list. Use exact names. Focus on what's most actionable for their current stage.`,
        response_json_schema: {
          type: "object",
          properties: {
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  resource_name: { type: "string" },
                  category: { type: "string" },
                  priority: { type: "string" },
                  reason: { type: "string" }
                }
              }
            }
          }
        }
      });

      // Match recommendations with actual resource objects
      const matchedRecommendations = response.recommendations
        .map(rec => {
          const category = allResources.find(cat => 
            cat.category === rec.category || 
            cat.items.some(item => item.name === rec.resource_name)
          );
          const resource = category?.items.find(item => item.name === rec.resource_name);
          
          if (resource) {
            return {
              ...resource,
              priority: rec.priority,
              reason: rec.reason,
              categoryColor: category.color
            };
          }
          return null;
        })
        .filter(Boolean);

      setRecommendations(matchedRecommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
        <CardContent className="pt-6 text-center">
          <Loader2 className="h-8 w-8 text-purple-600 mx-auto mb-3 animate-spin" />
          <p className="text-sm text-gray-600">Analyzing your journey to find the best resources...</p>
        </CardContent>
      </Card>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-lg">
      <CardHeader 
        className="cursor-pointer hover:bg-purple-50/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-800">
                Recommended for You
              </CardTitle>
              <p className="text-xs text-gray-600 mt-0.5">
                Based on your journey progress
              </p>
            </div>
          </div>
          <ChevronRight 
            className={`h-5 w-5 text-gray-400 transition-transform ${
              expanded ? 'rotate-90' : ''
            }`}
          />
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-3 pt-0">
          {recommendations.map((resource, idx) => {
            const bookmarked = isBookmarked(resource.id);
            const colorMap = {
              purple: 'from-purple-400 to-purple-600',
              green: 'from-green-400 to-green-600',
              blue: 'from-blue-400 to-blue-600',
              indigo: 'from-indigo-400 to-indigo-600',
              rose: 'from-rose-400 to-rose-600'
            };
            const gradient = colorMap[resource.categoryColor] || 'from-gray-400 to-gray-600';

            return (
              <Card 
                key={idx} 
                className="bg-white border-2 border-purple-100 hover:border-purple-300 transition-all hover:shadow-md"
              >
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {resource.priority === 'high' && (
                          <Badge className="bg-red-500 text-white text-xs">High Priority</Badge>
                        )}
                        <Badge className="bg-purple-100 text-purple-700 text-xs">
                          {resource.type}
                        </Badge>
                      </div>
                      <h4 className="font-bold text-gray-800 text-sm mb-1">
                        {resource.name}
                      </h4>
                      <p className="text-xs text-gray-500 mb-2">{resource.org}</p>
                      <p className="text-xs text-purple-700 bg-purple-50 p-2 rounded italic">
                        💡 {resource.reason}
                      </p>
                    </div>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`ml-3 p-3 rounded-lg bg-gradient-to-br ${gradient} hover:opacity-90 transition-all shadow-md flex-shrink-0`}
                    >
                      <ExternalLink className="h-4 w-4 text-white" />
                    </a>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant={bookmarked ? "default" : "outline"}
                      size="sm"
                      onClick={() => onBookmark(resource.id)}
                      className="flex-1 text-xs h-8"
                    >
                      {bookmarked ? <Bookmark className="h-3 w-3 mr-1 fill-current" /> : <Bookmark className="h-3 w-3 mr-1" />}
                      {bookmarked ? 'Saved' : 'Save'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDiscussWithCoach(resource)}
                      className="flex-1 text-xs h-8"
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Discuss
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <Button
            variant="ghost"
            size="sm"
            onClick={generateRecommendations}
            className="w-full text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Refresh Recommendations
          </Button>
        </CardContent>
      )}
    </Card>
  );
}