import { base44 } from '@/api/base44Client';

/**
 * Uses AI to analyze a resource and generate enhanced tags, categories, and relevance scores
 */
export async function analyzeResourceWithAI(resource, userProgress) {
  try {
    const prompt = `Analyze this resource for cancer survivors returning to work:

Resource: ${resource.name}
Organization: ${resource.org}
Description: ${resource.description}
Current Type: ${resource.type}
Current Topics: ${resource.topics?.join(', ') || 'none'}

User Context:
- Journey Stage: ${userProgress?.journey_stage || 'planning'}
- Completed Tasks: ${userProgress?.completed_checklist_items?.length || 0}
- Energy Logs: ${userProgress?.energy_logs?.length || 0}
- Accommodations Requested: ${userProgress?.accommodations_requested?.length || 0}
${userProgress?.return_date ? `- Return Date: ${userProgress.return_date}` : ''}

Generate enhanced metadata for this resource.`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: prompt,
      response_json_schema: {
        type: "object",
        properties: {
          enhanced_topics: {
            type: "array",
            items: { type: "string" },
            description: "Comprehensive list of topics this resource covers"
          },
          relevance_tags: {
            type: "array",
            items: { type: "string" },
            description: "Specific relevance tags (e.g., 'first week back', 'managing fatigue', 'legal rights')"
          },
          user_relevance_score: {
            type: "number",
            description: "Relevance score for this specific user (0-10)"
          },
          recommendation_reason: {
            type: "string",
            description: "Brief explanation of why this is relevant to the user"
          },
          best_timing: {
            type: "string",
            description: "When this resource is most useful (e.g., 'planning phase', 'first week', 'ongoing')"
          }
        }
      }
    });

    return result;
  } catch (error) {
    console.error('AI analysis failed:', error);
    return null;
  }
}

/**
 * Generates personalized resource recommendations using AI
 */
export async function generateAIRecommendations(allResources, userProgress, limit = 8) {
  try {
    const userContext = {
      journey_stage: userProgress?.journey_stage || 'planning',
      completed_tasks: userProgress?.completed_checklist_items?.length || 0,
      energy_logs: userProgress?.energy_logs?.length || 0,
      accommodations: userProgress?.accommodations_requested?.length || 0,
      saved_resources: userProgress?.bookmarked_resources?.length || 0,
      return_date: userProgress?.return_date,
      recent_energy: userProgress?.energy_logs?.slice(-7) || [],
      recent_mood: userProgress?.energy_logs?.slice(-7).map(log => log.mood).filter(Boolean) || []
    };

    const resourceSummaries = allResources.flatMap(cat => 
      cat.items.map((item, idx) => ({
        id: `${cat.category}-${idx}`,
        name: item.name,
        org: item.org,
        category: cat.category,
        type: item.type,
        description: item.description,
        topics: item.topics || []
      }))
    ).slice(0, 50); // Limit to first 50 for performance

    const prompt = `You are an AI assistant helping cancer survivors return to work. Analyze the user's current situation and recommend the most helpful resources.

User Context:
${JSON.stringify(userContext, null, 2)}

Available Resources:
${JSON.stringify(resourceSummaries, null, 2)}

Based on the user's journey stage, progress, and recent activity, recommend the ${limit} most relevant resources. Consider:
- Their current journey stage and what they need most right now
- Recent energy/mood patterns
- Whether they've started making accommodations
- How much progress they've made
- Timing and readiness for different types of information

Return the recommended resource IDs with personalized reasons.`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: prompt,
      response_json_schema: {
        type: "object",
        properties: {
          recommendations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                resource_id: { type: "string" },
                relevance_score: { type: "number" },
                reason: { type: "string" },
                priority: { type: "string", enum: ["urgent", "high", "medium", "low"] }
              }
            }
          },
          overall_insights: {
            type: "string",
            description: "Brief insight about what the user should focus on right now"
          }
        }
      }
    });

    return result;
  } catch (error) {
    console.error('AI recommendations failed:', error);
    return null;
  }
}