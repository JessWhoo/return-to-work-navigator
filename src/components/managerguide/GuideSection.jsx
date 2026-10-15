import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GuideBlock from './GuideBlock';

export default function GuideSection({ section }) {
  return (
    <Card id={section.id} className="scroll-mt-28">
      <CardHeader className="pb-3">
        <CardTitle className="font-heading text-xl sm:text-2xl font-bold text-brand-text">
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