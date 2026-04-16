import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, HeartOff, Share2, RefreshCw, BookOpen, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

const today = new Date().toISOString().split('T')[0];

export default function DailyAffirmation({ progress }) {
  const queryClient = useQueryClient();
  const [showSaved, setShowSaved] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Fetch today's affirmation and saved ones
  const { data: affirmations = [], isLoading: isLoadingAffirmations } = useQuery({
    queryKey: ['dailyAffirmations'],
    queryFn: () => base44.entities.DailyAffirmation.list('-created_date', 50),
  });

  const todayAffirmation = affirmations.find(a => a.date === today);
  const savedAffirmations = affirmations.filter(a => a.is_saved);

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.DailyAffirmation.create(data),
    onSuccess: () => queryClient.invalidateQueries(['dailyAffirmations']),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }) => base44.entities.DailyAffirmation.update(id, updates),
    onSuccess: () => queryClient.invalidateQueries(['dailyAffirmations']),
  });

  const generateAffirmation = async (force = false) => {
    if (todayAffirmation && !force) return;
    setGenerating(true);
    try {
      const stage = progress?.journey_stage || 'planning';
      const stageLabel = stage.replace('_', ' ');
      const text = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a compassionate coach for cancer survivors returning to work.
Generate ONE warm, specific, empowering daily affirmation for a cancer survivor who is in the "${stageLabel}" stage of returning to work.
The affirmation should:
- Be 1-2 sentences, personal and direct (use "you" or "I")
- Acknowledge their unique courage and strength
- Be practical and grounding, not generic
- Avoid medical jargon
Respond with ONLY the affirmation text, no quotes, no extra text.`,
      });

      try {
        await createMutation.mutateAsync({ text: text.trim(), date: today, is_saved: false, is_shared: false });
      } catch {
        // user may not have permission to create affirmations (e.g. guest)
      }

      base44.analytics.track({
        eventName: 'daily_affirmation_generated',
        properties: { journey_stage: stage, forced_refresh: force },
      });
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (!isLoadingAffirmations && !todayAffirmation && !generating) {
      generateAffirmation();
    }
  }, [isLoadingAffirmations, todayAffirmation, generating]);

  const handleToggleSave = async () => {
    if (!todayAffirmation) return;
    const newSaved = !todayAffirmation.is_saved;
    await updateMutation.mutateAsync({ id: todayAffirmation.id, updates: { is_saved: newSaved } });
    toast.success(newSaved ? 'Affirmation saved to favorites ❤️' : 'Removed from favorites');
    base44.analytics.track({ eventName: newSaved ? 'affirmation_saved' : 'affirmation_unsaved', properties: {} });
  };

  const handleShare = async () => {
    if (!todayAffirmation) return;
    const shareText = `✨ Today's affirmation: "${todayAffirmation.text}" — Back to Life, Back to Work Navigator`;
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText, title: 'My Daily Affirmation' });
        await updateMutation.mutateAsync({ id: todayAffirmation.id, updates: { is_shared: true } });
        base44.analytics.track({ eventName: 'affirmation_shared', properties: { method: 'native_share' } });
      } catch {
        // user cancelled share
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast.success('Affirmation copied to clipboard — paste it anywhere to share!');
      await updateMutation.mutateAsync({ id: todayAffirmation.id, updates: { is_shared: true } });
      base44.analytics.track({ eventName: 'affirmation_shared', properties: { method: 'clipboard' } });
    }
  };

  return (
    <div className="space-y-4 mb-12">
      {/* Today's Affirmation Card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Card className="relative overflow-hidden bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 border-2 border-purple-500 shadow-2xl">
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

          <CardContent className="relative z-10 pt-6 pb-6 px-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-purple-500/30 border border-purple-400/40">
                <Sparkles className="h-5 w-5 text-purple-300" />
              </div>
              <div>
                <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Daily Affirmation</p>
                <p className="text-xs text-purple-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {(generating || isLoadingAffirmations) && !todayAffirmation ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3 py-4">
                  <Loader2 className="h-5 w-5 text-purple-300 animate-spin" />
                  <span className="text-purple-200 text-sm italic">Crafting your affirmation for today…</span>
                </motion.div>
              ) : todayAffirmation ? (
                <motion.p
                  key={todayAffirmation.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-lg sm:text-xl font-medium text-white leading-relaxed mb-5 italic"
                >
                  "{todayAffirmation.text}"
                </motion.p>
              ) : null}
            </AnimatePresence>

            {todayAffirmation && (
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleToggleSave}
                  className={`gap-1.5 ${todayAffirmation.is_saved ? 'text-pink-400 hover:text-pink-300' : 'text-purple-300 hover:text-pink-300'}`}
                >
                  {todayAffirmation.is_saved ? <Heart className="h-4 w-4 fill-pink-400" /> : <Heart className="h-4 w-4" />}
                  {todayAffirmation.is_saved ? 'Saved' : 'Save'}
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleShare}
                  className="gap-1.5 text-purple-300 hover:text-cyan-300"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => generateAffirmation(true)}
                  disabled={generating}
                  className="gap-1.5 text-purple-400 hover:text-purple-200 ml-auto"
                >
                  {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  New
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Saved Affirmations toggle */}
      {savedAffirmations.length > 0 && (
        <div>
          <button
            onClick={() => setShowSaved(!showSaved)}
            className="flex items-center gap-2 text-sm text-purple-300 hover:text-purple-100 transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            My Favorites ({savedAffirmations.length})
            {showSaved ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          <AnimatePresence>
            {showSaved && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 space-y-2 overflow-hidden"
              >
                {savedAffirmations.map((a) => (
                  <div key={a.id} className="flex items-start gap-3 bg-purple-900/30 border border-purple-700/40 rounded-xl px-4 py-3">
                    <Heart className="h-4 w-4 text-pink-400 fill-pink-400 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-200 italic">"{a.text}"</p>
                      <p className="text-xs text-purple-400 mt-1">{new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <button
                      onClick={() => updateMutation.mutate({ id: a.id, updates: { is_saved: false } })}
                      className="text-purple-500 hover:text-red-400 transition-colors shrink-0"
                      title="Remove from favorites"
                    >
                      <HeartOff className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}