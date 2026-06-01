import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, Send, Loader2, Sparkles, Plus, 
  Trash2, Bot, RefreshCw
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

export default function Coach() {
  useSEO({
    title: 'AI Coach',
    description: 'Chat with your AI return-to-work coach for personalized guidance, emotional support, and tailored advice on workplace accommodations.',
    path: '/Coach'
  });
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [lastUserMessage, setLastUserMessage] = useState('');

  // Load user progress for calendar insights
  const { data: progress } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const progressList = await base44.entities.UserProgress.list();
      if (progressList.length > 0) return progressList[0];
      return null;
    }
  });

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
      queryClient.invalidateQueries({ queryKey: ['coach-conversations'] });
      setSelectedConversation(newConv.id);
    }
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageText) => {
      setLastUserMessage(messageText);
      const conversation = conversations.find(c => c.id === selectedConversation);
      if (!conversation) throw new Error('No conversation selected');

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
      queryClient.invalidateQueries({ queryKey: ['coach-conversations'] });
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

    if (!selectedConversation) {
      const newConv = await base44.agents.createConversation({
        agent_name: 'return_to_work_coach',
        metadata: { name: 'New Conversation', created_at: new Date().toISOString() }
      });
      const convWithMessages = { ...newConv, messages: [] };
      setSelectedConversation(newConv.id);
      setConversations(prev => [convWithMessages, ...prev]);
      await base44.agents.addMessage(convWithMessages, { role: 'user', content: currentMessage });
      queryClient.invalidateQueries({ queryKey: ['coach-conversations'] });
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
      const conversation = conversations.find(c => c.id === selectedConversation);
      if (conversation) {
        await base44.agents.addMessage(conversation, { role: 'user', content: messageText });
      }
    }
    queryClient.invalidateQueries({ queryKey: ['coach-conversations'] });
  };

  const currentConversation = conversations.find(c => c.id === selectedConversation);
  const messages = currentConversation?.messages || [];

  if (loadingConversations) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center h-64">
        <div className="text-center space-y-3">
          <Loader2 className="h-10 w-10 animate-spin text-purple-300 mx-auto" />
          <p className="text-slate-100 text-sm font-medium">Loading your coach...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-16rem)] lg:h-[calc(100vh-12rem)] pb-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {/* Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-4 h-full overflow-y-auto">
          {/* Conversation History Panel */}
          <Card className="bg-slate-800/90 backdrop-blur-sm border-2 border-purple-600 flex flex-col" style={{ maxHeight: '50vh' }}>
            <CardContent className="pt-4 pb-4 flex flex-col flex-1 overflow-hidden">
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
          <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-600/60">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">AI Return-to-Work Coach</h3>
                  <p className="text-xs text-slate-200">Your 24/7 return-to-work guide</p>
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
        <div className="lg:col-span-3 flex flex-col h-full">
          <Card className="flex-1 flex flex-col bg-slate-800/90 backdrop-blur-sm border-2 border-purple-600 overflow-hidden">
            <CardHeader className="border-b border-slate-700">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Sparkles className="h-5 w-5 text-purple-300" />
                  <span>Chat with Your Coach</span>
                </CardTitle>
                {currentConversation && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['coach-conversations'] })}
                    className="text-slate-200 hover:text-white"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-900/50">
              {!selectedConversation ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4 max-w-md">
                    <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <MessageSquare className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        Welcome to Your AI Coach
                      </h3>
                      <p className="text-slate-100 mb-4 leading-relaxed">
                        Get personalized guidance for your return-to-work journey. Ask questions, share concerns, and receive tailored advice based on your progress data, symptoms, and current challenges.
                      </p>
                      <div className="space-y-2 mb-4 text-left max-w-sm mx-auto">
                        <p className="text-sm text-white font-semibold">I can help you with:</p>
                        <ul className="text-sm text-slate-100 space-y-1 ml-4">
                          <li>• Answering questions about your rights and accommodations</li>
                          <li>• Providing emotional support and encouragement</li>
                          <li>• Offering advice based on your energy, symptoms, and progress</li>
                          <li>• Navigating app features and finding resources</li>
                          <li>• Connecting insights from symptom analysis and health alerts</li>
                        </ul>
                      </div>
                      <Button
                        onClick={() => createConversationMutation.mutate()}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Start New Conversation
                      </Button>
                    </div>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4 max-w-md">
                    <Bot className="h-16 w-16 text-purple-300 mx-auto" />
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        Ready to Talk?
                      </h3>
                      <p className="text-slate-100 text-sm mb-3 leading-relaxed">
                        I have access to your journey stage, energy patterns, symptom logs, and progress data to provide personalized guidance.
                      </p>
                      <div className="text-left max-w-sm mx-auto bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-100">
                        <p className="font-semibold mb-2 text-white">Try asking about:</p>
                        <ul className="space-y-1 ml-4">
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
              <div className="px-4 pb-2 bg-slate-900/50">
                <SentimentResourceSuggestions lastUserMessage={lastUserMessage} />
              </div>
            )}

            {/* Proactive library resource suggestions based on conversation context */}
            {messages.length >= 2 && (
              <ProactiveResourceSuggestions messages={messages} />
            )}

            {/* Input Area */}
            <div className="border-t border-slate-700 p-4 bg-slate-800/90">
              <div className="flex gap-3">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message... (Shift+Enter for new line)"
                  className="flex-1 min-h-[60px] max-h-[200px] bg-slate-900 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500"
                  disabled={sendMessageMutation.isPending}
                />
                <Button
                  onClick={handleSend}
                  disabled={!message.trim() || sendMessageMutation.isPending}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 self-end"
                >
                  {sendMessageMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
              {selectedConversation && (
                <p className="text-xs text-slate-300 mt-2">
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