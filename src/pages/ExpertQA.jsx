import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  MessageCircleQuestion, Search, Plus, ThumbsUp, Sparkles,
  Battery, Scale, Handshake, MessageSquare, Briefcase,
  Heart, Shield, HelpCircle, Star, CheckCircle2, User
} from 'lucide-react';

const TOPICS = [
  { id: 'all', label: 'All Topics', icon: MessageCircleQuestion, color: 'from-slate-500 to-slate-600' },
  { id: 'fatigue', label: 'Fatigue & Energy', icon: Battery, color: 'from-amber-500 to-orange-600' },
  { id: 'rights', label: 'Workplace Rights', icon: Scale, color: 'from-blue-500 to-indigo-600' },
  { id: 'accommodations', label: 'Accommodations', icon: Handshake, color: 'from-emerald-500 to-teal-600' },
  { id: 'disclosure', label: 'Disclosure', icon: Shield, color: 'from-violet-500 to-purple-600' },
  { id: 'communication', label: 'Communication', icon: MessageSquare, color: 'from-sky-500 to-cyan-600' },
  { id: 'career_return', label: 'Career & Return', icon: Briefcase, color: 'from-rose-500 to-pink-600' },
  { id: 'emotional_support', label: 'Emotional Support', icon: Heart, color: 'from-fuchsia-500 to-rose-600' },
  { id: 'insurance_benefits', label: 'Insurance & Benefits', icon: Star, color: 'from-yellow-500 to-amber-600' },
  { id: 'general', label: 'General', icon: HelpCircle, color: 'from-slate-500 to-slate-700' },
];

const getTopic = (id) => TOPICS.find(t => t.id === id) || TOPICS[0];

export default function ExpertQA() {
  const qc = useQueryClient();
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [search, setSearch] = useState('');
  const [askOpen, setAskOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: qaList = [], isLoading } = useQuery({
    queryKey: ['expertQA'],
    queryFn: () => base44.entities.ExpertQA.list('-created_date', 200),
  });

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
      if (!currentUser) return;
      const already = item.helpful_by?.includes(currentUser.id);
      const helpful_by = already
        ? (item.helpful_by || []).filter(id => id !== currentUser.id)
        : [...(item.helpful_by || []), currentUser.id];
      const helpful_count = helpful_by.length;
      return base44.entities.ExpertQA.update(item.id, { helpful_by, helpful_count });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['expertQA'] }),
  });

  const answeredCount = qaList.filter(q => q.status === 'answered' || q.status === 'featured').length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-violet-600 via-rose-500 to-amber-500 rounded-2xl p-6 text-white shadow-xl"
      >
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-wide">Expert Q&A</span>
            </div>
            <h1 className="text-3xl font-extrabold mb-2">Ask the Experts</h1>
            <p className="text-white/90 max-w-2xl">
              Common questions about returning to work — with answers from workplace experts,
              attorneys, and oncology professionals.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-3 text-center">
              <div className="text-2xl font-extrabold">{answeredCount}</div>
              <div className="text-xs font-semibold">Answered</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-3 text-center">
              <div className="text-2xl font-extrabold">{qaList.length}</div>
              <div className="text-xs font-semibold">Total</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search + Ask */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
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
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                active
                  ? `bg-gradient-to-r ${t.color} text-white border-transparent shadow-md`
                  : 'bg-white text-slate-800 border-slate-300 hover:border-slate-500'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{t.label}</span>
              <span className={`text-xs px-1.5 rounded-full ${active ? 'bg-white/25' : 'bg-slate-200'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Q&A List */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-600 font-semibold">Loading questions...</div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageCircleQuestion className="h-12 w-12 mx-auto text-slate-400 mb-3" />
            <p className="text-lg font-bold text-slate-800">No questions yet</p>
            <p className="text-sm text-slate-600 mt-1">
              {search || selectedTopic !== 'all'
                ? 'Try a different topic or search term.'
                : 'Be the first to ask a question — experts will respond soon.'}
            </p>
            <Button className="mt-4" onClick={() => setAskOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Ask a question
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

function QACard({ item, isExpanded, onToggle, onHelpful, userMarkedHelpful }) {
  const topic = getTopic(item.topic);
  const Icon = topic.icon;
  const hasAnswer = item.status === 'answered' || item.status === 'featured';

  return (
    <motion.div layout>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <button onClick={onToggle} className="w-full text-left">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${topic.color} flex-shrink-0`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <Badge variant="secondary" className="text-xs">{topic.label}</Badge>
                  {item.status === 'featured' && (
                    <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-xs">
                      <Star className="h-3 w-3 mr-1" /> Featured
                    </Badge>
                  )}
                  {hasAnswer ? (
                    <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Answered
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">Awaiting expert</Badge>
                  )}
                </div>
                <CardTitle className="text-base sm:text-lg text-slate-900 leading-snug">
                  {item.question}
                </CardTitle>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" /> {item.asker_name || 'Anonymous'}
                  </span>
                  {item.helpful_count > 0 && (
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" /> {item.helpful_count} helpful
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
        </button>

        {isExpanded && (
          <CardContent className="pt-0 pb-4 space-y-3">
            {item.question_details && (
              <div className="pl-14">
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{item.question_details}</p>
              </div>
            )}

            {hasAnswer ? (
              <div className="ml-14 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-sky-50 border-2 border-emerald-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-sky-600 flex items-center justify-center text-white text-xs font-bold">
                    {item.expert_name?.[0]?.toUpperCase() || 'E'}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900">
                      {item.expert_name || 'Workplace Expert'}
                    </p>
                    {item.expert_title && (
                      <p className="text-xs text-slate-700 font-medium">{item.expert_title}</p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {item.answer}
                </p>
                <div className="mt-3 pt-3 border-t border-emerald-200 flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-medium">Was this helpful?</span>
                  <Button
                    size="sm"
                    variant={userMarkedHelpful ? "default" : "outline"}
                    onClick={(e) => { e.stopPropagation(); onHelpful(); }}
                    className={userMarkedHelpful ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                  >
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    {userMarkedHelpful ? 'Helpful' : 'Mark helpful'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="ml-14 p-4 rounded-xl bg-slate-100 border border-slate-300">
                <p className="text-sm text-slate-700 italic">
                  This question is awaiting an expert response. Check back soon.
                </p>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}

function AskQuestionDialog({ open, onOpenChange, currentUser, onCreated }) {
  const [question, setQuestion] = useState('');
  const [details, setDetails] = useState('');
  const [topic, setTopic] = useState('');
  const [anonymous, setAnonymous] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const reset = () => {
    setQuestion(''); setDetails(''); setTopic(''); setAnonymous(true); setError('');
  };

  const submit = async () => {
    if (!question.trim() || !topic) return;
    setSubmitting(true);
    setError('');
    try {
      // Verify the user is authenticated before attempting to create.
      // ExpertQA has an RLS create rule that requires the record be tied to a user.
      let user = currentUser;
      if (!user) {
        try {
          user = await base44.auth.me();
        } catch {
          user = null;
        }
      }
      if (!user) {
        setError('Please log in to ask a question. You can sign in from the top-right and try again.');
        setSubmitting(false);
        return;
      }

      const payload = {
        question: question.trim(),
        topic,
        is_anonymous: anonymous,
        asker_name: anonymous ? 'Anonymous' : (user.full_name || 'Anonymous'),
        status: 'pending',
      };
      if (details.trim()) payload.question_details = details.trim();
      await base44.entities.ExpertQA.create(payload);
      reset();
      onOpenChange(false);
      onCreated?.();
    } catch (err) {
      const msg = err?.message || '';
      if (/permission denied/i.test(msg)) {
        setError("You need to be signed in to submit a question. Please log in and try again.");
      } else {
        setError(msg || 'Could not submit your question. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-rose-500 to-violet-600 hover:from-rose-600 hover:to-violet-700">
          <Plus className="h-4 w-4 mr-2" /> Ask a question
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Ask an Expert</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-slate-800 mb-1 block">Topic</label>
            <Select value={topic} onValueChange={setTopic}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a topic..." />
              </SelectTrigger>
              <SelectContent>
                {TOPICS.filter(t => t.id !== 'all').map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-800 mb-1 block">Your question</label>
            <Input
              placeholder="E.g., How do I request reduced hours after treatment?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              maxLength={200}
            />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-800 mb-1 block">
              More context <span className="text-slate-500 font-normal">(optional)</span>
            </label>
            <Textarea
              placeholder="Add any details that would help an expert answer..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              maxLength={1000}
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-slate-800 font-medium">Ask anonymously</span>
          </label>
          {error && (
            <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700 font-medium">
              {error}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={submit}
            disabled={!question.trim() || !topic || submitting}
            className="bg-gradient-to-r from-rose-500 to-violet-600"
          >
            {submitting ? 'Submitting...' : 'Submit question'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}