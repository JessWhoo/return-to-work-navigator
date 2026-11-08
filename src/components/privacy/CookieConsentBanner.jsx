import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { applyCookieConsent, readCookieConsent } from '@/lib/cookieConsent';

export default function CookieConsentBanner() {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const settingsRef = useRef(null);
  const titleRef = useRef(null);
  useEffect(() => {
    const saved = readCookieConsent();
    applyCookieConsent(saved || 'denied');
    setOpen(!saved);
    setReady(true);
  }, []);
  const choose = choice => {
    applyCookieConsent(choice, true);
    setOpen(false);
    requestAnimationFrame(() => settingsRef.current?.focus());
  };
  if (!ready) return null;
  return createPortal(open ? (
    <section
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      className="fixed inset-x-0 bottom-0 z-[9999] max-h-[100dvh] overflow-y-auto border-t border-brand-border bg-brand-background px-5 pb-6 pt-5 font-body text-brand-text shadow-brand-lg"
      style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-3">
          <h2 id="cookie-consent-title" ref={titleRef} tabIndex={-1} className="font-heading text-xl font-bold">Your privacy, your choice</h2>
          <p id="cookie-consent-description" className="text-sm">Essential cookies keep Navigator working. With your permission, we also use analytics and advertising cookies to understand visits and measure our outreach. Declining won’t affect access to our tools.</p>
          <a href="/PrivacySecurity" className="text-sm text-brand-text underline underline-offset-4">Read our privacy policy</a>
        </div>
        <div className="grid w-full shrink-0 grid-cols-2 gap-3 lg:w-auto">
          <Button type="button" variant="outline" className="w-full" onClick={() => choose('denied')}>Decline</Button>
          <Button type="button" variant="outline" className="w-full" onClick={() => choose('granted')}>Accept</Button>
        </div>
      </div>
    </section>
  ) : (
    <Button ref={settingsRef} type="button" variant="outline" size="sm" className="fixed bottom-24 left-4 z-[9998] lg:bottom-4" onClick={() => { setOpen(true); requestAnimationFrame(() => titleRef.current?.focus()); }}>Cookie settings</Button>
  ), document.body);
}