import React, { useState } from 'react';
import { Mail, MessageSquare, ExternalLink, Send, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import useSEO from '@/hooks/useSEO';
import PageHeader from '@/components/brand/PageHeader';
import SmsConsentCard from '@/components/sms/SmsConsentCard';
import { toast } from 'sonner';

export default function Contact() {
  useSEO({
    title: 'Contact Us',
    description:
      'Get in touch with the Back to Life, Back to Work team with questions, feedback or resource suggestions for cancer survivors returning to work.',
    path: '/Contact',
  });
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all fields.');
      return;
    }
    setSending(true);
    try {
      await base44.functions.invoke('sendAppEmail', {
        operation: 'contact_message',
        data: { name: form.name, email: form.email, message: form.message },
      });
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'conversion', {
          send_to: 'AW-18498327009/N9fnCJaezJMdEOGj2PRE',
        });
      }
      setSent(true);
    } catch {
      toast.error('Could not send your message. Please email us directly.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-12">
      {/* Header */}
      <PageHeader
        center
        eyebrow="Support"
        title="Contact Us"
        subtitle="We'd love to hear from you — questions, feedback, or partnership inquiries are all welcome."
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Email */}
        <Card>
          <CardContent className="flex items-start gap-4 p-6">
            <span className="flex-shrink-0 rounded-pill bg-brand-muted p-2 text-brand-primary">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <p className="mb-1 font-heading font-bold text-brand-text">Email</p>
              <a
                href="mailto:jess@artisanhrai.com"
                className="flex items-center gap-1 text-sm text-brand-primary underline transition-colors hover:text-brand-text"
              >
                jess@artisanhrai.com <ExternalLink className="h-3 w-3" />
              </a>
              <p className="mt-1 text-xs text-brand-muted-foreground">We aim to respond within 2 business days.</p>
            </div>
          </CardContent>
        </Card>

        {/* AI Coach */}
        <Card>
          <CardContent className="flex items-start gap-4 p-6">
            <span className="flex-shrink-0 rounded-pill bg-brand-muted p-2 text-brand-primary">
              <MessageSquare className="h-5 w-5" />
            </span>
            <div>
              <p className="mb-1 font-heading font-bold text-brand-text">Immediate Support</p>
              <p className="text-sm text-brand-muted-foreground">
                For return-to-work questions, our AI Coach is available 24/7 inside the app.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Text message program */}
      <SmsConsentCard />

      {/* Contact Form */}
      <Card>
        <CardContent className="p-8">
          {sent ? (
            <div className="space-y-3 py-8 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-brand-primary" />
              <p className="font-heading text-lg font-bold text-brand-text">Message Sent!</p>
              <p className="text-brand-muted-foreground">Thank you for reaching out. We'll be in touch soon.</p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }); }}
              >
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="font-heading text-xl font-bold text-brand-text">Send a Message</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-brand-text">Your Name</label>
                  <Input
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="nv-input"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-brand-text">Email Address</label>
                  <Input
                    type="email"
                    placeholder="jane@example.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="nv-input"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-brand-text">Message</label>
                <textarea
                  rows={5}
                  placeholder="Tell us how we can help…"
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  className="nv-input w-full resize-none px-3 py-2 text-sm"
                />
              </div>
              <Button
                type="submit"
                disabled={sending}
                className="w-full"
              >
                {sending ? 'Sending…' : <span className="flex items-center gap-2"><Send className="h-4 w-4" /> Send Message</span>}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}