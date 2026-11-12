import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, Send, Loader2, Sparkles, Plus, Bot, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from '../components/coach/MessageBubble';
import ProactiveCalendarInsights from '../components/coach/ProactiveCalendarInsights';
import SuggestedQuestions from '../components/coach/SuggestedQuestions';
import AppFeatureGuide from '../components/coach/AppFeatureGuide';
import SentimentResourceSuggestions, { detectSentimentAndResources } from '../components/coach/SentimentResourceSuggestions';
import ConversationHistory from '../components/coach/ConversationHistory';
import ProactiveResourceSuggestions from '../components/coach/ProactiveResourceSuggestions';
import CoachProfileCard from '../components/coach/CoachProfileCard';
import CoachProfileDialog from '../components/coach/CoachProfileDialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useSEO from '@/hooks/useSEO';
import PageHeader from '@/components/brand/PageHeader';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useAuth } from '@/lib/AuthContext';
import { logToolEngagement } from '@/lib/analytics';
import useCoachThread from '@/hooks/useCoachThread';

export default function Coach() {
  useSEO({
    title: '24/7 AI Return-to-Work Coach for Cancer Survivors',
    description:
      'Chat confidentially with your AI Return-to-Work Coach for tailored guidance on workplace accommodations, fatigue pacing, HR scripts, and emotional readiness.',
    path: '/Coach',
  });
  const queryClient = useQueryClient();
  const messagesScrollRef = useRef(null);
  const inputRef = useRef(null);
  const [message, setMessage] = useState('');
  // Mobile is a two-tab view: the conversation, or the coach's profile.
  const [mobileTab, setMobileTab] = useState('chat');
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [lastUserMessage, setLastUserMessage] = useState('');
  const [chatError, setChatError] = useState(null);
  const { isAuthenticated, isLoadingAuth } = useAuth();

  // Load user progress for calendar insights
  const { data: progress } = useUserProgress();

  // Load pending message from other pages
  useEffect(() => {
    const pendingMessage = localStorage.getItem('pendingCoachMessage');
    if (pendingMessage) {
      setMessage(pendingMessage);
      localStorage.removeItem('pendingCoachMessage');
    }
  }, []);

  // Load conversations
  const { data: conversationsList, isLoading: loadingConversations, error: conversationsError } = useQuery({
    queryKey: ['coach-conversations'],
    queryFn: async () => {
      // Filter params go straight into the query string, so they must be flat
      // (`q: { agent_name }` serialised to "[object Object]" and returned nothing,
      // leaving the history empty and conversations "disappearing" on reload).
      const convs = await base44.agents.listConversations({
        agent_name: 'return_to_work_coach',
        sort: '-updated_date',
        limit: 50,
      });
      return convs || [];
    },
    // Agent conversations are per-user — never fire this for anonymous
    // visitors (it 401s and surfaces as repeated script errors).
    enabled: !isLoadingAuth && !!isAuthenticated,
    retry: 2,
    retryDelay: 1000,
    staleTime: 30000,
  });

  useEffect(() => {
    if (conversationsList) {
      setConversations(previous => conversationsList.map(incoming => {
        const existing = previous.find(conv => conv.id === incoming.id);
        return existing ? { ...incoming, messages: existing.messages ?? incoming.messages } : incoming;
      }));
      if (!selectedConversation && conversationsList.length > 0) {
        // Open the newest thread that actually has messages, so a freshly
        // started blank conversation can never hide all saved replies.
        const withMessages = conversationsList.find(conv => conv.messages?.length > 0);
        setSelectedConversation((withMessages || conversationsList[0]).id);
      }
    }
  }, [conversationsList]);

  // Scroll the message list itself (never the window) so loading or streaming
  // a conversation doesn't drag the whole mobile page around.
  useEffect(() => {
    const scroller = messagesScrollRef.current;
    if (!scroller) return;
    const hasMessages = conversations.some(conv => conv.id === selectedConversation && conv.messages?.length > 0);
    scroller.scrollTop = hasMessages ? scroller.scrollHeight : 0;
  }, [conversations, selectedConversation]);

  const createConversationMutation = useMutation({
    mutationFn: async () => {
      // Track new conversation start
      base44.analytics.track({
        eventName: 'ai_coach_conversation_started',
        properties: {
          journey_stage: progress?.journey_stage || 'unknown',
          has_return_date: !!progress?.return_date
        }
      });

      return await base44.agents.createConversation({
        agent_name: 'return_to_work_coach',
        metadata: {
          name: 'New Conversation',
          created_at: new Date().toISOString()
        }
      });
    },
    onSuccess: (newConv) => {
      setChatError(null);
      // Show the new thread immediately instead of waiting for the refetch,
      // which otherwise flashes the "no conversation" empty state.
      setConversations(prev => [
        { ...newConv, messages: newConv.messages || [] },
        ...prev.filter(c => c.id !== newConv.id),
      ]);
      queryClient.invalidateQueries({ queryKey: ['coach-conversations'] });
      setSelectedConversation(newConv.id);
      setMobileTab('chat');
    },
    onError: () => {
      setChatError("Couldn't start a new conversation. Please try again.");
    }
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (/** @type {string} */ messageText) => {
      setLastUserMessage(messageText);
      setChatError(null);

      // Never let a thread that cannot be opened stop the send: fall back to a
      // new conversation so the survivor's message still reaches the coach.
      let conversation = null;
      if (selectedConversation) {
        try {
          conversation = await base44.agents.getConversation(selectedConversation);
        } catch {
          conversation = null;
        }
      }
      if (!conversation) conversation = await createConversationMutation.mutateAsync();

      // Show the message in the thread straight away — the reply arrives with
      // the request, so waiting for it left the composer looking unresponsive.
      const showOwnMessage = () => setConversations(previous => previous.map(conv =>
        conv.id === conversation.id
          ? { ...conv, messages: [...(conv.messages || []), { id: `pending-${Date.now()}`, role: 'user', content: messageText }] }
          : conv));

      showOwnMessage();

      try {
        await base44.agents.addMessage(conversation, { role: 'user', content: messageText });
      } catch (error) {
        // A saved thread the platform no longer accepts messages on (removed or
        // archived) is replaced rather than leaving the message unsent.
        if (error?.status !== 404 && error?.status !== 403) throw error;
        conversation = await createConversationMutation.mutateAsync();
        showOwnMessage();
        await base44.agents.addMessage(conversation, { role: 'user', content: messageText });
      }

      base44.analytics.track({
        eventName: 'ai_coach_message_sent',
        properties: { conversation_id: conversation.id, message_length: messageText.length },
      });
      // Refresh this thread, not the conversation list, which can overwrite streamed replies.
      await queryClient.invalidateQueries({ queryKey: ['coach-thread', conversation.id] });
    },
    onError: (_err, messageText) => {
      setChatError("Your message couldn't be sent. Please try again.");
      setMessage(messageText);
    },
  });

  // Sending is never blocked by a reply still being written — a survivor can
  // follow up at any time and both messages land in the same thread.
  const handleSend = () => {
    if (!message.trim() || !isAuthenticated) return;
    const currentMessage = message.trim();
    setMessage('');
    sendMessageMutation.mutate(currentMessage);

    // On a phone the chat card is taller than the visible screen once the
    // keyboard opens, so the message box could end up hidden. Bring it back
    // into view and keep the keyboard open for a follow-up question.
    requestAnimationFrame(() => {
      const box = inputRef.current;
      if (!box) return;
      box.scrollIntoView({ block: 'nearest' });
      box.focus({ preventScroll: true });
    });
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickMessage = messageText => {
    if (!isAuthenticated) return;
    setMobileTab('chat');
    sendMessageMutation.mutate(messageText);
  };

  const currentConversation = conversations.find(c => c.id === selectedConversation);
  const messages = currentConversation?.messages || [];
  const lastMessage = messages[messages.length - 1];
  const awaitingReply = sendMessageMutation.isPending || lastMessage?.role === 'user'
    || (lastMessage?.role === 'assistant' && !lastMessage.content);

  // Keeps the open thread in sync with the saved conversation, including the
  // reply the agent writes after the send request returns.
  const updateThread = thread => setConversations(previous => {
    const exists = previous.some(conv => conv.id === thread.id);
    return exists
      ? previous.map(conv => conv.id === thread.id ? { ...conv, ...thread } : conv)
      : [thread, ...previous];
  });
  const { refetch: refreshThread, error: threadError } = useCoachThread(
    selectedConversation,
    updateThread,
    awaitingReply,
  );

  const firedCoachEngagement = useRef(new Set());
  useEffect(() => {
    if (!selectedConversation) return;
    if (firedCoachEngagement.current.has(selectedConversation)) return;
    if (messages.some((m) => m.role === 'assistant')) {
      firedCoachEngagement.current.add(selectedConversation);
      logToolEngagement('ai_coach');
    }
  }, [messages, selectedConversation]);

  // The page always renders: a slow conversation list must never hide the
  // composer and leave the coach impossible to message.
  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-4">
      <PageHeader
        eyebrow="24/7 Personalized Guidance"
        title="AI Return-to-Work Coach for Cancer Survivors"
        subtitle="Ask questions about ADA accommodations, fatigue pacing, employer conversations, and your return-to-work plan."
      />
      <div className="grid min-w-0 grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(15rem,18rem)_minmax(0,1fr)]">
        {/* Mobile: switch between the conversation and the coach profile */}
        <Tabs value={mobileTab} onValueChange={setMobileTab} className="order-1 min-w-0 xl:hidden">
          <TabsList aria-label="Coach sections" className="nv-tabs h-auto">
            <TabsTrigger value="chat" className="nv-tab">
              <MessageSquare className="h-4 w-4" aria-hidden="true" />
              <span>Chat</span>
            </TabsTrigger>
            <TabsTrigger value="coach" className="nv-tab">
              <Bot className="h-4 w-4" aria-hidden="true" />
              <span>History &amp; Profile</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Sidebar */}
        <div className={`order-3 min-w-0 flex-col gap-4 xl:order-none xl:flex ${mobileTab === 'coach' ? 'flex' : 'hidden'}`}>
          {/* Conversation History Panel */}
          <Card className="order-2 flex max-h-[50dvh] min-h-0 min-w-0 flex-col xl:order-none">
            <CardContent className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
              <ConversationHistory
                conversations={conversations}
                selectedConversation={selectedConversation}
                onSelect={setSelectedConversation}
                onNew={() => createConversationMutation.mutate()}
                onRefresh={() => queryClient.invalidateQueries({ queryKey: ['coach-conversations'] })}
                loading={loadingConversations}
                error={conversationsError}
              />
            </CardContent>
          </Card>

          {/* Coach identity — carries the profile entry point on mobile */}
          <CoachProfileCard
            className="order-1 lg:order-none"
            onViewProfile={() => setProfileOpen(true)}
          />

          {/* Contextual Sidebar Tools */}
          <div className="order-3 space-y-3 lg:order-none">
            {progress && (
              <>
                <ProactiveCalendarInsights 
                  progress={progress} 
                  onSendMessage={handleQuickMessage}
                />
                <SuggestedQuestions 
                  progress={progress}
                  onSendMessage={handleQuickMessage}
                />
              </>
            )}
            <AppFeatureGuide />
          </div>
        </div>

        {/* Main Chat Area */}
        {/* Height follows the visible viewport (dvh) with no rem floor, so the
            composer stays on screen on a phone even with the keyboard open. */}
        <div className={`order-2 h-[calc(100dvh-8.5rem)] min-h-[20rem] min-w-0 flex-col scroll-mt-20 xl:order-none xl:h-[max(36rem,80dvh)] xl:min-h-0 xl:flex ${mobileTab === 'chat' ? 'flex' : 'hidden'}`}>
          <Card className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <CardHeader className="shrink-0 border-b border-border">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="flex min-w-0 items-center gap-2 text-lg sm:text-xl">
                  <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span>Chat with Your Coach</span>
                </CardTitle>
                {currentConversation && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Refresh coaching conversation"
                    onClick={() => refreshThread()}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent ref={messagesScrollRef} className="min-h-0 min-w-0 flex-1 space-y-4 overflow-y-auto overscroll-contain bg-muted p-4 [overflow-wrap:anywhere] sm:p-6">
              {isLoadingAuth ? (
                <div className="flex min-h-full items-center justify-center" role="status">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
                  <span className="sr-only">Loading your coach</span>
                </div>
              ) : !isAuthenticated ? (
                <div className="flex min-h-full items-center justify-center">
                  <div className="max-w-xl space-y-5 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-pill bg-primary text-primary-foreground">
                      <MessageSquare className="h-10 w-10" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="mb-2 text-2xl font-bold text-foreground">
                        Welcome to Your 24/7 AI Return-to-Work Coach
                      </h2>
                      <p className="mb-4 text-muted-foreground">
                        Get confidential, personalized guidance for every stage of returning to work after cancer treatment — from drafting ADA accommodation requests and planning a phased schedule to managing treatment fatigue and preparing for HR conversations.
                      </p>
                      <div className="mx-auto max-w-md space-y-2 rounded-brand border border-border bg-brand-surface p-4 text-left">
                        <p className="text-sm font-bold text-foreground">How your AI Return-to-Work Coach supports you:</p>
                        <ul className="ml-4 space-y-1.5 text-sm text-muted-foreground">
                          <li>• Drafting ADA workplace accommodation letters and HR emails</li>
                          <li>• Building a gradual, week-by-week phased return schedule</li>
                          <li>• Pacing workday energy around cancer-related fatigue and chemo brain</li>
                          <li>• Practicing scripts for supervisor check-ins and coworker boundaries</li>
                          <li>• Understanding federal FMLA, ADA, COBRA, and state leave protections</li>
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        Your coaching conversations are private and saved to your account.
                      </p>
                      <Button onClick={() => base44.auth.redirectToLogin(createPageUrl('Coach'))}>
                        Sign in to start chatting
                      </Button>
                    </div>
                  </div>
                </div>
              ) : !selectedConversation ? (
                <div className="flex min-h-full items-center justify-center">
                  <div className="max-w-md space-y-4 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-pill bg-primary text-primary-foreground">
                      <MessageSquare className="h-10 w-10" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-2xl font-bold text-foreground">
                        Welcome to Your AI Coach
                      </h3>
                      <p className="mb-4 text-muted-foreground">
                        Get personalized workplace guidance for your return-to-work journey. Ask questions about ADA accommodations, phased schedules, HR conversations, and your return-to-work plan.
                      </p>
                      <div className="mx-auto max-w-sm space-y-2 rounded-brand border border-border bg-brand-surface p-3 text-left">
                        <p className="text-sm font-bold text-foreground">I can help you with:</p>
                        <ul className="ml-4 space-y-1 text-sm text-muted-foreground">
                          <li>• Answering questions about your workplace rights and ADA accommodations</li>
                          <li>• Drafting emails and scripts for HR, managers, and coworkers</li>
                          <li>• Planning a gradual return schedule and workday pacing strategies</li>
                          <li>• Navigating app tools and finding workplace resources</li>
                        </ul>
                      </div>
                      <p className="mt-3 mb-3 text-xs text-muted-foreground">
                        Non-medical workplace support only — the AI Coach does not analyze symptoms or provide medical advice. Always consult your healthcare team for medical questions.
                      </p>
                      <Button
                        onClick={() => createConversationMutation.mutate()}
                      >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        Start New Conversation
                      </Button>
                    </div>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex min-h-full items-center justify-center">
                  <div className="max-w-md space-y-4 text-center">
                    <Bot className="mx-auto h-16 w-16 text-primary" aria-hidden="true" />
                    <div>
                      <h3 className="mb-2 text-xl font-bold text-foreground">
                        Ready to Talk?
                      </h3>
                      <p className="mb-3 text-sm text-muted-foreground">
                        I have access to your return-to-work journey stage, checklist progress, and planning calendar to provide personalized workplace guidance (non-medical).
                      </p>
                      <div className="mx-auto max-w-sm space-y-1 rounded-brand border border-border bg-brand-surface p-3 text-left text-sm text-muted-foreground">
                        <p className="mb-2 font-bold text-foreground">Try asking about:</p>
                        <ul className="ml-4 space-y-1">
                          <li>• "What accommodations should I request?"</li>
                          <li>• "How do I talk to my employer about my cancer?"</li>
                          <li>• "I'm struggling with fatigue - what can help?"</li>
                          <li>• "What resources match my current needs?"</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <AnimatePresence>
                  {messages.map((msg, idx) => {
                      // Find the preceding user message for sentiment detection on assistant replies
                      const prevUserMsg = msg.role === 'assistant'
                        ? messages.slice(0, idx).reverse().find(m => m.role === 'user')?.content
                        : null;
                      const sentiment = prevUserMsg ? detectSentimentAndResources(prevUserMsg)?.sentiment : null;
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <MessageBubble
                            message={msg}
                            messageIndex={idx}
                            conversationId={selectedConversation}
                            detectedSentiment={sentiment}
                          />
                        </motion.div>
                      );
                    })}
                </AnimatePresence>
              )}

              {awaitingReply && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Your coach is preparing a reply…
                </div>
              )}
              {threadError && (
                <div role="alert" className="space-y-2 text-sm text-destructive">
                  <p>Couldn't load the latest replies. Your conversation is saved.</p>
                  <Button variant="outline" size="sm" onClick={() => refreshThread()}>Reload replies</Button>
                </div>
              )}

              {/* Contextual suggestions scroll with the conversation so they can
                  never squeeze, clip, or overlap the composer below. */}
              {lastUserMessage && selectedConversation && (
                <SentimentResourceSuggestions lastUserMessage={lastUserMessage} />
              )}
              {messages.length >= 2 && (
                <ProactiveResourceSuggestions messages={messages} />
              )}
            </CardContent>

            {/* Input Area */}
            <div className="shrink-0 border-t border-border bg-brand-surface p-4">
              {chatError && (
                <div className="mb-2 space-y-2" role="alert">
                  <p className="text-sm font-semibold text-destructive">{chatError}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setChatError(null); if (message.trim()) handleSend(); }}
                  >
                    <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                    Try again
                  </Button>
                </div>
              )}
              {isLoadingAuth ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Loading your coach…
                </div>
              ) : !isAuthenticated ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Sign in to message your coach — your conversations are saved privately to your account.
                  </p>
                  <Button onClick={() => base44.auth.redirectToLogin(createPageUrl('Coach'))}>
                    Sign in to message
                  </Button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Textarea
                    ref={inputRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message... (Shift+Enter for new line)"
                    aria-label="Message to your coach"
                    className="min-h-[60px] max-h-[120px] min-w-0 flex-1 resize-y text-base"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!message.trim()}
                    size="icon"
                    aria-label="Send message to your coach"
                    className="self-end"
                  >
                    <Send className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </div>
              )}
              {selectedConversation && (
                <p className="mt-2 text-xs font-medium text-muted-foreground">
                  Press Enter to send • Shift+Enter for new line
                </p>
              )}
            </div>

            {/* Quality review disclosure — always visible under the composer */}
            <div className="shrink-0 border-t border-border bg-muted px-4 py-3">
              <p className="text-xs text-muted-foreground">
                <span className="font-bold text-foreground">Quality review: </span>
                to help the AI Coach give answers that are clear and easy to act on when you are under stress, copies of Coach replies and the question each reply answered are reviewed by Smarter Medical Care Inc against its AWCL communication standard. Your name, email address and account details are removed before anything is sent.{' '}
                <Link to="/PrivacySecurity" className="font-semibold text-primary underline underline-offset-2">
                  Read our privacy policy
                </Link>
                .
              </p>
            </div>
          </Card>
        </div>
      </div>

      <CoachProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
    </div>
  );
}