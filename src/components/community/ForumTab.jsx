import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ForumReplyComposer from '@/components/community/ForumReplyComposer';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Heart, ChevronDown, ChevronUp, User } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/lib/AuthContext';

const TOPICS = [
  { value: 'general', label: 'General', color: 'bg-brand-muted text-brand-text' },
  { value: 'fatigue_management', label: 'Fatigue', color: 'bg-brand-compass-cream text-brand-text' },
  { value: 'workplace_rights', label: 'Workplace Rights', color: 'bg-brand-sky text-brand-text' },
  { value: 'accommodations', label: 'Accommodations', color: 'bg-brand-primary text-primary-foreground' },
  { value: 'emotional_support', label: 'Emotional Support', color: 'bg-brand-accent text-brand-text' },
  { value: 'returning_to_work', label: 'Return to Work', color: 'bg-brand-secondary text-brand-text' },
  { value: 'resources', label: 'Resources', color: 'bg-brand-muted text-brand-text' },
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
      queryClient.invalidateQueries({ queryKey: ['forumReplies', post.id] });
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
    <div className="mt-4 space-y-3 border-t border-brand-border pt-4">
      {replies.map(reply => (
        <div key={reply.id} className="nv-card nv-card--muted p-4 text-sm">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <User className="h-3 w-3 text-brand-muted-foreground" />
            <span className="text-brand-primary font-medium text-xs">{reply.author_name}</span>
            <span className="text-brand-muted-foreground text-xs">{formatDistanceToNow(new Date(reply.created_date), { addSuffix: true })}</span>
          </div>
          <p className="text-brand-text [overflow-wrap:anywhere]">{reply.content}</p>
        </div>
      ))}
      <ForumReplyComposer text={replyText} anonymous={isAnon} onTextChange={setReplyText} onAnonymousChange={setIsAnon} onSubmit={handleSubmit} />
    </div>
  );
}

export default function ForumTab() {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const queryClient = useQueryClient();
  const [filterTopic, setFilterTopic] = useState('all');
  const [expandedPost, setExpandedPost] = useState(null);

  const { data: currentUser } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
    enabled: !isLoadingAuth && !!isAuthenticated,
  });

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['forumPosts', filterTopic],
    enabled: !isLoadingAuth && !!isAuthenticated,
    queryFn: () => filterTopic === 'all'
      ? base44.entities.ForumPost.list('-created_date', 50)
      : base44.entities.ForumPost.filter({ topic: filterTopic }, '-created_date', 50),
  });

  const likePost = useMutation({
    mutationFn: async (post) => {
      const liked = post.liked_by?.includes(currentUser?.email);
      const liked_by = liked
        ? post.liked_by.filter(e => e !== currentUser?.email)
        : [...(post.liked_by || []), currentUser?.email];
      return base44.entities.ForumPost.update(post.id, { liked_by, likes: liked_by.length });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['forumPosts'] })
  });

  const topicConfig = Object.fromEntries(TOPICS.map(t => [t.value, t]));

  return (
    <div className="space-y-4 mt-4">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" aria-pressed={filterTopic === 'all'} variant={filterTopic === 'all' ? 'default' : 'outline'} onClick={() => setFilterTopic('all')}>
          All Topics
        </Button>
        {TOPICS.map(t => (
          <Button key={t.value} size="sm" aria-pressed={filterTopic === t.value} variant={filterTopic === t.value ? 'default' : 'outline'} onClick={() => setFilterTopic(t.value)}>
            {t.label}
          </Button>
        ))}
      </div>
      {isLoading && <p className="text-brand-muted-foreground text-center py-8">Loading posts…</p>}
      {!isLoading && posts.length === 0 && (
        <div className="text-center py-12 text-brand-muted-foreground">
          <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p>No posts to show yet.</p>
        </div>
      )}
      {posts.map(post => {
        const tc = topicConfig[post.topic];
        const isExpanded = expandedPost === post.id;
        const liked = post.liked_by?.includes(currentUser?.email);
        return (
          <Card key={post.id}>
            <CardContent className="pt-5">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {tc && <Badge variant="outline" className={`${tc.color} rounded-pill text-xs`}>{tc.label}</Badge>}
                    <span className="text-brand-primary text-xs font-medium">{post.author_name}</span>
                    <span className="text-brand-muted-foreground text-xs">{formatDistanceToNow(new Date(post.created_date), { addSuffix: true })}</span>
                  </div>
                  <h3 className="text-brand-text font-semibold mb-1 [overflow-wrap:anywhere]">{post.title}</h3>
                  <p className="text-brand-text text-sm [overflow-wrap:anywhere]">{post.content}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-brand-border">
                <button aria-label="Like post" aria-pressed={!!liked} onClick={() => likePost.mutate(post)}
                  className={`nv-btn nv-btn--text nv-btn--sm ${liked ? 'text-brand-primary' : ''}`}>
                  <Heart className={`h-4 w-4 ${liked ? 'fill-brand-primary' : ''}`} />
                  {post.likes || 0}
                </button>
                <button aria-expanded={isExpanded} onClick={() => setExpandedPost(isExpanded ? null : post.id)} className="nv-btn nv-btn--text nv-btn--sm ml-auto">
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