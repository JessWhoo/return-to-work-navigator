import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Phone, Heart, Scale, Globe } from 'lucide-react';
import ContactCard from '@/components/emergency/ContactCard';
import {
  crisisHotlines,
  cancerSupport,
  workplaceAndLegal,
  internationalDirectories,
} from '@/components/emergency/emergencyContactsData';
import useSEO from '@/hooks/useSEO';
import PageHeader from '@/components/brand/PageHeader';

function Section({ icon: Icon, iconColor, title, description, children }) {
  return (
    <section className="space-y-4">
      <div className="flex items-start gap-3">
        <div className={`p-2.5 rounded-xl ${iconColor} shadow-sm`}>
          <Icon className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-brand-text">{title}</h2>
          <p className="text-sm text-brand-muted-foreground font-medium">{description}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </section>
  );
}

export default function EmergencyContacts() {
  useSEO({
    title: '24/7 Crisis Hotlines & Cancer Support Helplines',
    description:
      'Free, confidential 24/7 crisis hotlines, oncology social work helplines, and legal aid contacts for cancer survivors needing immediate emotional or workplace support.',
    path: '/emergency-contacts',
  });

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <PageHeader center eyebrow="Immediate Support" title="24/7 Emergency Contacts & Cancer Support Hotlines" subtitle="If you're in crisis or need urgent help, you're not alone. Reach out any time — day or night. All lines below are free and confidential." />

      {/* 911 Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-destructive text-destructive-foreground rounded-brand-lg p-6 shadow-brand-md"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-destructive-foreground/20 rounded-full flex-shrink-0">
            <Phone className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold">Life-Threatening Emergency?</h2>
            <p className="font-medium">
              If you or someone you love is in immediate danger, call{' '}
              <a
                href="tel:911"
                onClick={() => {
                  if (typeof window !== 'undefined' && window.gtag) {
                    window.gtag('event', 'conversion', {
                      send_to: 'AW-18498327009/QvcyCOOjzJMdEOGj2PRE',
                    });
                  }
                }}
                className="underline font-bold text-destructive-foreground"
              >
                911
              </a>{' '}
              (US) or your local emergency number right now.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Crisis Hotlines */}
      <Section
        icon={AlertCircle}
        iconColor="bg-destructive"
        title="Crisis & Mental Health Hotlines"
        description="24/7 support when you're in emotional distress."
      >
        {crisisHotlines.map((c) => (
          <ContactCard key={c.name} contact={c} />
        ))}
      </Section>

      {/* Cancer Support */}
      <Section
        icon={Heart}
        iconColor="bg-brand-primary"
        title="Cancer Support & Counseling"
        description="Professional oncology social workers and survivor support."
      >
        {cancerSupport.map((c) => (
          <ContactCard key={c.name} contact={c} />
        ))}
      </Section>

      {/* Workplace & Legal */}
      <Section
        icon={Scale}
        iconColor="bg-brand-primary"
        title="Workplace & Legal Assistance"
        description="Free legal guidance on ADA, FMLA, accommodations, and discrimination."
      >
        {workplaceAndLegal.map((c) => (
          <ContactCard key={c.name} contact={c} />
        ))}
      </Section>

      {/* International */}
      <Section
        icon={Globe}
        iconColor="bg-brand-primary"
        title="Outside the US?"
        description="Find verified crisis lines in your country."
      >
        {internationalDirectories.map((c) => (
          <ContactCard key={c.name} contact={c} />
        ))}
      </Section>

      {/* Reassurance */}
      <div className="nv-card nv-card--muted p-8 text-center">
        <Heart className="h-10 w-10 text-brand-primary fill-brand-primary mx-auto mb-3" />
        <p className="text-brand-text font-medium max-w-2xl mx-auto">
          Reaching out is a sign of strength, not weakness. Whatever you're
          facing right now, there is a real person on the other end of these
          lines who wants to help.
        </p>
      </div>
    </div>
  );
}