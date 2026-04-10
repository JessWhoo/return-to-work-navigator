import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Heart, Plus, ChevronDown, ChevronUp, Send, User } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

const TOPICS = [
  { value: 'general', label: 'General', color: 'bg-slate-500' },
  { value: 'fatigue_management', label: 'Fatigue', color: 'bg-amber-500' },
  { value: 'workplace_rights', label: 'Workplace Rights', color: 'bg-blue-500' },
  { value: 'accommodations', label: 'Accommodations', color: 'bg-purple-500' },
  { value: 'emotional_support', label: 'Emotional Support', color: 'bg-rose-500' },
  { value: 'returning_to_work', label: 'Return to Work', color: 'bg-teal-500' },
  { value: 'resources', label: 'Resources', color: 'bg-green-500' },
];

function ReplySection({ post, currentUser }) {
  const [replyText, setReplyText] = useState('');
  const [isAnon, setIsAnon] = useState(false);
  const queryClient = useQueryClient();

  const { data: replies = [] } = useQuery({
    queryKey: ['forumReplies', post.id],
    queryFn: () => base44.entities.ForumReply.filter({ post_id: post.id }, '-created_date'),
  });

  const addReply = useMutation({
    mutationFn: (data) => base44.entities.ForumReply.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['forumReplies', post.id]);
      setReplyText('');
      toast.success('Reply posted!');
    }
  });

  const handleSubmit = () => {
    if (!replyText.trim()) return;
    addReply.mutate({
      post_id: post.id,
      content: replyText.trim(),
      author_name: isAnon ? 'Anonymous' : (currentUser?.full_name || 'Member'),
      is_anonymous: isAnon,
      likes: 0,
      liked_by: []
    });
  };

  return (
    <div className="mt-4 space-y-3 border-t border-slate-600 pt-4">
      {replies.map(reply => (
        <div key={reply.id} className="bg-slate-800 rounded-lg p-3 text-sm">
          <div className="flex items-center gap-2 mb-1">
            <User className="h-3 w-3 text-slate-400" />
            <span className="text-teal-300 font-medium text-xs">{reply.author_name}</span>
            <span className="text-slate-500 text-xs">{formatDistanceToNow(new Date(reply.created_date), { addSuffix: true })}</span>
          </div>
          <p className="text-slate-200 leading-relaxed">{reply.content}</p>
        </div>
      ))}
      <div className="flex gap-2">
        <Input
          value={replyText}
          onChange={e => setReplyText(e.target.value)}
          placeholder="Write a reply..."
          className="bg-slate-700 border-slate-500 text-slate-200 placeholder:text-slate-500 text-sm"
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />
        <label className="flex items-center gap-1 text-xs text-slate-400 whitespace-nowrap cursor-pointer">
          <input type="checkbox" checked={isAnon} onChange={e => setIsAnon(e.target.checked)} className="rounded" />
          Anon
        </label>
        <Button size="sm" onClick={handleSubmit} className="bg-teal-600 hover:bg-teal-700 flex-shrink-0">
          <Send className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

export default function ForumTab() {
  const queryClient = useQueryClient();
  const [filterTopic, setFilterTopic] = useState('all');
  const [showNew, setShowNew] = useState(false);
  const [expandedPost, setExpandedPost] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', topic: 'general', is_anonymous: false });

  const { data: currentUser } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['forumPosts', filterTopic],
    queryFn: () => filterTopic === 'all'
      ? base44.entities.ForumPost.list('-created_date', 50)
      : base44.entities.ForumPost.filter({ topic: filterTopic }, '-created_date', 50),
  });

  const createPost = useMutation({
    mutationFn: (data) => base44.entities.ForumPost.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['forumPosts']);
      setShowNew(false);
      setForm({ title: '', content: '', topic: 'general', is_anonymous: false });
      toast.success('Post created!');
    }
  });

  const likePost = useMutation({
    mutationFn: async (post) => {
      const liked = post.liked_by?.includes(currentUser?.email);
      const liked_by = liked
        ? post.liked_by.filter(e => e !== currentUser?.email)
        : [...(post.liked_by || []), currentUser?.email];
      return base44.entities.ForumPost.update(post.id, { liked_by, likes: liked_by.length });
    },
    onSuccess: () => queryClient.invalidateQueries(['forumPosts'])
  });

  const handleSubmit = () => {
    if (!form.title.trim() || !form.content.trim()) return;
    createPost.mutate({
      ...form,
      author_name: form.is_anonymous ? 'Anonymous' : (currentUser?.full_name || 'Member'),
      likes: 0,
      liked_by: [],
      reply_count: 0
    });
  };

  const topicConfig = Object.fromEntries(TOPICS.map(t => [t.value, t]));

  return (
    <div className="space-y-4 mt-4">
      {/* Topic Filter */}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant={filterTopic === 'all' ? 'default' : 'outline'}
          onClick={() => setFilterTopic('all')}
          className={filterTopic === 'all' ? 'bg-teal-600' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}>
          All Topics
        </Button>
        {TOPICS.map(t => (
          <Button key={t.value} size="sm" variant={filterTopic === t.value ? 'default' : 'outline'}
            onClick={() => setFilterTopic(t.value)}
            className={filterTopic === t.value ? 'bg-teal-600' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}>
            {t.label}
          </Button>
        ))}
      </div>

      {/* New Post */}
      <Button onClick={() => setShowNew(!showNew)} className="bg-teal-600 hover:bg-teal-700 w-full">
        <Plus className="h-4 w-4 mr-2" /> New Post
      </Button>

      {showNew && (
        <Card className="bg-slate-800 border-teal-600 border-2">
          <CardContent className="pt-5 space-y-3">
            <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Post title..." className="bg-slate-700 border-slate-500 text-slate-200 placeholder:text-slate-400" />
            <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              placeholder="Share your thoughts, questions, or experiences..."
              rows={4} className="w-full bg-slate-700 border border-slate-500 text-slate-200 placeholder:text-slate-400 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500" />
            <div className="flex gap-3 items-center flex-wrap">
              <select value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                className="bg-slate-700 border border-slate-500 text-slate-200 rounded-md px-3 py-2 text-sm">
                {TOPICS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                <input type="checkbox" checked={form.is_anonymous} onChange={e => setForm(f => ({ ...f, is_anonymous: e.target.checked }))} className="rounded" />
                Post anonymously
              </label>
              <Button onClick={handleSubmit} className="ml-auto bg-teal-600 hover:bg-teal-700">Post</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts List */}
      {isLoading && <p className="text-slate-400 text-center py-8">Loading posts…</p>}
      {!isLoading && posts.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p>No posts yet. Be the first to start a conversation!</p>
        </div>
      )}
      {posts.map(post => {
        const tc = topicConfig[post.topic];
        const isExpanded = expandedPost === post.id;
        const liked = post.liked_by?.includes(currentUser?.email);
        return (
          <Card key={post.id} className="bg-slate-800 border-slate-600 hover:border-teal-600 transition-colors">
            <CardContent className="pt-5">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {tc && <Badge className={`${tc.color} text-white text-xs`}>{tc.label}</Badge>}
                    <span className="text-teal-300 text-xs font-medium">{post.author_name}</span>
                    <span className="text-slate-500 text-xs">{formatDistanceToNow(new Date(post.created_date), { addSuffix: true })}</span>
                  </div>
                  <h3 className="text-slate-100 font-semibold mb-1">{post.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{post.content}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-700">
                <button onClick={() => likePost.mutate(post)}
                  className={`flex items-center gap-1 text-sm transition-colors ${liked ? 'text-rose-400' : 'text-slate-400 hover:text-rose-400'}`}>
                  <Heart className={`h-4 w-4 ${liked ? 'fill-rose-400' : ''}`} />
                  {post.likes || 0}
                </button>
                <button onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                  className="flex items-center gap-1 text-sm text-slate-400 hover:text-teal-300 transition-colors ml-auto">
                  <MessageCircle className="h-4 w-4" />
                  Replies
                  {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
              </div>
              {isExpanded && <ReplySection post={post} currentUser={currentUser} />}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}