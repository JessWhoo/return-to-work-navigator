import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2 } from 'lucide-react';

export default function StepCard({ step, index, checkedItems, onToggle }) {
  const Icon = step.icon;
  const completedCount = step.checklistItems.filter((item) =>
    checkedItems.includes(`${step.id}::${item}`)
  ).length;
  const isComplete = completedCount === step.checklistItems.length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.05 }}>
      <Card className={isComplete ? 'ring-1 ring-primary' : ''}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="shrink-0 p-3 rounded-brand bg-brand-muted"><Icon className="h-6 w-6 text-brand-primary" /></div>
            <div className="flex-1 min-w-0"><div className="flex items-center gap-2 flex-wrap"><span className="nv-eyebrow">Step {index + 1}</span>{isComplete && <span className="nv-chip"><CheckCircle2 className="h-3 w-3" />Complete</span>}</div><h3 className="text-xl font-bold text-brand-text mt-1">{step.title}</h3></div>
          </div>
          <p className="text-brand-text font-medium mb-4">{step.summary}</p>
          <ul className="space-y-2 mb-5 list-disc list-inside text-sm text-brand-muted-foreground font-medium">{step.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
          <div className="nv-card nv-card--muted p-4">
            <p className="nv-eyebrow mb-3">Checklist · {completedCount}/{step.checklistItems.length}</p>
            <div className="space-y-2">
              {step.checklistItems.map(item => {
                const key = `${step.id}::${item}`;
                const checked = checkedItems.includes(key);
                return <label key={key} className="flex items-start gap-3 cursor-pointer"><Checkbox checked={checked} onCheckedChange={() => onToggle(key)} className="mt-0.5" /><span className={`text-sm font-medium ${checked ? 'text-brand-muted-foreground line-through' : 'text-brand-text'}`}>{item}</span></label>;
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}