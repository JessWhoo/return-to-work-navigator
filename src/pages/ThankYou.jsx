import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import PageHeader from '@/components/brand/PageHeader';
import useSEO from '@/hooks/useSEO';

export default function ThankYou() {
  useSEO({
    title: 'Thank You — Premium Access Unlocked',
    description: 'Your premium access to the Return to Work Navigator Manager & HR Guide is ready.',
    path: '/ThankYou',
    noindex: true,
  });

  const [access, setAccess] = useState(null);

  useEffect(() => {
    base44.functions.invoke('check-premium-access', {})
      .then((res) => setAccess(res.data))
      .catch(() => setAccess({ hasAccess: false, isAuthenticated: false }));
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader
        eyebrow="Purchase Complete"
        title="Thank You for Your Purchase"
        subtitle="Your premium access to the Manager & HR Guide is ready."
      />

      <Card>
        <CardContent className="p-6 sm:p-8 space-y-4 text-center">
          <CheckCircle2 className="h-12 w-12 text-brand-primary mx-auto" aria-hidden="true" />
          <h2 className="font-heading text-xl font-bold text-brand-text">Payment Successful</h2>

          {access?.hasAccess ? (
            <p className="text-sm text-brand-muted-foreground">
              Your premium access is active. You can now read the full Manager &amp; HR Guide.
            </p>
          ) : access?.isAuthenticated ? (
            <p className="text-sm text-brand-muted-foreground">
              Your payment is being processed. If access doesn&apos;t appear within a minute, refresh
              the guide page.
            </p>
          ) : (
            <p className="text-sm text-brand-muted-foreground">
              To access your premium guide, sign in or create an account with the email you used at
              checkout.
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link to="/ManagerGuide">
              <Button className="!whitespace-normal">
                Go to Manager &amp; HR Guide <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            {!access?.isAuthenticated && (
              <Link to="/login">
                <Button variant="outline" className="!whitespace-normal">Sign In</Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}