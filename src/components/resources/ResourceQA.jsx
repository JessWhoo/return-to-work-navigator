import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, ChevronDown, ChevronUp, Send, User, Reply, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

function QuestionItem({ post, currentUser }) {
  const queryClient = useQueryClient();
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyName, setReplyName] = useState(currentUser?.full_name || '');
  const [showReplyForm, setShowReplyForm] = useState(false);

  const { data: replies = [], isLoading: loadingReplies } = useQuery({
    queryKey: ['forum-replies', post.id],
    queryFn: () => base44.entities.ForumReply.filter({ post_id: post.id }, 'created_date', 50),
    enabled: showReplies,
  });

  const replyMutation = useMutation({
    mutationFn: async () => {
      const reply = await base44.entities.ForumReply.create({
        post_id: post.id,
        content: replyText.trim(),
        author_name: replyName.trim() || 'Community Member',
      });
      await base44.entities.ForumPost.update(post.id, { reply_count: (post.reply_count || 0) + 1 });
      return reply;
    },
    onSuccess: () => {
      setReplyText('');
      setShowReplyForm(false);
      queryClient.invalidateQueries(['forum-replies', post.id]);
      queryClient.invalidateQueries(['resource-qa', post.resource_id]);
    },
  });

  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
      {/* Question */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="font-semibold text-gray-800 text-sm">{post.title}</p>
            <p className="text-sm text-gray-600 mt-1">{post.content}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-3 text-xs text-gray-400 flex-wrap">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {post.author_name || 'Community Member'}
          </span>
          <span>{formatDistanceToNow(new Date(post.created_date), { addSuffix: true })}</span>
          <button
            onClick={() => { setShowReplies(!showReplies); }}
            className="flex items-center gap-1 text-purple-600 hover:text-purple-800 font-medium ml-auto"
          >
            <Reply className="h-3 w-3" />
            {post.reply_count || 0} {post.reply_count === 1 ? 'answer' : 'answers'}
            {showReplies ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>
      </div>

      {/* Replies */}
      {showReplies && (
        <div className="border-t border-gray-100 bg-purple-50/40">
          {loadingReplies ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {replies.length === 0 && (
                <p className="text-xs text-gray-400 px-4 py-3 italic">No answers yet — be the first to help!</p>
              )}
              {replies.map(reply => (
                <div key={reply.id} className="px-4 py-3">
                  <p className="text-sm text-gray-700">{reply.content}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                    <User className="h-3 w-3" />
                    <span>{reply.author_name || 'Community Member'}</span>
                    <span>{formatDistanceToNow(new Date(reply.created_date), { addSuffix: true })}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reply Form */}
          {showReplyForm ? (
            <div className="px-4 py-3 border-t border-purple-100 space-y-2">
              <Input
                placeholder="Your name (optional)"
                value={replyName}
                onChange={e => setReplyName(e.target.value)}
                className="h-8 text-xs border-purple-200"
              />
              <Textarea
                placeholder="Share your answer or experience..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                className="text-sm min-h-[70px] border-purple-200"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => replyMutation.mutate()}
                  disabled={!replyText.trim() || replyMutation.isPending}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-7"
                >
                  {replyMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3 mr-1" />}
                  Post Answer
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowReplyForm(false)} className="text-xs h-7">Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="px-4 py-2 border-t border-purple-100">
              <button
                onClick={() => setShowReplyForm(true)}
                className="text-xs text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1"
              >
                <Reply className="h-3 w-3" /> Write an answer
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ResourceQA({ resourceId, currentUser }) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionContent, setQuestionContent] = useState('');
  const [authorName, setAuthorName] = useState(currentUser?.full_name || '');

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['resource-qa', resourceId],
    queryFn: () => base44.entities.ForumPost.filter({ resource_id: resourceId, topic: 'resources' }, '-created_date', 20),
    enabled: isOpen,
  });

  const askMutation = useMutation({
    mutationFn: () =>
      base44.entities.ForumPost.create({
        title: questionTitle.trim(),
        content: questionContent.trim(),
        topic: 'resources',
        resource_id: resourceId,
        author_name: authorName.trim() || 'Community Member',
        reply_count: 0,
        likes: 0,
        liked_by: [],
      }),
    onSuccess: () => {
      setQuestionTitle('');
      setQuestionContent('');
      setShowForm(false);
      queryClient.invalidateQueries(['resource-qa', resourceId]);
    },
  });

  return (
    <div className="mt-3 border-t border-gray-100 pt-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900 transition-colors"
      >
        <MessageCircle className="h-4 w-4" />
        Community Q&amp;A
        {posts.length > 0 && (
          <Badge className="bg-indigo-100 text-indigo-700 text-xs px-1.5 py-0">{posts.length}</Badge>
        )}
        {isOpen ? <ChevronUp className="h-3.5 w-3.5 ml-auto" /> : <ChevronDown className="h-3.5 w-3.5 ml-auto" />}
      </button>

      {isOpen && (
        <div className="mt-3 space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
            </div>
          ) : (
            <>
              {posts.map(post => (
                <QuestionItem key={post.id} post={post} currentUser={currentUser} />
              ))}
              {posts.length === 0 && !showForm && (
                <p className="text-xs text-gray-400 italic">No questions yet. Be the first to ask!</p>
              )}
            </>
          )}

          {/* Ask Question Form */}
          {showForm ? (
            <div className="border-2 border-indigo-200 rounded-lg p-4 bg-indigo-50/40 space-y-3">
              <p className="text-xs font-semibold text-indigo-700">Ask a Question</p>
              <Input
                placeholder="Your name (optional)"
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                className="h-8 text-xs border-indigo-200"
              />
              <Input
                placeholder="Question title (e.g. 'How do I access this resource?')"
                value={questionTitle}
                onChange={e => setQuestionTitle(e.target.value)}
                className="text-sm border-indigo-200"
              />
              <Textarea
                placeholder="Add more detail about your question..."
                value={questionContent}
                onChange={e => setQuestionContent(e.target.value)}
                className="text-sm min-h-[80px] border-indigo-200"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => askMutation.mutate()}
                  disabled={!questionTitle.trim() || !questionContent.trim() || askMutation.isPending}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
                >
                  {askMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Send className="h-3 w-3 mr-1" />}
                  Post Question
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowForm(false)} className="text-xs">Cancel</Button>
              </div>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowForm(true)}
              className="border-indigo-300 text-indigo-700 hover:bg-indigo-50 text-xs w-full"
            >
              <MessageCircle className="h-3 w-3 mr-1.5" /> Ask a Question
            </Button>
          )}
        </div>
      )}
    </div>
  );
}