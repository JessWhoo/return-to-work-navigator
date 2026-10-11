import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, MessageCircle, Zap, Shield, 
  Calendar, Heart, FileText, TrendingUp 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SuggestedQuestions({ progress, onSendMessage }) {
  // Generate contextual suggestions based on user's current state
  const generateSuggestions = () => {
    const suggestions = [];

    // Journey stage specific
    const stage = progress?.journey_stage || 'planning';
    
    if (stage === 'planning') {
      suggestions.push({
        question: "What accommodations should I request for my return to work?",
        icon: Shield,
        category: "Accommodations"
      });
      suggestions.push({
        question: "How do I talk to my employer about my cancer history?",
        icon: MessageCircle,
        category: "Communication"
      });
    }

    if (stage === 'first_week') {
      suggestions.push({
        question: "I'm exhausted on my first week back. What should I do?",
        icon: Zap,
        category: "Energy"
      });
      suggestions.push({
        question: "How can I handle questions from coworkers about my absence?",
        icon: MessageCircle,
        category: "Communication"
      });
    }

    if (stage === 'ongoing') {
      suggestions.push({
        question: "My current accommodations aren't working. How can I request changes?",
        icon: Shield,
        category: "Accommodations"
      });
    }

    // Energy-based suggestions
    const recentEnergy = progress?.energy_logs?.slice(-7) || [];
    const avgEnergy = recentEnergy.length > 0
      ? recentEnergy.reduce((sum, log) => {
          const avg = ((log.morning_energy || 0) + (log.afternoon_energy || 0) + (log.evening_energy || 0)) / 3;
          return sum + avg;
        }, 0) / recentEnergy.length
      : 5;

    if (avgEnergy < 5) {
      suggestions.push({
        question: "I'm struggling with low energy. What pacing strategies can help?",
        icon: Zap,
        category: "Energy",
        priority: true
      });
    }

    // Stress-based suggestions
    const avgStress = recentEnergy.length > 0
      ? recentEnergy.reduce((sum, log) => sum + (log.stress_level || 0), 0) / recentEnergy.length
      : 5;

    if (avgStress >= 7) {
      suggestions.push({
        question: "I'm feeling overwhelmed and stressed. Can you help me cope?",
        icon: Heart,
        category: "Emotional Support",
        priority: true
      });
    }

    // Return date proximity
    if (progress?.return_date) {
      const daysToReturn = Math.ceil((new Date(progress.return_date) - new Date()) / (1000 * 60 * 60 * 24));
      if (daysToReturn > 0 && daysToReturn <= 14) {
        suggestions.push({
          question: "My return date is coming up. How can I prepare?",
          icon: Calendar,
          category: "Preparation",
          priority: true
        });
      }
    }

    // Checklist progress
    const checklistItems = progress?.completed_checklist_items?.length || 0;
    if (checklistItems === 0) {
      suggestions.push({
        question: "Where should I start with my return-to-work preparation?",
        icon: FileText,
        category: "Getting Started"
      });
    }

    // General helpful questions
    suggestions.push({
      question: "What are my legal rights as a cancer survivor returning to work?",
      icon: Shield,
      category: "Legal Rights"
    });

    suggestions.push({
      question: "Show me resources relevant to my current situation",
      icon: TrendingUp,
      category: "Resources"
    });

    // Limit to 6 suggestions, prioritize urgent ones
    const prioritized = suggestions.sort((a, b) => (b.priority ? 1 : 0) - (a.priority ? 1 : 0));
    return prioritized.slice(0, 6);
  };

  const suggestions = generateSuggestions();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span>Suggested Questions</span>
        </CardTitle>
        <p className="mt-1 text-xs text-muted-foreground">
          Click a question to start the conversation
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {suggestions.map((suggestion, idx) => {
          const Icon = suggestion.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Button
                variant="outline"
                className="h-auto w-full justify-start !whitespace-normal p-3 text-left"
                onClick={() => onSendMessage(suggestion.question)}
              >
                <div className="flex w-full items-start space-x-3">
                  <div className="shrink-0 rounded-pill bg-muted p-2 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="nv-chip nv-chip--muted">
                        {suggestion.category}
                      </span>
                      {suggestion.priority && (
                        <span className="nv-chip !bg-destructive !text-destructive-foreground">
                          Priority
                        </span>
                      )}
                    </div>
                    <p className="text-sm">{suggestion.question}</p>
                  </div>
                </div>
              </Button>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}