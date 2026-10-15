import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
import useSEO from '@/hooks/useSEO';
import PageHeader from '@/components/brand/PageHeader';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useAuth } from '@/lib/AuthContext';
import { logToolEngagement } from '@/lib/analytics';

export default function Coach() {
  useSEO({
    title: '24/7 AI Return-to-Work Coach for Cancer Survivors',
    description:
      'Chat confidentially with your AI Return-to-Work Coach for tailored guidance on workplace accommodations, fatigue pacing, HR scripts, and emotional readiness.',
    path: '/Coach',
  });
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState('');
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
      const convs = await base44.agents.listConversations({
        agent_name: 'return_to_work_coach'
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
      setConversations(conversationsList);
      if (!selectedConversation && conversationsList.length > 0) {
        setSelectedConversation(conversationsList[0].id);
      }
    }
  }, [conversationsList]);

  // Subscribe to conversation updates
  useEffect(() => {
    if (!selectedConversation) return;

    const unsubscribe = base44.agents.subscribeToConversation(
      selectedConversation,
      (data) => {
        setConversations(prev => 
          prev.map(conv => 
            conv.id === selectedConversation 
              ? { ...conv, messages: data.messages }
              : conv
          )
        );
      }
    );

    return () => unsubscribe();
  }, [selectedConversation]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
      queryClient.invalidateQueries({ queryKey: ['coach-conversations'] });
      setSelectedConversation(newConv.id);
    },
    onError: () => {
      setChatError("Couldn't start a new conversation. Please try again.");
    }
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageText) => {
      setLastUserMessage(messageText);
      // The conversation may not be in local state yet right after it was
      // created (the list is still refetching). addMessage only needs the id,
      // so fall back to a minimal object instead of failing to send.
      const conversation = conversations.find(c => c.id === selectedConversation)
        || { id: selectedConversation };

      // Track conversation interaction
      base44.analytics.track({
        eventName: 'ai_coach_message_sent',
        properties: {
          conversation_id: selectedConversation,
          message_length: messageText.length,
          has_calendar_insights: progress?.calendar_events?.length > 0 || !!progress?.return_date
        }
      });

      return await base44.agents.addMessage(conversation, {
        role: 'user',
        content: messageText
      });
    },
    onSuccess: () => {
      setChatError(null);
      queryClient.invalidateQueries({ queryKey: ['coach-conversations'] });
    },
    onError: (_err, messageText) => {
      setChatError("Your message couldn't be sent. Please try again.");
      setMessage(messageText);
    }
  });

  const deleteConversationMutation = useMutation({
    mutationFn: async (convId) => {
      // Note: You'll need to implement delete in the SDK if not available
      // For now, we'll just update the list locally
      return convId;
    },
    onSuccess: (deletedId) => {
      setConversations(prev => prev.filter(c => c.id !== deletedId));
      if (selectedConversation === deletedId) {
        setSelectedConversation(conversations[0]?.id || null);
      }
    }
  });

  const handleSend = async () => {
    if (!message.trim()) return;
    const currentMessage = message;
    setMessage('');
    setLastUserMessage(currentMessage);
    setChatError(null);

    if (!selectedConversation) {
      try {
        const newConv = await base44.agents.createConversation({
          agent_name: 'return_to_work_coach',
          metadata: { name: 'New Conversation', created_at: new Date().toISOString() }
        });
        const convWithMessages = { ...newConv, messages: [] };
        setSelectedConversation(newConv.id);
        setConversations(prev => [convWithMessages, ...prev]);
        await base44.agents.addMessage(convWithMessages, { role: 'user', content: currentMessage });
        queryClient.invalidateQueries({ queryKey: ['coach-conversations'] });
      } catch {
        setChatError("Your message couldn't be sent. Please try again.");
        setMessage(currentMessage);
      }
    } else {
      sendMessageMutation.mutate(currentMessage);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickMessage = async (messageText) => {
    setLastUserMessage(messageText);
    setChatError(null);
    try {
      if (!selectedConversation) {
        const newConv = await base44.agents.createConversation({
          agent_name: 'return_to_work_coach',
          metadata: { name: 'New Conversation' }
        });
        const convWithMessages = { ...newConv, messages: [] };
        setSelectedConversation(newConv.id);
        setConversations(prev => [convWithMessages, ...prev]);
        await base44.agents.addMessage(convWithMessages, { role: 'user', content: messageText });
      } else {
        // Fall back to the id when the full conversation object isn't loaded
        // yet, so quick-send buttons never silently drop the message.
        const conversation = conversations.find(c => c.id === selectedConversation)
          || { id: selectedConversation };
        await base44.agents.addMessage(conversation, { role: 'user', content: messageText });
      }
      queryClient.invalidateQueries({ queryKey: ['coach-conversations'] });
    } catch {
      setChatError("Your message couldn't be sent. Please try again.");
    }
  };

  const currentConversation = conversations.find(c => c.id === selectedConversation);
  const messages = currentConversation?.messages || [];

  const firedCoachEngagement = useRef(new Set());
  useEffect(() => {
    if (!selectedConversation) return;
    if (firedCoachEngagement.current.has(selectedConversation)) return;
    if (messages.some((m) => m.role === 'assistant')) {
      firedCoachEngagement.current.add(selectedConversation);
      logToolEngagement('ai_coach');
    }
  }, [messages, selectedConversation]);

  if (loadingConversations) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 pb-4">
        <PageHeader
          eyebrow="24/7 Personalized Guidance"
          title="AI Return-to-Work Coach for Cancer Survivors"
          subtitle="Ask questions about ADA accommodations, fatigue pacing, employer conversations, and your return-to-work plan."
        />
        <div className="flex h-64 items-center justify-center">
          <div className="space-y-3 text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
            <p className="text-sm font-semibold text-foreground">Loading your coach...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-4">
      <PageHeader
        eyebrow="24/7 Personalized Guidance"
        title="AI Return-to-Work Coach for Cancer Survivors"
        subtitle="Ask questions about ADA accommodations, fatigue pacing, employer conversations, and your return-to-work plan."
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 lg:items-start">
        {/* Sidebar */}
        <div className="flex flex-col gap-4 lg:col-span-1">
          {/* Conversation History Panel */}
          <Card className="flex flex-col" style={{ maxHeight: '50vh' }}>
            <CardContent className="flex flex-1 flex-col overflow-hidden pt-4 pb-4">
              <ConversationHistory
                conversations={conversations}
                selectedConversation={selectedConversation}
                onSelect={setSelectedConversation}
                onNew={() => createConversationMutation.mutate()}
                onDelete={(id) => deleteConversationMutation.mutate(id)}
                onRefresh={() => queryClient.invalidateQueries({ queryKey: ['coach-conversations'] })}
                loading={loadingConversations}
                error={conversationsError}
              />
            </CardContent>
          </Card>

          {/* Coach Avatar */}
          <Card className="nv-card--muted">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-pill bg-primary text-primary-foreground">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">AI Return-to-Work Coach</h3>
                  <p className="text-xs font-medium text-muted-foreground">Your 24/7 return-to-work guide</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contextual Sidebar Tools */}
          <div className="space-y-3">
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
        <div className="order-first flex h-[70vh] min-h-[480px] flex-col lg:order-none lg:sticky lg:top-24 lg:col-span-3 lg:h-[calc(100vh-9rem)] lg:min-h-[560px]">
          <Card className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="flex min-w-0 items-center gap-2 text-lg sm:text-xl">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span>Chat with Your Coach</span>
                </CardTitle>
                {currentConversation && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Refresh coaching conversation"
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['coach-conversations'] })}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-muted p-4 sm:p-6">
              {!isLoadingAuth && !isAuthenticated ? (
                <div className="flex min-h-full items-center justify-center">
                  <div className="max-w-xl space-y-5 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-pill bg-primary text-primary-foreground">
                      <MessageSquare className="h-10 w-10" />
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
                      <Button onClick={() => base44.auth.redirectToLogin()}>
                        Sign in to start chatting
                      </Button>
                    </div>
                  </div>
                </div>
              ) : !selectedConversation ? (
                <div className="flex min-h-full items-center justify-center">
                  <div className="max-w-md space-y-4 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-pill bg-primary text-primary-foreground">
                      <MessageSquare className="h-10 w-10" />
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
                        <Plus className="h-4 w-4" />
                        Start New Conversation
                      </Button>
                    </div>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex min-h-full items-center justify-center">
                  <div className="max-w-md space-y-4 text-center">
                    <Bot className="mx-auto h-16 w-16 text-primary" />
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
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Sentiment-based resource suggestions */}
            {lastUserMessage && selectedConversation && (
              <div className="bg-muted px-4 pb-2">
                <SentimentResourceSuggestions lastUserMessage={lastUserMessage} />
              </div>
            )}

            {/* Proactive library resource suggestions based on conversation context */}
            {messages.length >= 2 && (
              <ProactiveResourceSuggestions messages={messages} />
            )}

            {/* Input Area */}
            <div className="border-t border-border bg-brand-surface p-4">
              {chatError && (
                <p className="mb-2 text-sm font-semibold text-destructive" role="alert">{chatError}</p>
              )}
              <div className="flex gap-3">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message... (Shift+Enter for new line)"
                  aria-label="Message to your coach"
                  className="min-h-[60px] max-h-[200px] min-w-0 flex-1"
                  disabled={sendMessageMutation.isPending || (!isLoadingAuth && !isAuthenticated)}
                />
                <Button
                  onClick={handleSend}
                  disabled={!message.trim() || sendMessageMutation.isPending || (!isLoadingAuth && !isAuthenticated)}
                  size="icon"
                  aria-label="Send message to your coach"
                  className="self-end"
                >
                  {sendMessageMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
              {selectedConversation && (
                <p className="mt-2 text-xs font-medium text-muted-foreground">
                  Press Enter to send • Shift+Enter for new line
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}