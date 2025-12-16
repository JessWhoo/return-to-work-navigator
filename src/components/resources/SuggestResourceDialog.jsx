import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Sparkles } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function SuggestResourceDialog() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    url: '',
    description: '',
    category: '',
    type: 'WEBSITE',
    suggested_topics: [],
    notes: ''
  });
  const [topicInput, setTopicInput] = useState('');

  const submitSuggestionMutation = useMutation({
    mutationFn: (data) => base44.entities.ResourceSuggestion.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['resourceSuggestions']);
      toast.success('Thank you! Your suggestion has been submitted for review.');
      setOpen(false);
      resetForm();
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      organization: '',
      url: '',
      description: '',
      category: '',
      type: 'WEBSITE',
      suggested_topics: [],
      notes: ''
    });
    setTopicInput('');
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.url || !formData.description || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    submitSuggestionMutation.mutate(formData);
  };

  const addTopic = () => {
    if (topicInput.trim() && !formData.suggested_topics.includes(topicInput.trim())) {
      setFormData(prev => ({
        ...prev,
        suggested_topics: [...prev.suggested_topics, topicInput.trim()]
      }));
      setTopicInput('');
    }
  };

  const removeTopic = (topic) => {
    setFormData(prev => ({
      ...prev,
      suggested_topics: prev.suggested_topics.filter(t => t !== topic)
    }));
  };

  const categories = [
    'Cancer Organizations',
    'Financial Assistance',
    'Government Resources',
    'Articles & Publications',
    'Video Resources',
    'Support Groups',
    'Expert Interviews & Podcasts',
    'Professional Services',
    'Mental Health & Wellness',
    'Workshops & Webinars',
    'Stress Reduction & Mindfulness'
  ];

  const resourceTypes = [
    'WEBSITE', 'ARTICLE', 'VIDEO', 'GUIDE', 'PODCAST',
    'SUPPORT_GROUP', 'WORKSHOP', 'MEDITATION', 'TOOL', 'SERVICE'
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          <Plus className="h-4 w-4 mr-2" />
          Suggest a Resource
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <span>Suggest a New Resource</span>
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-2">
            Help others by suggesting valuable resources. Your submission will be reviewed before being added to the library.
          </p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Resource Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Cancer and Careers Toolkit"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Organization</label>
              <Input
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="e.g., Cancer and Careers"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">URL *</label>
            <Input
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://..."
              type="url"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Description *</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of what this resource provides..."
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select category...</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {resourceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Topics</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
                placeholder="Add topics (e.g., fatigue, legal rights)"
              />
              <Button type="button" onClick={addTopic} size="sm">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.suggested_topics.map(topic => (
                <Badge
                  key={topic}
                  variant="secondary"
                  className="cursor-pointer hover:bg-red-100"
                  onClick={() => removeTopic(topic)}
                >
                  {topic} ×
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Additional Notes</label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional context about why this resource would be helpful..."
              className="min-h-[60px]"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={handleSubmit}
              disabled={submitSuggestionMutation.isPending}
            >
              {submitSuggestionMutation.isPending ? 'Submitting...' : 'Submit Suggestion'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}