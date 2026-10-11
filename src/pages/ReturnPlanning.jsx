import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Calendar, Clock, Home, Save, CheckCircle2, Download 
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useAuth } from '@/lib/AuthContext';

const phasedReturnTemplates = [
  {
    name: 'Gradual (Recommended)',
    description: 'Slow increase over 4-6 weeks',
    phases: [
      { week: '1-2', hours: 20, remote: 2, notes: 'Part-time, mostly remote, no early meetings' },
      { week: '3-4', hours: 30, remote: 1, notes: 'Increase hours, reduce remote days' },
      { week: '5+', hours: 40, remote: 'as needed', notes: 'Full-time with ongoing flexibility' }
    ]
  },
  {
    name: 'Quick Return',
    description: 'Return to full-time within 2 weeks',
    phases: [
      { week: '1', hours: 30, remote: 3, notes: 'Reduced hours, mostly remote' },
      { week: '2+', hours: 40, remote: 'as needed', notes: 'Full-time with flexible accommodations' }
    ]
  },
  {
    name: 'Extended Transition',
    description: 'Gradual return over 8-10 weeks',
    phases: [
      { week: '1-2', hours: 15, remote: 3, notes: 'Very part-time, high remote ratio' },
      { week: '3-4', hours: 20, remote: 2, notes: 'Increase hours slowly' },
      { week: '5-6', hours: 30, remote: 1, notes: 'Approaching full-time' },
      { week: '7+', hours: 40, remote: 'as needed', notes: 'Full-time with support' }
    ]
  }
];

export default function ReturnPlanning() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [returnDate, setReturnDate] = useState('');
  const [customPlan, setCustomPlan] = useState('');

  const { data: progress } = useUserProgress({});

  const saveReturnDateMutation = useMutation({
    mutationFn: async (date) => {
      if (!isAuthenticated) {
        throw new Error('Please sign in to save your return date.');
      }
      if (progress?.id) {
        return await base44.entities.UserProgress.update(progress.id, { return_date: date });
      } else {
        return await base44.entities.UserProgress.create({ return_date: date });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userProgress']);
      toast.success('Return date saved!');
    },
    onError: (err) => {
      toast.error('Failed to save: ' + err.message);
    }
  });

  const generateReturnPlan = () => {
    if (!selectedTemplate || !returnDate) {
      toast.error('Please select a template and return date');
      return;
    }

    const template = phasedReturnTemplates.find(t => t.name === selectedTemplate);
    const plan = `Subject: Return to Work Plan Following Medical Leave

Dear [HR/Manager],

I am planning to return to work on ${format(parseISO(returnDate), 'MMMM d, yyyy')} following my medical leave. As I transition back, I am requesting the following phased return schedule to ensure a successful reintegration:

${template.phases.map(phase => `Week ${phase.week}:
• Work schedule: ${phase.hours} hours per week
• Remote work: ${phase.remote} days${typeof phase.remote === 'number' ? ' per week' : ''}
• ${phase.notes}`).join('\n\n')}

${customPlan ? `\nAdditional considerations:\n${customPlan}\n` : ''}
My doctor has cleared me to return with these modifications and can provide additional documentation if needed. I'm eager to rejoin the team and appreciate your support during this transition.

I'd like to schedule a meeting to discuss this plan and address any questions you may have.

Thank you for your understanding.

Sincerely,
[Your name]`;

    // Create and download text file
    const blob = new Blob([plan], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'return-to-work-plan.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Return plan downloaded!');
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div className="space-y-4 text-center">
        <h1 className="font-heading text-4xl font-bold text-foreground">
          Plan Your Return
        </h1>
        <p className="mx-auto max-w-2xl text-lg font-medium text-muted-foreground">
          Create a phased return-to-work schedule that supports your recovery
        </p>
      </div>

      {/* Current Return Date */}
      {progress?.return_date && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm font-semibold text-muted-foreground">Your planned return date:</p>
                <p className="text-2xl font-bold text-primary">
                  {format(parseISO(progress.return_date), 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
              <Calendar className="h-12 w-12 text-primary" />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Template Selection */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Choose a Phased Return Template</CardTitle>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                Select a template that matches your needs. You can customize it further below.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {phasedReturnTemplates.map((template) => (
                <div
                  key={template.name}
                  onClick={() => setSelectedTemplate(template.name)}
                  className={`cursor-pointer rounded-brand border-2 p-4 transition-all ${
                    selectedTemplate === template.name
                      ? 'border-primary bg-muted'
                      : 'border-border bg-surface hover:border-primary'
                  }`}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-foreground">{template.name}</h3>
                      <p className="text-sm font-medium text-muted-foreground">{template.description}</p>
                    </div>
                    {selectedTemplate === template.name && (
                      <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-brand-secondary" />
                    )}
                  </div>

                  <div className="space-y-2">
                    {template.phases.map((phase, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <Badge variant="secondary">Week {phase.week}</Badge>
                        <span className="text-foreground">
                         {phase.hours}hrs/week, {phase.remote} remote
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Selected Template Details */}
          {selectedTemplate && (
            <Card>
              <CardHeader>
                <CardTitle>Your Selected Plan: {selectedTemplate}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {phasedReturnTemplates
                  .find(t => t.name === selectedTemplate)
                  ?.phases.map((phase, index) => (
                    <div key={index} className="rounded-brand bg-muted p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-semibold text-foreground">Week {phase.week}</h4>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">{phase.hours} hours/week</span>
                        </div>
                      </div>
                      <div className="mb-2 flex items-center space-x-2">
                        <Home className="h-4 w-4 text-primary" />
                        <span className="text-sm text-muted-foreground">
                          Remote: {phase.remote} {typeof phase.remote === 'number' ? 'days/week' : ''}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{phase.notes}</p>
                    </div>
                  ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Form */}
        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">Plan Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="returnDate">Return Date</Label>
                <Input
                  id="returnDate"
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customPlan">Additional Notes (Optional)</Label>
                <Textarea
                  id="customPlan"
                  value={customPlan}
                  onChange={(e) => setCustomPlan(e.target.value)}
                  placeholder="Any special considerations or additional accommodations needed..."
                  rows={4}
                />
              </div>

              <div className="space-y-3 pt-4">
                <Button
                  onClick={() => saveReturnDateMutation.mutate(returnDate)}
                  variant="outline"
                  className="w-full"
                  disabled={!returnDate}
                >
                  <Save className="h-4 w-4" />
                  Save Return Date
                </Button>

                <Button
                  onClick={generateReturnPlan}
                  className="w-full"
                  disabled={!selectedTemplate || !returnDate}
                >
                  <Download className="h-4 w-4" />
                  Generate & Download Letter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="nv-card--muted">
            <CardContent className="pt-6">
              <h4 className="mb-3 font-semibold text-foreground">💡 Planning Tips</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Start slower than you think you need to</li>
                <li>• Build in review points to adjust the plan</li>
                <li>• Communicate your plan clearly in writing</li>
                <li>• Have a backup plan if you need more time</li>
                <li>• Remember: this is a guideline, not a contract</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}