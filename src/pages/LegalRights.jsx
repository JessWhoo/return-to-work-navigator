import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, Scale, FileText, AlertCircle, 
  CheckCircle2, Building, Clock 
} from 'lucide-react';
import AccommodationRequestGuide from '@/components/legal/AccommodationRequestGuide';
import GuideFaqSection from '@/components/seo/GuideFaqSection';
import { LEGAL_RIGHTS_FAQS } from '@/components/seo/guideFaqsData';
import useSEO from '@/hooks/useSEO';

const laws = [
  {
    id: 'ada',
    name: 'Americans with Disabilities Act (ADA)',
    year: 'Amended 2008',
    icon: Shield,
    color: 'blue',
    summary: 'Protects you from discrimination and requires employers to provide reasonable accommodations',
    sections: [
      {
        title: 'Who is Covered?',
        content: [
          'Private employers with 15+ employees',
          'State and local governments',
          'Employment agencies and labor unions'
        ]
      },
      {
        title: 'Key Protections',
        content: [
          'Cannot discriminate in hiring, firing, advancement, or compensation',
          'Must provide reasonable accommodations unless it causes undue hardship',
          'Medical information must be kept confidential',
          'Protection from retaliation',
          'No pre-employment medical exams or disability questions'
        ]
      },
      {
        title: 'When Cancer Qualifies',
        content: [
          'Cancer almost always qualifies as a disability under the 2008 amendments',
          'Substantially limits major life activity (like normal cell growth)',
          'History of Cancer counts, even if in remission',
          'Being "regarded as" having a disability is enough'
        ]
      },
      {
        title: 'Reasonable Accommodations Examples',
        content: [
          'Flexible schedules for appointments',
          'Remote work options',
          'Modified break schedules',
          'Reduced or part-time hours',
          'Reserved parking',
          'Ergonomic equipment',
          'Temperature adjustments'
        ]
      }
    ]
  },
  {
    id: 'fmla',
    name: 'Family and Medical Leave Act (FMLA)',
    year: 'Enacted 1993',
    icon: Clock,
    color: 'teal',
    summary: 'Guarantees job-protected, unpaid leave for medical reasons',
    sections: [
      {
        title: 'Employer Coverage',
        content: [
          'Private employers with 50+ employees within 75 miles',
          'All public agencies regardless of size',
          'Public and private schools regardless of size'
        ]
      },
      {
        title: 'Employee Eligibility',
        content: [
          'Worked for employer at least 12 months',
          'Worked at least 1,250 hours in past 12 months',
          'Work location has 50+ employees within 75 miles'
        ]
      },
      {
        title: 'Leave Entitlement',
        content: [
          'Up to 12 weeks unpaid leave per year',
          'Can be continuous, intermittent, or reduced schedule',
          'Job protection - right to return to same or equivalent position',
          'Health insurance continues during leave',
          'Up to 26 weeks for military caregiver leave'
        ]
      },
      {
        title: 'Using FMLA for Cancer',
        content: [
          'Continuous: All at once for surgery/recovery',
          'Intermittent: Separate blocks for treatment days',
          'Reduced schedule: Fewer hours during treatment',
          'Can run concurrently with other leave types'
        ]
      }
    ]
  },
  {
    id: 'cobra',
    name: 'COBRA',
    year: 'Enacted 1985',
    icon: FileText,
    color: 'purple',
    summary: 'Allows you to continue employer health insurance after leaving employment',
    sections: [
      {
        title: 'Who is Covered?',
        content: [
          'Employers with 20+ employees',
          'You must have been enrolled in the health plan',
          'Applies after job loss, hour reduction, or other qualifying events'
        ]
      },
      {
        title: 'Coverage Duration',
        content: [
          '18-36 months depending on qualifying event',
          '29 months if disabled at time of job loss',
          'You pay full premium plus up to 2% admin fee'
        ]
      },
      {
        title: 'Important Deadlines',
        content: [
          'You have 60 days to elect COBRA from notice date',
          'Missing deadline = loss of coverage rights',
          'Must notify plan of disability within 60 days for extended coverage'
        ]
      }
    ]
  },
  {
    id: 'aca',
    name: 'Affordable Care Act (ACA)',
    year: 'Enacted 2010',
    icon: Building,
    color: 'rose',
    summary: 'Critical health insurance protections including pre-existing condition coverage',
    sections: [
      {
        title: 'Pre-Existing Condition Protections',
        content: [
          'No denial of coverage based on cancer history',
          'No higher premiums because of health status',
          'No waiting periods for pre-existing conditions',
          'Applies to all health insurance plans'
        ]
      },
      {
        title: 'Coverage Limits',
        content: [
          'No lifetime limits on essential health benefits',
          'No annual limits on essential benefits',
          'Out-of-pocket maximum protections',
          'Free preventive services including cancer screenings'
        ]
      },
      {
        title: 'Additional Protections',
        content: [
          'Young adults can stay on parent\'s plan until age 26',
          'Cannot cancel coverage when you get sick',
          'Must cover essential health benefits'
        ]
      }
    ]
  }
];

const accentMap = {
  blue: { iconBg: 'bg-primary', check: 'text-primary' },
  teal: { iconBg: 'bg-brand-secondary', check: 'text-brand-secondary' },
  purple: { iconBg: 'bg-primary', check: 'text-primary' },
  rose: { iconBg: 'bg-destructive', check: 'text-destructive' },
};

export default function LegalRights({ embedded = false }) {
  useSEO({
    title: 'ADA, FMLA, COBRA & HIPAA Protections for Cancer Survivors',
    description:
      'Plain-language guide to federal employment laws protecting cancer survivors at work: the Americans with Disabilities Act (ADA), FMLA leave, COBRA, and GINA.',
    path: '/LegalRights',
    enabled: !embedded,
  });
  const [activeTab, setActiveTab] = useState('ada');

  const handleTabChange = (lawId) => {
    setActiveTab(lawId);
    base44.analytics.track({ eventName: 'legal_rights_tab_viewed', properties: { law: lawId } });
  };

  const handleResourceClick = (resource, url) => {
    base44.analytics.track({ eventName: 'legal_rights_resource_clicked', properties: { resource, url } });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div className="space-y-4 text-center">
        {embedded ? (
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Federal Workplace Legal Rights for Cancer Survivors
          </h2>
        ) : (
          <h1 className="font-heading text-4xl font-bold text-foreground">
            Federal Workplace Legal Rights for Cancer Survivors
          </h1>
        )}
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Understanding your ADA, FMLA, COBRA, and HIPAA workplace protections as a cancer survivor
        </p>
      </div>

      {/* Important Notice */}
      <Alert className="nv-card--muted border-destructive/30">
        <AlertCircle className="h-5 w-5 text-destructive" />
        <AlertDescription className="text-foreground">
          <strong>Important Notice:</strong> This information is for educational purposes only and should not be
          considered legal advice. For specific guidance about your situation, please consult with a
          qualified employment attorney or contact the EEOC.
        </AlertDescription>
      </Alert>

      {/* Laws Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          {laws.map((law) => {
            const Icon = law.icon;
            return (
              <TabsTrigger 
                key={law.id} 
                value={law.id}
                onClick={() => handleTabChange(law.id)}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{law.id.toUpperCase()}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {laws.map((law) => {
          const Icon = law.icon;
          const accent = accentMap[law.color] || accentMap.blue;
          return (
            <TabsContent
              key={law.id}
              value={law.id}
              forceMount
              className={`space-y-6 ${activeTab === law.id ? '' : 'hidden'}`}
              style={{ outline: 'none' }}
            >
              {/* Law Overview */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className={`rounded-brand p-3 ${accent.iconBg}`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="mb-2 flex items-center space-x-3">
                        <h2 className="font-heading text-2xl font-bold text-foreground">{law.name}</h2>
                        <Badge variant="secondary">{law.year}</Badge>
                      </div>
                      <p className="font-medium leading-relaxed text-muted-foreground">{law.summary}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Sections */}
              <div className="grid gap-6">
                {law.sections.map((section, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-lg">
                        <CheckCircle2 className={`h-5 w-5 ${accent.check}`} />
                        <span className="font-bold text-foreground">{section.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {section.content.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start space-x-3">
                            <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                            <span className="leading-relaxed text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Plain-language accommodation request guide */}
      <AccommodationRequestGuide />

      {/* Resources for Help */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Scale className="h-6 w-6 text-primary" />
            <span>Where to Get Help</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-brand border border-border bg-muted p-4">
              <h4 className="mb-2 font-semibold text-foreground">EEOC</h4>
              <p className="mb-2 text-sm text-muted-foreground">Enforces ADA and employment discrimination laws</p>
              <p className="text-sm text-muted-foreground">📞 1-800-669-4000</p>
              <a href="https://www.eeoc.gov" target="_blank" rel="noopener noreferrer" onClick={() => handleResourceClick('EEOC', 'https://www.eeoc.gov')} className="text-sm font-semibold text-primary hover:text-foreground hover:underline">🌐 www.eeoc.gov</a>
            </div>

            <div className="rounded-brand border border-border bg-muted p-4">
              <h4 className="mb-2 font-semibold text-foreground">Dept. of Labor</h4>
              <p className="mb-2 text-sm text-muted-foreground">Enforces FMLA</p>
              <p className="text-sm text-muted-foreground">📞 1-866-487-2365</p>
              <a href="https://www.dol.gov" target="_blank" rel="noopener noreferrer" onClick={() => handleResourceClick('Dept. of Labor', 'https://www.dol.gov')} className="text-sm font-semibold text-primary hover:text-foreground hover:underline">🌐 www.dol.gov</a>
            </div>

            <div className="rounded-brand border border-border bg-muted p-4">
              <h4 className="mb-2 font-semibold text-foreground">Job Accommodation Network</h4>
              <p className="mb-2 text-sm text-muted-foreground">Free guidance on accommodations</p>
              <p className="text-sm text-muted-foreground">📞 1-800-526-7234</p>
              <a href="https://askjan.org" target="_blank" rel="noopener noreferrer" onClick={() => handleResourceClick('Job Accommodation Network', 'https://askjan.org')} className="text-sm font-semibold text-primary hover:text-foreground hover:underline">🌐 askjan.org</a>
            </div>

            <div className="rounded-brand border border-border bg-muted p-4">
              <h4 className="mb-2 font-semibold text-foreground">Triage Cancer</h4>
              <p className="mb-2 text-sm text-muted-foreground">Legal info for cancer patients</p>
              <a href="https://triagecancer.org" target="_blank" rel="noopener noreferrer" onClick={() => handleResourceClick('Triage Cancer', 'https://triagecancer.org')} className="text-sm font-semibold text-primary hover:text-foreground hover:underline">🌐 triagecancer.org</a>
            </div>
          </div>
        </CardContent>
      </Card>

      <GuideFaqSection
        id="legal-rights-faq"
        eyebrow="Federal Workplace Law FAQ"
        title="Frequently Asked Questions: ADA, FMLA & COBRA for Cancer Survivors"
        subtitle="Direct answers on how federal leave, disability accommodations, and health insurance continuation protect you during and after cancer treatment."
        faqs={LEGAL_RIGHTS_FAQS}
        headingLevel={embedded ? 'h3' : 'h2'}
      />
    </div>
  );
}