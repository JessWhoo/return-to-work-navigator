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
        resource_id: `${cat.category}-${idx}`,
        category: cat.category,
        color: cat.color
      }))
    );

    // Fetch user's records for additional context
    const records = await base44.entities.Record.list('-date', 10);
    const symptomRecords = await base44.entities.Record.filter({ type: 'symptom' }, '-date', 10);
    
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

    // Analyze symptoms
    const recentSymptoms = symptomRecords.slice(0, 5).map(s => ({
      title: s.title,
      severity: s.symptom_details?.severity,
      types: s.symptom_details?.symptom_type || [],
      date: s.date
    }));

    const avgSymptomSeverity = recentSymptoms.length > 0
      ? recentSymptoms.reduce((sum, s) => sum + (s.severity || 0), 0) / recentSymptoms.length
      : 0;

    // Fetch all reviews to get community insights
    const allReviews = await base44.entities.ResourceReview.list();
    const reviewsByResource = {};
    allReviews.forEach(review => {
      if (!reviewsByResource[review.resource_id]) {
        reviewsByResource[review.resource_id] = [];
      }
      reviewsByResource[review.resource_id].push(review);
    });

    // Analyze user interaction patterns
    const interactions = progress.resource_interactions || [];
    const interactionCounts = {};
    interactions.forEach(i => {
      if (!interactionCounts[i.resource_id]) interactionCounts[i.resource_id] = { view: 0, link_click: 0, bookmark: 0, ask_coach: 0 };
      interactionCounts[i.resource_id][i.event] = (interactionCounts[i.resource_id][i.event] || 0) + 1;
    });

    // User tags: useful vs not_relevant
    const resourceTags = progress.resource_tags || {};
    const usefulIds = Object.entries(resourceTags).filter(([, v]) => v === 'useful').map(([k]) => k);
    const notRelevantIds = Object.entries(resourceTags).filter(([, v]) => v === 'not_relevant').map(([k]) => k);

    // Find patterns in what user finds useful — extract topics/categories
    const usefulResources = flatResources.filter(r => usefulIds.includes(r.resource_id));
    const usefulTopics = [...new Set(usefulResources.flatMap(r => r.topics || []))];
    const usefulCategories = [...new Set(usefulResources.map(r => r.category))];
    const usefulTypes = [...new Set(usefulResources.map(r => r.type))];

    // Build comprehensive prompt for AI
    const prompt = `You are an expert return-to-work coach for cancer survivors. Analyze the user's current state and recommend the most relevant resources.

USER PROFILE:
- Journey Stage: ${progress.journey_stage || 'planning'}
- Average Energy Level: ${avgEnergy.toFixed(1)}/10 (recent week)
- Average Stress Level: ${avgStress.toFixed(1)}/10 (recent week)
- Current Mood: ${dominantMood}
- Checklist Progress: ${progress.completed_checklist_items?.length || 0} items completed
- Accommodations Requested: ${progress.accommodations_requested?.length || 0}
- Recent Symptoms: ${recentSymptoms.length} logged (avg severity: ${avgSymptomSeverity.toFixed(1)}/10)
- Symptom Types: ${[...new Set(recentSymptoms.flatMap(s => s.types))].join(', ') || 'none reported'}

USER INTERACTION PATTERNS (explicit feedback):
- Resources tagged as USEFUL by user: ${usefulIds.length > 0 ? usefulIds.join(', ') : 'none yet'}
- Preferred topics (from useful tags): ${usefulTopics.join(', ') || 'none yet'}
- Preferred categories: ${usefulCategories.join(', ') || 'none yet'}
- Preferred types: ${usefulTypes.join(', ') || 'none yet'}
- Resources tagged as NOT RELEVANT (MUST exclude from recommendations): ${notRelevantIds.length > 0 ? notRelevantIds.join(', ') : 'none'}

ENGAGEMENT PATTERNS (most clicked/viewed):
${Object.entries(interactionCounts).slice(0, 10).map(([id, counts]) => 
  `- ${id}: ${counts.view || 0} views, ${counts.link_click || 0} link clicks, ${counts.ask_coach || 0} coach asks`
).join('\n') || '- No interaction data yet'}

RECENT RECORDS (last 10):
${records.map(r => `- ${r.type}: ${r.title} (${r.date})`).join('\n')}

RECENT SYMPTOMS (last 5):
${recentSymptoms.length > 0 
  ? recentSymptoms.map(s => `- ${s.title} (${s.date}): Severity ${s.severity}/10, Types: ${s.types.join(', ')}`).join('\n')
  : 'No symptoms logged recently'
}

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
2. Energy and stress levels - prioritize energy management if levels are low
3. Recent symptoms - if high severity or frequent, prioritize symptom management resources
4. Recent records (medical, workplace issues)
5. Community ratings and feedback - prefer highly-rated resources
6. Variety across different types of support needed
7. URGENCY: If symptoms are severe (7+/10) or stress is high (7+/10), mark as high/urgent priority
8. CRITICAL: NEVER recommend resources tagged as "not_relevant" by the user
9. STRONGLY PREFER resources matching user's preferred topics/categories/types from useful tags
10. Boost relevance_score for resources similar to ones the user has engaged with most

For each recommendation, provide:
- resource_id (MUST match exactly from the list above)
- priority (urgent/high/medium/low)
- reason (why this resource is relevant RIGHT NOW for this user - be specific and personal, mention if it matches their stated preferences)
- relevance_score (1-10, how relevant is this)

Also provide overall_insights (2-3 sentences about the user's current state and general recommendations, mentioning any clear preference patterns observed).`;

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
    base44.analytics.track({
      eventName: 'ai_recommendations_failed',
      properties: {
        error_message: error?.message || 'unknown',
        journey_stage: progress?.journey_stage || 'unknown',
      }
    });
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