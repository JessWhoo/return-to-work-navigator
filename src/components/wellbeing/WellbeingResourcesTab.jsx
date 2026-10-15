import React from 'react';
import WellnessLibrary from '@/pages/WellnessLibrary';
import WellnessResources from '@/pages/WellnessResources';
import ResourceLibrary from '@/pages/ResourceLibrary';

/**
 * A single consolidated "Resources & Libraries" view that brings the
 * previously scattered library tabs — Wellness Library, Wellness Resources
 * (coping techniques), and the Legal & Workplace Resource Library — together
 * into one place inside the Wellbeing Hub.
 *
 * Each embedded library suppresses its own page header and SEO (via the
 * `embedded` prop) so the section headers below are the only headings.
 */
export default function WellbeingResourcesTab() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <div>
          <p className="nv-eyebrow nv-eyebrow--primary">Wellness Library</p>
          <h2 className="font-heading text-2xl font-bold text-brand-text">
            Cancer Survivorship &amp; Workplace Wellness Library
          </h2>
          <p className="text-sm text-brand-muted-foreground">
            Search trusted fatigue, sleep, nutrition, and emotional wellness resources by topic, and rate how helpful each one was.
          </p>
        </div>
        <WellnessLibrary embedded />
      </section>

      <section className="space-y-4">
        <div>
          <p className="nv-eyebrow nv-eyebrow--primary">Coping Techniques</p>
          <h2 className="font-heading text-2xl font-bold text-brand-text">
            Workplace Stress Relief &amp; Wellness Techniques
          </h2>
          <p className="text-sm text-brand-muted-foreground">
            Quick breathing, grounding, sleep, and cognitive techniques for the workday.
          </p>
        </div>
        <WellnessResources embedded />
      </section>

      <section className="space-y-4">
        <div>
          <p className="nv-eyebrow nv-eyebrow--primary">Legal &amp; Workplace Resources</p>
          <h2 className="font-heading text-2xl font-bold text-brand-text">
            Legal Rights &amp; Workplace Accommodation Resource Library
          </h2>
          <p className="text-sm text-brand-muted-foreground">
            Every ADA guide, FMLA template, and trusted legal resource — searchable and organized in one place.
          </p>
        </div>
        <ResourceLibrary embedded />
      </section>
    </div>
  );
}