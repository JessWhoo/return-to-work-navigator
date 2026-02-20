import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Copy, Loader2, MessageSquare, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function AIIcebreakers({ progress }) {
  const [profileInfo, setProfileInfo] = useState({
    name: '',
    title: '',
    company: '',
    commonality: ''
  });
  const [showResults, setShowResults] = useState(false);

  // Generate icebreakers mutation
  const icebreakersMutation = useMutation({
    mutationFn: async (profileData) => {
      const prompt = `You are a LinkedIn networking coach helping a cancer survivor returning to work connect with professionals.

USER'S CONTEXT:
- Journey Stage: ${progress?.journey_stage || 'planning'}
- Return to Work Status: ${progress?.return_date ? 'Planning return' : 'In planning phase'}

TARGET PROFESSIONAL:
- Name: ${profileData.name || 'Professional'}
- Title: ${profileData.title || 'Not specified'}
- Company: ${profileData.company || 'Not specified'}
- Common Ground: ${profileData.commonality || 'Cancer survivorship, return to work'}

Generate 5 personalized LinkedIn icebreaker messages (100-150 characters each) that:
1. Are warm, professional, and authentic
2. Reference the common ground naturally
3. Show genuine interest in connecting
4. Are appropriate for a first connection request
5. Avoid being overly personal about health details
6. Focus on professional growth, shared interests, or mutual experiences

Also provide:
- 3 conversation starter questions to use after connecting
- 2 professional compliments based on their role/industry
- 1 personalized subject line for a message

Make them feel personal but professional, showing you've done your research.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            icebreakers: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  tone: { type: 'string', enum: ['warm', 'professional', 'casual', 'inspiring'] },
                  best_for: { type: 'string' }
                }
              }
            },
            conversation_starters: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  question: { type: 'string' },
                  context: { type: 'string' }
                }
              }
            },
            compliments: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            subject_line: { type: 'string' }
          }
        }
      });

      base44.analytics.track({
        eventName: 'linkedin_icebreakers_generated',
        properties: {
          has_common_ground: !!profileData.commonality,
          journey_stage: progress?.journey_stage
        }
      });

      return response;
    }
  });

  const handleGenerate = () => {
    if (!profileInfo.name && !profileInfo.title && !profileInfo.commonality) {
      toast.error('Please provide at least the person\'s name or some information');
      return;
    }
    setShowResults(true);
    icebreakersMutation.mutate(profileInfo);
  };

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
    
    base44.analytics.track({
      eventName: 'linkedin_icebreaker_copied',
      properties: {
        content_type: label
      }
    });
  };

  return (
    <Card className="bg-gradient-to-br from-pink-900/40 to-purple-900/40 border-2 border-pink-600">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-slate-200">
          <Sparkles className="h-5 w-5 text-pink-400" />
          <span>AI-Powered Icebreakers</span>
        </CardTitle>
        <p className="text-xs text-slate-400 mt-1">
          Generate personalized connection messages for LinkedIn professionals
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Form */}
        {!showResults && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Their Name</label>
                <Input
                  value={profileInfo.name}
                  onChange={(e) => setProfileInfo({ ...profileInfo, name: e.target.value })}
                  placeholder="Jane Smith"
                  className="bg-slate-700 border-slate-600 text-slate-200"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Their Title</label>
                <Input
                  value={profileInfo.title}
                  onChange={(e) => setProfileInfo({ ...profileInfo, title: e.target.value })}
                  placeholder="HR Director"
                  className="bg-slate-700 border-slate-600 text-slate-200"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Their Company</label>
              <Input
                value={profileInfo.company}
                onChange={(e) => setProfileInfo({ ...profileInfo, company: e.target.value })}
                placeholder="Acme Corp"
                className="bg-slate-700 border-slate-600 text-slate-200"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Common Ground / Why Connect</label>
              <Textarea
                value={profileInfo.commonality}
                onChange={(e) => setProfileInfo({ ...profileInfo, commonality: e.target.value })}
                placeholder="Both cancer survivors, shared interest in workplace inclusion, same industry..."
                className="bg-slate-700 border-slate-600 text-slate-200"
                rows={3}
              />
              <p className="text-xs text-slate-500 mt-1">
                What do you have in common? Why do you want to connect?
              </p>
            </div>
            <Button
              onClick={handleGenerate}
              disabled={icebreakersMutation.isPending}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
            >
              {icebreakersMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Personalized Messages...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Icebreakers
                </>
              )}
            </Button>
          </div>
        )}

        {/* Results */}
        {showResults && icebreakersMutation.data && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-300">Personalized for: {profileInfo.name || 'Professional'}</h4>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowResults(false);
                  setProfileInfo({ name: '', title: '', company: '', commonality: '' });
                }}
                className="text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                New Person
              </Button>
            </div>

            {/* Subject Line */}
            {icebreakersMutation.data.subject_line && (
              <div className="bg-slate-700/50 rounded-lg p-3 border border-pink-600/30">
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-pink-600 text-white text-xs">Subject Line</Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(icebreakersMutation.data.subject_line, 'Subject line')}
                    className="h-6 text-pink-400 hover:text-pink-300"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <p className="text-sm text-slate-300">{icebreakersMutation.data.subject_line}</p>
              </div>
            )}

            {/* Icebreakers */}
            <div>
              <h4 className="text-sm font-semibold text-slate-200 mb-2 flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-pink-400" />
                <span>Connection Request Messages</span>
              </h4>
              <div className="space-y-2">
                {icebreakersMutation.data.icebreakers?.map((icebreaker, idx) => (
                  <div key={idx} className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-purple-600 text-white text-xs capitalize">{icebreaker.tone}</Badge>
                        <span className="text-xs text-slate-500">{icebreaker.best_for}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(icebreaker.message, 'Message')}
                        className="h-6 text-pink-400 hover:text-pink-300"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <p className="text-sm text-slate-300">{icebreaker.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Conversation Starters */}
            {icebreakersMutation.data.conversation_starters && icebreakersMutation.data.conversation_starters.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-200 mb-2">After Connecting - Conversation Starters</h4>
                <div className="space-y-2">
                  {icebreakersMutation.data.conversation_starters.map((starter, idx) => (
                    <div key={idx} className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-xs text-slate-500">{starter.context}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(starter.question, 'Question')}
                          className="h-6 text-pink-400 hover:text-pink-300"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-slate-300">{starter.question}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Compliments */}
            {icebreakersMutation.data.compliments && icebreakersMutation.data.compliments.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-200 mb-2">Professional Compliments</h4>
                <div className="space-y-2">
                  {icebreakersMutation.data.compliments.map((compliment, idx) => (
                    <div key={idx} className="bg-slate-700/50 rounded-lg p-2 border border-slate-600 flex items-center justify-between">
                      <p className="text-sm text-slate-300">{compliment}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(compliment, 'Compliment')}
                        className="h-6 text-pink-400 hover:text-pink-300"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {showResults && icebreakersMutation.isPending && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-pink-400 mx-auto mb-3" />
            <p className="text-slate-400">Crafting personalized icebreakers...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}