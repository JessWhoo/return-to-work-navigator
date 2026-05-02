import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Send, Loader2, RotateCcw, Star, MessageSquare,
  User, Bot, ChevronDown, ChevronUp, Lightbulb
} from 'lucide-react';

const MEETING_TYPE_LABELS = {
  accommodation_request: 'Accommodation Request',
  return_to_work_plan: 'Return to Work Plan',
  performance_review: 'Performance Review',
  hr_discussion: 'HR Discussion',
  supervisor_checkin: 'Supervisor Check-in',
  disclosure: 'Medical Disclosure',
  other: 'Other'
};

function buildSystemPrompt(meeting) {
  const role = ['hr_discussion', 'accommodation_request', 'return_to_work_plan'].includes(meeting.meeting_type)
    ? 'HR Representative'
    : 'Manager / Direct Supervisor';

  const lines = [
    `You are roleplaying as a ${role} in a workplace meeting titled "${meeting.title}" (${MEETING_TYPE_LABELS[meeting.meeting_type] || meeting.meeting_type}).`,
    `Your tone is professional, sometimes skeptical, but ultimately reasonable — push back gently to help the employee practice.`,
    ``,
    `Context you know about the meeting:`,
    meeting.goals ? `- Employee's goals: ${meeting.goals}` : '',
    meeting.attendees ? `- Attendees: ${meeting.attendees}` : '',
    meeting.talking_points?.length
      ? `- Talking points the employee may raise:\n${meeting.talking_points.map((p, i) => `  ${i + 1}. ${p}`).join('\n')}`
      : '',
    meeting.anticipated_objections?.length
      ? `- Anticipated objections to raise naturally:\n${meeting.anticipated_objections.map(o => `  - ${o}`).join('\n')}`
      : '',
    meeting.accommodation_requests?.length
      ? `- Accommodation requests to respond to:\n${meeting.accommodation_requests.map(r => `  - ${r.accommodation}`).join('\n')}`
      : '',
    ``,
    `Instructions:`,
    `1. Open the meeting naturally as the ${role}.`,
    `2. Respond realistically to what the employee says. Raise objections or concerns from the anticipated list when appropriate.`,
    `3. Keep each response concise (2-4 sentences).`,
    `4. Stay in character throughout the simulation.`,
    `5. Do NOT give coaching tips during the simulation — save that for after.`,
  ].filter(Boolean).join('\n');

  return lines;
}

function buildFeedbackPrompt(meeting, messages) {
  const transcript = messages
    .map(m => `${m.role === 'user' ? 'Employee' : 'Manager/HR'}: ${m.content}`)
    .join('\n');

  return `You are an expert career coach specializing in supporting cancer survivors returning to work.

Below is a transcript of a practice conversation simulation for a meeting titled "${meeting.title}".

Transcript:
${transcript}

Please provide structured post-simulation feedback. Evaluate the employee's performance (the "Employee" turns only) on:
1. **Clarity** – Were their points clear and easy to understand?
2. **Confidence** – Did they sound assertive and self-assured?
3. **Completeness** – Did they cover their key talking points?
4. **Handling objections** – Did they respond well when challenged?

For each area, give a score out of 5 and 1-2 specific sentences of feedback.

Then provide 2-3 "What to try next time" tips that are specific to what you saw in this conversation.

Format your response as JSON:
{
  "scores": {
    "clarity": { "score": 4, "feedback": "..." },
    "confidence": { "score": 3, "feedback": "..." },
    "completeness": { "score": 4, "feedback": "..." },
    "objection_handling": { "score": 3, "feedback": "..." }
  },
  "overall_score": 3.5,
  "strengths": ["...", "..."],
  "tips": ["...", "...", "..."],
  "encouragement": "A short, warm, personalized closing message for a cancer survivor."
}`;
}

function ScoreBar({ score }) {
  const pct = (score / 5) * 100;
  const color = score >= 4 ? 'bg-green-500' : score >= 3 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-700 rounded-full h-2">
        <div className={`h-2 rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-slate-300 w-6 text-right">{score}/5</span>
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
      {/* Overall score */}
      <div className="text-center py-4 bg-slate-900/60 rounded-xl border border-purple-600/40">
        <p className="text-slate-400 text-sm mb-1">Overall Score</p>
        <div className="flex items-center justify-center gap-1">
          {[1, 2, 3, 4, 5].map(s => (
            <Star key={s}
              className={`h-6 w-6 ${s <= Math.round(feedback.overall_score) ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
            />
          ))}
          <span className="ml-2 text-2xl font-bold text-white">{feedback.overall_score.toFixed(1)}</span>
        </div>
        <p className="text-slate-300 text-sm mt-3 px-6 italic">"{feedback.encouragement}"</p>
      </div>

      {/* Category scores */}
      <Card className="bg-slate-800/80 border-slate-700">
        <CardContent className="p-4 space-y-4">
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex items-center justify-between w-full text-slate-200 font-semibold text-sm"
          >
            Detailed Scores {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {expanded && categories.map(({ key, label }) => {
            const cat = feedback.scores[key];
            return (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span className="font-medium">{label}</span>
                </div>
                <ScoreBar score={cat.score} />
                <p className="text-xs text-slate-400">{cat.feedback}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Strengths */}
      {feedback.strengths?.length > 0 && (
        <Card className="bg-green-900/20 border-green-700/40">
          <CardContent className="p-4">
            <p className="text-green-300 font-semibold text-sm mb-2">✓ What you did well</p>
            <ul className="space-y-1">
              {feedback.strengths.map((s, i) => (
                <li key={i} className="text-sm text-slate-300 flex gap-2">
                  <span className="text-green-400 flex-shrink-0">·</span> {s}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      {feedback.tips?.length > 0 && (
        <Card className="bg-amber-900/20 border-amber-700/40">
          <CardContent className="p-4">
            <p className="text-amber-300 font-semibold text-sm mb-2 flex items-center gap-1">
              <Lightbulb className="h-4 w-4" /> Try next time
            </p>
            <ul className="space-y-1">
              {feedback.tips.map((t, i) => (
                <li key={i} className="text-sm text-slate-300 flex gap-2">
                  <span className="text-amber-400 flex-shrink-0">{i + 1}.</span> {t}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Button onClick={onReset} className="w-full bg-purple-700 hover:bg-purple-600">
        <RotateCcw className="h-4 w-4 mr-2" /> Practice Again
      </Button>
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
    const systemPrompt = buildSystemPrompt(meeting);
    const opening = await base44.integrations.Core.InvokeLLM({
      prompt: systemPrompt + '\n\nNow open the meeting. Start speaking as the manager/HR rep.',
    });
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

    const systemPrompt = buildSystemPrompt(meeting);
    const history = newMessages
      .map(m => `${m.role === 'user' ? 'Employee' : 'Manager/HR'}: ${m.content}`)
      .join('\n');

    const reply = await base44.integrations.Core.InvokeLLM({
      prompt: `${systemPrompt}\n\nConversation so far:\n${history}\n\nContinue as the Manager/HR. Respond to the employee's last message:`,
    });
    setMessages([...newMessages, { role: 'assistant', content: reply }]);
    setLoading(false);
  };

  const getFeedback = async () => {
    setLoading(true);
    const feedbackPrompt = buildFeedbackPrompt(meeting, messages);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: feedbackPrompt,
      response_json_schema: {
        type: 'object',
        properties: {
          scores: { type: 'object' },
          overall_score: { type: 'number' },
          strengths: { type: 'array', items: { type: 'string' } },
          tips: { type: 'array', items: { type: 'string' } },
          encouragement: { type: 'string' },
        },
      },
    });
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
        <Card className="bg-slate-800/80 border-purple-600/40">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-900/60 rounded-xl border border-purple-600/40 flex-shrink-0">
                <MessageSquare className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-slate-100 font-semibold">Practice Your Conversation</h3>
                <p className="text-slate-400 text-sm mt-1">
                  The AI will roleplay as your{' '}
                  <span className="text-purple-300">
                    {['hr_discussion', 'accommodation_request', 'return_to_work_plan'].includes(meeting.meeting_type)
                      ? 'HR Representative'
                      : 'Manager'}
                  </span>{' '}
                  using your saved talking points and anticipated objections. After the practice, you'll receive detailed feedback.
                </p>
              </div>
            </div>

            {hasContent && (
              <div className="bg-slate-900/60 rounded-lg p-3 space-y-2">
                <p className="text-xs text-slate-500 font-semibold uppercase">The AI will use your:</p>
                <div className="flex flex-wrap gap-2">
                  {meeting.goals && <Badge className="bg-blue-900/40 text-blue-300 border-blue-600/40 text-xs">Goals</Badge>}
                  {meeting.talking_points?.length > 0 && <Badge className="bg-teal-900/40 text-teal-300 border-teal-600/40 text-xs">{meeting.talking_points.length} talking points</Badge>}
                  {meeting.anticipated_objections?.length > 0 && <Badge className="bg-amber-900/40 text-amber-300 border-amber-600/40 text-xs">{meeting.anticipated_objections.length} objections to raise</Badge>}
                  {meeting.accommodation_requests?.length > 0 && <Badge className="bg-purple-900/40 text-purple-300 border-purple-600/40 text-xs">{meeting.accommodation_requests.length} accommodation requests</Badge>}
                </div>
              </div>
            )}

            {!hasContent && (
              <p className="text-amber-400 text-xs bg-amber-900/20 border border-amber-700/40 rounded-lg px-3 py-2">
                Tip: Add talking points and goals in the "Edit" tab to get a more realistic simulation.
              </p>
            )}

            <Button
              onClick={startSimulation}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-5 text-base font-semibold"
            >
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
      <div className="flex items-center justify-between">
        <Badge className="bg-purple-900/40 text-purple-300 border-purple-600/40 text-xs">
          Live Practice Session
        </Badge>
        <Button size="sm" variant="ghost" onClick={reset} className="text-slate-500 hover:text-slate-300 text-xs">
          <RotateCcw className="h-3 w-3 mr-1" /> Start Over
        </Button>
      </div>

      {/* Message thread */}
      <div className="bg-slate-900/80 rounded-xl border border-slate-700 p-4 space-y-4 min-h-[320px] max-h-[420px] overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-purple-800 border border-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="h-3.5 w-3.5 text-purple-300" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-cyan-800/60 border border-cyan-700/60 text-slate-100'
                : 'bg-slate-800 border border-slate-700 text-slate-200'
            }`}>
              {msg.role === 'assistant' && (
                <p className="text-xs text-purple-400 font-semibold mb-1">
                  {['hr_discussion', 'accommodation_request', 'return_to_work_plan'].includes(meeting.meeting_type)
                    ? 'HR Representative'
                    : 'Manager'}
                </p>
              )}
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-cyan-800 border border-cyan-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="h-3.5 w-3.5 text-cyan-300" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 h-7 rounded-full bg-purple-800 border border-purple-600 flex items-center justify-center flex-shrink-0">
              <Bot className="h-3.5 w-3.5 text-purple-300" />
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl px-4 py-2.5">
              <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <textarea
          rows={2}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your response as you would say it in the real meeting… (Enter to send)"
          disabled={loading}
          className="flex-1 bg-slate-800 border border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none disabled:opacity-50"
        />
        <Button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-cyan-700 hover:bg-cyan-600 self-end px-3 py-2 h-auto"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* End & get feedback */}
      {messages.length >= 4 && (
        <Button
          onClick={getFeedback}
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 font-semibold"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Star className="h-4 w-4 mr-2" />}
          End Session & Get Feedback
        </Button>
      )}
    </div>
  );
}