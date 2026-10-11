import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Loader2, Sparkles, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';

const OUTCOME_CONFIG = {
  approved: { label: 'Approved', color: 'bg-brand-secondary/20 text-brand-text border-brand-secondary' },
  denied: { label: 'Denied', color: 'bg-destructive/10 text-destructive border-destructive' },
  pending: { label: 'Pending', color: 'bg-brand-cream text-brand-text border-brand-border' },
  partial: { label: 'Partial', color: 'bg-brand-sky text-brand-text border-brand-border' },
  follow_up_needed: { label: 'Follow-up Needed', color: 'bg-brand-muted text-brand-primary border-brand-border' }
};

export default function EmployerResponseLog({ meeting, onUpdate }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [saving, setSaving] = useState(false);

  const [newResponse, setNewResponse] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
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
    setNewResponse({ date: format(new Date(), 'yyyy-MM-dd'), response_text: '', outcome: 'pending', notes: '' });
    setShowForm(false);
    setSaving(false);
    onUpdate?.();
  };

  const getAIRefinement = async () => {
    setAiLoading(true);
    const responses = meeting.employer_responses || [];
    const responsesText = responses.map((r, i) => `${i + 1}. [${r.outcome}] on ${r.date}: "${r.response_text}" Notes: ${r.notes || 'none'}`).join('\n');
    const result = (await base44.functions.invoke('aiGateway', {
      operation: 'analyze_employer_response',
      data: {
        title: meeting.title,
        meetingType: meeting.meeting_type,
        goals: meeting.goals,
        talkingPoints: meeting.talking_points?.join('; '),
        accommodations: meeting.accommodation_requests?.map(a => a.accommodation).join('; '),
        responsesText,
      },
    })).data.result;
    setAiSuggestion(result);
    setAiLoading(false);
  };

  const responses = meeting.employer_responses || [];

  return (
    <div className="space-y-4">
      {/* Response history */}
      <div className="space-y-3">
        {responses.length === 0 ? (
          <div className="text-center py-6 text-brand-muted-foreground text-sm">
            No employer responses logged yet. Add one after your meeting.
          </div>
        ) : (
          responses.map((resp, idx) => {
            const cfg = OUTCOME_CONFIG[resp.outcome] || OUTCOME_CONFIG.pending;
            const isOpen = expanded === idx;
            return (
              <div key={idx} className="nv-card nv-card--muted overflow-hidden">
                <button className="w-full flex items-center justify-between p-3 text-left"
                  onClick={() => setExpanded(isOpen ? null : idx)}>
                  <div className="flex items-center gap-3">
                    <Badge className={`${cfg.color} text-xs`}>{cfg.label}</Badge>
                    <span className="text-brand-text text-sm truncate max-w-xs">{resp.response_text?.slice(0, 60) || 'No details'}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-brand-muted-foreground">{resp.date ? format(parseISO(resp.date), 'MMM d, yyyy') : ''}</span>
                    {isOpen ? <ChevronUp className="h-4 w-4 text-brand-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-brand-muted-foreground" />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 space-y-2 border-t border-brand-border pt-3">
                    <p className="text-sm text-brand-text">{resp.response_text}</p>
                    {resp.notes && <p className="text-xs text-brand-muted-foreground italic">Notes: {resp.notes}</p>}
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
            className="w-full !whitespace-normal">
            {aiLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
            {aiLoading ? 'Analyzing responses...' : 'AI: Refine My Strategy Based on Responses'}
          </Button>

          {aiSuggestion && (
            <Card className="mt-3 nv-card--muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-brand-text flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> AI Strategy Refinement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-brand-muted-foreground font-semibold uppercase mb-1">Analysis</p>
                  <p className="text-brand-text">{aiSuggestion.analysis}</p>
                </div>
                {aiSuggestion.refined_strategies?.length > 0 && (
                  <div>
                    <p className="text-xs text-brand-muted-foreground font-semibold uppercase mb-1">Refined Strategies</p>
                    <ul className="space-y-1">
                      {aiSuggestion.refined_strategies.map((s, i) => (
                        <li key={i} className="flex gap-2 text-brand-text">
                          <span className="text-brand-primary flex-shrink-0">→</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <p className="text-xs text-brand-muted-foreground font-semibold uppercase mb-1">Next Action</p>
                  <p className="text-brand-primary font-medium">{aiSuggestion.next_action}</p>
                </div>
                <Button size="sm" variant="ghost" className="text-brand-muted-foreground text-xs w-full"
                  onClick={() => {
                    const msg = `I just got this advice about my ${meeting.title} meeting: "${aiSuggestion.next_action}". Can you help me figure out my next steps?`;
                    localStorage.setItem('pendingCoachMessage', msg);
                    navigate('/Coach');
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
        <Card className="">
          <CardHeader><CardTitle className="text-brand-text text-sm">Log Employer Response</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-brand-muted-foreground mb-1 block">Date</label>
                <Input type="date" value={newResponse.date}
                  onChange={e => setNewResponse(p => ({ ...p, date: e.target.value }))}
                  className="nv-input" />
              </div>
              <div>
                <label className="text-xs text-brand-muted-foreground mb-1 block">Outcome</label>
                <Select value={newResponse.outcome} onValueChange={v => setNewResponse(p => ({ ...p, outcome: v }))}>
                  <SelectTrigger className="nv-input">
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
              <label className="text-xs text-brand-muted-foreground mb-1 block">What did the employer say?</label>
              <Textarea value={newResponse.response_text}
                onChange={e => setNewResponse(p => ({ ...p, response_text: e.target.value }))}
                placeholder="Describe the employer's response..."
                className="nv-input min-h-[80px]" />
            </div>
            <div>
              <label className="text-xs text-brand-muted-foreground mb-1 block">Additional Notes</label>
              <Input value={newResponse.notes}
                onChange={e => setNewResponse(p => ({ ...p, notes: e.target.value }))}
                placeholder="Any additional context..."
                className="nv-input" />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddResponse} disabled={saving || !newResponse.response_text}
                className="">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Response'}
              </Button>
              <Button variant="ghost" onClick={() => setShowForm(false)} className="text-brand-muted-foreground">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setShowForm(true)} variant="outline"
          className="w-full">
          <Plus className="h-4 w-4 mr-2" /> Log Employer Response
        </Button>
      )}
    </div>
  );
}