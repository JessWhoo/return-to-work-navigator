import { base44 } from '@/api/base44Client';

/**
 * Generates AI-powered resource recommendations based on user data
 */
export async function generateAIRecommendations(allResources, progress) {
  if (!progress) return { recommendations: [], overall_insights: '' };

  try {
    // Flatten all resources with IDs
    const flatResources = allResources.flatMap(cat =>
      cat.items.map((item, idx) => ({
        ...item,
        resource_id: `${cat.category.split(' ').join('')}-${idx}`,
        category: cat.category,
        color: cat.color
      }))
    );

    // Fetch user's records for additional context
    const records = await base44.entities.Record.list('-date', 10);
    
    // Analyze user's current state
    const recentEnergyLogs = progress.energy_logs?.slice(-7) || [];
    const avgEnergy = recentEnergyLogs.length > 0
      ? recentEnergyLogs.reduce((sum, log) => 
          sum + (log.morning_energy + log.afternoon_energy + log.evening_energy) / 3, 0
        ) / recentEnergyLogs.length
      : 5;
    
    const avgStress = recentEnergyLogs.length > 0
      ? recentEnergyLogs.reduce((sum, log) => sum + (log.stress_level || 5), 0) / recentEnergyLogs.length
      : 5;

    const moods = recentEnergyLogs.map(log => log.mood).filter(Boolean);
    const dominantMood = moods.length > 0 ? moods[moods.length - 1] : 'neutral';

    // Fetch all reviews to get community insights
    const allReviews = await base44.entities.ResourceReview.list();
    const reviewsByResource = {};
    allReviews.forEach(review => {
      if (!reviewsByResource[review.resource_id]) {
        reviewsByResource[review.resource_id] = [];
      }
      reviewsByResource[review.resource_id].push(review);
    });

    // Build comprehensive prompt for AI
    const prompt = `You are an expert return-to-work coach for cancer survivors. Analyze the user's current state and recommend the most relevant resources.

USER PROFILE:
- Journey Stage: ${progress.journey_stage || 'planning'}
- Average Energy Level: ${avgEnergy.toFixed(1)}/10 (recent week)
- Average Stress Level: ${avgStress.toFixed(1)}/10 (recent week)
- Current Mood: ${dominantMood}
- Checklist Progress: ${progress.completed_checklist_items?.length || 0} items completed
- Accommodations Requested: ${progress.accommodations_requested?.length || 0}

RECENT RECORDS (last 10):
${records.map(r => `- ${r.type}: ${r.title} (${r.date})`).join('\n')}

UPCOMING EVENTS:
${progress.calendar_events?.slice(0, 3).map(e => `- ${e.title} (${e.date})`).join('\n') || 'None scheduled'}
${progress.return_date ? `- Return to Work Date: ${progress.return_date}` : ''}

AVAILABLE RESOURCES (${flatResources.length} total):
${flatResources.slice(0, 50).map(r => 
  `ID: ${r.resource_id} | ${r.name} | ${r.category} | ${r.type} | Topics: ${r.topics?.join(', ')} | Stages: ${r.stages?.join(', ')}`
).join('\n')}

${flatResources.length > 50 ? `... and ${flatResources.length - 50} more resources` : ''}

COMMUNITY INSIGHTS:
${Object.entries(reviewsByResource).slice(0, 10).map(([id, reviews]) => {
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const recommendCount = reviews.filter(r => r.would_recommend).length;
  return `- Resource ${id}: ${avg.toFixed(1)} stars, ${reviews.length} reviews, ${recommendCount} recommend`;
}).join('\n')}

TASK:
Recommend 5-8 resources that are MOST RELEVANT to this user's current situation. Consider:
1. Their journey stage and upcoming events
2. Energy and stress levels
3. Recent records (medical, workplace issues)
4. Community ratings and feedback
5. Variety across different types of support needed

For each recommendation, provide:
- resource_id (MUST match exactly from the list above)
- priority (urgent/high/medium/low)
- reason (why this resource is relevant RIGHT NOW for this user - be specific and personal)
- relevance_score (1-10, how relevant is this)

Also provide overall_insights (2-3 sentences about the user's current state and general recommendations).`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          overall_insights: { type: 'string' },
          recommendations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                resource_id: { type: 'string' },
                priority: { type: 'string', enum: ['urgent', 'high', 'medium', 'low'] },
                reason: { type: 'string' },
                relevance_score: { type: 'number', minimum: 1, maximum: 10 }
              },
              required: ['resource_id', 'priority', 'reason', 'relevance_score']
            }
          }
        },
        required: ['overall_insights', 'recommendations']
      }
    });

    return response;
  } catch (error) {
    console.error('AI recommendation error:', error);
    return { recommendations: [], overall_insights: '' };
  }
}

/**
 * Auto-tag resources based on their content using AI
 */
export async function autoTagResources(resources) {
  try {
    const prompt = `Analyze these return-to-work resources and suggest additional relevant tags/keywords that would help users find them.

RESOURCES:
${resources.slice(0, 20).map((r, i) => 
  `${i+1}. ${r.name} - ${r.description}`
).join('\n\n')}

For each resource, suggest 3-5 additional tags that capture:
- Specific conditions/symptoms addressed
- Emotional/psychological aspects
- Practical outcomes
- Target audience nuances

Return as array of objects with: resource_index (0-based), suggested_tags (array of strings)`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          tagged_resources: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                resource_index: { type: 'number' },
                suggested_tags: {
                  type: 'array',
                  items: { type: 'string' }
                }
              },
              required: ['resource_index', 'suggested_tags']
            }
          }
        }
      }
    });

    return response.tagged_resources || [];
  } catch (error) {
    console.error('Auto-tagging error:', error);
    return [];
  }
}