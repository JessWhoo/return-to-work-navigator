import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GuideBlock from './GuideBlock';

export default function GuideSection({ section }) {
  return (
    <Card id={section.id} className="border-2 border-slate-300 shadow-sm scroll-mt-28">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-violet-700 to-emerald-700 bg-clip-text text-transparent">
          {section.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {section.blocks.map((block, i) => (
          <GuideBlock key={i} block={block} />
        ))}
      </CardContent>
    </Card>
  );
}