import React, { useState } from 'react';
import { Mail, MessageSquare, ExternalLink, Send, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function Contact() {
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
      await base44.integrations.Core.SendEmail({
        to: 'jess@artisanhrai.com',
        subject: `Contact Form: ${form.name}`,
        body: `From: ${form.name} <${form.email}>\n\n${form.message}`,
      });
      setSent(true);
    } catch {
      toast.error('Could not send your message. Please email us directly.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent leading-tight">
          Contact Us
        </h1>
        <p className="text-slate-700 text-lg max-w-xl mx-auto">
          We'd love to hear from you — questions, feedback, or partnership inquiries are all welcome.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Email */}
        <Card className="bg-white border-teal-400">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="p-2 rounded-xl bg-teal-50 border border-teal-300 flex-shrink-0">
              <Mail className="h-5 w-5 text-teal-700" />
            </div>
            <div>
              <p className="text-slate-900 font-semibold mb-1">Email</p>
              <a
                href="mailto:jess@artisanhrai.com"
                className="text-teal-700 hover:text-teal-800 text-sm transition-colors flex items-center gap-1"
              >
                jess@artisanhrai.com <ExternalLink className="h-3 w-3" />
              </a>
              <p className="text-slate-700 text-xs mt-1">We aim to respond within 2 business days.</p>
            </div>
          </CardContent>
        </Card>

        {/* AI Coach */}
        <Card className="bg-white border-cyan-400">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="p-2 rounded-xl bg-cyan-50 border border-cyan-300 flex-shrink-0">
              <MessageSquare className="h-5 w-5 text-cyan-700" />
            </div>
            <div>
              <p className="text-slate-900 font-semibold mb-1">Immediate Support</p>
              <p className="text-slate-700 text-sm">
                For return-to-work questions, our AI Coach is available 24/7 inside the app.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Form */}
      <Card className="bg-white border-slate-300">
        <CardContent className="p-8">
          {sent ? (
            <div className="text-center space-y-3 py-8">
              <CheckCircle className="h-12 w-12 text-teal-600 mx-auto" />
              <p className="text-slate-900 font-semibold text-lg">Message Sent!</p>
              <p className="text-slate-700">Thank you for reaching out. We'll be in touch soon.</p>
              <Button
                variant="outline"
                className="border-slate-400 text-slate-800 hover:bg-slate-100 mt-2"
                onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }); }}
              >
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-xl font-semibold text-slate-900">Send a Message</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-800 text-sm font-medium">Your Name</label>
                  <Input
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="bg-white border-slate-300 text-slate-900 placeholder-slate-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-800 text-sm font-medium">Email Address</label>
                  <Input
                    type="email"
                    placeholder="jane@example.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="bg-white border-slate-300 text-slate-900 placeholder-slate-500"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-800 text-sm font-medium">Message</label>
                <textarea
                  rows={5}
                  placeholder="Tell us how we can help…"
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  className="w-full rounded-md bg-white border border-slate-300 text-slate-900 placeholder-slate-500 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>
              <Button
                type="submit"
                disabled={sending}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold py-5 rounded-xl"
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