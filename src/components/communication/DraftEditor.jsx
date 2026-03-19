import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useOfflineEntity } from '@/lib/useOfflineEntity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Save, Sparkles, Loader2, Copy, Check, Lightbulb, 
  AlertCircle, X, FileText
} from 'lucide-react';
import { toast } from 'sonner';

export default function DraftEditor({ draft, onClose, onSave }) {
  const queryClient = useQueryClient();
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
    { value: 'friendly', label: 'Friendly', label: 'Warm yet professional' }
  ];

  const saveDraftMutation = useMutation({
    mutationFn: async () => {
      const draftData = {
        ...formData,
        ai_suggestions: aiSuggestions
      };

      if (draft?.id) {
        return await base44.entities.CommunicationDraft.update(draft.id, draftData);
      } else {
        return await base44.entities.CommunicationDraft.create(draftData);
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
      const prompt = `You are an expert workplace communication advisor specializing in helping cancer survivors navigate workplace conversations.

Scenario Type: ${formData.scenario_type}
Recipient: ${formData.recipient || 'supervisor/HR'}
Desired Tone: ${formData.tone}
Subject: ${formData.subject}

Current Draft:
${formData.content}

Provide 5 specific, actionable suggestions to improve this communication. Focus on:
1. Clarity and professionalism
2. Legal language for accommodation requests
3. Striking the right balance between disclosure and privacy
4. Tone consistency
5. Removing apologetic language or over-justification

For each suggestion, provide:
- type: "strength" (what's working well), "tone" (tone adjustments), "clarity" (unclear parts), "legal" (legal considerations), or "boundary" (privacy/boundaries)
- suggestion: specific advice with examples`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            suggestions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: {
                    type: 'string',
                    enum: ['strength', 'tone', 'clarity', 'legal', 'boundary']
                  },
                  suggestion: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      });

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
    strength: { bg: 'bg-green-50', border: 'border-green-200', icon: 'text-green-600', badge: 'bg-green-100 text-green-800' },
    tone: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600', badge: 'bg-blue-100 text-blue-800' },
    clarity: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'text-purple-600', badge: 'bg-purple-100 text-purple-800' },
    legal: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-600', badge: 'bg-amber-100 text-amber-800' },
    boundary: { bg: 'bg-rose-50', border: 'border-rose-200', icon: 'text-rose-600', badge: 'bg-rose-100 text-rose-800' }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <span>{draft?.id ? 'Edit Draft' : 'New Communication Draft'}</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Form */}
      <Card className="bg-white">
        <CardContent className="pt-6 space-y-6">
          {/* Title & Scenario */}
          <div className="grid md:grid-cols-2 gap-4">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {scenarioTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Recipient & Tone */}
          <div className="grid md:grid-cols-2 gap-4">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex gap-2">
              <Button
                onClick={() => getAISuggestionsMutation.mutate()}
                disabled={!formData.content.trim() || getAISuggestionsMutation.isPending}
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                {getAISuggestionsMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
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
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <Button
              onClick={() => saveDraftMutation.mutate()}
              disabled={!formData.title || !formData.content || saveDraftMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {saveDraftMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      {aiSuggestions.length > 0 && (
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-purple-900">
              <Lightbulb className="h-5 w-5" />
              <span>AI-Powered Suggestions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {aiSuggestions.map((suggestion, idx) => {
              const colors = suggestionTypeColors[suggestion.type] || suggestionTypeColors.clarity;
              return (
                <div key={idx} className={`${colors.bg} border ${colors.border} rounded-lg p-4`}>
                  <div className="flex items-start space-x-3">
                    <Lightbulb className={`h-5 w-5 ${colors.icon} flex-shrink-0 mt-0.5`} />
                    <div className="flex-1">
                      <Badge className={`${colors.badge} mb-2 capitalize`}>
                        {suggestion.type}
                      </Badge>
                      <p className="text-sm text-gray-700 leading-relaxed">{suggestion.suggestion}</p>
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