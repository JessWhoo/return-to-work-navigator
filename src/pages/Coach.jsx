import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, Send, Loader2, Sparkles, Plus, 
  Trash2, Bot, User as UserIcon, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from '../components/coach/MessageBubble';
import ProactiveCalendarInsights from '../components/coach/ProactiveCalendarInsights';
import SuggestedQuestions from '../components/coach/SuggestedQuestions';
import AppFeatureGuide from '../components/coach/AppFeatureGuide';
import SentimentResourceSuggestions, { detectSentimentAndResources } from '../components/coach/SentimentResourceSuggestions';

export default function Coach() {
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
    retry: 1
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
      queryClient.invalidateQueries(['coach-conversations']);
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
      queryClient.invalidateQueries(['coach-conversations']);
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
      queryClient.invalidateQueries(['coach-conversations']);
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
    queryClient.invalidateQueries(['coach-conversations']);
  };

  const currentConversation = conversations.find(c => c.id === selectedConversation);
  const messages = currentConversation?.messages || [];

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-12rem)]">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {/* Sidebar - Conversations */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-slate-800/90 backdrop-blur-sm border-2 border-purple-600">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-slate-200">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Conversations</span>
                </div>
                <Button
                  size="sm"
                  onClick={() => createConversationMutation.mutate()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[calc(100vh-20rem)] overflow-y-auto">
              {loadingConversations ? (
                <div className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
                </div>
              ) : conversationsError ? (
                <div className="text-center py-8 text-red-400 text-xs">
                  <p className="font-semibold mb-2">Error loading conversations</p>
                  <p className="text-slate-400">{conversationsError.message}</p>
                  <Button
                    size="sm"
                    onClick={() => queryClient.invalidateQueries(['coach-conversations'])}
                    className="mt-3 bg-slate-600 hover:bg-slate-500"
                  >
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Retry
                  </Button>
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No conversations yet.<br />Start a new one!
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedConversation === conv.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {conv.metadata?.name || 'Conversation'}
                        </p>
                        <p className="text-xs opacity-75 truncate">
                          {conv.messages?.length || 0} messages
                        </p>
                      </div>
                      {selectedConversation === conv.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteConversationMutation.mutate(conv.id);
                          }}
                          className="ml-2 p-1 hover:bg-purple-700 rounded"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </button>
                ))
              )}
            </CardContent>
          </Card>

          {/* Sidebar Content */}
          <div className="space-y-4">
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

          {/* Coach Info */}
          <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-2 border-purple-600">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-200">AI Return-to-Work Coach</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Your 24/7 guide for navigating your return to work journey
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-3 flex flex-col h-full">
          <Card className="flex-1 flex flex-col bg-slate-800/90 backdrop-blur-sm border-2 border-purple-600 overflow-hidden">
            <CardHeader className="border-b border-slate-700">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2 text-slate-200">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  <span>Chat with Your Coach</span>
                </CardTitle>
                {currentConversation && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => queryClient.invalidateQueries(['coach-conversations'])}
                    className="text-slate-400 hover:text-slate-200"
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
                      <h3 className="text-xl font-bold text-slate-200 mb-2">
                        Welcome to Your AI Coach
                      </h3>
                      <p className="text-slate-400 mb-4">
                        Get personalized guidance for your return-to-work journey. Ask questions, share concerns, and receive tailored advice based on your progress data, symptoms, and current challenges.
                      </p>
                      <div className="space-y-2 mb-4 text-left max-w-sm mx-auto">
                        <p className="text-sm text-slate-300 font-semibold">I can help you with:</p>
                        <ul className="text-xs text-slate-400 space-y-1 ml-4">
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
                    <Bot className="h-16 w-16 text-purple-400 mx-auto" />
                    <div>
                      <h3 className="text-lg font-bold text-slate-200 mb-2">
                        Ready to Talk?
                      </h3>
                      <p className="text-slate-400 text-sm mb-3">
                        I have access to your journey stage, energy patterns, symptom logs, and progress data to provide personalized guidance.
                      </p>
                      <div className="text-left max-w-sm mx-auto bg-slate-800 rounded-lg p-3 text-xs text-slate-300">
                        <p className="font-semibold mb-2">Try asking about:</p>
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

            {/* Input Area */}
            <div className="border-t border-slate-700 p-4 bg-slate-800/90">
              <div className="flex gap-3">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message... (Shift+Enter for new line)"
                  className="flex-1 min-h-[60px] max-h-[200px] bg-slate-900 border-slate-600 text-slate-200 placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500"
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
                <p className="text-xs text-slate-500 mt-2">
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