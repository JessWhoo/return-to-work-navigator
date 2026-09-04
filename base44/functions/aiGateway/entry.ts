import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Centralized, auth-gated gateway for every AI (InvokeLLM) feature in the app.
//
// Why this exists: InvokeLLM spends integration credits. Calling it from the
// browser let any visitor — signed in or not — burn the app's credits with
// arbitrary prompts. This gateway fixes that:
//   1. The user MUST be authenticated (401 otherwise) — no anonymous credit use.
//   2. The client may only request a fixed `operation` from the allowlist below.
//      It cannot send an arbitrary prompt — the prompt is built server-side.
//   3. The response schema and model are chosen here, not by the caller.
//   4. Calls run as the service role so they work regardless of RLS.
//
// Contract: { operation, data } -> { result } where `result` is the LLM output
// (a string when no schema is set, an object when one is).

// ---- Per-operation response schemas (server-owned) ----
const SCHEMAS = {
  check_in_recommendation: {
    type: 'object',
    properties: {
      index: { type: 'number' },
      reason: { type: 'string' },
    },
    required: ['index', 'reason'],
  },
  action_plan: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      overview: { type: 'string' },
      week_1_2_goals: { type: 'array', items: { type: 'string' } },
      week_3_4_goals: { type: 'array', items: { type: 'string' } },
      key_focus_areas: {
        type: 'array',
        items: { type: 'object', properties: { area: { type: 'string' }, why: { type: 'string' } } },
      },
      daily_practices: { type: 'array', items: { type: 'string' } },
      success_metrics: { type: 'array', items: { type: 'string' } },
      encouragement: { type: 'string' },
    },
  },
  improve_draft: {
    type: 'object',
    properties: {
      suggestions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['strength', 'tone', 'clarity', 'legal', 'boundary'] },
            suggestion: { type: 'string' },
          },
        },
      },
    },
  },
  talking_points: {
    type: 'object',
    properties: { talking_points: { type: 'array', items: { type: 'string' } } },
  },
  meeting_prep_suggestions: {
    type: 'object',
    properties: {
      talking_points: { type: 'array', items: { type: 'string' } },
      anticipated_objections: { type: 'array', items: { type: 'string' } },
      documents_to_bring: { type: 'array', items: { type: 'string' } },
    },
  },
  simulate_feedback: {
    type: 'object',
    properties: {
      scores: { type: 'object' },
      overall_score: { type: 'number' },
      strengths: { type: 'array', items: { type: 'string' } },
      tips: { type: 'array', items: { type: 'string' } },
      encouragement: { type: 'string' },
    },
  },
  analyze_employer_response: {
    type: 'object',
    properties: {
      analysis: { type: 'string' },
      refined_strategies: { type: 'array', items: { type: 'string' } },
      next_action: { type: 'string' },
    },
  },
  symptom_insights: {
    type: 'object',
    properties: {
      overall_assessment: { type: 'string', enum: ['stable', 'improving', 'fluctuating', 'concerning'] },
      summary: { type: 'string' },
      recurring_patterns: {
        type: 'array',
        items: { type: 'object', properties: { pattern: { type: 'string' }, frequency: { type: 'string' }, description: { type: 'string' } } },
      },
      correlations: {
        type: 'array',
        items: { type: 'object', properties: { correlation: { type: 'string' }, insight: { type: 'string' } } },
      },
      identified_triggers: {
        type: 'array',
        items: { type: 'object', properties: { trigger: { type: 'string' }, description: { type: 'string' } } },
      },
      concerns: { type: 'array', items: { type: 'string' } },
      management_tips: {
        type: 'array',
        items: { type: 'object', properties: { tip: { type: 'string' }, rationale: { type: 'string' } } },
      },
      accommodation_suggestions: { type: 'array', items: { type: 'string' } },
    },
    required: ['overall_assessment', 'summary', 'management_tips'],
  },
  activity_correlations: {
    type: 'object',
    properties: {
      time_of_day_patterns: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            time_period: { type: 'string', enum: ['morning', 'afternoon', 'evening', 'consistent_all_day'] },
            pattern: { type: 'string' }, evidence: { type: 'string' }, strength: { type: 'string', enum: ['weak', 'moderate', 'strong'] },
          },
        },
      },
      activity_correlations: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            activity_type: { type: 'string' }, impact: { type: 'string' },
            correlation_strength: { type: 'string', enum: ['weak', 'moderate', 'strong'] },
            time_lag: { type: 'string' }, evidence: { type: 'string' }, recommendation: { type: 'string' },
          },
        },
      },
      symptom_triggers: {
        type: 'array',
        items: { type: 'object', properties: { trigger: { type: 'string' }, symptoms_affected: { type: 'array', items: { type: 'string' } }, frequency: { type: 'string' }, avoidance_strategy: { type: 'string' } } },
      },
      protective_factors: {
        type: 'array',
        items: { type: 'object', properties: { factor: { type: 'string' }, benefit: { type: 'string' }, recommendation: { type: 'string' } } },
      },
    },
    required: ['time_of_day_patterns', 'activity_correlations'],
  },
  predictive_alerts: {
    type: 'object',
    properties: {
      overall_risk_level: { type: 'string', enum: ['low', 'moderate', 'high'] },
      trend_direction: { type: 'string', enum: ['improving', 'stable', 'declining', 'fluctuating'] },
      predictions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            period: { type: 'string' }, risk_level: { type: 'string', enum: ['low', 'moderate', 'high'] },
            predicted_issue: { type: 'string' }, confidence: { type: 'string', enum: ['low', 'medium', 'high'] },
            reasoning: { type: 'string' }, triggers: { type: 'array', items: { type: 'string' } },
            prevention_strategies: { type: 'array', items: { type: 'string' } },
          },
        },
      },
      recommendations: { type: 'array', items: { type: 'string' } },
    },
    required: ['overall_risk_level', 'trend_direction', 'predictions'],
  },
  proactive_alerts: {
    type: 'object',
    properties: {
      alerts: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' }, priority: { type: 'string', enum: ['high', 'medium', 'low'] },
            type: { type: 'string', enum: ['energy', 'stress', 'symptom', 'general'] },
            title: { type: 'string' }, description: { type: 'string' },
            actions: { type: 'array', items: { type: 'string' } }, contact_provider: { type: 'boolean' },
          },
        },
      },
    },
    required: ['alerts'],
  },
  what_if: {
    type: 'object',
    properties: {
      overall_risk: { type: 'string', enum: ['low', 'moderate', 'high'] },
      feasibility: { type: 'string', enum: ['recommended', 'possible_with_caution', 'not_recommended'] },
      predicted_impacts: {
        type: 'object',
        properties: {
          energy_change: { type: 'string' }, stress_change: { type: 'string' },
          symptom_likelihood: { type: 'string' }, fatigue_risk: { type: 'string' },
        },
      },
      reasoning: { type: 'string' },
      mitigation_strategies: { type: 'array', items: { type: 'string' } },
      gradual_implementation: {
        type: 'object',
        properties: { recommended: { type: 'boolean' }, plan: { type: 'array', items: { type: 'string' } } },
      },
      monitoring_checklist: { type: 'array', items: { type: 'string' } },
    },
    required: ['overall_risk', 'feasibility', 'predicted_impacts', 'reasoning'],
  },
  progress_insights: {
    type: 'object',
    properties: {
      overall_status: { type: 'string', enum: ['improving', 'stable', 'declining', 'concerning'] },
      summary: { type: 'string' },
      energy_trend: { type: 'object', properties: { direction: { type: 'string', enum: ['up', 'down', 'stable', 'fluctuating'] }, insight: { type: 'string' } } },
      mood_pattern: { type: 'object', properties: { dominant_mood: { type: 'string' }, insight: { type: 'string' } } },
      stress_analysis: { type: 'object', properties: { average_level: { type: 'number' }, insight: { type: 'string' } } },
      correlations: { type: 'array', items: { type: 'object', properties: { pattern: { type: 'string' }, description: { type: 'string' } } } },
      concerns: { type: 'array', items: { type: 'string' } },
      personalized_tips: { type: 'array', items: { type: 'object', properties: { tip: { type: 'string' }, rationale: { type: 'string' } } } },
      recommended_actions: { type: 'array', items: { type: 'string' } },
    },
    required: ['overall_status', 'summary', 'personalized_tips'],
  },
  smart_recommendations: {
    type: 'object',
    properties: {
      recommendations: {
        type: 'array',
        items: { type: 'object', properties: { resource_name: { type: 'string' }, category: { type: 'string' }, priority: { type: 'string' }, reason: { type: 'string' } } },
      },
    },
  },
  personalized_recommendations: {
    type: 'object',
    properties: {
      user_insights: { type: 'object', properties: { primary_challenges: { type: 'array', items: { type: 'string' } }, key_focus_areas: { type: 'array', items: { type: 'string' } }, readiness_assessment: { type: 'string' } } },
      recommendations: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            resource_name: { type: 'string' }, resource_category: { type: 'string' },
            priority: { type: 'string', enum: ['high', 'medium', 'low'] },
            addresses_challenge: { type: 'string' }, why_now: { type: 'string' },
            how_to_use: { type: 'string' }, expected_benefit: { type: 'string' }, community_validation: { type: 'string' },
          },
        },
      },
      next_steps: { type: 'array', items: { type: 'string' } },
    },
  },
  resource_recommendations: {
    type: 'object',
    properties: {
      overall_insights: { type: 'string' },
      recommendations: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            resource_id: { type: 'string' }, priority: { type: 'string', enum: ['urgent', 'high', 'medium', 'low'] },
            reason: { type: 'string' }, relevance_score: { type: 'number', minimum: 1, maximum: 10 },
          },
          required: ['resource_id', 'priority', 'reason', 'relevance_score'],
        },
      },
    },
    required: ['overall_insights', 'recommendations'],
  },
  auto_tag_resources: {
    type: 'object',
    properties: {
      tagged_resources: {
        type: 'array',
        items: { type: 'object', properties: { resource_index: { type: 'number' }, suggested_tags: { type: 'array', items: { type: 'string' } } }, required: ['resource_index', 'suggested_tags'] },
      },
    },
  },
  compare_resources: {
    type: 'object',
    properties: {
      analyses: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            resource_id: { type: 'string' }, benefits: { type: 'array', items: { type: 'string' } },
            difficulty: { type: 'string' }, time_requirement: { type: 'string' },
            best_for: { type: 'string' }, score: { type: 'number' },
          },
        },
      },
      winner_id: { type: 'string' }, winner_reason: { type: 'string' },
    },
  },
  suggest_tags: { type: 'object', properties: { tags: { type: 'array', items: { type: 'string' } } } },
  resume_analysis: {
    type: 'object',
    properties: {
      match_score: { type: 'number' }, match_label: { type: 'string' }, summary: { type: 'string' },
      missing_keywords: { type: 'array', items: { type: 'string' } },
      present_keywords: { type: 'array', items: { type: 'string' } },
      missing_skills: { type: 'array', items: { type: 'object', properties: { skill: { type: 'string' }, importance: { type: 'string' }, suggestion: { type: 'string' } } } },
      resume_improvements: { type: 'array', items: { type: 'object', properties: { section: { type: 'string' }, suggestion: { type: 'string' } } } },
      strengths: { type: 'array', items: { type: 'string' } },
    },
  },
};

// ---- Per-operation prompt builders (server-owned) ----
// For simple features the whole prompt is built here from small fields.
// For features with large, app-built data sections the client sends the
// already-formatted data block; the server still owns the surrounding
// instruction, the schema, the model, and the auth gate — so callers can
// never inject an arbitrary prompt or pick a model.
const BUILDERS = {
  daily_affirmation: (d) => `You are a compassionate coach for cancer survivors returning to work.
Generate ONE warm, specific, empowering daily affirmation for a cancer survivor who is in the "${d.stageLabel || 'planning'}" stage of returning to work.
The affirmation should:
- Be 1-2 sentences, personal and direct (use "you" or "I")
- Acknowledge their unique courage and strength
- Be practical and grounding, not generic
- Avoid medical jargon
Respond with ONLY the affirmation text, no quotes, no extra text.`,

  check_in_recommendation: (d) => `A cancer survivor just logged their daily check-in:
- Mood: ${d.mood}
- Energy level: ${d.energy}/10
- Top challenge today: "${d.challenge}"

Here is a numbered list of resources available (index: name — description):
${d.resourceSummaries}

Based ONLY on their mood, energy, and challenge, pick the SINGLE most helpful resource index number. 
Reply with ONLY a JSON object like: {"index": 12, "reason": "one sentence explaining why this helps them today"}`,

  action_plan: (d) => `You are a supportive return-to-work coach for cancer survivors. Generate a personalized 30-day action plan based on this user's data:

Journey Stage: ${d.journey_stage}
Checklist Items Completed: ${d.completed_items}
Energy Tracking: ${d.energy_logs_count} days logged${d.avgEnergy ? `, avg energy ${d.avgEnergy}/10` : ''}
Stress Level: ${d.avgStress ? `${d.avgStress}/10` : 'Not tracked'}
Accommodations Requested: ${d.accommodations_requested}
Return Date: ${d.return_date || 'Not set'}
Has Calendar Events: ${d.has_calendar_events ? 'Yes' : 'No'}

Create a supportive, actionable 30-day plan with:
1. Week 1-2 Goals (3-4 specific, achievable goals)
2. Week 3-4 Goals (3-4 specific, achievable goals)
3. Key Focus Areas (3-4 areas to prioritize)
4. Daily Practices (3-4 simple daily habits)
5. Success Metrics (how they'll know they're making progress)

Be encouraging, realistic, and specific to their current stage. Focus on gradual progress and self-care.`,

  smart_insights: (d) => `Analyze this cancer survivor's return-to-work data and provide ONE specific, actionable insight:

Journey Stage: ${d.journey_stage}
Completed Tasks: ${d.completedCount}
Recent Energy Logs: ${d.recentLogsJson}
Accommodations: ${d.accommodationsCount}

Provide a SHORT (1-2 sentences), specific insight about their pattern or something they should focus on.`,

  progress_insights: (d) => `You are an expert health analytics coach for cancer survivors returning to work. Analyze this user's progress data and provide actionable insights.

USER DATA:
Journey Stage: ${d.journey_stage}
Return Date: ${d.return_date || 'Not set'}
Accommodations Requested: ${d.accommodations}
Checklist Items Completed: ${d.checklist_progress}

ENERGY & MOOD TRENDS (Last 14 days):
${d.energyTrendsText}

RECENT SYMPTOMS (Last 5):
${d.recentSymptomsText}

ANALYSIS TASKS:
1. Identify energy level trends (improving, declining, stable)
2. Detect mood patterns and correlations with energy/stress
3. Spot potential triggers or patterns in symptoms
4. Identify concerning patterns requiring attention
5. Provide 3-5 personalized, actionable tips for managing stress and fatigue
6. Suggest potential accommodations or adjustments based on data

Be specific, empathetic, and actionable. Focus on patterns over the last 7-14 days.`,

  progress_report: (d) => `You are a compassionate return-to-work coach. Generate a concise, professional progress summary that a cancer survivor can share with their mentor, coach, or support group. Use warm, encouraging language. Include only the data provided below. Format as readable paragraphs (no bullet lists).

Progress Data:
${d.context}

Write a 2-3 paragraph shareable progress report. Highlight achievements and frame any challenges positively.`,

  improve_draft: (d) => `You are an expert communication coach helping a cancer survivor navigate workplace conversations. Review and improve this workplace communication draft.

Scenario Type: ${d.scenario_type}
Recipient: ${d.recipient || 'supervisor/HR'}
Desired Tone: ${d.tone}
Subject: ${d.subject}

Current Draft:
${d.content}

Provide 5 specific, actionable suggestions to improve this communication. Focus on:
1. Clarity and professionalism
2. Legal language for accommodation requests
3. Striking the right balance between disclosure and privacy
4. Tone consistency
5. Removing apologetic language or over-justification

For each suggestion, provide:
- type: "strength" (what's working well), "tone" (tone adjustments), "clarity" (unclear parts), "legal" (legal considerations), or "boundary" (privacy/boundaries)
- suggestion: specific advice with examples`,

  draft_email: (d) => `${d.templatePrompt}

${d.contextInfo || ''}

Recipient name (if provided): ${d.recipientName || 'Not specified'}
Sender should sign as: [Your Name]

Generate a professional, empathetic email that:
- Uses proper business email format
- Includes a warm greeting and professional closing
- Is approximately 150-250 words
- Uses confident but collaborative language
- Avoids oversharing medical details
- Focuses on solutions and capabilities
- Includes specific, actionable requests

Return only the email body text, starting with the greeting.`,

  generate_employer_email: (d) => `${d.scenarioPrompt}

${d.progressContext || ''}${d.coachContext || ''}${d.extraInfo || ''}

${d.recipientInfo}
Sender signs as: [Your Name]

Rules:
- Proper business email format (greeting → body → closing)
- 150–250 words
- Professional, empathetic, solution-focused language
- Do NOT overshare medical details
- Use [bracketed placeholders] for any specific details the sender should fill in
- Return ONLY the email body starting with the greeting (no subject line in the body)`,

  talking_points: (d) => `You are helping a cancer survivor prepare talking points for a meeting with their manager about returning to work.

Scenario focus: ${d.scenarioName || 'General return-to-work discussion'}
Their work constraints: ${d.constraints || 'None specified'}
Their current energy level: ${d.energyLabel} (${d.energy}/5)

Write 5-7 concise, professional, first-person talking points they can say directly to their manager. Points should:
- Be confident and collaborative, not apologetic
- Reflect their stated constraints and energy level realistically (lower energy = more emphasis on pacing, breaks, phased plans)
- Include at least one concrete, specific proposal (schedule, phasing, or accommodation)
- Avoid medical jargon and oversharing medical details`,

  meeting_prep_suggestions: (d) => `You are helping a cancer survivor prepare for a workplace meeting. Generate practical, specific suggestions.

Meeting type: ${d.meetingTypeLabel}
Attendees: ${d.attendees || 'not specified'}
Goals: ${d.goals || 'not specified'}
Existing talking points: ${d.talkingPoints || 'none yet'}
Requested accommodations: ${d.accommodations || 'none yet'}

Generate:
1. 3-4 specific talking points they should raise
2. 2-3 potential employer objections they should be ready for
3. 2-3 documents they should bring

Be concise and practical.`,

  simulate_opening: (d) => `${d.systemPrompt}\n\nNow open the meeting. Start speaking as the manager/HR rep.`,

  simulate_reply: (d) => `${d.systemPrompt}\n\nConversation so far:\n${d.history}\n\nContinue as the Manager/HR. Respond to the employee's last message:`,

  simulate_feedback: (d) => d.feedbackPrompt,

  analyze_employer_response: (d) => `You are an expert coach helping a cancer survivor navigate workplace accommodation negotiations.

Meeting: ${d.title} (${d.meetingType})
Goals: ${d.goals || 'Not specified'}
Talking points used: ${d.talkingPoints || 'None'}
Accommodations requested: ${d.accommodations || 'None'}

Employer response history:
${d.responsesText}

Based on this history, provide:
1. Analysis of what worked and what didn't
2. 3 refined follow-up talking points or strategies
3. Next recommended action step

Be concise, empathetic, and practical.`,

  symptom_insights: (d) => `You are an expert symptom analyst helping cancer survivors manage their return to work. Analyze the symptom patterns below and provide actionable insights.

SYMPTOM LOGS (Last 30):
${d.symptomLogsText}

RECENT ENERGY & MOOD DATA (Last 14 days):
${d.recentEnergyText}

ANALYSIS TASKS:
1. Identify recurring symptom patterns (frequency, timing, types)
2. Detect correlations between symptoms and energy/mood/stress levels
3. Identify potential symptom triggers (activities, times, conditions)
4. Spot concerning patterns that may need medical attention
5. Provide 4-6 personalized tips for managing these specific symptoms
6. Suggest practical accommodations or adjustments based on symptom patterns

Focus on actionable insights that can help the user manage symptoms while returning to work.`,

  activity_correlations: (d) => `You are an expert in health pattern analysis for cancer survivors. Analyze the data below to identify correlations between activities, times of day, and symptom patterns.

DAILY DATA (Last 30 days):
${d.dailyDataText}

ANALYSIS TASKS:
1. **Time-of-Day Patterns**: Identify if symptoms or energy dips occur at specific times (morning/afternoon/evening)
2. **Activity Correlations**: Find connections between calendar events (meetings, medical appointments) and symptom onset or energy changes
3. **Multi-Day Patterns**: Detect if symptoms appear X days after certain activities
4. **Trigger Identification**: Identify specific activities or event types that precede increased symptoms or decreased energy
5. **Protective Factors**: Find activities or patterns associated with better energy and fewer symptoms

Provide 4-6 actionable correlations with strong evidence from the data.`,

  predictive_alerts: (d) => `You are a health analytics AI specializing in predicting health patterns for cancer survivors returning to work.

HISTORICAL DATA (Last 30 days):

Energy & Stress Logs:
${d.energyTrendsText}

Symptom Records:
${d.symptomPatternsText}

Upcoming Calendar Events (Next 14 days):
${d.upcomingEventsText}

Current Journey Stage: ${d.journeyStage}
Days to Return: ${d.daysToReturn}

TASK:
Analyze the historical patterns and predict potential flare-ups or challenging periods in the next 7-14 days. Consider:

1. **Historical Patterns**: Identify recurring patterns (e.g., symptoms spike every X days, energy crashes after certain events)
2. **Trend Analysis**: Detect if symptoms/energy are trending upward or downward
3. **Event Triggers**: Correlate past calendar events with energy drops or symptom increases
4. **Upcoming Risks**: Predict how upcoming events might impact health based on past patterns
5. **Risk Level**: Assign risk level (low/medium/high) for each predicted period

Provide 3-5 actionable predictions with specific dates/periods, reasoning, and prevention strategies.`,

  proactive_alerts: (d) => `You are a health monitoring AI for cancer survivors returning to work. Analyze the data below and generate proactive health alerts.

RECENT ENERGY LOGS (Last 7 days):
${d.energyDataText}

RECENT SYMPTOMS (Last 10):
${d.symptomDataText}

CURRENT STATUS:
- Journey Stage: ${d.journeyStage}
- Return Date: ${d.returnDate || 'Not set'}
- Days Tracked: ${d.daysTracked}

ANALYSIS REQUIREMENTS:
1. Identify concerning patterns (energy drops, stress spikes, symptom severity)
2. Detect early warning signs that need attention
3. Generate 2-4 actionable alerts with specific recommendations
4. Each alert should have: priority (high/medium/low), type (energy/stress/symptom/general), title, description, and recommended actions
5. Focus on preventive care and early intervention

Return proactive, supportive alerts that help the user maintain their health.`,

  what_if: (d) => `You are a predictive health analytics AI for cancer survivors. Perform a 'what-if' scenario analysis.

CURRENT BASELINE:
${d.baselineText}

RECENT PATTERNS:
${d.recentPatternsText}

PROPOSED SCENARIO:
${d.scenarioText}

ANALYSIS TASK:
Based on the user's current health patterns and the proposed change, predict:
1. How their energy levels might change (realistic estimate)
2. How stress levels might be affected
3. Likelihood of symptom increase or fatigue
4. Risk level of implementing this change
5. Specific recommendations to mitigate negative impacts
6. Gradual implementation strategy if needed

Be realistic and data-driven. Consider the user's current trajectory and symptom patterns.`,

  smart_recommendations: (d) => `You are an expert return-to-work advisor for cancer survivors. Analyze the user's journey data and recommend 3-4 highly relevant resources from the provided list.

${d.userContextText}

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

  personalized_recommendations: (d) => `You are an expert advisor for cancer survivors returning to work. Analyze this user's data and recommend the most relevant resources.

USER DATA:
${d.userDataText}

AVAILABLE RESOURCES WITH COMMUNITY FEEDBACK:
${d.resourcesJson}

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

Return recommendations sorted by priority (high first).`,

  resource_recommendations: (d) => `You are an expert return-to-work advisor for cancer survivors. Analyze this user's journey data and recommend the most relevant resources from the list below.

${d.context}

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

Also provide overall_insights (2-3 sentences about the user's current state and general recommendations, mentioning any clear preference patterns observed).`,

  auto_tag_resources: (d) => `Analyze these return-to-work resources and suggest additional relevant tags/keywords that would help users find them.

RESOURCES:
${d.resourcesText}

For each resource, suggest 3-5 additional tags that capture:
- Specific conditions/symptoms addressed
- Emotional/psychological aspects
- Practical outcomes
- Target audience nuances

Return as array of objects with: resource_index (0-based), suggested_tags (array of strings)`,

  compare_resources: (d) => `You are an expert career coach helping cancer survivors return to work. Analyze these ${d.count} resources and provide a structured comparison.

Resources:
${d.resourceDescriptionsText}

User Journey Stage: ${d.journeyStage || 'planning'}

For EACH resource, provide:
- benefits: array of 3 short specific benefits (each under 10 words)
- difficulty: "low", "medium", or "high" (how hard it is to use/apply this resource)
- time_requirement: "quick" (<15min), "short" (15-60min), "long" (1-4 hours), or "ongoing"
- best_for: one sentence on who benefits most from this resource
- score: 1-5 overall recommendation score for this user's journey stage

Also identify the single best overall recommendation (winner_id) with a short reason (winner_reason).

Respond ONLY with valid JSON.`,

  summarize_resource: (d) => `You are a helpful assistant for cancer survivors returning to work. 
Generate a concise, plain-language summary (3-5 sentences) of the following resource. 
Focus on: what it is, who it's for, and how it helps someone returning to work after cancer treatment.

${d.resourceText}

Write in a warm, supportive tone. Be specific and actionable.`,

  suggest_tags: (d) => `Generate 5-8 concise, relevant tags for this resource that would help a cancer survivor find it via search. Tags should be lowercase, 1-3 words each, covering the main topics, audience, and use case.

${d.resourceText}

Return ONLY a JSON array of tag strings. Example: ["return to work", "fatigue", "workplace accommodations", "legal rights"]`,

  resume_analysis: (d) => `You are an expert resume coach and ATS specialist helping a cancer survivor return to work.

Analyze the resume (from the attached file) against the job description below.

JOB DESCRIPTION:
${d.jobDescription}

Return a JSON object with this exact structure:
{
  "match_score": <number 0-100>,
  "match_label": <"Poor" | "Fair" | "Good" | "Strong">,
  "summary": "<2-sentence overview of the match>",
  "missing_keywords": ["<keyword1>", "<keyword2>", ...],
  "present_keywords": ["<keyword1>", "<keyword2>", ...],
  "missing_skills": [
    { "skill": "<skill name>", "importance": "<High|Medium|Low>", "suggestion": "<how to address this on the resume>" }
  ],
  "resume_improvements": [
    { "section": "<Resume Section e.g. Summary, Experience, Skills>", "suggestion": "<specific actionable suggestion>" }
  ],
  "strengths": ["<strength1>", "<strength2>", ...]
}`,
};

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { operation, data } = body || {};
    const builder = BUILDERS[operation];
    if (!builder) return Response.json({ error: 'Unknown operation' }, { status: 400 });

    const prompt = builder(data || {});
    const schema = SCHEMAS[operation] || null;

    const invokeArgs = schema ? { prompt, response_json_schema: schema } : { prompt };
    // resume_analysis attaches the uploaded resume file (UploadFile stays client-side).
    if (operation === 'resume_analysis' && data?.resumeUrl) {
      invokeArgs.file_urls = [data.resumeUrl];
    }

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM(invokeArgs);
    return Response.json({ result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}