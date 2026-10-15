import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, MessageCircleQuestion } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import QACard from './QACard';
import AskQuestionDialog from './AskQuestionDialog';
import { TOPICS, FEATURED_EXPERT_QAS } from './expertQaData';

export default function ExpertQASection() {
  const qc = useQueryClient();
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [search, setSearch] = useState('');
  const [askOpen, setAskOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);

  // This section is on a public route — anonymous visitors can browse. Don't
  // retry on 401 (that just produces console noise for a normal state) and
  // treat "not signed in" as `null` rather than a query error.
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try { return await base44.auth.me(); }
      catch { return null; }
    },
    retry: false,
    staleTime: 60_000,
  });
  const { toast } = useToast();

  const { data: rawQaList = [] } = useQuery({
    queryKey: ['expertQA'],
    queryFn: async () => {
      try {
        return await base44.entities.ExpertQA.list('-created_date', 200);
      } catch {
        return [];
      }
    },
  });

  const qaList = rawQaList.length > 0 ? rawQaList : FEATURED_EXPERT_QAS;

  const filtered = useMemo(() => {
    let items = qaList;
    if (selectedTopic !== 'all') items = items.filter(q => q.topic === selectedTopic);
    if (search.trim()) {
      const s = search.toLowerCase();
      items = items.filter(q =>
        q.question?.toLowerCase().includes(s) ||
        q.answer?.toLowerCase().includes(s) ||
        q.question_details?.toLowerCase().includes(s)
      );
    }
    // Featured first, then answered, then pending
    return [...items].sort((a, b) => {
      const order = { featured: 0, answered: 1, pending: 2 };
      return (order[a.status] ?? 3) - (order[b.status] ?? 3);
    });
  }, [qaList, selectedTopic, search]);

  const topicCounts = useMemo(() => {
    const counts = { all: qaList.length };
    TOPICS.forEach(t => { if (t.id !== 'all') counts[t.id] = 0; });
    qaList.forEach(q => { counts[q.topic] = (counts[q.topic] || 0) + 1; });
    return counts;
  }, [qaList]);

  const markHelpful = useMutation({
    mutationFn: async (item) => {
      if (!currentUser) {
        toast({
          title: 'Sign in required',
          description: 'Please sign in to mark answers as helpful.',
        });
        return;
      }
      return base44.functions.invoke('markQAHelpful', { qaId: item.id });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['expertQA'] }),
  });

  const answeredCount = qaList.filter(q => q.status === 'answered' || q.status === 'featured').length;

  return (
    <div className="space-y-6 [overflow-wrap:anywhere]">
      {/* Stats */}
      <div className="flex gap-3">
        <div className="nv-card nv-card--muted px-4 py-3 text-center">
          <div className="text-2xl font-bold text-brand-primary">{answeredCount}</div>
          <div className="text-xs font-semibold text-brand-muted-foreground">Answered</div>
        </div>
        <div className="nv-card nv-card--muted px-4 py-3 text-center">
          <div className="text-2xl font-bold text-brand-primary">{qaList.length}</div>
          <div className="text-xs font-semibold text-brand-muted-foreground">Total</div>
        </div>
      </div>

      {/* Search + Ask */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted-foreground" />
          <Input
            aria-label="Search questions and answers"
            placeholder="Search questions and answers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <AskQuestionDialog
          open={askOpen}
          onOpenChange={setAskOpen}
          currentUser={currentUser}
          onCreated={() => qc.invalidateQueries({ queryKey: ['expertQA'] })}
        />
      </div>

      {/* Topic pills */}
      <div className="flex flex-wrap gap-2">
        {TOPICS.map(t => {
          const Icon = t.icon;
          const active = selectedTopic === t.id;
          const count = topicCounts[t.id] || 0;
          return (
            <button
              key={t.id}
              onClick={() => setSelectedTopic(t.id)}
              aria-pressed={active}
              className={`nv-btn nv-btn--sm !whitespace-normal ${active ? '' : 'nv-btn--outline'}`}
            >
              <Icon className="h-4 w-4" />
              <span>{t.label}</span>
              <span className={`text-xs px-1.5 rounded-full ${active ? 'bg-primary-foreground/20' : 'bg-brand-muted'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Q&A List */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageCircleQuestion className="h-12 w-12 mx-auto text-brand-muted-foreground mb-3" />
            <p className="text-lg font-bold text-brand-text">No questions yet</p>
            <p className="text-sm text-brand-muted-foreground mt-1">
              {search || selectedTopic !== 'all'
                ? 'Try a different topic or search term.'
                : 'Be the first to ask a question — experts will respond soon.'}
            </p>
            <Button className="mt-4" onClick={() => setAskOpen(true)}>
              <Plus className="h-4 w-4" /> Ask a question
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => (
            <QACard
              key={item.id}
              item={item}
              isExpanded={expanded === item.id}
              onToggle={() => setExpanded(expanded === item.id ? null : item.id)}
              onHelpful={() => markHelpful.mutate(item)}
              userMarkedHelpful={item.helpful_by?.includes(currentUser?.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}