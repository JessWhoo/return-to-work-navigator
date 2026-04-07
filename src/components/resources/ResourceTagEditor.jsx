import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tag, Sparkles, X, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ResourceTagEditor({ resource, progress }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [generating, setGenerating] = useState(false);

  // AI-generated tags stored under resource_ai_tags in UserProgress (object: resourceId -> string[])
  const aiTags = progress?.resource_ai_tags?.[resource.id] || [];
  // Manual user tags stored under resource_custom_tags (object: resourceId -> string[])
  const customTags = progress?.resource_custom_tags?.[resource.id] || [];
  const allTags = [...new Set([...aiTags, ...customTags])];

  const saveTagsMutation = useMutation({
    mutationFn: async ({ ai, custom }) => {
      const updatedAI = { ...(progress?.resource_ai_tags || {}), [resource.id]: ai };
      const updatedCustom = { ...(progress?.resource_custom_tags || {}), [resource.id]: custom };
      return await base44.entities.UserProgress.update(progress.id, {
        resource_ai_tags: updatedAI,
        resource_custom_tags: updatedCustom
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userProgress']);
    }
  });

  const handleGenerateAITags = async () => {
    setGenerating(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate 5-8 concise, relevant tags for this resource that would help a cancer survivor find it via search. Tags should be lowercase, 1-3 words each, covering the main topics, audience, and use case.

Resource: "${resource.name}"
Organization: "${resource.org}"
Description: "${resource.description}"
Existing topics: ${(resource.topics || []).join(', ')}
Type: ${resource.type}

Return ONLY a JSON array of tag strings. Example: ["return to work", "fatigue", "workplace accommodations", "legal rights"]`,
        response_json_schema: {
          type: 'object',
          properties: {
            tags: { type: 'array', items: { type: 'string' } }
          }
        }
      });
      const tags = result?.tags || [];
      const currentCustom = progress?.resource_custom_tags?.[resource.id] || [];
      await saveTagsMutation.mutateAsync({ ai: tags, custom: currentCustom });
      toast.success(`Generated ${tags.length} AI tags`);
    } catch {
      toast.error('Failed to generate tags');
    } finally {
      setGenerating(false);
    }
  };

  const handleAddCustomTag = () => {
    const trimmed = newTag.trim().toLowerCase();
    if (!trimmed || customTags.includes(trimmed) || aiTags.includes(trimmed)) {
      setNewTag('');
      return;
    }
    const updated = [...customTags, trimmed];
    saveTagsMutation.mutate({ ai: aiTags, custom: updated });
    setNewTag('');
  };

  const handleRemoveTag = (tag, isAI) => {
    if (isAI) {
      saveTagsMutation.mutate({ ai: aiTags.filter(t => t !== tag), custom: customTags });
    } else {
      saveTagsMutation.mutate({ ai: aiTags, custom: customTags.filter(t => t !== tag) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 transition-colors">
          <Tag className="h-3 w-3" />
          {allTags.length > 0 ? `${allTags.length} tags` : 'Add tags'}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base">Tags for: {resource.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* AI Generate */}
          <Button
            onClick={handleGenerateAITags}
            disabled={generating}
            size="sm"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
          >
            {generating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
            {generating ? 'Generating...' : 'Auto-generate AI Tags'}
          </Button>

          {/* AI Tags */}
          {aiTags.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-purple-500" /> AI-generated tags
              </p>
              <div className="flex flex-wrap gap-2">
                {aiTags.map(tag => (
                  <Badge key={tag} className="bg-purple-100 text-purple-800 border border-purple-300 flex items-center gap-1 pr-1">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag, true)} className="hover:text-red-600 transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Custom Tags */}
          {customTags.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2">Your custom tags</p>
              <div className="flex flex-wrap gap-2">
                {customTags.map(tag => (
                  <Badge key={tag} className="bg-teal-100 text-teal-800 border border-teal-300 flex items-center gap-1 pr-1">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag, false)} className="hover:text-red-600 transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Add custom tag */}
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustomTag()}
              placeholder="Add custom tag..."
              className="text-sm"
            />
            <Button onClick={handleAddCustomTag} size="sm" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-xs text-gray-400">Tags help you search and filter resources more effectively.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}