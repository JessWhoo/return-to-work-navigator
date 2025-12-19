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

export default function Coach() {
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);

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
  const { data: conversationsList, isLoading: loadingConversations } = useQuery({
    queryKey: ['coach-conversations'],
    queryFn: async () => {
      const convs = await base44.agents.listConversations({
        agent_name: 'return_to_work_coach'
      });
      return convs || [];
    }
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
      const conversation = conversations.find(c => c.id === selectedConversation);
      if (!conversation) throw new Error('No conversation selected');

      return await base44.agents.addMessage(conversation, {
        role: 'user',
        content: messageText
      });
    },
    onSuccess: () => {
      setMessage('');
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

  const handleSend = () => {
    if (!message.trim()) return;
    
    if (!selectedConversation) {
      createConversationMutation.mutate();
      setTimeout(() => {
        sendMessageMutation.mutate(message);
      }, 500);
    } else {
      sendMessageMutation.mutate(message);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickMessage = (messageText) => {
    setMessage(messageText);
    // Auto-send after a brief delay
    setTimeout(() => {
      if (!selectedConversation) {
        createConversationMutation.mutate();
        setTimeout(() => {
          sendMessageMutation.mutate(messageText);
        }, 500);
      } else {
        sendMessageMutation.mutate(messageText);
      }
    }, 100);
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

          {/* Calendar Insights */}
          {progress && (
            <div className="space-y-4">
              <ProactiveCalendarInsights 
                progress={progress} 
                onSendMessage={handleQuickMessage}
              />
            </div>
          )}

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
                        Get personalized guidance for your return-to-work journey. Ask questions, share concerns, and receive tailored advice.
                      </p>
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
                        Start the Conversation
                      </h3>
                      <p className="text-slate-400 text-sm">
                        Try asking about accommodations, energy management, communication strategies, or any challenges you're facing.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <AnimatePresence>
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <MessageBubble message={msg} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

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