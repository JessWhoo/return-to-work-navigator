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
    <div
      className={`rounded-xl border-2 border-slate-200 bg-gradient-to-br from-amber-50 via-white to-slate-100 p-6 sm:p-8 shadow-sm ${className}`}
    >
      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
        Text Return Collective of Survivors today
      </h2>

      <a
        href={`tel:${PHONE_E164}`}
        onClick={() => {
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'conversion', { send_to: CALL_CONVERSION });
          }
        }}
        className="mt-4 inline-flex items-center gap-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight hover:text-violet-700 transition-colors"
      >
        <Phone className="h-7 w-7 text-violet-700 flex-shrink-0" />
        {PHONE_DISPLAY}
      </a>

      <div className="mt-4">
        <a
          href={`sms:${PHONE_E164}`}
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl bg-violet-700 hover:bg-violet-800 px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors"
        >
          <MessageSquare className="h-4 w-4" />
          Text us
        </a>
      </div>

      <p className="mt-5 text-sm text-slate-700 leading-relaxed max-w-2xl">
        By contacting us via SMS with your mobile number, you consent to receive customer care text
        messages from Return Collective of Survivors. Msg&amp;Data rates may apply. Message frequency
        varies. Text HELP for help. Reply "STOP" at any time to opt out.
      </p>

      {children && (
        <div className="mt-5 pt-4 border-t-2 border-slate-200 space-y-2">{children}</div>
      )}
    </div>
  );
}