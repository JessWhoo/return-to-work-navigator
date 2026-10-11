import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useOfflineEntity } from '@/lib/useOfflineEntity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Save, Sparkles, Loader2, Copy, Check, Lightbulb, X, FileText
} from 'lucide-react';
import { toast } from 'sonner';

export default function DraftEditor({ draft, onClose, onSave }) {
  const queryClient = useQueryClient();
  const draftAPI = useOfflineEntity('CommunicationDraft');
  const [formData, setFormData] = useState({
    title: draft?.title || '',
    scenario_type: draft?.scenario_type || 'accommodation_request',
    recipient: draft?.recipient || '',
    subject: draft?.subject || '',
    content: draft?.content || '',
    tone: draft?.tone || 'professional',
    is_finalized: draft?.is_finalized || false
  });
  const [aiSuggestions, setAiSuggestions] = useState(draft?.ai_suggestions || []);
  const [copied, setCopied] = useState(false);

  const scenarioTypes = [
    { value: 'diagnosis_disclosure', label: 'Disclosing Diagnosis' },
    { value: 'accommodation_request', label: 'Requesting Accommodations' },
    { value: 'schedule_flexibility', label: 'Schedule Flexibility' },
    { value: 'work_from_home', label: 'Work From Home Request' },
    { value: 'declining_task', label: 'Declining Tasks/Projects' },
    { value: 'explaining_limitations', label: 'Explaining Limitations' },
    { value: 'return_to_work_plan', label: 'Return to Work Plan' },
    { value: 'follow_up_request', label: 'Follow-up on Request' },
    { value: 'boundaries_setting', label: 'Setting Boundaries' },
    { value: 'other', label: 'Other' }
  ];

  const toneOptions = [
    { value: 'professional', label: 'Professional', desc: 'Balanced and business-like' },
    { value: 'assertive', label: 'Assertive', desc: 'Confident and direct' },
    { value: 'collaborative', label: 'Collaborative', desc: 'Team-focused approach' },
    { value: 'formal', label: 'Formal', desc: 'Official and structured' },
    { value: 'friendly', label: 'Friendly', desc: 'Warm yet professional' }
  ];

  const saveDraftMutation = useMutation({
    mutationFn: async () => {
      const draftData = {
        ...formData,
        ai_suggestions: aiSuggestions
      };

      if (draft?.id) {
        return await draftAPI.update(draft.id, draftData);
      } else {
        return await draftAPI.create(draftData);
      }
    },
    onSuccess: (savedDraft) => {
      queryClient.invalidateQueries(['communication-drafts']);
      toast.success(draft?.id ? 'Draft updated!' : 'Draft saved!');
      if (onSave) onSave(savedDraft);
      
      base44.analytics.track({
        eventName: 'communication_draft_saved',
        properties: {
          scenario_type: formData.scenario_type,
          tone: formData.tone,
          is_new: !draft?.id,
          is_finalized: formData.is_finalized
        }
      });
    }
  });

  const getAISuggestionsMutation = useMutation({
    mutationFn: async () => {
      const response = (await base44.functions.invoke('aiGateway', {
        operation: 'improve_draft',
        data: {
          scenario_type: formData.scenario_type,
          recipient: formData.recipient,
          tone: formData.tone,
          subject: formData.subject,
          content: formData.content,
        },
      })).data.result;

      base44.analytics.track({
        eventName: 'communication_ai_suggestions_generated',
        properties: {
          scenario_type: formData.scenario_type,
          tone: formData.tone,
          content_length: formData.content.length
        }
      });

      return response.suggestions;
    },
    onSuccess: (suggestions) => {
      setAiSuggestions(suggestions);
      toast.success('AI suggestions generated!');
    }
  });

  const handleCopy = () => {
    const fullText = `Subject: ${formData.subject}\n\n${formData.content}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard!');
  };

  const suggestionTypeColors = {
    strength: 'text-brand-secondary',
    tone: 'text-primary',
    clarity: 'text-primary',
    legal: 'text-brand-accent',
    boundary: 'text-destructive'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="nv-card--muted">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>{draft?.id ? 'Edit Draft' : 'New Communication Draft'}</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Form */}
      <Card>
        <CardContent className="space-y-6 pt-6">
          {/* Title & Scenario */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Draft Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Flexible Schedule Request"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scenario">Scenario Type</Label>
              <select
                id="scenario"
                value={formData.scenario_type}
                onChange={(e) => setFormData({ ...formData, scenario_type: e.target.value })}
                className="nv-input h-10 w-full px-3"
              >
                {scenarioTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Recipient & Tone */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                value={formData.recipient}
                onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                placeholder="e.g., My Manager, HR Department"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <select
                id="tone"
                value={formData.tone}
                onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                className="nv-input h-10 w-full px-3"
              >
                {toneOptions.map(tone => (
                  <option key={tone.value} value={tone.value}>
                    {tone.label} - {tone.desc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Email Subject</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Brief, professional subject line"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Message Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your message here..."
              className="min-h-[300px] font-sans"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div className="flex gap-2">
              <Button
                onClick={() => getAISuggestionsMutation.mutate()}
                disabled={!formData.content.trim() || getAISuggestionsMutation.isPending}
                variant="outline"
              >
                {getAISuggestionsMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Get AI Suggestions
                  </>
                )}
              </Button>
              <Button
                onClick={handleCopy}
                disabled={!formData.content.trim()}
                variant="outline"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-brand-secondary" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <Button
              onClick={() => saveDraftMutation.mutate()}
              disabled={!formData.title || !formData.content || saveDraftMutation.isPending}
            >
              {saveDraftMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Draft
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      {aiSuggestions.length > 0 && (
        <Card className="nv-card--muted">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <span>AI-Powered Suggestions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {aiSuggestions.map((suggestion, idx) => {
              const iconColor = suggestionTypeColors[suggestion.type] || suggestionTypeColors.clarity;
              return (
                <div key={idx} className="rounded-brand border border-border bg-surface p-4">
                  <div className="flex items-start space-x-3">
                    <Lightbulb className={`mt-0.5 h-5 w-5 flex-shrink-0 ${iconColor}`} />
                    <div className="flex-1">
                      <span className="nv-chip nv-chip--muted mb-2 capitalize">
                        {suggestion.type}
                      </span>
                      <p className="text-sm leading-relaxed text-foreground">{suggestion.suggestion}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}