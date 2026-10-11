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
      <Card className="nv-card--muted">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="shrink-0 rounded-pill bg-primary p-2">
                <Icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <Badge variant="secondary" className="mb-2 rounded-pill">
                  {category.category}
                </Badge>
                <CardTitle className="text-lg text-foreground">
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
          
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={handleSaveReflection}
              variant="outline"
              className="flex-1 !whitespace-normal"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Privately
            </Button>
            <Button
              onClick={handleSendToCoach}
              className="flex-1 !whitespace-normal"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Share with Coach
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            Reflections are private unless you choose to share with the coach
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Heart className="h-5 w-5 text-primary" />
        <h3 className="font-bold text-foreground">Guided Reflections</h3>
      </div>
      
      <div className="grid gap-3">
        {reflectionPrompts.map((category, idx) => {
          const Icon = category.icon;
          const isExpanded = selectedCategory === category.category;
          
          return (
            <Card 
              key={idx}
              className=""
            >
              <CardHeader className="pb-3">
                <Button type="button" variant="outline" aria-expanded={isExpanded} className="h-auto w-full justify-between !whitespace-normal p-3 text-left" onClick={() => setSelectedCategory(isExpanded ? null : category.category)}>
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="shrink-0 rounded-pill bg-primary p-2 text-primary-foreground"><Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" /></div>
                    <CardTitle className="text-base font-bold">{category.category}</CardTitle>
                  </div>
                  <ChevronRight className={`h-5 w-5 shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`} aria-hidden="true" />
                </Button>
              </CardHeader>
              
              {isExpanded && (
                <CardContent className="space-y-2 pt-0">
                  {category.prompts.map((prompt, pIdx) => (
                    <Button key={pIdx} type="button" variant="outline" onClick={() => setSelectedPrompt(prompt)} className="h-auto w-full justify-start !whitespace-normal p-3 text-left text-sm">
                      {prompt}
                    </Button>
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