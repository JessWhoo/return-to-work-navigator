import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, MessageSquare, Clock, ExternalLink } from 'lucide-react';

export default function ContactCard({ contact }) {
  return (
    <Card className="h-full">
      <CardContent className="p-5 space-y-3">
        <h3 className="text-lg font-extrabold text-brand-text">
          {contact.name}
        </h3>

        <div className="flex flex-wrap gap-2">
          {contact.tel && (
            <a
              href={contact.tel}
              onClick={() => {
                if (typeof window !== 'undefined' && window.gtag) {
                  window.gtag('event', 'conversion', {
                    send_to: 'AW-18498327009/QvcyCOOjzJMdEOGj2PRE',
                  });
                }
              }}
              className="nv-btn nv-btn--sm !whitespace-normal"
            >
              <Phone className="h-4 w-4" />
              {contact.phone}
            </a>
          )}
          {!contact.tel && contact.phone && (
            <span className="nv-chip nv-chip--muted">
              <Phone className="h-4 w-4" />
              {contact.phone}
            </span>
          )}
          {contact.sms && (
            <a
              href={contact.sms}
              className="nv-btn nv-btn--secondary nv-btn--sm !whitespace-normal"
            >
              <MessageSquare className="h-4 w-4" />
              {contact.text}
            </a>
          )}
        </div>

        {contact.hours && (
          <div className="flex items-center gap-1.5 text-xs text-brand-muted-foreground font-semibold">
            <Clock className="h-3.5 w-3.5 text-brand-primary" />
            <span>{contact.hours}</span>
          </div>
        )}

        <p className="text-sm text-brand-muted-foreground">
          {contact.description}
        </p>

        {contact.website && (
          <a
            href={contact.website}
            target="_blank"
            rel="noopener noreferrer"
            className="nv-btn nv-btn--text nv-btn--sm !whitespace-normal"
          >
            Visit website <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </CardContent>
    </Card>
  );
}