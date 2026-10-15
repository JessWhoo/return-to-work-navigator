import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const PREMIUM_FEATURES = [
  'The complete 4-pillar framework for supporting an employee with cancer',
  'Ready-to-use email templates for accommodation and disclosure discussions',
  'ADA, FMLA, and GINA compliance checklist',
  'Printable PDF guide for your HR team',
  'FAQ with answers to the most common manager and HR questions',
];

export default function PremiumPaywall({ isAuthenticated }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await base44.functions.invoke('create-checkout', {
        productId: 'manager-guide-premium',
      });
      const redirectUrl = response.data?.redirectUrl;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        toast.error('Could not start checkout. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      toast.error('Could not start checkout. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Card className="nv-card--muted">
      <CardContent className="p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-3">
          <div className="rounded-brand bg-primary p-2.5">
            <Lock className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-brand-text">Premium Access Required</h2>
            <p className="text-sm text-brand-muted-foreground">Unlock the full Manager &amp; HR Guide</p>
          </div>
        </div>

        <p className="text-sm text-brand-text leading-relaxed">
          This complete guide is available as a premium resource. Get instant access to the full
          framework, email templates, compliance checklist, and printable PDF.
        </p>

        <ul className="space-y-2">
          {PREMIUM_FEATURES.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-brand-text">
              <CheckCircle2 className="h-4 w-4 text-brand-primary mt-0.5 shrink-0" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between gap-4 pt-2">
          <div>
            <p className="text-2xl font-bold text-brand-text">$49<span className="text-base font-normal text-brand-muted-foreground">/mo</span></p>
            <p className="text-xs text-brand-muted-foreground">Billed monthly · Cancel anytime</p>
          </div>
          <Button onClick={handleCheckout} disabled={loading} className="!whitespace-normal">
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Starting checkout…</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Subscribe</>
            )}
          </Button>
        </div>

        {!isAuthenticated && (
          <p className="text-xs text-brand-muted-foreground border-t border-brand-border pt-3">
            You can check out without an account. After payment, sign in with the email you used to
            unlock your guide.
          </p>
        )}
      </CardContent>
    </Card>
  );
}