import React from 'react';
import { FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TemplateCard({ template, onSelect }) {
  return (
    <button type="button" onClick={() => onSelect(template)} className="text-left w-full">
      <Card className="h-full border-2 border-slate-200 hover:border-violet-400 hover:shadow-md transition-all">
        <CardContent className="p-5 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <FileText className="h-5 w-5 text-violet-700" />
            <Badge variant="outline" className="text-xs font-bold">{template.category}</Badge>
          </div>
          <h3 className="text-base font-bold text-slate-900">{template.title}</h3>
          <p className="text-sm text-slate-700">{template.summary}</p>
          <span className="text-sm font-bold text-violet-700">Use this template</span>
        </CardContent>
      </Card>
    </button>
  );
}