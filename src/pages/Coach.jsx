import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, Send, Sparkles, Clock, CheckCircle2, 
  Zap, Heart, Loader2, Plus, TrendingUp, Trash2, X
} from 'lucide-react';
import MessageBubble from '../components/coach/MessageBubble';
import ProactiveSuggestions from '../components/coach/ProactiveSuggestions';
import ReflectionPrompts from '../components/coach/ReflectionPrompts';
import UpcomingEvents from '../components/coach/UpcomingEvents';
import ActionPlanGenerator from '../components/coach/ActionPlanGenerator';
import SmartInsights from '../components/coach/SmartInsights';

export default function Coach() {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const { data: progress } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const progressList = await base44.entities.UserProgress.list();
      return progressList[0] || null;
    }
  });

  useEffect(() => {
    loadConversations();
    
    // Check for pending message from Resources page
    const pendingMessage = localStorage.getItem('pendingCoachMessage');
    if (pendingMessage) {
      localStorage.removeItem('pendingCoachMessage');
      setInputMessage(pendingMessage);
    }
  }, []);

  useEffect(() => {
    if (currentConversation?.id) {
      setMessages(currentConversation.messages || []);
      const unsubscribe = base44.agents.subscribeToConversation(
        currentConversation.id,
        (data) => {
          setMessages(data.messages || []);
          setIsSending(false);
          setTimeout(scrollToBottom, 100);
        }
      );
      return () => unsubscribe();
    }
  }, [currentConversation?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const convos = await base44.agents.listConversations({
        agent_name: 'return_to_work_coach'
      });
      
      setConversations(convos);
      
      if (convos.length > 0 && !currentConversation) {
        await selectConversation(convos[0]);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectConversation = async (conversation) => {
    try {
      const convoId = conversation.id || conversation;
      const fullConvo = await base44.agents.getConversation(convoId);
      setCurrentConversation(fullConvo);
      setMessages(fullConvo.messages || []);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const createNewConversation = async () => {
    setIsCreatingConversation(true);
    try {
      const newConvo = await base44.agents.createConversation({
        agent_name: 'return_to_work_coach',
        metadata: {
          name: `Chat ${new Date().toLocaleDateString()}`,
          created_at: new Date().toISOString()
        }
      });
      
      // Add to conversations list
      setConversations(prev => [newConvo, ...prev]);
      setCurrentConversation(newConvo);
      setMessages([]);
      
      return newConvo;
    } catch (error) {
      console.error('Error creating conversation:', error);
    } finally {
      setIsCreatingConversation(false);
    }
  };

  const deleteConversation = async (conversationId) => {
    try {
      await base44.agents.deleteConversation(conversationId);
      
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
      }
      
      await loadConversations();
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const resetAllConversations = async () => {
    if (!window.confirm('Are you sure you want to delete all conversations? This cannot be undone.')) {
      return;
    }
    
    try {
      for (const convo of conversations) {
        await base44.agents.deleteConversation(convo.id);
      }
      
      setCurrentConversation(null);
      setMessages([]);
      setConversations([]);
    } catch (error) {
      console.error('Error resetting conversations:', error);
    }
  };

  const sendMessage = async (customMessage = null) => {
    const messageText = customMessage || inputMessage.trim();
    if (!messageText || isSending) return;

    if (!customMessage) setInputMessage('');
    setIsSending(true);

    try {
      let conversationToUse = currentConversation;
      
      // Create conversation if none exists
      if (!conversationToUse) {
        conversationToUse = await createNewConversation();
        if (!conversationToUse) {
          setIsSending(false);
          return;
        }
      }

      await base44.agents.addMessage(conversationToUse, {
        role: 'user',
        content: messageText
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setIsSending(false);
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    const message = `I'd like to discuss this insight: ${suggestion.title}\n\n${suggestion.insight}\n\nCan you help me with this?`;
    await sendMessage(message);
  };

  const handleReflectionShare = async (reflectionText) => {
    await sendMessage(reflectionText);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(null);
    }
  };

  const getProgressSummary = () => {
    if (!progress) return null;
    
    return {
      stage: progress.journey_stage,
      completedItems: progress.completed_checklist_items?.length || 0,
      energyLogs: progress.energy_logs?.length || 0,
      accommodations: progress.accommodations_requested?.length || 0
    };
  };

  const progressSummary = getProgressSummary();

  const starterPrompts = [
    "I'm anxious about my first day back. What should I expect?",
    "Help me understand what accommodations I should request",
    "I'm struggling with fatigue. What strategies can help?",
    "How do I talk to my boss about my limitations?",
    "Analyze my progress and give me personalized advice"
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 className="h-12 w-12 text-purple-600 animate-spin mx-auto" />
          <p className="text-slate-300">Loading AI Coach...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-12rem)]">
      <div className="grid lg:grid-cols-4 gap-6 h-full">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <span>Your AI Coach</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-700">
              <p>I'm here to support your return-to-work journey with personalized guidance and encouragement.</p>
              
              {progressSummary && (
                <div className="bg-white/60 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Journey Stage</span>
                    <Badge variant="secondary" className="capitalize text-xs">
                      {progressSummary.stage.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{progressSummary.completedItems}</div>
                      <div className="text-xs text-gray-500">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-pink-600">{progressSummary.energyLogs}</div>
                      <div className="text-xs text-gray-500">Logs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-teal-600">{progressSummary.accommodations}</div>
                      <div className="text-xs text-gray-500">Requests</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Conversations</CardTitle>
                <div className="flex gap-1">
                  {conversations.length > 0 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={resetAllConversations}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      title="Delete all conversations"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={createNewConversation}
                    disabled={isCreatingConversation}
                    className="h-8 w-8 p-0"
                  >
                    {isCreatingConversation ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[300px] overflow-y-auto">
              {conversations.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No conversations yet
                </p>
              ) : (
                conversations.map((convo) => (
                  <div
                    key={convo.id}
                    className={`relative group rounded-lg transition-all ${
                      currentConversation?.id === convo.id
                        ? 'bg-purple-100 border-2 border-purple-300'
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <button
                      onClick={() => selectConversation(convo)}
                      className="w-full text-left p-3 pr-10"
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <MessageCircle className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium truncate">
                          {convo.metadata?.name || 'Conversation'}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(convo.created_date).toLocaleDateString()}
                      </span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(convo.id);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                      title="Delete conversation"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                ))
              )}
            </CardContent>
            </Card>

            {/* Smart Insights */}
            {progress && (
              <SmartInsights 
                progress={progress}
                onAskCoach={sendMessage}
              />
            )}

            {/* Action Plan Generator */}
            {progress && (
              <ActionPlanGenerator 
                progress={progress}
                onSendToCoach={sendMessage}
              />
            )}

            {/* Upcoming Events */}
            {progress && (
              <UpcomingEvents 
                progress={progress}
                onAskCoach={sendMessage}
              />
            )}

            {/* Proactive Suggestions */}
            {progress && (
            <ProactiveSuggestions 
              progress={progress} 
              onSelectSuggestion={handleSuggestionClick}
            />
            )}

            {/* Reflection Prompts */}
            <ReflectionPrompts onSendToCoach={handleReflectionShare} />
            </div>

            {/* Main Chat Area */}
        <div className="lg:col-span-3 flex flex-col h-full">
          <Card className="flex-1 flex flex-col bg-white/80 backdrop-blur-sm overflow-hidden">
            {!currentConversation ? (
              <CardContent className="flex-1 flex flex-col items-center justify-center p-8">
                <Sparkles className="h-16 w-16 text-purple-300 mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Your AI Coach</h3>
                <p className="text-gray-600 text-center mb-6 max-w-md">
                  Start a conversation to get personalized guidance on your return-to-work journey
                </p>
                <Button
                  onClick={createNewConversation}
                  disabled={isCreatingConversation}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isCreatingConversation ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Start New Conversation
                    </>
                  )}
                </Button>
              </CardContent>
            ) : (
              <>
                {/* Messages Area */}
                <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.length === 0 && (
                    <div className="space-y-6 py-8">
                      <div className="text-center">
                        <Heart className="h-12 w-12 text-rose-400 mx-auto mb-3" />
                        <p className="text-gray-600">How can I support you today?</p>
                      </div>
                      
                      <div className="grid gap-3 max-w-2xl mx-auto">
                        {starterPrompts.map((prompt, index) => (
                          <button
                            key={index}
                            onClick={() => sendMessage(prompt)}
                            className="text-left p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border border-purple-200 transition-all text-sm text-gray-700"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {messages.map((message, index) => (
                    <MessageBubble key={index} message={message} />
                  ))}
                  
                  {isSending && (
                    <div className="flex items-center space-x-3">
                      <div className="h-7 w-7 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Loader2 className="h-4 w-4 text-purple-600 animate-spin" />
                      </div>
                      <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2.5">
                        <p className="text-sm text-gray-500">Thinking...</p>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Input Area */}
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="flex space-x-3">
                    <Textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about returning to work..."
                      className="flex-1 min-h-[60px] max-h-[120px] resize-none"
                      disabled={isSending}
                    />
                    <Button
                      onClick={() => sendMessage(null)}
                      disabled={!inputMessage.trim() || isSending}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-[60px]"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Press Enter to send, Shift+Enter for new line
                  </p>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}