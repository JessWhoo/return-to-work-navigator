import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ExternalLink } from 'lucide-react';

export default function DirectoryEntryCard({ entry }) {
  const [open, setOpen] = useState(false);

  return (
    <Card className="bg-white border-2 border-slate-200 hover:border-violet-300 transition-all">
      <CardContent className="p-0">
        <button
          onClick={() => setOpen(!open)}
          className="w-full text-left p-5 flex items-start justify-between gap-3"
          aria-expanded={open}
        >
          <div>
            <h3 className="font-bold text-slate-900">{entry.title}</h3>
            <p className="text-sm text-slate-700 mt-1">{entry.summary}</p>
          </div>
          <ChevronDown className={`h-5 w-5 text-slate-500 flex-shrink-0 mt-1 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="px-5 pb-5 space-y-3">
            <p className="text-sm text-slate-800 leading-relaxed">{entry.details}</p>
            {entry.link && (
              <a
                href={entry.link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-violet-700 hover:text-violet-800 underline"
              >
                {entry.link.label}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            <div className="flex flex-wrap gap-1.5">
              {entry.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs bg-slate-50">{tag}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}