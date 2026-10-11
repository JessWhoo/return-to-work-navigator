import React from 'react';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ForumReplyComposer({ text, anonymous, onTextChange, onAnonymousChange, onSubmit }) {
  return (
    <div className="space-y-3">
      <Input aria-label="Write a reply" value={text} onChange={e => onTextChange(e.target.value)} placeholder="Write a reply..." className="min-w-0 text-sm" onKeyDown={e => e.key === 'Enter' && onSubmit()} />
      <div className="flex items-center justify-between gap-3">
        <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-brand-muted-foreground">
          <input type="checkbox" checked={anonymous} onChange={e => onAnonymousChange(e.target.checked)} className="h-4 w-4 accent-primary" />
          Anon
        </label>
        <Button size="icon" onClick={onSubmit} aria-label="Send reply" className="shrink-0">
          <Send className="h-4 w-4" strokeWidth={1.75} />
        </Button>
      </div>
    </div>
  );
}