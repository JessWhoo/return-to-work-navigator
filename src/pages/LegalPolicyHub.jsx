import React, { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, FileText, Globe, Lock, CheckSquare, Search, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import PageHeader from '@/components/brand/PageHeader';
import WorkplaceRightsAndDisclosure from '../components/legal/WorkplaceRightsAndDisclosure';
import useSEO from '@/hooks/useSEO';

// Secondary tabs load on demand so the hub's initial render isn't blocked by
// five full pages of content that most visitors never open.
const LegalRights = lazy(() => import('./LegalRights'));
const Accommodations = lazy(() => import('./Accommodations'));
const StateByStateLaws = lazy(() => import('./StateByStateLaws'));
const InternationalLaws = lazy(() => import('./InternationalLaws'));
const LegalRightsChecklist = lazy(() => import('./LegalRightsChecklist'));

const TabFallback = () => (
  <div className="flex justify-center py-16">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-border border-t-brand-primary" />
  </div>
);

const HUB_TABS = [
  { value: 'disclosure', label: 'Rights & Disclosure', Icon: Lock },
  { value: 'rights', label: 'Legal Rights', Icon: Shield },
  { value: 'accommodations', label: 'Accommodations', Icon: FileText },
  { value: 'state', label: 'State Laws', Icon: Globe },
  { value: 'international', label: 'International', Icon: Globe },
  { value: 'checklist', label: 'Checklist', Icon: CheckSquare },
];

export default function LegalPolicyHub() {
  useSEO({
    title: 'Legal Rights & Workplace Policy',
    description:
      'Understand your workplace rights as a cancer survivor — ADA and FMLA protections, accommodations, disclosure and state-by-state laws.',
    path: '/LegalPolicyHub',
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        eyebrow="Tools & rights"
        title="Legal & Policy Guidance"
        subtitle="Your rights, accommodations, and laws explained"
      />

      <Link to="/LegalDirectory" className="block">
        <Card>
          <CardContent className="flex items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0 rounded-pill bg-brand-muted p-3 text-brand-primary">
                <Search className="h-6 w-6" />
              </span>
              <div>
                <p className="font-heading font-bold text-brand-text">Searchable Legal Directory</p>
                <p className="text-sm text-brand-muted-foreground">Find quick answers on FMLA, ADA, state laws, accommodations, insurance &amp; privacy</p>
              </div>
            </div>
            <ArrowRight className="h-6 w-6 flex-shrink-0 text-brand-primary" />
          </CardContent>
        </Card>
      </Link>

      <Tabs defaultValue="disclosure" className="space-y-6">
        <TabsList className="nv-tabs h-auto">
          {HUB_TABS.map(({ value, label, Icon }) => (
            <TabsTrigger key={value} value={value} className="nv-tab">
              <Icon className="h-4 w-4" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="disclosure">
          <WorkplaceRightsAndDisclosure />
        </TabsContent>
        <TabsContent value="rights">
          <Suspense fallback={<TabFallback />}><LegalRights /></Suspense>
        </TabsContent>
        <TabsContent value="accommodations">
          <Suspense fallback={<TabFallback />}><Accommodations /></Suspense>
        </TabsContent>
        <TabsContent value="state">
          <Suspense fallback={<TabFallback />}><StateByStateLaws /></Suspense>
        </TabsContent>
        <TabsContent value="international">
          <Suspense fallback={<TabFallback />}><InternationalLaws /></Suspense>
        </TabsContent>
        <TabsContent value="checklist">
          <Suspense fallback={<TabFallback />}><LegalRightsChecklist /></Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}