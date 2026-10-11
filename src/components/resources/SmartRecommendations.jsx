import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ChevronRight, Loader2, ExternalLink, Bookmark, MessageCircle } from 'lucide-react';

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

      const response = (await base44.functions.invoke('aiGateway', {
        operation: 'smart_recommendations',
        data: { userContextText: userContext },
      })).data.result;

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
      <Card className="nv-card--muted">
        <CardContent className="pt-6 text-center">
          <Loader2 className="h-8 w-8 text-brand-primary mx-auto mb-3 animate-spin" />
          <p className="text-sm text-brand-muted-foreground">Analyzing your journey to find the best resources...</p>
        </CardContent>
      </Card>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="nv-card--muted">
      <CardHeader className="cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-brand-primary shrink-0"><Sparkles className="h-5 w-5 text-primary-foreground" /></div>
            <div><CardTitle className="text-lg text-brand-text">Recommended for You</CardTitle><p className="text-xs text-brand-muted-foreground mt-0.5">Based on your journey progress</p></div>
          </div>
          <ChevronRight className={`h-5 w-5 text-brand-primary shrink-0 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="space-y-3 pt-0">
          {recommendations.map((resource, idx) => {
            const bookmarked = isBookmarked(resource.id);
            return (
              <Card key={idx}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">{resource.priority === 'high' && <Badge className="text-xs">High Priority</Badge>}<Badge className="bg-brand-sky text-brand-text text-xs">{resource.type}</Badge></div>
                      <h4 className="font-bold text-brand-text text-sm mb-1">{resource.name}</h4><p className="text-xs text-brand-muted-foreground mb-2">{resource.org}</p><p className="text-xs text-brand-text bg-brand-muted p-2 rounded-brand italic">💡 {resource.reason}</p>
                    </div>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${resource.name}`} className="nv-btn nv-btn--outline nv-btn--icon shrink-0"><ExternalLink className="h-4 w-4" /></a>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button variant={bookmarked ? 'default' : 'outline'} size="sm" onClick={() => onBookmark(resource.id)} className="flex-1 !whitespace-normal">{bookmarked ? <Bookmark className="h-3 w-3 mr-1 fill-current" /> : <Bookmark className="h-3 w-3 mr-1" />}{bookmarked ? 'Saved' : 'Save'}</Button>
                    <Button variant="outline" size="sm" onClick={() => onDiscussWithCoach(resource)} className="flex-1 !whitespace-normal"><MessageCircle className="h-3 w-3 mr-1" />Discuss</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          <Button variant="ghost" size="sm" onClick={generateRecommendations} className="w-full !whitespace-normal"><Sparkles className="h-4 w-4 mr-2" />Refresh Recommendations</Button>
        </CardContent>
      )}
    </Card>
  );
}