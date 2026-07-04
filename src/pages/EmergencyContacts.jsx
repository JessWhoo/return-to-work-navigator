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

function Section({ icon: Icon, iconColor, title, description, children }) {
  return (
    <section className="space-y-4">
      <div className="flex items-start gap-3">
        <div className={`p-2.5 rounded-xl ${iconColor} shadow-sm`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-700 font-medium">{description}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </section>
  );
}

export default function EmergencyContacts() {
  useSEO({
    title: 'Emergency Contacts & Crisis Resources',
    description:
      'Critical hotlines, crisis text lines, and professional contacts for immediate emotional, medical, and legal assistance for cancer survivors.',
    path: '/emergency-contacts',
  });

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full border-2 border-rose-300 shadow-sm">
          <AlertCircle className="h-4 w-4 text-rose-600" />
          <span className="text-sm font-bold text-slate-900">Immediate Support</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-rose-600 via-violet-600 to-sky-700 bg-clip-text text-transparent leading-tight">
          Emergency Contacts
        </h1>
        <p className="text-lg text-slate-700 max-w-2xl mx-auto font-medium leading-relaxed">
          If you're in crisis or need urgent help, you're not alone. Reach out
          any time — day or night. All lines below are free and confidential.
        </p>
      </motion.div>

      {/* 911 Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-full flex-shrink-0">
            <Phone className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold">Life-Threatening Emergency?</h2>
            <p className="font-medium leading-relaxed">
              If you or someone you love is in immediate danger, call{' '}
              <a
                href="tel:911"
                className="underline font-extrabold text-white hover:text-rose-100"
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
        iconColor="bg-gradient-to-br from-rose-500 to-red-600"
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
        iconColor="bg-gradient-to-br from-violet-500 to-fuchsia-600"
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
        iconColor="bg-gradient-to-br from-sky-500 to-emerald-600"
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
        iconColor="bg-gradient-to-br from-amber-500 to-orange-600"
        title="Outside the US?"
        description="Find verified crisis lines in your country."
      >
        {internationalDirectories.map((c) => (
          <ContactCard key={c.name} contact={c} />
        ))}
      </Section>

      {/* Reassurance */}
      <div className="bg-gradient-to-r from-rose-100 via-amber-50 to-sky-100 border-2 border-rose-200 rounded-2xl p-8 text-center shadow-md">
        <Heart className="h-10 w-10 text-rose-600 fill-rose-500 mx-auto mb-3" />
        <p className="text-slate-800 font-medium leading-relaxed max-w-2xl mx-auto">
          Reaching out is a sign of strength, not weakness. Whatever you're
          facing right now, there is a real person on the other end of these
          lines who wants to help.
        </p>
      </div>
    </div>
  );
}