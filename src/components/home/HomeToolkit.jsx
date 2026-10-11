import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { sectionGroups } from '@/components/home/homeToolkitData';

export default function HomeToolkit() {
  return (
    <section className="space-y-8" aria-labelledby="home-toolkit-title">
      <div><span className="nv-eyebrow nv-eyebrow--primary">Your toolkit</span><h2 id="home-toolkit-title" className="mt-2 text-2xl font-bold sm:text-3xl">Everything, organised by what you're working on</h2></div>
      {sectionGroups.map(group => <div key={group.groupTitle}>
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3 border-b border-brand-border pb-3"><div><h3 className="text-xl font-bold">{group.groupTitle}</h3><p className="mt-1 text-sm text-brand-muted-foreground">{group.groupDescription}</p></div><span className="nv-chip nv-chip--muted">{group.items.length} {group.items.length === 1 ? 'tool' : 'tools'}</span></div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{group.items.map(item => {
          const Icon = item.icon;
          return <Link key={item.page} to={`/${item.page}`} className="nv-resource"><div className="nv-media flex items-center justify-center"><Icon className="h-9 w-9 text-brand-text" aria-hidden="true" /></div><div className="nv-body"><span className="nv-eyebrow nv-eyebrow--primary">{group.groupTitle}</span><h4 className="font-heading text-lg font-bold">{item.title}</h4><p>{item.description}</p><span className="nv-meta inline-flex items-center gap-2">Open {item.title}<ArrowRight className="h-4 w-4" aria-hidden="true" /></span></div></Link>;
        })}</div>
      </div>)}
    </section>
  );
}