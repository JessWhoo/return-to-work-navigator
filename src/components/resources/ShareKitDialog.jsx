import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Share2, FileDown, Mail, Loader2, BookOpen, StickyNote, Stethoscope, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { base44 } from '@/api/base44Client';

// Build the share kit as a PDF (bookmarked resources + saved notes)
async function buildShareKitPDF({ resources, notes, recipientLabel }) {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const generatedDate = format(new Date(), 'MMMM d, yyyy');

  // Header banner
  doc.setFillColor(15, 118, 110);
  doc.rect(0, 0, pageWidth, 22, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Back to Life, Back to Work Navigator', 14, 10);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Generated ${generatedDate}`, 14, 17);
  doc.setTextColor(0, 0, 0);

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 118, 110);
  doc.text('Share Kit', 14, 36);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  const subline = recipientLabel
    ? `Prepared for ${recipientLabel}`
    : 'Saved resources & personal notes';
  doc.text(subline, 14, 43);
  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(15, 118, 110);
  doc.line(14, 46, pageWidth - 14, 46);

  let y = 56;

  // Notes section
  if (notes && notes.trim()) {
    doc.setFillColor(240, 253, 250);
    doc.rect(10, y - 5, pageWidth - 20, 10, 'F');
    doc.setTextColor(15, 118, 110);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Personal Notes', 14, y + 1);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    y += 12;

    doc.setFontSize(10);
    const noteLines = doc.splitTextToSize(notes, pageWidth - 28);
    for (const line of noteLines) {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(line, 14, y);
      y += 5;
    }
    y += 6;
  }

  // Resources section
  if (resources?.length) {
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFillColor(240, 253, 250);
    doc.rect(10, y - 5, pageWidth - 20, 10, 'F');
    doc.setTextColor(15, 118, 110);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Saved Resources (${resources.length})`, 14, y + 1);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    y += 12;

    for (const r of resources) {
      if (y > 255) { doc.addPage(); y = 20; }

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 30, 30);
      const nameLines = doc.splitTextToSize(r.name, pageWidth - 28);
      doc.text(nameLines, 14, y);
      y += nameLines.length * 6;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 118, 110);
      const orgType = [r.org, r.type, r.category].filter(Boolean).join('  ·  ');
      if (orgType) { doc.text(orgType, 14, y); y += 6; }

      if (r.description) {
        doc.setTextColor(60, 60, 60);
        const descLines = doc.splitTextToSize(r.description, pageWidth - 28);
        if (y + descLines.length * 5 > 270) { doc.addPage(); y = 20; }
        doc.text(descLines, 14, y);
        y += descLines.length * 5 + 2;
      }

      if (r.url) {
        doc.setFontSize(8);
        doc.setTextColor(37, 99, 235);
        const urlText = doc.splitTextToSize(r.url, pageWidth - 28);
        doc.text(urlText, 14, y);
        y += urlText.length * 5;
      }

      doc.setDrawColor(220, 220, 220);
      y += 3;
      doc.line(14, y, pageWidth - 14, y);
      y += 7;
    }
  }

  // Footer
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${totalPages}  |  Back to Life, Back to Work Navigator`, 14, 290);
    doc.text(generatedDate, pageWidth - 40, 290);
  }

  return doc;
}

// Build an HTML email body
function buildEmailBody({ resources, notes, recipientLabel, senderNote }) {
  const generatedDate = format(new Date(), 'MMMM d, yyyy');
  const intro = recipientLabel
    ? `<p>Hello,</p><p>Below is a curated summary I'd like to share with you${recipientLabel ? ` as my ${recipientLabel}` : ''}.</p>`
    : `<p>Hello,</p><p>Below is a curated summary I'd like to share with you.</p>`;

  const senderBlock = senderNote
    ? `<div style="background:#f0fdfa;border-left:4px solid #0f766e;padding:12px 16px;margin:16px 0;border-radius:6px;"><p style="margin:0;font-size:14px;color:#134e4a;white-space:pre-wrap;">${escapeHtml(senderNote)}</p></div>`
    : '';

  const notesBlock = notes && notes.trim()
    ? `<h2 style="color:#0f766e;font-size:18px;margin-top:24px;border-bottom:2px solid #0f766e;padding-bottom:4px;">Personal Notes</h2>
       <p style="font-size:14px;color:#1e293b;white-space:pre-wrap;">${escapeHtml(notes)}</p>`
    : '';

  const resourceItems = (resources || []).map(r => `
    <div style="border:1px solid #e2e8f0;border-radius:8px;padding:14px;margin-bottom:12px;">
      <h3 style="margin:0 0 4px 0;font-size:15px;color:#0f172a;">${escapeHtml(r.name)}</h3>
      <p style="margin:0 0 6px 0;font-size:12px;color:#0f766e;">${escapeHtml([r.org, r.type, r.category].filter(Boolean).join(' · '))}</p>
      ${r.description ? `<p style="margin:0 0 8px 0;font-size:13px;color:#475569;">${escapeHtml(r.description)}</p>` : ''}
      ${r.url ? `<a href="${escapeHtml(r.url)}" style="font-size:12px;color:#2563eb;">${escapeHtml(r.url)}</a>` : ''}
    </div>
  `).join('');

  const resourcesBlock = resources?.length
    ? `<h2 style="color:#0f766e;font-size:18px;margin-top:24px;border-bottom:2px solid #0f766e;padding-bottom:4px;">Saved Resources (${resources.length})</h2>${resourceItems}`
    : '';

  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:640px;margin:0 auto;color:#0f172a;">
      <div style="background:#0f766e;color:#fff;padding:16px 20px;border-radius:8px 8px 0 0;">
        <h1 style="margin:0;font-size:20px;">Back to Life, Back to Work Navigator</h1>
        <p style="margin:4px 0 0 0;font-size:12px;opacity:0.9;">Generated ${generatedDate}</p>
      </div>
      <div style="padding:20px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;background:#fff;">
        ${intro}
        ${senderBlock}
        ${notesBlock}
        ${resourcesBlock}
        <p style="margin-top:24px;font-size:12px;color:#64748b;border-top:1px solid #e2e8f0;padding-top:12px;">
          This summary was generated by the Back to Life, Back to Work Navigator to support return-to-work conversations.
        </p>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

const RECIPIENT_PRESETS = [
  { id: 'healthcare', label: 'Healthcare Team', icon: Stethoscope },
  { id: 'employer', label: 'Employer / HR', icon: Briefcase },
];

export default function ShareKitDialog({ resources, bookmarkedIds, notes }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('pdf'); // 'pdf' | 'email'
  const [includeResources, setIncludeResources] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [recipientType, setRecipientType] = useState('healthcare');
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('Sharing my saved resources & notes');
  const [senderNote, setSenderNote] = useState('');
  const [busy, setBusy] = useState(false);

  // Flatten resources and filter to bookmarked ones
  const allFlat = (resources || []).flatMap(cat =>
    cat.items.map((item, idx) => ({
      ...item,
      id: `${cat.category}-${idx}`,
      category: cat.category,
    }))
  );
  const bookmarkedResources = allFlat.filter(r => bookmarkedIds?.includes(r.id));
  const hasNotes = !!(notes && notes.trim());

  const recipientLabel = RECIPIENT_PRESETS.find(p => p.id === recipientType)?.label || '';

  const handleOpen = (v) => {
    if (v) {
      base44.analytics.track({
        eventName: 'share_kit_dialog_opened',
        properties: {
          bookmarked_count: bookmarkedResources.length,
          has_notes: hasNotes,
        },
      });
    }
    setOpen(v);
  };

  const handleDownloadPDF = async () => {
    if (!includeResources && !includeNotes) {
      toast.error('Please include at least one section.');
      return;
    }
    setBusy(true);
    try {
      const doc = await buildShareKitPDF({
        resources: includeResources ? bookmarkedResources : [],
        notes: includeNotes ? notes : '',
        recipientLabel,
      });
      doc.save(`share-kit-${recipientType}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      toast.success('Share kit PDF downloaded!');
      base44.analytics.track({
        eventName: 'share_kit_pdf_downloaded',
        properties: { recipient_type: recipientType, resource_count: bookmarkedResources.length, included_notes: includeNotes },
      });
      setOpen(false);
    } catch (e) {
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleSendEmail = async () => {
    if (!emailTo || !/^\S+@\S+\.\S+$/.test(emailTo)) {
      toast.error('Please enter a valid recipient email.');
      return;
    }
    if (!includeResources && !includeNotes && !senderNote.trim()) {
      toast.error('Add a message or include resources/notes.');
      return;
    }
    setBusy(true);
    try {
      const body = buildEmailBody({
        resources: includeResources ? bookmarkedResources : [],
        notes: includeNotes ? notes : '',
        recipientLabel,
        senderNote,
      });
      await base44.integrations.Core.SendEmail({
        to: emailTo,
        subject: emailSubject || 'Sharing my saved resources & notes',
        body,
      });
      toast.success(`Email sent to ${emailTo}!`);
      base44.analytics.track({
        eventName: 'share_kit_email_sent',
        properties: { recipient_type: recipientType, resource_count: bookmarkedResources.length, included_notes: includeNotes },
      });
      setOpen(false);
    } catch (e) {
      toast.error('Failed to send email. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white gap-2">
          <Share2 className="h-4 w-4" />
          Share Kit (PDF / Email)
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border border-slate-700 text-slate-100 max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-slate-100 flex items-center gap-2">
            <Share2 className="h-5 w-5 text-indigo-400" />
            Share Your Saved Resources & Notes
          </DialogTitle>
          <p className="text-sm text-slate-400">
            Compile your bookmarked resources and personal notes into a polished PDF or send them by email.
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-5 pr-1 min-h-0">
          {/* Recipient preset */}
          <div>
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wide mb-2">Sharing with</p>
            <div className="grid grid-cols-2 gap-2">
              {RECIPIENT_PRESETS.map(p => {
                const Icon = p.icon;
                const active = recipientType === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setRecipientType(p.id)}
                    className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-all ${
                      active
                        ? 'border-indigo-500 bg-indigo-900/30 text-slate-100'
                        : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <span className="text-sm font-medium">{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sections to include */}
          <div>
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wide mb-2">Include</p>
            <div className="space-y-2">
              <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                includeResources ? 'border-teal-500 bg-teal-900/20' : 'border-slate-700 bg-slate-800/50'
              }`}>
                <Checkbox
                  checked={includeResources}
                  onCheckedChange={(v) => setIncludeResources(!!v)}
                  className="mt-0.5 border-slate-500 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-teal-400" />
                    <span className="text-sm font-semibold text-slate-100">Saved Resources</span>
                    <Badge className="bg-slate-700 text-slate-300 text-xs">{bookmarkedResources.length}</Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {bookmarkedResources.length === 0
                      ? 'No bookmarks yet. Save resources from the library first.'
                      : `${bookmarkedResources.length} bookmarked resource${bookmarkedResources.length !== 1 ? 's' : ''} will be included.`}
                  </p>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                includeNotes ? 'border-amber-500 bg-amber-900/20' : 'border-slate-700 bg-slate-800/50'
              }`}>
                <Checkbox
                  checked={includeNotes}
                  onCheckedChange={(v) => setIncludeNotes(!!v)}
                  disabled={!hasNotes}
                  className="mt-0.5 border-slate-500 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <StickyNote className="h-4 w-4 text-amber-400" />
                    <span className="text-sm font-semibold text-slate-100">Personal Notes</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {hasNotes
                      ? `${notes.length} characters from your journey notes will be included.`
                      : 'No personal notes saved yet. Add notes from your Journey page.'}
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Mode tabs */}
          <div>
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wide mb-2">Delivery</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setMode('pdf')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                  mode === 'pdf'
                    ? 'border-teal-500 bg-teal-900/30 text-slate-100'
                    : 'border-slate-700 bg-slate-800/50 text-slate-300'
                }`}
              >
                <FileDown className="h-4 w-4" />
                <span className="text-sm font-medium">Download PDF</span>
              </button>
              <button
                onClick={() => setMode('email')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                  mode === 'email'
                    ? 'border-indigo-500 bg-indigo-900/30 text-slate-100'
                    : 'border-slate-700 bg-slate-800/50 text-slate-300'
                }`}
              >
                <Mail className="h-4 w-4" />
                <span className="text-sm font-medium">Send Email</span>
              </button>
            </div>
          </div>

          {/* Email fields */}
          {mode === 'email' && (
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Recipient email</label>
                <Input
                  type="email"
                  placeholder={recipientType === 'healthcare' ? 'doctor@clinic.com' : 'hr@company.com'}
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  className="bg-slate-900 border-slate-600 text-slate-100"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Subject</label>
                <Input
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="bg-slate-900 border-slate-600 text-slate-100"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Optional personal message</label>
                <Textarea
                  rows={3}
                  placeholder="Add a short note to your recipient…"
                  value={senderNote}
                  onChange={(e) => setSenderNote(e.target.value)}
                  className="bg-slate-900 border-slate-600 text-slate-100"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-700 flex-shrink-0">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Cancel
          </Button>
          {mode === 'pdf' ? (
            <Button
              onClick={handleDownloadPDF}
              disabled={busy}
              className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
            >
              {busy ? <><Loader2 className="h-4 w-4 animate-spin" />Generating…</> : <><FileDown className="h-4 w-4" />Download PDF</>}
            </Button>
          ) : (
            <Button
              onClick={handleSendEmail}
              disabled={busy}
              className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
            >
              {busy ? <><Loader2 className="h-4 w-4 animate-spin" />Sending…</> : <><Mail className="h-4 w-4" />Send Email</>}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}