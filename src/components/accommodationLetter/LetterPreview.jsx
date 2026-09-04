import React, { useState } from 'react';
import { Copy, Check, Download, Printer, Pencil, Eye, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { downloadLetterPdf } from './downloadLetterPdf';

export default function LetterPreview({ text, onChange, onRegenerate }) {
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Letter copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="no-print flex flex-wrap gap-2">
        <Button onClick={copy} className="bg-gradient-to-r from-violet-600 to-emerald-600 hover:from-violet-700 hover:to-emerald-700 text-white font-bold">
          {copied ? <Check className="h-4 w-4 mr-1.5" /> : <Copy className="h-4 w-4 mr-1.5" />}
          {copied ? 'Copied' : 'Copy letter'}
        </Button>
        <Button variant="outline" className="font-bold" onClick={() => { downloadLetterPdf(text); toast.success('PDF downloaded'); }}>
          <Download className="h-4 w-4 mr-1.5" /> Download PDF
        </Button>
        <Button variant="outline" className="font-bold" onClick={() => window.print()}>
          <Printer className="h-4 w-4 mr-1.5" /> Print
        </Button>
        <Button variant="outline" className="font-bold" onClick={() => setEditing((e) => !e)}>
          {editing ? <Eye className="h-4 w-4 mr-1.5" /> : <Pencil className="h-4 w-4 mr-1.5" />}
          {editing ? 'Preview' : 'Edit text'}
        </Button>
        <Button variant="ghost" className="font-bold text-slate-700" onClick={onRegenerate}>
          <RotateCcw className="h-4 w-4 mr-1.5" /> Regenerate from my answers
        </Button>
      </div>

      {editing ? (
        <Textarea
          value={text}
          onChange={(e) => onChange(e.target.value)}
          rows={28}
          className="font-serif text-[15px] leading-relaxed bg-white"
        />
      ) : (
        <article className="print-letter bg-white border-2 border-slate-200 rounded-2xl shadow-sm px-6 py-8 sm:px-12 sm:py-12">
          <div className="font-serif text-[15px] sm:text-base text-slate-900 leading-relaxed whitespace-pre-wrap max-w-[42rem] mx-auto">
            {text}
          </div>
        </article>
      )}
    </div>
  );
}