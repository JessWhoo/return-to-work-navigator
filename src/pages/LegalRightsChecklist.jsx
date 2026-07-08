import React, { useMemo, useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle2, RotateCcw } from 'lucide-react';
import { legalChecklistSections } from '@/components/legal/legalChecklistData';

// All checklist item ids (legal: prefixed) — used to isolate this checklist's
// completions from the main return-to-work checklist that shares the same
// UserProgress.completed_checklist_items array.
const LEGAL_ITEM_IDS = new Set(
  legalChecklistSections.flatMap((s) => s.items.map((i) => i.id))
);

export default function LegalRightsChecklist() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const list = await base44.entities.UserProgress.list();
      const record = list?.[0] || await base44.entities.UserProgress.create({ completed_checklist_items: [] });
      setProgress(record);
      setLoading(false);
    })();
  }, []);

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
        <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700 bg-clip-text text-transparent">
          Legal Rights & Medical Accommodations Checklist
        </h1>
        <p className="text-slate-700 font-medium max-w-2xl mx-auto">
          Track the steps that protect you: understanding your rights, gathering documents,
          FMLA paperwork, and requesting medical accommodations like ergonomic adjustments.
        </p>
      </div>

      {/* Overall progress */}
      <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span className="font-bold text-slate-900">
                {completedCount} of {totalItems} completed
              </span>
              {saving && <span className="text-xs text-slate-600">Saving…</span>}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={resetAll}
              disabled={completedCount === 0 || saving}
              className="border-slate-300"
            >
              <RotateCcw className="h-4 w-4 mr-1.5" />
              Reset
            </Button>
          </div>
          <Progress value={percent} className="h-3" />
          <p className="text-sm text-slate-700">{percent}% complete</p>
        </CardContent>
      </Card>

      {/* Sections */}
      {legalChecklistSections.map((section) => {
        const sectionDone = section.items.filter((i) => completed.has(i.id)).length;
        return (
          <Card key={section.id} className="border-2 border-slate-200">
            <CardHeader>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <CardTitle className="text-xl text-slate-900">{section.title}</CardTitle>
                  <p className="text-sm text-slate-700 mt-1">{section.description}</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  {sectionDone}/{section.items.length}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {section.items.map((item) => {
                const isDone = completed.has(item.id);
                return (
                  <label
                    key={item.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      isDone
                        ? 'bg-emerald-50 border-emerald-300'
                        : 'bg-white border-slate-200 hover:border-emerald-200'
                    }`}
                  >
                    <Checkbox
                      checked={isDone}
                      onCheckedChange={() => toggleItem(item.id)}
                      disabled={saving}
                      className="mt-0.5"
                    />
                    <span
                      className={`text-sm font-medium ${
                        isDone ? 'text-slate-500 line-through' : 'text-slate-900'
                      }`}
                    >
                      {item.label}
                    </span>
                  </label>
                );
              })}
            </CardContent>
          </Card>
        );
      })}

      <p className="text-xs text-slate-600 text-center italic pt-2">
        This checklist is for educational purposes only and is not legal advice.
        Please consult with legal counsel for your specific situation.
      </p>
    </div>
  );
}