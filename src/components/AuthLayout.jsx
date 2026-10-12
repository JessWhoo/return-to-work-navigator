import React from "react";
import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import BrandMark from "@/components/brand/BrandMark";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-background px-4 py-8 sm:py-12">
      <Card className="w-full max-w-md overflow-hidden">
        <div className="nv-media h-20 sm:h-24" aria-hidden="true" />
        <div className="p-5 sm:p-8">
          <header className="mb-8 space-y-4 text-center">
            <BrandMark size="lg" showTagline className="justify-center" />
            <div>
              <div className="flex items-center justify-center gap-2">
                <Icon className="h-5 w-5 shrink-0 text-brand-primary" strokeWidth={1.75} aria-hidden="true" />
                <h1 className="font-heading text-2xl font-bold text-brand-text sm:text-3xl">{title}</h1>
              </div>
              {subtitle && <p className="mt-2 text-brand-muted-foreground">{subtitle}</p>}
            </div>
          </header>
          {children}
          {footer && <p className="mt-6 border-t border-brand-border pt-5 text-center text-sm text-brand-muted-foreground">{footer}</p>}
          <div className="mt-4 text-center"><Link to="/PrivacySecurity" className="nv-btn nv-btn--text nv-btn--sm">Privacy Policy</Link></div>
        </div>
      </Card>
    </main>
  );
}