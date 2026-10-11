import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Mail, Sparkles, Copy, ChevronDown, ChevronUp,
  MessageSquare, User, Loader2, CheckCircle2, RefreshCw, Info
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useAuth } from '@/lib/AuthContext';
import SaveDraftButton from '@/components/communication/SaveDraftButton';

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

// CommunicationDraft scenario type used when a generated email is saved to
// My Drafts.
const DRAFT_SCENARIO_TYPES = {
  return_to_work: 'return_to_work_plan',
  accommodation_request: 'accommodation_request',
  health_status_update: 'other',
  schedule_modification: 'schedule_flexibility',
  disclosure: 'diagnosis_disclosure',
  follow_up: 'follow_up_request',
};

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
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [selectedConvId, setSelectedConvId] = useState('none');
  const [recipientName, setRecipientName] = useState('');
  const [recipientRole, setRecipientRole] = useState('');
  const [extraContext, setExtraContext] = useState('');
  const [subject, setSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConvPicker, setShowConvPicker] = useState(false);
  const draftRef = useRef(null);

  // Load user progress for context
  const { data: progress } = useUserProgress();

  // Load coach conversations
  const { data: conversations = [], isLoading: loadingConvs } = useQuery({
    queryKey: ['coach-conversations'],
    enabled: !isLoadingAuth && !!isAuthenticated,
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

      const result = (await base44.functions.invoke('aiGateway', {
        operation: 'generate_employer_email',
        data: {
          scenarioPrompt: scenario.prompt,
          progressContext,
          coachContext,
          extraInfo,
          recipientInfo,
        },
      })).data.result;

      setSubject(scenario.label + (recipientRole ? ` – ${recipientRole}` : ''));
      setEmailBody(typeof result === 'string' ? result : result?.content || '');
      toast.success('Email draft generated!');

      // On narrow screens the draft sits below the form, so bring it into view
      // rather than leaving the result off-screen.
      if (window.innerWidth < 1024) {
        requestAnimationFrame(() =>
          draftRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        );
      }
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

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="rounded-pill bg-muted p-2.5 text-primary">
          <Mail className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">Employer Email Generator</h2>
          <p className="text-sm text-muted-foreground">AI-drafted emails grounded in your coaching conversations</p>
        </div>
      </div>

      {/* Tip banner */}
      <Card className="nv-card--muted">
        <CardContent className="pt-4 pb-4">
          <div className="flex gap-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
            <p>
              Select a <strong>coaching conversation</strong> below to personalize the draft with your own situation —
              the AI will use what you've discussed with your coach as context.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left column: config */}
        <div className="space-y-5 lg:col-span-2">

          {/* Step 1: Pick scenario */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm text-foreground">
                <span className="flex h-5 w-5 items-center justify-center rounded-pill bg-primary text-xs font-bold text-primary-foreground">1</span>
                Choose Email Type
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {EMAIL_SCENARIOS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedScenario(s.id)}
                  className={`w-full rounded-brand border p-3 text-left transition-all ${
                    selectedScenario === s.id
                      ? 'border-primary bg-muted text-foreground'
                      : 'border-border bg-surface text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{s.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold">{s.label}</p>
                      <p className="truncate text-[10px] text-muted-foreground">{s.description}</p>
                    </div>
                    {selectedScenario === s.id && <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-primary" />}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Step 2: Link coaching conversation */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm text-foreground">
                <span className="flex h-5 w-5 items-center justify-center rounded-pill bg-primary text-xs font-bold text-primary-foreground">2</span>
                Link Coaching Conversation
                <span className="nv-chip nv-chip--muted ml-auto">Optional</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingConvs ? (
                <div className="flex justify-center py-3"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>
              ) : conversations.length === 0 ? (
                <p className="text-xs text-muted-foreground">No coach conversations yet. <Link to="/Coach" className="text-primary underline">Start one in Coach</Link>.</p>
              ) : (
                <div className="space-y-1.5">
                  <button
                    onClick={() => setShowConvPicker(!showConvPicker)}
                    className="flex w-full items-center justify-between rounded-brand border border-border bg-surface p-2.5 text-xs text-foreground transition-colors hover:bg-muted"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <MessageSquare className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
                      <span className="truncate">
                        {selectedConvId === 'none'
                          ? 'No conversation selected'
                          : (selectedConversation?.messages?.find(m => m.role === 'user')?.content?.slice(0, 50) || 'Conversation')
                        }
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
                          className={`w-full rounded-brand p-2 text-left text-xs transition-colors ${selectedConvId === 'none' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                        >
                          — None (generic email)
                        </button>
                        {conversations.map(c => {
                          const firstMsg = c.messages?.find(m => m.role === 'user');
                          return (
                            <button
                              key={c.id}
                              onClick={() => { setSelectedConvId(c.id); setShowConvPicker(false); }}
                              className={`w-full rounded-brand p-2 text-left text-xs transition-colors ${selectedConvId === c.id ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                            >
                              <p className="truncate font-medium">{firstMsg?.content?.slice(0, 60) || 'Conversation'}</p>
                              <p className="text-[10px] text-muted-foreground">{c.messages?.length || 0} messages</p>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {selectedConvId !== 'none' && (
                    <p className="flex items-center gap-1 text-[10px] text-brand-secondary">
                      <CheckCircle2 className="h-3 w-3" />
                      Conversation context will be used to personalize your draft
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 3: Recipient & extra context */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm text-foreground">
                <span className="flex h-5 w-5 items-center justify-center rounded-pill bg-primary text-xs font-bold text-primary-foreground">3</span>
                Recipient & Extra Details
                <span className="nv-chip nv-chip--muted ml-auto">Optional</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-xs text-foreground"><User className="h-3 w-3" /> Recipient Name</Label>
                <Input
                  placeholder="e.g. Sarah Johnson"
                  value={recipientName}
                  onChange={e => setRecipientName(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-foreground">Recipient Role</Label>
                <Input
                  placeholder="e.g. HR Manager, Supervisor"
                  value={recipientRole}
                  onChange={e => setRecipientRole(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-foreground">Additional Context (optional)</Label>
                <Textarea
                  placeholder="e.g. I need 2 days WFH per week and a later start time on Tuesdays..."
                  value={extraContext}
                  onChange={e => setExtraContext(e.target.value)}
                  className="min-h-[70px] text-xs"
                />
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={generateEmail}
            disabled={isGenerating || !selectedScenario}
            className="h-11 w-full"
          >
            {isGenerating ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Generate Email Draft</>
            )}
          </Button>
        </div>

        {/* Right column: draft output */}
        <div className="lg:col-span-3">
          <Card ref={draftRef} className="flex h-full flex-col">
            <CardHeader className="border-b border-border pb-3">
              <CardTitle className="flex items-center gap-2 text-sm text-foreground">
                <Mail className="h-4 w-4 text-primary" />
                Email Draft
                {emailBody && (
                  <span className="nv-chip ml-auto">
                    <CheckCircle2 className="h-3 w-3" />
                    Ready
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-4 pt-4">
              {!emailBody && !isGenerating ? (
                <div className="flex h-64 flex-col items-center justify-center space-y-3 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-pill bg-muted">
                    <Mail className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">No draft yet</p>
                    <p className="mt-1 text-xs text-muted-foreground">Select a scenario and click Generate</p>
                  </div>
                </div>
              ) : isGenerating ? (
                <div className="flex h-64 flex-col items-center justify-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">Generating your draft…</p>
                    <p className="mt-1 text-xs text-muted-foreground">
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
                      <Label className="text-xs text-foreground">Subject</Label>
                      <Input
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-foreground">Body — edit freely</Label>
                      <Textarea
                        value={emailBody}
                        onChange={e => setEmailBody(e.target.value)}
                        className="min-h-[320px] font-mono text-sm leading-relaxed"
                      />
                      <p className="text-[10px] text-muted-foreground">Fill in any <span className="text-primary">[bracketed placeholders]</span> before sending.</p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                       <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                         <Copy className="h-4 w-4" /> Copy
                       </Button>
                       <SaveDraftButton
                         title={EMAIL_SCENARIOS.find(s => s.id === selectedScenario)?.label || 'Workplace Email'}
                         scenarioType={DRAFT_SCENARIO_TYPES[selectedScenario] || 'other'}
                         recipient={recipientName || recipientRole || ''}
                         subject={subject}
                         content={emailBody}
                         className="flex-1"
                       />
                       <Button onClick={generateEmail} variant="outline" title="Regenerate">
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