import React, { useEffect, useId, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { useRateResource } from '@/hooks/useWellnessLibrary';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import StarRating from '@/components/wellness/StarRating';

export default function WellnessRatingEditor({ resourceId, resourceTitle, myRating = 0, myNote = '' }) {
  const { isAuthenticated } = useAuth();
  const mutation = useRateResource();
  const [note, setNote] = useState(myNote);
  const noteId = useId();
  useEffect(() => { setNote(myNote); }, [myNote]);
  const save = (value) => {
    if (!isAuthenticated) { base44.auth.redirectToLogin(window.location.pathname); return; }
    if (!mutation.isPending) mutation.mutate({ resourceId, value, note });
  };
  return (
    <fieldset aria-label={`Rating and optional note for ${resourceTitle}`} className="min-w-0 space-y-2 rounded-lg border border-border bg-card p-3">
      <legend className="px-1 text-sm font-semibold text-foreground">Your rating and note</legend>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-foreground">Your rating</span>
        <StarRating value={myRating} onRate={save} disabled={mutation.isPending} size="h-5 w-5" />
      </div>
      <label htmlFor={noteId} className="block text-xs font-semibold text-foreground">Optional note for your rating</label>
      <Textarea id={noteId} value={note} onChange={(e) => setNote(e.target.value)} disabled={mutation.isPending}
        maxLength={1000} rows={2} placeholder="What helped, or what could be better?"
        aria-describedby={`${noteId}-status`} />
      <Button type="button" size="sm" variant="outline" disabled={mutation.isPending || !myRating || note === myNote}
        onClick={() => save(myRating)}>Save note</Button>
      <p id={`${noteId}-status`} role="status" className="text-xs text-foreground">
        {mutation.isPending ? 'Saving your rating and note…' : myRating
          ? `Saved rating: ${myRating} out of 5 stars${note !== myNote ? '. Note has unsaved changes.' : myNote ? '. Your note is saved too.' : '.'}`
          : 'Choose a star to save your rating and any note.'}
      </p>
      {mutation.isError && <p role="alert" className="text-sm text-destructive">We couldn’t confirm this change was saved. Please check your connection and try again.</p>}
    </fieldset>
  );
}