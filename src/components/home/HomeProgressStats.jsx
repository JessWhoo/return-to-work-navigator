import React from 'react';

const stages = { planning: 'Planning', first_week: 'First week', ongoing: 'Ongoing', completed: 'Completed' };
export default function HomeProgressStats({ progress }) {
  if (!progress) return null;
  const stats = [
    { label: 'Checklist items', value: progress.completed_checklist_items?.length || 0, blurb: 'Steps you have marked off so far.' },
    { label: 'Current stage', value: stages[progress.journey_stage] || 'Planning', blurb: 'Where you are on the road back.' },
    { label: 'Saved resources', value: progress.bookmarked_resources?.length || 0, blurb: 'Guides and tools you kept for later.' },
  ];
  return <div className="grid gap-4 sm:grid-cols-3">{stats.map(stat => <div key={stat.label} className="nv-milestone"><span className="nv-eyebrow">{stat.label}</span><h3>{stat.value}</h3><p>{stat.blurb}</p></div>)}</div>;
}