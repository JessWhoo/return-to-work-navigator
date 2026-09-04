import React from 'react';
import { Copy, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LetterPreview({ letter, onCopy }) {
  return <section className="rounded-2xl border-2 border-slate-200 bg-card shadow-sm" aria-live="polite">
    <div className="no-print flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5"><div><p className="text-xs font-extrabold uppercase tracking-wider text-violet-700">Your letter</p><h2 className="mt-1 text-xl font-extrabold text-slate-900">Ready to review</h2></div><div className="flex gap-2"><Button type="button" variant="outline" onClick={onCopy}><Copy className="h-4 w-4" />Copy letter</Button><Button type="button" variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4" />Print</Button></div></div>
    <article className="whitespace-pre-wrap p-6 text-base leading-7 text-slate-800 sm:p-8">{letter}</article>
  </section>;
}