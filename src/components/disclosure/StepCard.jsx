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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card
        className={`bg-white border-2 shadow-md hover:shadow-xl transition-all ${
          isComplete ? 'border-emerald-400' : 'border-slate-200'
        }`}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div
              className={`flex-shrink-0 p-3 rounded-2xl bg-gradient-to-br ${step.color} shadow-lg`}
            >
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                  Step {index + 1}
                </span>
                {isComplete && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                    <CheckCircle2 className="h-3 w-3" /> Complete
                  </span>
                )}
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                {step.title}
              </h3>
            </div>
          </div>

          <p className="text-slate-800 font-medium leading-relaxed mb-4">
            {step.summary}
          </p>

          <ul className="space-y-2 mb-5 list-disc list-inside text-sm text-slate-700 font-medium">
            {step.bullets.map((b, i) => (
              <li key={i} className="leading-relaxed">
                {b}
              </li>
            ))}
          </ul>

          <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4">
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-3">
              Checklist · {completedCount}/{step.checklistItems.length}
            </p>
            <div className="space-y-2">
              {step.checklistItems.map((item) => {
                const key = `${step.id}::${item}`;
                const checked = checkedItems.includes(key);
                return (
                  <label
                    key={key}
                    className="flex items-start gap-3 cursor-pointer group"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => onToggle(key)}
                      className="mt-0.5"
                    />
                    <span
                      className={`text-sm font-medium transition-all ${
                        checked
                          ? 'text-slate-500 line-through'
                          : 'text-slate-800 group-hover:text-slate-900'
                      }`}
                    >
                      {item}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}