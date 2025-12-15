import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, Heart, TrendingUp, Target, 
  MessageCircle, ChevronRight, Save
} from 'lucide-react';
import { toast } from 'sonner';

const reflectionPrompts = [
  {
    category: 'Celebrate Wins',
    icon: Sparkles,
    color: 'amber',
    gradient: 'from-amber-500 to-orange-500',
    prompts: [
      "What's one thing you accomplished this week, no matter how small?",
      "What did you do today that past-you would be proud of?",
      "Name three things you're grateful for in your return-to-work journey.",
      "What's improved since you started planning your return?",
      "Which challenge did you overcome recently? How did you do it?"
    ]
  },
  {
    category: 'Reframe Setbacks',
    icon: TrendingUp,
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-500',
    prompts: [
      "What did today's challenge teach you about what you need?",
      "If a friend experienced this setback, what would you tell them?",
      "What's one thing you can try differently tomorrow?",
      "This didn't work, but what information did you gain from trying?",
      "How can you adjust your approach based on what you learned?"
    ]
  },
  {
    category: 'Build Confidence',
    icon: Heart,
    color: 'rose',
    gradient: 'from-rose-500 to-pink-500',
    prompts: [
      "You survived cancer treatment. What does that say about your strength?",
      "What's one quality you have that will help you succeed at work?",
      "When have you advocated for yourself before? You can do it again.",
      "What would you tell someone who doubts their ability to return to work?",
      "How have you already proven you're capable of hard things?"
    ]
  },
  {
    category: 'Set Micro-Goals',
    icon: Target,
    color: 'green',
    gradient: 'from-green-500 to-emerald-500',
    prompts: [
      "What's ONE small thing you can do tomorrow to move forward?",
      "What would make tomorrow feel like a 'win'?",
      "What's the smallest next step you could take today?",
      "If you could only complete one task tomorrow, what would it be?",
      "What's a realistic goal for this week (not the whole month)?"
    ]
  },
  {
    category: 'Process Emotions',
    icon: MessageCircle,
    color: 'purple',
    gradient: 'from-purple-500 to-violet-500',
    prompts: [
      "How are you really feeling about returning to work?",
      "What are you most anxious about? Is this fear based on facts or assumptions?",
      "What support do you need right now that you're not getting?",
      "If you could tell your employer one thing without fear, what would it be?",
      "What would help you feel more prepared or confident?"
    ]
  }
];

export default function ReflectionPrompts({ onSendToCoach }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [reflection, setReflection] = useState('');

  const handleSendToCoach = () => {
    if (!reflection.trim()) {
      toast.error('Please write your reflection first');
      return;
    }

    const message = `Reflection Prompt: "${selectedPrompt}"\n\nMy Reflection:\n${reflection}`;
    onSendToCoach(message);
    
    // Reset
    setReflection('');
    setSelectedPrompt(null);
    setSelectedCategory(null);
    
    toast.success('Reflection shared with coach!');
  };

  const handleSaveReflection = () => {
    if (!reflection.trim()) {
      toast.error('Please write your reflection first');
      return;
    }

    // Save to localStorage for now
    const saved = JSON.parse(localStorage.getItem('reflections') || '[]');
    saved.push({
      prompt: selectedPrompt,
      reflection: reflection,
      date: new Date().toISOString()
    });
    localStorage.setItem('reflections', JSON.stringify(saved));
    
    toast.success('Reflection saved privately!');
    setReflection('');
    setSelectedPrompt(null);
    setSelectedCategory(null);
  };

  if (selectedPrompt) {
    const category = reflectionPrompts.find(c => c.prompts.includes(selectedPrompt));
    const Icon = category.icon;
    
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${category.gradient}`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <Badge className={`bg-${category.color}-100 text-${category.color}-700 mb-1`}>
                  {category.category}
                </Badge>
                <CardTitle className="text-lg text-gray-800">
                  {selectedPrompt}
                </CardTitle>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedPrompt(null);
                setReflection('');
              }}
            >
              Back
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Take your time... write whatever comes to mind."
            className="min-h-[150px] text-sm"
          />
          
          <div className="flex gap-3">
            <Button
              onClick={handleSaveReflection}
              variant="outline"
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Privately
            </Button>
            <Button
              onClick={handleSendToCoach}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Share with Coach
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            Reflections are private unless you choose to share with the coach
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Heart className="h-5 w-5 text-purple-600" />
        <h3 className="font-bold text-gray-800">Guided Reflections</h3>
      </div>
      
      <div className="grid gap-3">
        {reflectionPrompts.map((category, idx) => {
          const Icon = category.icon;
          const isExpanded = selectedCategory === category.category;
          
          return (
            <Card 
              key={idx}
              className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all cursor-pointer"
            >
              <CardHeader 
                className="pb-3"
                onClick={() => setSelectedCategory(isExpanded ? null : category.category)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${category.gradient}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-base font-bold text-gray-800">
                      {category.category}
                    </CardTitle>
                  </div>
                  <ChevronRight 
                    className={`h-5 w-5 text-gray-400 transition-transform ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </CardHeader>
              
              {isExpanded && (
                <CardContent className="space-y-2 pt-0">
                  {category.prompts.map((prompt, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => setSelectedPrompt(prompt)}
                      className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-sm text-gray-700 border border-gray-200"
                    >
                      {prompt}
                    </button>
                  ))}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}