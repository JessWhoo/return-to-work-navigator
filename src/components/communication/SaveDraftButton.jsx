import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Save, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/AuthContext';

/**
 * Saves an AI-generated email as a CommunicationDraft so it shows up in the
 * My Drafts tab, where it can be edited, copied or deleted later.
 * Shared by the email generators.
 */
export default function SaveDraftButton({ title, scenarioType, recipient, subject, content, className }) {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const [status, setStatus] = useState('idle'); // idle | saving | saved

  // Editing the message again means it differs from what was saved.
  useEffect(() => {
    setStatus('idle');
  }, [content, subject]);

  const handleSave = async () => {
    if (!content?.trim()) return;

    if (!isAuthenticated) {
      toast.error('Sign in to save drafts to My Drafts');
      return;
    }

    setStatus('saving');
    try {
      await base44.entities.CommunicationDraft.create({
        title,
        scenario_type: scenarioType,
        recipient: recipient || '',
        subject,
        content,
        tone: 'professional',
      });

      queryClient.invalidateQueries({ queryKey: ['communication-drafts'] });
      base44.analytics.track({
        eventName: 'communication_draft_saved',
        properties: { scenario_type: scenarioType, tone: 'professional', is_new: true },
      });
      setStatus('saved');
      toast.success('Saved to My Drafts');
    } catch (err) {
      setStatus('idle');
      toast.error('Could not save draft: ' + (err?.message || 'please try again'));
    }
  };

  return (
    <Button onClick={handleSave} disabled={status === 'saving'} className={className}>
      {status === 'saving' ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Saving…
        </>
      ) : status === 'saved' ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Saved to My Drafts
        </>
      ) : (
        <>
          <Save className="h-4 w-4 mr-2" />
          Save to My Drafts
        </>
      )}
    </Button>
  );
}