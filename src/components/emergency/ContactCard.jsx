import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, MessageSquare, Clock, ExternalLink } from 'lucide-react';

export default function ContactCard({ contact }) {
  return (
    <Card className="bg-white border-2 border-slate-200 hover:border-rose-400 hover:shadow-lg transition-all h-full">
      <CardContent className="p-5 space-y-3">
        <h3 className="text-lg font-extrabold text-slate-900 leading-tight">
          {contact.name}
        </h3>

        <div className="flex flex-wrap gap-2">
          {contact.tel && (
            <a
              href={contact.tel}
              className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold px-3 py-2 rounded-lg shadow-sm transition-colors"
            >
              <Phone className="h-4 w-4" />
              {contact.phone}
            </a>
          )}
          {!contact.tel && contact.phone && (
            <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-900 text-sm font-bold px-3 py-2 rounded-lg">
              <Phone className="h-4 w-4" />
              {contact.phone}
            </span>
          )}
          {contact.sms && (
            <a
              href={contact.sms}
              className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold px-3 py-2 rounded-lg shadow-sm transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              {contact.text}
            </a>
          )}
        </div>

        {contact.hours && (
          <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
            <Clock className="h-3.5 w-3.5 text-emerald-600" />
            <span>{contact.hours}</span>
          </div>
        )}

        <p className="text-sm text-slate-700 leading-relaxed">
          {contact.description}
        </p>

        {contact.website && (
          <a
            href={contact.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-700 hover:text-sky-800 hover:underline"
          >
            Visit website <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </CardContent>
    </Card>
  );
}