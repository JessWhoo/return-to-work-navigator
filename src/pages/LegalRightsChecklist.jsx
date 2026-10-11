import React, { useMemo, useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import PageHeader from '@/components/brand/PageHeader';
import { legalChecklistSections } from '@/components/legal/legalChecklistData';
import { useAuth } from '@/lib/AuthContext';

// All checklist item ids (legal: prefixed) — used to isolate this checklist's
// completions from the main return-to-work checklist that shares the same
// UserProgress.completed_checklist_items array.
const LEGAL_ITEM_IDS = new Set(
  legalChecklistSections.flatMap((s) => s.items.map((i) => i.id))
);

export default function LegalRightsChecklist() {
  const { isAuthenticated, isLoadingAuth, user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Wait for auth to fully resolve before touching any user-scoped entity —
    // firing earlier produces 401/403 request failures.
    if (isLoadingAuth) return;

    (async () => {
      const localMode = () => {
        let saved = [];
        try { saved = JSON.parse(localStorage.getItem('legalChecklistLocal') || '[]'); } catch { /* ignore */ }
        setProgress({ id: null, completed_checklist_items: saved });
      };

      if (!isAuthenticated || !user?.id) {
        // Signed-out visitor — keep progress in this browser, no API calls.
        localMode();
        setLoading(false);
        return;
      }

      try {
        const list = await base44.entities.UserProgress.list();
        const record = list?.[0] || await base44.entities.UserProgress.create({ completed_checklist_items: [] });
        setProgress(record);
      } catch {
        localMode();
      }
      setLoading(false);
    })();
  }, [isLoadingAuth, isAuthenticated, user?.id]);

  const completed = useMemo(() => {
    const all = progress?.completed_checklist_items || [];
    return new Set(all.filter((id) => LEGAL_ITEM_IDS.has(id)));
  }, [progress]);

  const totalItems = useMemo(
    () => legalChecklistSections.reduce((n, s) => n + s.items.length, 0),
    []
  );
  const completedCount = completed.size;
  const percent = totalItems ? Math.round((completedCount / totalItems) * 100) : 0;

  const persist = async (nextLegalIds) => {
    if (!progress) return;
    // Preserve any non-legal ids already stored on the record.
    const existing = progress.completed_checklist_items || [];
    const preserved = existing.filter((id) => !LEGAL_ITEM_IDS.has(id));
    const merged = [...preserved, ...nextLegalIds];
    if (!progress.id) {
      // Local (signed-out) mode
      localStorage.setItem('legalChecklistLocal', JSON.stringify(merged));
      setProgress({ ...progress, completed_checklist_items: merged });
      return;
    }
    setSaving(true);
    const updated = await base44.entities.UserProgress.update(progress.id, {
      completed_checklist_items: merged,
    });
    setProgress(updated);
    setSaving(false);
  };

  const toggleItem = (itemId) => {
    const next = new Set(completed);
    if (next.has(itemId)) next.delete(itemId);
    else next.add(itemId);
    persist(Array.from(next));
  };

  const resetAll = () => {
    persist([]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-4 border-brand-border border-t-brand-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader center title="Legal Rights & Medical Accommodations Checklist" subtitle="Track the steps that protect you: understanding your rights, gathering documents, FMLA paperwork, and requesting medical accommodations like ergonomic adjustments." />
      <Card className="nv-card--muted">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap"><CheckCircle2 className="h-5 w-5 text-brand-primary" /><span className="font-bold text-brand-text">{completedCount} of {totalItems} completed</span>{saving && <span className="text-xs text-brand-muted-foreground">Saving…</span>}</div>
            <Button variant="outline" size="sm" onClick={resetAll} disabled={completedCount === 0 || saving}><RotateCcw className="h-4 w-4 mr-1.5" />Reset</Button>
          </div>
          <Progress value={percent} className="h-3" /><p className="text-sm text-brand-muted-foreground">{percent}% complete</p>
        </CardContent>
      </Card>
      {legalChecklistSections.map(section => {
        const sectionDone = section.items.filter(i => completed.has(i.id)).length;
        return (
          <Card key={section.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3 flex-wrap"><div><CardTitle className="text-xl text-brand-text">{section.title}</CardTitle><p className="text-sm text-brand-muted-foreground mt-1">{section.description}</p></div><span className="nv-chip">{sectionDone}/{section.items.length}</span></div>
            </CardHeader>
            <CardContent className="space-y-2">
              {section.items.map(item => {
                const isDone = completed.has(item.id);
                return (
                  <label key={item.id} className={`nv-card flex items-start gap-3 p-3 cursor-pointer ${isDone ? 'nv-card--muted ring-1 ring-primary' : ''}`}>
                    <Checkbox checked={isDone} onCheckedChange={() => toggleItem(item.id)} disabled={saving} className="mt-0.5" />
                    <span className={`text-sm font-medium ${isDone ? 'text-brand-muted-foreground line-through' : 'text-brand-text'}`}>{item.label}</span>
                  </label>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
      <p className="text-xs text-brand-muted-foreground text-center italic pt-2">This checklist is for educational purposes only and is not legal advice. Please consult with legal counsel for your specific situation.</p>
    </div>
  );
}