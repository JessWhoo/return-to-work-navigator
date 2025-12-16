import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Mail, Copy, Send, Sparkles, User, Building2 } from 'lucide-react';
import { toast } from 'sonner';

export default function EmailDrafter() {
  const [recipient, setRecipient] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [subject, setSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailType, setEmailType] = useState('accommodation_request');
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: progress } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const progressList = await base44.entities.UserProgress.list();
      return progressList[0] || null;
    }
  });

  const emailTemplates = {
    accommodation_request: {
      subject: 'Request for Workplace Accommodations',
      prompt: 'Draft a professional email requesting workplace accommodations. Include a brief mention of medical treatment (without excessive detail), specific accommodations needed (flexible schedule, remote work options, ergonomic adjustments), and express willingness to provide medical documentation. Maintain a confident yet collaborative tone.'
    },
    return_plan: {
      subject: 'Return-to-Work Plan Discussion',
      prompt: 'Draft a professional email to discuss a phased return-to-work plan. Mention readiness to return, propose a gradual schedule (e.g., part-time to full-time over several weeks), express commitment to the role, and request a meeting to discuss details. Be positive and solution-oriented.'
    },
    accommodation_update: {
      subject: 'Update on Workplace Accommodations',
      prompt: 'Draft a professional email providing an update on current accommodations. Thank the employer for existing support, report on progress, suggest modifications if needed (more/less support), and maintain open communication. Be appreciative and factual.'
    },
    medical_documentation: {
      subject: 'Medical Documentation for Accommodations',
      prompt: 'Draft a brief professional email transmitting medical documentation to support accommodation requests. Reference attached documentation, reiterate key accommodations requested, offer to discuss further, and maintain privacy. Be concise and professional.'
    },
    first_day_logistics: {
      subject: 'First Day Return - Logistics and Questions',
      prompt: 'Draft a friendly yet professional email to confirm first day logistics. Ask about start time, parking, who to report to, any pre-arrival tasks, and express enthusiasm about returning. Be organized and positive.'
    }
  };

  const generateEmail = async () => {
    setIsGenerating(true);
    try {
      const template = emailTemplates[emailType];
      
      const contextInfo = progress ? `
User context:
- Journey stage: ${progress.journey_stage}
- Has tracked energy: ${progress.energy_logs?.length > 0 ? 'Yes' : 'No'}
- Accommodations requested: ${progress.accommodations_requested?.length || 0}
- Return date: ${progress.return_date || 'Not set'}
      ` : '';

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${template.prompt}

${contextInfo}

Recipient name (if provided): ${recipientName || 'Not specified'}
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
        add_context_from_internet: false
      });

      setSubject(template.subject);
      setEmailBody(response);
      toast.success('Email draft generated!');
    } catch (error) {
      toast.error('Failed to generate email: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    const fullEmail = `To: ${recipient}
Subject: ${subject}

${emailBody}`;
    navigator.clipboard.writeText(fullEmail);
    toast.success('Email copied to clipboard');
  };

  const sendViaEmail = () => {
    const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mail className="h-5 w-5 text-indigo-600" />
          <span>AI Email Drafter</span>
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Generate professional emails to your employer or HR team
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Email Type</Label>
            <select
              value={emailType}
              onChange={(e) => setEmailType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="accommodation_request">Accommodation Request</option>
              <option value="return_plan">Return-to-Work Plan</option>
              <option value="accommodation_update">Accommodation Update</option>
              <option value="medical_documentation">Medical Documentation</option>
              <option value="first_day_logistics">First Day Logistics</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>Recipient Name (Optional)</span>
            </Label>
            <Input
              placeholder="e.g., Sarah Johnson"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
            />
          </div>
        </div>

        <Button
          onClick={generateEmail}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
        >
          {isGenerating ? (
            <>
              <Sparkles className="h-4 w-4 mr-2 animate-spin" />
              Generating Email...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Email Draft
            </>
          )}
        </Button>

        {emailBody && (
          <>
            <div className="border-t pt-4 space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center space-x-1">
                  <Building2 className="h-4 w-4" />
                  <span>Recipient Email</span>
                </Label>
                <Input
                  type="email"
                  placeholder="e.g., hr@company.com"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Subject</Label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Email Body</Label>
                <Textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={12}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500">
                  Feel free to edit the draft above to personalize it
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy to Clipboard
                </Button>
                <Button
                  onClick={sendViaEmail}
                  disabled={!recipient}
                  className="flex-1 bg-indigo-600"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Open in Email Client
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}