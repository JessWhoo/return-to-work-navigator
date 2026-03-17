import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Loader2, Sparkles, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

const OUTCOME_CONFIG = {
  approved: { label: 'Approved', color: 'bg-green-900/40 text-green-300 border-green-600/40' },
  denied: { label: 'Denied', color: 'bg-red-900/40 text-red-300 border-red-600/40' },
  pending: { label: 'Pending', color: 'bg-yellow-900/40 text-yellow-300 border-yellow-600/40' },
  partial: { label: 'Partial', color: 'bg-blue-900/40 text-blue-300 border-blue-600/40' },
  follow_up_needed: { label: 'Follow-up Needed', color: 'bg-orange-900/40 text-orange-300 border-orange-600/40' }
};

export default function EmployerResponseLog({ meeting, onUpdate }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [saving, setSaving] = useState(false);

  const [newResponse, setNewResponse] = useState({
    date: new Date().toISOString().split('T')[0],
    response_text: '',
    outcome: 'pending',
    notes: ''
  });

  const handleAddResponse = async () => {
    setSaving(true);
    const updated = [...(meeting.employer_responses || []), newResponse];
    await base44.entities.MeetingPrep.update(meeting.id, {
      employer_responses: updated,
      status: newResponse.outcome === 'approved' ? 'completed'
        : newResponse.outcome === 'follow_up_needed' ? 'follow_up'
        : meeting.status
    });
    queryClient.invalidateQueries(['meeting-preps']);
    setNewResponse({ date: new Date().toISOString().split('T')[0], response_text: '', outcome: 'pending', notes: '' });
    setShowForm(false);
    setSaving(false);
    onUpdate?.();
  };

  const getAIRefinement = async () => {
    setAiLoading(true);
    const responses = meeting.employer_responses || [];
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert coach helping a cancer survivor navigate workplace accommodation negotiations.

Meeting: ${meeting.title} (${meeting.meeting_type})
Goals: ${meeting.goals || 'Not specified'}
Talking points used: ${meeting.talking_points?.join('; ') || 'None'}
Accommodations requested: ${meeting.accommodation_requests?.map(a => a.accommodation).join('; ') || 'None'}

Employer response history:
${responses.map((r, i) => `${i + 1}. [${r.outcome}] on ${r.date}: "${r.response_text}" Notes: ${r.notes || 'none'}`).join('\n')}

Based on this history, provide:
1. Analysis of what worked and what didn't
2. 3 refined follow-up talking points or strategies
3. Next recommended action step

Be concise, empathetic, and practical.`,
      response_json_schema: {
        type: 'object',
        properties: {
          analysis: { type: 'string' },
          refined_strategies: { type: 'array', items: { type: 'string' } },
          next_action: { type: 'string' }
        }
      }
    });
    setAiSuggestion(result);
    setAiLoading(false);
  };

  const responses = meeting.employer_responses || [];

  return (
    <div className="space-y-4">
      {/* Response history */}
      <div className="space-y-3">
        {responses.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-sm">
            No employer responses logged yet. Add one after your meeting.
          </div>
        ) : (
          responses.map((resp, idx) => {
            const cfg = OUTCOME_CONFIG[resp.outcome] || OUTCOME_CONFIG.pending;
            const isOpen = expanded === idx;
            return (
              <div key={idx} className="bg-slate-900/60 rounded-lg border border-slate-700 overflow-hidden">
                <button className="w-full flex items-center justify-between p-3 text-left"
                  onClick={() => setExpanded(isOpen ? null : idx)}>
                  <div className="flex items-center gap-3">
                    <Badge className={`${cfg.color} text-xs`}>{cfg.label}</Badge>
                    <span className="text-slate-300 text-sm truncate max-w-xs">{resp.response_text?.slice(0, 60) || 'No details'}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-slate-500">{resp.date ? format(new Date(resp.date), 'MMM d, yyyy') : ''}</span>
                    {isOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 space-y-2 border-t border-slate-700 pt-3">
                    <p className="text-sm text-slate-300">{resp.response_text}</p>
                    {resp.notes && <p className="text-xs text-slate-400 italic">Notes: {resp.notes}</p>}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* AI Refinement */}
      {responses.length > 0 && (
        <div>
          <Button onClick={getAIRefinement} disabled={aiLoading}
            className="w-full bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-600 hover:to-pink-600">
            {aiLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
            {aiLoading ? 'Analyzing responses...' : 'AI: Refine My Strategy Based on Responses'}
          </Button>

          {aiSuggestion && (
            <Card className="mt-3 bg-purple-900/20 border-purple-600/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-purple-300 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> AI Strategy Refinement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Analysis</p>
                  <p className="text-slate-300">{aiSuggestion.analysis}</p>
                </div>
                {aiSuggestion.refined_strategies?.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Refined Strategies</p>
                    <ul className="space-y-1">
                      {aiSuggestion.refined_strategies.map((s, i) => (
                        <li key={i} className="flex gap-2 text-slate-300">
                          <span className="text-purple-400 flex-shrink-0">→</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Next Action</p>
                  <p className="text-green-300 font-medium">{aiSuggestion.next_action}</p>
                </div>
                <Button size="sm" variant="ghost" className="text-slate-400 text-xs w-full"
                  onClick={() => {
                    const msg = `I just got this advice about my ${meeting.title} meeting: "${aiSuggestion.next_action}". Can you help me figure out my next steps?`;
                    localStorage.setItem('pendingCoachMessage', msg);
                    window.location.href = '/Coach';
                  }}>
                  <MessageSquare className="h-3 w-3 mr-1" /> Discuss this with my AI Coach
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Add new response form */}
      {showForm ? (
        <Card className="bg-slate-800/80 border-slate-600">
          <CardHeader><CardTitle className="text-slate-200 text-sm">Log Employer Response</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Date</label>
                <Input type="date" value={newResponse.date}
                  onChange={e => setNewResponse(p => ({ ...p, date: e.target.value }))}
                  className="bg-slate-900 border-slate-600 text-slate-200" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Outcome</label>
                <Select value={newResponse.outcome} onValueChange={v => setNewResponse(p => ({ ...p, outcome: v }))}>
                  <SelectTrigger className="bg-slate-900 border-slate-600 text-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(OUTCOME_CONFIG).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">What did the employer say?</label>
              <Textarea value={newResponse.response_text}
                onChange={e => setNewResponse(p => ({ ...p, response_text: e.target.value }))}
                placeholder="Describe the employer's response..."
                className="bg-slate-900 border-slate-600 text-slate-200 min-h-[80px]" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Additional Notes</label>
              <Input value={newResponse.notes}
                onChange={e => setNewResponse(p => ({ ...p, notes: e.target.value }))}
                placeholder="Any additional context..."
                className="bg-slate-900 border-slate-600 text-slate-200" />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddResponse} disabled={saving || !newResponse.response_text}
                className="bg-purple-600 hover:bg-purple-700">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Response'}
              </Button>
              <Button variant="ghost" onClick={() => setShowForm(false)} className="text-slate-400">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setShowForm(true)} variant="outline"
          className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
          <Plus className="h-4 w-4 mr-2" /> Log Employer Response
        </Button>
      )}
    </div>
  );
}