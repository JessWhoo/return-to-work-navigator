import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
        category: "Accommodations",
        color: "blue"
      });
      suggestions.push({
        question: "How do I talk to my employer about my cancer history?",
        icon: MessageCircle,
        category: "Communication",
        color: "purple"
      });
    }

    if (stage === 'first_week') {
      suggestions.push({
        question: "I'm exhausted on my first week back. What should I do?",
        icon: Zap,
        category: "Energy",
        color: "amber"
      });
      suggestions.push({
        question: "How can I handle questions from coworkers about my absence?",
        icon: MessageCircle,
        category: "Communication",
        color: "purple"
      });
    }

    if (stage === 'ongoing') {
      suggestions.push({
        question: "My current accommodations aren't working. How can I request changes?",
        icon: Shield,
        category: "Accommodations",
        color: "blue"
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
        color: "amber",
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
        color: "rose",
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
          color: "green",
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
        category: "Getting Started",
        color: "indigo"
      });
    }

    // General helpful questions
    suggestions.push({
      question: "What are my legal rights as a cancer survivor returning to work?",
      icon: Shield,
      category: "Legal Rights",
      color: "blue"
    });

    suggestions.push({
      question: "Show me resources relevant to my current situation",
      icon: TrendingUp,
      category: "Resources",
      color: "teal"
    });

    // Limit to 6 suggestions, prioritize urgent ones
    const prioritized = suggestions.sort((a, b) => (b.priority ? 1 : 0) - (a.priority ? 1 : 0));
    return prioritized.slice(0, 6);
  };

  const suggestions = generateSuggestions();

  const colorMap = {
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    amber: 'from-amber-500 to-orange-500',
    rose: 'from-rose-500 to-pink-500',
    green: 'from-green-500 to-emerald-500',
    indigo: 'from-indigo-500 to-purple-500',
    teal: 'from-teal-500 to-cyan-500'
  };

  return (
    <Card className="bg-slate-800/90 backdrop-blur-sm border-2 border-cyan-600">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-slate-200">
          <Sparkles className="h-5 w-5 text-cyan-400" />
          <span>Suggested Questions</span>
        </CardTitle>
        <p className="text-xs text-slate-400 mt-1">
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
                className="w-full justify-start text-left h-auto p-3 bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200 transition-all group"
                onClick={() => onSendMessage(suggestion.question)}
              >
                <div className="flex items-start space-x-3 w-full">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${colorMap[suggestion.color]} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant="outline" className="text-xs text-slate-400 border-slate-600">
                        {suggestion.category}
                      </Badge>
                      {suggestion.priority && (
                        <Badge className="text-xs bg-red-500 text-white">
                          Priority
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm leading-tight">{suggestion.question}</p>
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