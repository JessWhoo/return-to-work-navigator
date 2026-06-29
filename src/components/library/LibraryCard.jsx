import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, ExternalLink, BookOpen } from 'lucide-react';

const CATEGORY_STYLES = {
  legal: 'from-indigo-500 to-violet-600',
  accommodations: 'from-emerald-500 to-teal-600',
  templates: 'from-rose-500 to-pink-600',
  disclosure: 'from-amber-500 to-orange-600',
  leave: 'from-sky-500 to-blue-600',
};

export default function LibraryCard({ item }) {
  const gradient = CATEGORY_STYLES[item.category] || 'from-slate-500 to-slate-700';

  const inner = (
    <Card className="bg-white border-2 border-slate-200 hover:border-slate-400 shadow-md hover:shadow-xl transition-all h-full">
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex items-start gap-3 mb-3">
          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient} shadow-md flex-shrink-0`}>
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-300">
              {item.type}
            </span>
            <h3 className="text-base font-extrabold text-slate-900 mt-1.5 leading-tight">
              {item.title}
            </h3>
          </div>
        </div>

        <p className="text-sm font-medium text-slate-700 leading-relaxed flex-1">
          {item.summary}
        </p>

        {item.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {item.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-3 border-t-2 border-slate-100">
          <span className="text-sm font-bold text-slate-800">
            {item.external ? 'Open resource' : 'View guide'}
          </span>
          {item.external ? (
            <ExternalLink className="h-4 w-4 text-slate-700" />
          ) : (
            <ArrowRight className="h-4 w-4 text-slate-700" />
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (item.external) {
    return (
      <a href={item.link} target="_blank" rel="noopener noreferrer" className="block h-full">
        {inner}
      </a>
    );
  }
  return (
    <Link to={item.link} className="block h-full">
      {inner}
    </Link>
  );
}