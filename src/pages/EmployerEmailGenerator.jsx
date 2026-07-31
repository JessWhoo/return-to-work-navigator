import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Mail, Sparkles, Copy, ChevronDown, ChevronUp,
  MessageSquare, User, Loader2, CheckCircle2, RefreshCw, Info
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const EMAIL_SCENARIOS = [
  {
    id: 'return_to_work',
    label: 'Return-to-Work Announcement',
    icon: '🏢',
    description: 'Notify your employer you are returning and propose a plan',
    prompt: `Draft a professional email to an employer announcing a return to work after medical leave. 
Propose a phased return plan (e.g. part-time first two weeks, then full time), express enthusiasm, 
and request a meeting to align on expectations. Tone: confident, positive, solution-focused.`,
  },
  {
    id: 'accommodation_request',
    label: 'Accommodation Request',
    icon: '🤝',
    description: 'Formally request workplace adjustments under ADA',
    prompt: `Draft a professional email formally requesting reasonable workplace accommodations under the ADA. 
Include placeholders for specific accommodations (flexible schedule, remote work, ergonomic equipment). 
Reference willingness to provide medical documentation. Tone: assertive yet collaborative.`,
  },
  {
    id: 'health_status_update',
    label: 'Health Status Update',
    icon: '💬',
    description: 'Inform your employer about your current health situation professionally',
    prompt: `Draft a professional email updating an employer on current health status during ongoing treatment. 
Keep medical detail minimal, focus on work capacity and any temporary schedule impacts. 
Reassure them of continued commitment. Tone: professional, factual, not oversharing.`,
  },
  {
    id: 'schedule_modification',
    label: 'Schedule Modification',
    icon: '📅',
    description: 'Request flexible or modified work hours due to treatment',
    prompt: `Draft a professional email requesting a modified work schedule due to medical treatment appointments. 
Propose specific alternatives to maintain productivity (adjusted hours, remote options, swap days). 
Tone: practical, cooperative, solutions-oriented.`,
  },
  {
    id: 'disclosure',
    label: 'Diagnosis Disclosure',
    icon: '🔒',
    description: 'Carefully disclose a cancer diagnosis without oversharing',
    prompt: `Draft a professional email disclosing a cancer diagnosis to an employer or HR. 
Keep medical details minimal (do not name the cancer type unless the user specifies). 
Focus on upcoming treatment needs, desired privacy, and commitment to work. Tone: calm, professional, boundaried.`,
  },
  {
    id: 'follow_up',
    label: 'Follow-Up on Accommodation',
    icon: '📩',
    description: 'Follow up on a previously submitted accommodation request',
    prompt: `Draft a professional follow-up email regarding an accommodation request that has not yet received a response. 
Reference the original request, express readiness to discuss, and request a meeting or written confirmation. 
Tone: persistent but polite.`,
  },
];

function extractConversationContext(conversation) {
  if (!conversation?.messages?.length) return '';
  const relevant = conversation.messages
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .slice(-10); // last 10 messages
  return relevant
    .map(m => `${m.role === 'user' ? 'User' : 'Coach'}: ${(m.content || '').slice(0, 400)}`)
    .join('\n');
}

export default function EmployerEmailGenerator() {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [selectedConvId, setSelectedConvId] = useState('none');
  const [recipientName, setRecipientName] = useState('');
  const [recipientRole, setRecipientRole] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [extraContext, setExtraContext] = useState('');
  const [subject, setSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConvPicker, setShowConvPicker] = useState(false);

  // Load user progress for context
  const { data: progress } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const list = await base44.entities.UserProgress.list();
      return list[0] || null;
    }
  });

  // Load coach conversations
  const { data: conversations = [], isLoading: loadingConvs } = useQuery({
    queryKey: ['coach-conversations'],
    queryFn: async () => {
      const convs = await base44.agents.listConversations({ agent_name: 'return_to_work_coach' });
      return convs || [];
    },
    retry: 1
  });

  const selectedConversation = conversations.find(c => c.id === selectedConvId) || null;
  const conversationContext = extractConversationContext(selectedConversation);

  const generateEmail = async () => {
    if (!selectedScenario) {
      toast.error('Please select an email scenario first.');
      return;
    }
    setIsGenerating(true);
    setEmailBody('');
    setSubject('');

    try {
      const scenario = EMAIL_SCENARIOS.find(s => s.id === selectedScenario);

      const progressContext = progress ? `
User's journey stage: ${progress.journey_stage || 'unknown'}
Return date: ${progress.return_date || 'not set'}
Number of accommodations previously requested: ${progress.accommodations_requested?.length || 0}
Energy logs tracked: ${progress.energy_logs?.length > 0 ? 'yes' : 'no'}
      `.trim() : 'No progress data available.';

      const coachContext = conversationContext
        ? `\n\nRecent coaching conversation context (use this to personalize the email):\n${conversationContext}`
        : '';

      const recipientInfo = [
        recipientName && `Recipient name: ${recipientName}`,
        recipientRole && `Recipient role: ${recipientRole}`,
      ].filter(Boolean).join('\n') || 'Recipient not specified — use a generic greeting.';

      const extraInfo = extraContext ? `\nAdditional user-provided context:\n${extraContext}` : '';

      const fullPrompt = `${scenario.prompt}

${progressContext}${coachContext}${extraInfo}

${recipientInfo}
Sender signs as: [Your Name]

Rules:
- Proper business email format (greeting → body → closing)
- 150–250 words
- Professional, empathetic, solution-focused language
- Do NOT overshare medical details
- Use [bracketed placeholders] for any specific details the sender should fill in
- Return ONLY the email body starting with the greeting (no subject line in the body)`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: fullPrompt,
        add_context_from_internet: false,
      });

      setSubject(scenario.label + (recipientRole ? ` – ${recipientRole}` : ''));
      setEmailBody(typeof result === 'string' ? result : result?.content || '');
      toast.success('Email draft generated!');
    } catch (err) {
      toast.error('Failed to generate: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    const full = `Subject: ${subject}\n\n${emailBody}`;
    navigator.clipboard.writeText(full);
    toast.success('Copied to clipboard!');
  };

  const openInMailClient = () => {
    const link = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = link;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold text-slate-100">Employer Email Generator</h1>
            <p className="text-sm text-slate-400">AI-drafted emails grounded in your coaching conversations</p>
          </div>
        </div>
      </div>

      {/* Tip banner */}
      <Card className="bg-indigo-950/60 border border-indigo-700/50">
        <CardContent className="pt-4 pb-4">
          <div className="flex gap-2 text-xs text-indigo-300">
            <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
            <p>
              Select a <strong>coaching conversation</strong> below to personalize the draft with your own situation —
              the AI will use what you've discussed with your coach as context.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left column: config */}
        <div className="lg:col-span-2 space-y-5">

          {/* Step 1: Pick scenario */}
          <Card className="bg-slate-800/90 border-2 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-200 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                Choose Email Type
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {EMAIL_SCENARIOS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedScenario(s.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all border ${
                    selectedScenario === s.id
                      ? 'bg-indigo-700/60 border-indigo-500 text-white'
                      : 'bg-slate-700/40 border-slate-600/50 text-slate-300 hover:bg-slate-700/70 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{s.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{s.label}</p>
                      <p className="text-[10px] text-slate-400 truncate">{s.description}</p>
                    </div>
                    {selectedScenario === s.id && <CheckCircle2 className="h-3.5 w-3.5 text-indigo-300 flex-shrink-0" />}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Step 2: Link coaching conversation */}
          <Card className="bg-slate-800/90 border-2 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-200 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                Link Coaching Conversation
                <Badge className="bg-purple-700/50 text-purple-200 text-[10px] px-1.5 py-0 ml-auto">Optional</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingConvs ? (
                <div className="flex justify-center py-3"><Loader2 className="h-4 w-4 animate-spin text-slate-400" /></div>
              ) : conversations.length === 0 ? (
                <p className="text-xs text-slate-500">No coach conversations yet. <a href="/Coach" className="text-purple-400 underline">Start one in Coach</a>.</p>
              ) : (
                <div className="space-y-1.5">
                  <button
                    onClick={() => setShowConvPicker(!showConvPicker)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-700/50 border border-slate-600/50 text-xs text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <MessageSquare className="h-3.5 w-3.5 text-purple-400 flex-shrink-0" />
                      <span className="truncate">
                        {selectedConvId === 'none'
                          ? 'No conversation selected'
                          : (selectedConversation?.messages?.find(m => m.role === 'user')?.content?.slice(0, 50) || 'Conversation')}
                      </span>
                    </div>
                    {showConvPicker ? <ChevronUp className="h-3.5 w-3.5 flex-shrink-0" /> : <ChevronDown className="h-3.5 w-3.5 flex-shrink-0" />}
                  </button>

                  <AnimatePresence>
                    {showConvPicker && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-1 overflow-hidden"
                      >
                        <button
                          onClick={() => { setSelectedConvId('none'); setShowConvPicker(false); }}
                          className={`w-full text-left p-2 rounded-lg text-xs transition-colors ${selectedConvId === 'none' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'}`}
                        >
                          — None (generic email)
                        </button>
                        {conversations.map(c => {
                          const firstMsg = c.messages?.find(m => m.role === 'user');
                          return (
                            <button
                              key={c.id}
                              onClick={() => { setSelectedConvId(c.id); setShowConvPicker(false); }}
                              className={`w-full text-left p-2 rounded-lg text-xs transition-colors ${selectedConvId === c.id ? 'bg-purple-700/50 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-slate-100'}`}
                            >
                              <p className="truncate font-medium">{firstMsg?.content?.slice(0, 60) || 'Conversation'}</p>
                              <p className="text-[10px] text-slate-500">{c.messages?.length || 0} messages</p>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {selectedConvId !== 'none' && (
                    <p className="text-[10px] text-green-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Conversation context will be used to personalize your draft
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 3: Recipient & extra context */}
          <Card className="bg-slate-800/90 border-2 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-200 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold">3</span>
                Recipient & Extra Details
                <Badge className="bg-teal-700/40 text-teal-300 text-[10px] px-1.5 py-0 ml-auto">Optional</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300 flex items-center gap-1"><User className="h-3 w-3" /> Recipient Name</Label>
                <Input
                  placeholder="e.g. Sarah Johnson"
                  value={recipientName}
                  onChange={e => setRecipientName(e.target.value)}
                  className="h-8 text-xs bg-slate-900 border-slate-600 text-slate-200 placeholder:text-slate-500"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Recipient Role</Label>
                <Input
                  placeholder="e.g. HR Manager, Supervisor"
                  value={recipientRole}
                  onChange={e => setRecipientRole(e.target.value)}
                  className="h-8 text-xs bg-slate-900 border-slate-600 text-slate-200 placeholder:text-slate-500"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Additional Context (optional)</Label>
                <Textarea
                  placeholder="e.g. I need 2 days WFH per week and a later start time on Tuesdays..."
                  value={extraContext}
                  onChange={e => setExtraContext(e.target.value)}
                  className="text-xs bg-slate-900 border-slate-600 text-slate-200 placeholder:text-slate-500 min-h-[70px]"
                />
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={generateEmail}
            disabled={isGenerating || !selectedScenario}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 h-11"
          >
            {isGenerating ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating…</>
            ) : (
              <><Sparkles className="h-4 w-4 mr-2" /> Generate Email Draft</>
            )}
          </Button>
        </div>

        {/* Right column: draft output */}
        <div className="lg:col-span-3">
          <Card className="bg-slate-800/90 border-2 border-slate-700 h-full flex flex-col">
            <CardHeader className="border-b border-slate-700 pb-3">
              <CardTitle className="text-sm text-slate-200 flex items-center gap-2">
                <Mail className="h-4 w-4 text-indigo-400" />
                Email Draft
                {emailBody && (
                  <Badge className="bg-green-700/50 text-green-300 text-[10px] px-1.5 py-0 ml-auto">
                    <CheckCircle2 className="h-3 w-3 mr-1 inline" />
                    Ready
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pt-4 space-y-4">
              {!emailBody && !isGenerating ? (
                <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center">
                    <Mail className="h-8 w-8 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm font-medium">No draft yet</p>
                    <p className="text-slate-600 text-xs mt-1">Select a scenario and click Generate</p>
                  </div>
                </div>
              ) : isGenerating ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
                  <div className="text-center">
                    <p className="text-slate-300 text-sm font-medium">Generating your draft…</p>
                    <p className="text-slate-500 text-xs mt-1">
                      {selectedConvId !== 'none' ? 'Using your coaching conversation for context' : 'Using your journey data'}
                    </p>
                  </div>
                </div>
              ) : (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-300">Subject</Label>
                      <Input
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        className="text-sm bg-slate-900 border-slate-600 text-slate-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-300">Body — edit freely</Label>
                      <Textarea
                        value={emailBody}
                        onChange={e => setEmailBody(e.target.value)}
                        className="text-sm bg-slate-900 border-slate-600 text-slate-200 font-mono min-h-[320px] leading-relaxed"
                      />
                      <p className="text-[10px] text-slate-500">Fill in any <span className="text-indigo-400">[bracketed placeholders]</span> before sending.</p>
                    </div>

                    <div className="flex gap-2 pt-1">
                       <Button onClick={copyToClipboard} variant="outline" className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700">
                         <Copy className="h-4 w-4 mr-2" /> Copy
                       </Button>
                       <Button onClick={generateEmail} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700" title="Regenerate">
                         <RefreshCw className="h-4 w-4" />
                       </Button>
                     </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}