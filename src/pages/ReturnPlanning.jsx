import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Calendar, Clock, Home, Users, 
  TrendingUp, Copy, Save, CheckCircle2, Download 
} from 'lucide-react';
import { format } from 'date-fns';

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
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [returnDate, setReturnDate] = useState('');
  const [customPlan, setCustomPlan] = useState('');

  const { data: progress } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const progressList = await base44.entities.UserProgress.list();
      if (progressList.length > 0) return progressList[0];
      
      return await base44.entities.UserProgress.create({});
    }
  });

  const saveReturnDateMutation = useMutation({
    mutationFn: async (date) => {
      return await base44.entities.UserProgress.update(progress.id, {
        return_date: date
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userProgress']);
      toast.success('Return date saved!');
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

I am planning to return to work on ${format(new Date(returnDate), 'MMMM d, yyyy')} following my medical leave. As I transition back, I am requesting the following phased return schedule to ensure a successful reintegration:

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
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
          Plan Your Return
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Create a phased return-to-work schedule that supports your recovery
        </p>
      </div>

      {/* Current Return Date */}
      {progress?.return_date && (
        <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Your planned return date:</p>
                <p className="text-2xl font-bold text-teal-700">
                  {format(new Date(progress.return_date), 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
              <Calendar className="h-12 w-12 text-teal-600" />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Template Selection */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Choose a Phased Return Template</CardTitle>
              <p className="text-sm text-gray-500 mt-2">
                Select a template that matches your needs. You can customize it further below.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {phasedReturnTemplates.map((template) => (
                <div
                  key={template.name}
                  onClick={() => setSelectedTemplate(template.name)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedTemplate === template.name
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-teal-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-800">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </div>
                    {selectedTemplate === template.name && (
                      <CheckCircle2 className="h-6 w-6 text-teal-600 flex-shrink-0" />
                    )}
                  </div>

                  <div className="space-y-2">
                    {template.phases.map((phase, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <Badge variant="outline" className="bg-white">Week {phase.week}</Badge>
                        <span className="text-gray-700">
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
            <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200">
              <CardHeader>
                <CardTitle>Your Selected Plan: {selectedTemplate}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {phasedReturnTemplates
                  .find(t => t.name === selectedTemplate)
                  ?.phases.map((phase, index) => (
                    <div key={index} className="bg-white/60 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">Week {phase.week}</h4>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-teal-600" />
                          <span className="text-sm font-medium">{phase.hours} hours/week</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Home className="h-4 w-4 text-teal-600" />
                        <span className="text-sm text-gray-700">
                          Remote: {phase.remote} {typeof phase.remote === 'number' ? 'days/week' : ''}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{phase.notes}</p>
                    </div>
                  ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Form */}
        <div className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm sticky top-24">
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
                  <Save className="h-4 w-4 mr-2" />
                  Save Return Date
                </Button>

                <Button
                  onClick={generateReturnPlan}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600"
                  disabled={!selectedTemplate || !returnDate}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Generate & Download Letter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-amber-900 mb-3">💡 Planning Tips</h4>
              <ul className="space-y-2 text-sm text-amber-800">
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