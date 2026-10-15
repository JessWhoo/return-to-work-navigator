import React, { useState } from 'react';
import { Share2, Copy, Check, Mail, Heart, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

const SHARE_URL = 'https://return-to-work-navigator.org/AccommodationLetterGenerator';
const ROOT_URL = 'https://return-to-work-navigator.org';
const SHARE_MESSAGE =
  'If you are navigating work after cancer treatment, this free ADA Accommodation Letter Generator helps you draft a customized workplace request letter in a few minutes (no sign-in required): https://return-to-work-navigator.org/AccommodationLetterGenerator';

export default function PostLetterSharePrompt() {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  const trackShare = (method) => {
    try {
      base44.analytics.track({
        eventName: 'accommodation_letter_tool_shared',
        properties: { method },
      });
    } catch {
      // ignore analytics errors
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(ROOT_URL);
    setCopiedLink(true);
    trackShare('copy_link');
    toast.success('Link copied to clipboard');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyMessage = async () => {
    await navigator.clipboard.writeText(SHARE_MESSAGE);
    setCopiedMessage(true);
    trackShare('copy_group_message');
    toast.success('Support group message copied to clipboard');
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  const handleNativeOrEmailShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Free ADA Accommodation Letter Generator — Return to Work Navigator',
          text: 'A free, private tool for cancer survivors to generate a workplace accommodation request letter.',
          url: SHARE_URL,
        });
        trackShare('native_share');
        return;
      } catch {
        // user cancelled or share failed; fall back only if not AbortError
      }
    }
    trackShare('email_share');
    const subject = encodeURIComponent('Free ADA Accommodation Letter Generator for Cancer Survivors');
    const body = encodeURIComponent(`${SHARE_MESSAGE}\n\nExplore the full free toolkit at https://return-to-work-navigator.org`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <Card className="no-print nv-card--muted mt-6">
      <CardContent className="p-6 sm:p-8 space-y-4">
        <div className="flex items-start gap-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-brand-surface text-brand-primary shadow-brand-sm">
            <Heart className="h-5 w-5" />
          </span>
          <div className="space-y-1">
            <p className="nv-eyebrow nv-eyebrow--primary">Pay It Forward</p>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-brand-text">
              Know another survivor who could use this? Share the Navigator.
            </h3>
            <p className="text-sm text-brand-muted-foreground">
              The Navigator is always <strong className="text-brand-text">free</strong>, no sign-in required — and your personal
              letter never leaves this page. Only the link is shared.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button type="button" onClick={handleCopyLink}>
            {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copiedLink ? 'Link Copied' : 'Copy Link'}
          </Button>
          <Button type="button" variant="outline" onClick={handleCopyMessage}>
            {copiedMessage ? <Check className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
            {copiedMessage ? 'Message Copied' : 'Copy Post for Support Group'}
          </Button>
          <Button type="button" variant="outline" onClick={handleNativeOrEmailShare}>
            {typeof navigator !== 'undefined' && navigator.share ? (
              <>
                <Share2 className="h-4 w-4" /> Share Tool
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" /> Share via Email
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}