import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Send, Loader2, RotateCcw, Star, MessageSquare,
  User, Bot, ChevronDown, ChevronUp, Lightbulb
} from 'lucide-react';

function meetingContext(m) {
  return {
    title: m.title, meeting_type: m.meeting_type, goals: m.goals, attendees: m.attendees,
    talking_points: m.talking_points, anticipated_objections: m.anticipated_objections,
    accommodation_requests: m.accommodation_requests,
  };
}


function ScoreBar({ score }) {
  const pct = (score / 5) * 100;
  const color = score >= 4 ? 'bg-brand-secondary' : score >= 3 ? 'bg-brand-primary' : 'bg-destructive';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-brand-muted rounded-full h-2">
        <div className={`h-2 rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-brand-text w-6 text-right">{score}/5</span>
    </div>
  );
}

function FeedbackPanel({ feedback, onReset }) {
  const [expanded, setExpanded] = useState(true);
  const categories = [
    { key: 'clarity', label: 'Clarity' },
    { key: 'confidence', label: 'Confidence' },
    { key: 'completeness', label: 'Completeness' },
    { key: 'objection_handling', label: 'Handling Objections' },
  ];

  return (
    <div className="space-y-4">
      <div className="nv-card nv-card--muted text-center py-4">
        <p className="text-brand-muted-foreground text-sm mb-1">Overall Score</p>
        <div className="flex items-center justify-center gap-1">
          {[1, 2, 3, 4, 5].map(s => (
            <Star key={s} className={`h-6 w-6 ${s <= Math.round(feedback.overall_score) ? 'text-brand-primary fill-brand-primary' : 'text-brand-border'}`} />
          ))}
          <span className="ml-2 text-2xl font-bold text-brand-text">{feedback.overall_score.toFixed(1)}</span>
        </div>
        <p className="text-brand-text text-sm mt-3 px-6 italic">"{feedback.encouragement}"</p>
      </div>
      <Card>
        <CardContent className="p-4 space-y-4">
          <button onClick={() => setExpanded(e => !e)} className="nv-btn nv-btn--text w-full justify-between">
            Detailed Scores {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {expanded && categories.map(({ key, label }) => {
            const cat = feedback.scores[key];
            return (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-xs text-brand-muted-foreground"><span className="font-medium">{label}</span></div>
                <ScoreBar score={cat.score} />
                <p className="text-xs text-brand-muted-foreground">{cat.feedback}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>
      {feedback.strengths?.length > 0 && (
        <Card className="nv-card--sage">
          <CardContent className="p-4">
            <p className="text-brand-text font-semibold text-sm mb-2">✓ What you did well</p>
            <ul className="space-y-1">{feedback.strengths.map((s, i) => (
              <li key={i} className="text-sm text-brand-text flex gap-2"><span className="text-brand-primary flex-shrink-0">·</span> {s}</li>
            ))}</ul>
          </CardContent>
        </Card>
      )}
      {feedback.tips?.length > 0 && (
        <Card className="bg-brand-compass-cream">
          <CardContent className="p-4">
            <p className="text-brand-text font-semibold text-sm mb-2 flex items-center gap-1"><Lightbulb className="h-4 w-4" /> Try next time</p>
            <ul className="space-y-1">{feedback.tips.map((t, i) => (
              <li key={i} className="text-sm text-brand-text flex gap-2"><span className="text-brand-primary flex-shrink-0">{i + 1}.</span> {t}</li>
            ))}</ul>
          </CardContent>
        </Card>
      )}
      <Button onClick={onReset} className="w-full"><RotateCcw className="h-4 w-4 mr-2" /> Practice Again</Button>
    </div>
  );
}

export default function ConversationSimulator({ meeting }) {
  const [phase, setPhase] = useState('intro'); // intro | simulating | feedback
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const startSimulation = async () => {
    setPhase('simulating');
    setLoading(true);
    const opening = (await base44.functions.invoke('aiGateway', { operation: 'simulate_opening', data: { meeting: meetingContext(meeting) } })).data.result;
    setMessages([{ role: 'assistant', content: opening }]);
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    const reply = (await base44.functions.invoke('aiGateway', { operation: 'simulate_reply', data: { meeting: meetingContext(meeting), messages: newMessages } })).data.result;
    setMessages([...newMessages, { role: 'assistant', content: reply }]);
    setLoading(false);
  };

  const getFeedback = async () => {
    setLoading(true);
    const result = (await base44.functions.invoke('aiGateway', { operation: 'simulate_feedback', data: { meeting: meetingContext(meeting), messages } })).data.result;
    setFeedback(result);
    setPhase('feedback');
    setLoading(false);
  };

  const reset = () => {
    setPhase('intro');
    setMessages([]);
    setInput('');
    setFeedback(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // INTRO
  if (phase === 'intro') {
    const hasContent = (meeting.talking_points?.length || 0) + (meeting.goals ? 1 : 0) > 0;
    return (
      <div className="space-y-5">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-brand-muted rounded-xl border border-brand-border flex-shrink-0"><MessageSquare className="h-5 w-5 text-brand-primary" /></div>
              <div>
                <h3 className="text-brand-text font-semibold">Practice Your Conversation</h3>
                <p className="text-brand-muted-foreground text-sm mt-1">
                  The AI will roleplay as your{' '}
                  <span className="text-brand-primary">{['hr_discussion', 'accommodation_request', 'return_to_work_plan'].includes(meeting.meeting_type) ? 'HR Representative' : 'Manager'}</span>{' '}
                  using your saved talking points and anticipated objections. After the practice, you'll receive detailed feedback.
                </p>
              </div>
            </div>
            {hasContent && (
              <div className="bg-brand-muted rounded-lg p-3 space-y-2">
                <p className="nv-eyebrow">The AI will use your:</p>
                <div className="flex flex-wrap gap-2">
                  {meeting.goals && <Badge className="bg-brand-sky text-brand-text border-brand-border text-xs">Goals</Badge>}
                  {meeting.talking_points?.length > 0 && <Badge className="bg-brand-secondary/20 text-brand-text border-brand-secondary text-xs">{meeting.talking_points.length} talking points</Badge>}
                  {meeting.anticipated_objections?.length > 0 && <Badge className="bg-brand-compass-cream text-brand-text border-brand-border text-xs">{meeting.anticipated_objections.length} objections to raise</Badge>}
                  {meeting.accommodation_requests?.length > 0 && <Badge className="bg-brand-muted text-brand-primary border-brand-border text-xs">{meeting.accommodation_requests.length} accommodation requests</Badge>}
                </div>
              </div>
            )}
            {!hasContent && <p className="text-brand-text text-xs bg-brand-compass-cream border border-brand-border rounded-lg px-3 py-2">Tip: Add talking points and goals in the "Edit" tab to get a more realistic simulation.</p>}
            <Button onClick={startSimulation} className="w-full !whitespace-normal py-5 text-base">
              <MessageSquare className="h-5 w-5 mr-2" /> Start Practice Session
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // FEEDBACK
  if (phase === 'feedback' && feedback) {
    return <FeedbackPanel feedback={feedback} onReset={reset} />;
  }

  // SIMULATION CHAT
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <Badge className="bg-brand-muted text-brand-primary border-brand-border text-xs">Live Practice Session</Badge>
        <Button size="sm" variant="ghost" onClick={reset}><RotateCcw className="h-3 w-3 mr-1" /> Start Over</Button>
      </div>
      <div className="bg-brand-background rounded-xl border border-brand-border p-4 space-y-4 min-h-[320px] max-h-[420px] overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-brand-muted border border-brand-border flex items-center justify-center flex-shrink-0 mt-0.5"><Bot className="h-3.5 w-3.5 text-brand-primary" /></div>
            )}
            <div className={`min-w-0 max-w-[80%] rounded-brand-lg px-4 py-2.5 text-sm [overflow-wrap:anywhere] ${msg.role === 'user' ? 'bg-brand-primary border border-brand-primary text-primary-foreground' : 'bg-brand-surface border border-brand-border text-brand-text'}`}>
              {msg.role === 'assistant' && <p className="text-xs text-brand-primary font-semibold mb-1">{['hr_discussion', 'accommodation_request', 'return_to_work_plan'].includes(meeting.meeting_type) ? 'HR Representative' : 'Manager'}</p>}
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-brand-secondary border border-brand-secondary flex items-center justify-center flex-shrink-0 mt-0.5"><User className="h-3.5 w-3.5 text-brand-text" /></div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 h-7 rounded-full bg-brand-muted border border-brand-border flex items-center justify-center flex-shrink-0"><Bot className="h-3.5 w-3.5 text-brand-primary" /></div>
            <div className="bg-brand-surface border border-brand-border rounded-2xl px-4 py-2.5"><Loader2 className="h-4 w-4 animate-spin text-brand-primary" /></div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2">
        <textarea rows={2} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
          placeholder="Type your response as you would say it in the real meeting… (Enter to send)" disabled={loading}
          className="nv-input flex-1 min-w-0 px-3 py-2 text-sm resize-none disabled:opacity-50" />
        <Button onClick={sendMessage} disabled={loading || !input.trim()} aria-label="Send response" size="icon" className="self-end"><Send className="h-4 w-4" /></Button>
      </div>
      {messages.length >= 4 && (
        <Button onClick={getFeedback} disabled={loading} variant="secondary" className="w-full !whitespace-normal">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Star className="h-4 w-4 mr-2" />}
          End Session & Get Feedback
        </Button>
      )}
    </div>
  );
}