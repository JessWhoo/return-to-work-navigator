import React from 'react';
import { MessageSquare, Phone } from 'lucide-react';

const PHONE_DISPLAY = '(575) 221-1160';
const PHONE_E164 = '+15752211160';
const CALL_CONVERSION = 'AW-18498327009/QvcyCOOjzJMdEOGj2PRE';

/**
 * SMS program consent card.
 * Reused wherever the text-messaging program is offered, so the disclosure
 * wording (and the phone number) lives in one place.
 */
export default function SmsConsentCard({ className = '', children }) {
  return (
    <div className={`nv-card p-6 sm:p-8 ${className}`}>
      <h2 className="font-heading text-xl font-bold leading-tight text-brand-text sm:text-2xl">
        Text Return Collective of Survivors today
      </h2>

      <a
        href={`tel:${PHONE_E164}`}
        onClick={() => {
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'conversion', { send_to: CALL_CONVERSION });
          }
        }}
        className="mt-4 inline-flex items-center gap-3 font-heading text-3xl font-bold tracking-tight text-brand-text transition-colors hover:text-brand-primary sm:text-4xl"
      >
        <Phone className="h-7 w-7 flex-shrink-0 text-brand-primary" />
        {PHONE_DISPLAY}
      </a>

      <div className="mt-4">
        <a
          href={`sms:${PHONE_E164}`}
          className="nv-btn inline-flex sm:w-auto"
        >
          <MessageSquare className="h-4 w-4" />
          Text us
        </a>
      </div>

      <p className="mt-5 max-w-2xl text-sm leading-relaxed text-brand-muted-foreground">
        By contacting us via SMS with your mobile number, you consent to receive customer care text
        messages from Return Collective of Survivors. Msg&amp;Data rates may apply. Message frequency
        varies. Text HELP for help. Reply "STOP" at any time to opt out.
      </p>

      {children && (
        <div className="mt-5 space-y-2 border-t border-brand-border pt-4">{children}</div>
      )}
    </div>
  );
}