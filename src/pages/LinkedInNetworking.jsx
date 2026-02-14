import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Share2, Users, Sparkles, Loader2, CheckCircle2, Lightbulb, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function LinkedInNetworking() {
  const queryClient = useQueryClient();
  const [postText, setPostText] = useState('');
  const [visibility, setVisibility] = useState('PUBLIC');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch LinkedIn profile
  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['linkedinProfile'],
    queryFn: async () => {
      const response = await base44.functions.invoke('linkedinProfile', {});
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      return response.data.profile;
    },
    retry: false
  });

  // Fetch user progress for suggestions
  const { data: progress } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const progressList = await base44.entities.UserProgress.list();
      return progressList[0] || null;
    }
  });

  // Generate AI suggestions
  const suggestionsMutation = useMutation({
    mutationFn: async () => {
      const prompt = `You are a professional LinkedIn content advisor for cancer survivors returning to work.

User's Journey Stage: ${progress?.journey_stage || 'planning'}
Return Date: ${progress?.return_date || 'not set'}

Generate 3 professional LinkedIn post suggestions that:
1. Are empowering and positive about their return-to-work journey
2. Can help connect with other cancer survivor professionals
3. Maintain appropriate professional boundaries
4. Use hashtags like #CancerSurvivor #ReturnToWork #Resilience
5. Are 100-200 characters each

Make them authentic, hopeful, and suitable for professional networking.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            suggestions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  text: { type: 'string' },
                  tone: { type: 'string', enum: ['inspirational', 'informative', 'milestone'] }
                }
              }
            }
          },
          required: ['suggestions']
        }
      });

      return response.suggestions;
    }
  });

  // Share post mutation
  const sharePostMutation = useMutation({
    mutationFn: async ({ text, visibility }) => {
      const response = await base44.functions.invoke('linkedinShareUpdate', {
        text,
        visibility
      });
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      
      return response.data;
    },
    onSuccess: () => {
      toast.success('Posted to LinkedIn successfully!');
      setPostText('');
      
      base44.analytics.track({
        eventName: 'linkedin_post_shared',
        properties: {
          visibility,
          journey_stage: progress?.journey_stage
        }
      });
    },
    onError: (error) => {
      toast.error(`Failed to post: ${error.message}`);
    }
  });

  const handleShare = () => {
    if (!postText.trim()) {
      toast.error('Please enter some text');
      return;
    }
    sharePostMutation.mutate({ text: postText, visibility });
  };

  const handleUseSuggestion = (suggestion) => {
    setPostText(suggestion.text);
    setShowSuggestions(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
          LinkedIn Professional Network
        </h1>
        <p className="text-slate-400">
          Connect with other cancer survivor professionals and share your journey
        </p>
      </div>

      {/* Profile Card */}
      {!profile && !profileLoading ? (
        <Card className="bg-slate-800/90 border-2 border-amber-600">
          <CardContent className="py-8 text-center">
            <Users className="h-12 w-12 text-amber-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-200 mb-2">Connect Your LinkedIn Account</h3>
            <p className="text-slate-400 text-sm mb-4">
              Authorize LinkedIn to share your return-to-work journey and connect with other cancer survivor professionals
            </p>
            <p className="text-xs text-slate-500 mb-4">
              To enable this feature, contact your app administrator to authorize LinkedIn from the dashboard settings.
            </p>
            <Badge className="bg-amber-600 text-white">Authorization Required</Badge>
          </CardContent>
        </Card>
      ) : profileLoading ? (
        <Card className="bg-slate-800/90 border-2 border-blue-600">
          <CardContent className="py-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-3" />
            <p className="text-slate-400">Connecting to LinkedIn...</p>
          </CardContent>
        </Card>
      ) : profile ? (
        <Card className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border-2 border-blue-600">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-200">
              <Users className="h-5 w-5 text-blue-400" />
              <span>Connected Profile</span>
              <Badge className="bg-green-600 text-white">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              {profile.picture && (
                <img 
                  src={profile.picture} 
                  alt={profile.name}
                  className="w-16 h-16 rounded-full border-2 border-blue-400"
                />
              )}
              <div>
                <p className="text-lg font-semibold text-slate-200">{profile.name}</p>
                <p className="text-sm text-slate-400">{profile.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Share Update Card */}
      {profile && (
      <Card className="bg-slate-800/90 border-2 border-purple-600">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-200">
            <Share2 className="h-5 w-5 text-purple-400" />
            <span>Share Your Journey</span>
          </CardTitle>
          <p className="text-xs text-slate-400 mt-1">
            Share updates about your return-to-work journey with your professional network
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* AI Suggestions */}
          <div className="space-y-2">
            <Button
              onClick={() => {
                setShowSuggestions(!showSuggestions);
                if (!showSuggestions && !suggestionsMutation.data) {
                  suggestionsMutation.mutate();
                }
              }}
              variant="outline"
              className="w-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500 text-purple-300 hover:bg-purple-600/30"
              disabled={suggestionsMutation.isPending}
            >
              {suggestionsMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Suggestions...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get AI-Powered Post Suggestions
                </>
              )}
            </Button>

            {showSuggestions && suggestionsMutation.data && (
              <div className="space-y-2 mt-3">
                {suggestionsMutation.data.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleUseSuggestion(suggestion)}
                    className="w-full text-left p-3 bg-slate-700 hover:bg-slate-600 rounded-lg border border-slate-600 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <Badge className="bg-purple-600 text-white text-xs capitalize">
                        {suggestion.tone}
                      </Badge>
                      <Lightbulb className="h-4 w-4 text-purple-400" />
                    </div>
                    <p className="text-sm text-slate-300">{suggestion.text}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Post Composer */}
          <div className="space-y-3">
            <Textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Share your return-to-work journey, celebrate a milestone, or connect with other survivors..."
              className="min-h-[150px] bg-slate-900 border-slate-600 text-slate-200 placeholder:text-slate-500"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-slate-400">Visibility:</label>
                <Select value={visibility} onValueChange={setVisibility}>
                  <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PUBLIC">Public</SelectItem>
                    <SelectItem value="CONNECTIONS">Connections Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleShare}
                disabled={!postText.trim() || sharePostMutation.isPending}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                {sharePostMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Post to LinkedIn
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      )}

      {/* Networking Tips */}
      <Card className="bg-gradient-to-br from-teal-900/40 to-green-900/40 border-2 border-teal-600">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-200">
            <Lightbulb className="h-5 w-5 text-teal-400" />
            <span>Networking Tips for Cancer Survivors</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-300">
          <div className="flex items-start space-x-2">
            <span className="text-teal-400 mt-0.5">✓</span>
            <p><strong>Be authentic:</strong> Share your journey genuinely while maintaining professional boundaries</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-teal-400 mt-0.5">✓</span>
            <p><strong>Use hashtags:</strong> #CancerSurvivor #ReturnToWork #Resilience #WorkplaceInclusion</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-teal-400 mt-0.5">✓</span>
            <p><strong>Connect with others:</strong> Search for cancer survivor groups and professional networks</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-teal-400 mt-0.5">✓</span>
            <p><strong>Share milestones:</strong> Celebrate return-to-work anniversaries and achievements</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-teal-400 mt-0.5">✓</span>
            <p><strong>Offer support:</strong> Comment on and support other survivors' posts</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}