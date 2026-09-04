import { jsPDF } from 'jspdf';
import { format, parseISO } from 'date-fns';

const STAGE_LABELS = {
  planning: 'Planning my return',
  first_week: 'First week back',
  ongoing: 'Ongoing adjustment',
  completed: 'Fully returned',
};

const fmt = (d) => {
  try { return format(typeof d === 'string' ? parseISO(d) : d, 'MMM d, yyyy'); }
  catch { return String(d || ''); }
};

/**
 * Build a printable, meeting-ready summary of the user's return-to-work
 * schedule (return date, stage, upcoming events) and accommodation list.
 */
export function generateReturnSummaryPdf({ progress, userName }) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const PAGE_W = doc.internal.pageSize.getWidth();
  const PAGE_H = doc.internal.pageSize.getHeight();
  const MARGIN = 48;
  const contentW = PAGE_W - MARGIN * 2;
  let y = MARGIN;

  const newPageIfNeeded = (needed = 40) => {
    if (y + needed > PAGE_H - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  };

  const heading = (text) => {
    newPageIfNeeded(50);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(text, MARGIN, y);
    y += 8;
    doc.setDrawColor(150);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 18;
  };

  const body = (text, indent = 0) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(text, contentW - indent);
    lines.forEach((line) => {
      newPageIfNeeded(18);
      doc.text(line, MARGIN + indent, y);
      y += 16;
    });
  };

  const labelValue = (label, value) => {
    newPageIfNeeded(20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(label, MARGIN, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, MARGIN + 170, y);
    y += 18;
  };

  // Title block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('Return-to-Work Summary', MARGIN, y);
  y += 24;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(90);
  doc.text(
    `${userName ? userName + ' • ' : ''}Prepared ${format(new Date(), 'MMMM d, yyyy')}`,
    MARGIN, y
  );
  doc.setTextColor(0);
  y += 26;

  // Schedule
  heading('My Return Schedule');
  labelValue('Current stage:', STAGE_LABELS[progress?.journey_stage] || 'Planning my return');
  labelValue('Return date:', progress?.return_date ? fmt(progress.return_date) : 'To be confirmed');
  y += 6;

  const events = [...(progress?.calendar_events || [])].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  newPageIfNeeded(20);
  doc.text('Key dates & milestones:', MARGIN, y);
  y += 18;
  if (events.length === 0) {
    body('No scheduled dates added yet.', 14);
  } else {
    events.forEach((e) => {
      body(`• ${fmt(e.date)} — ${e.title}${e.type ? ` (${String(e.type).replace(/_/g, ' ')})` : ''}`, 14);
      if (e.description) body(e.description, 28);
    });
  }
  y += 12;

  // Accommodations
  heading('Accommodations');
  const accs = progress?.accommodations_requested || [];
  if (accs.length === 0) {
    body('No accommodations recorded yet.', 14);
  } else {
    accs.forEach((a) => {
      body(`• ${a.type || 'Accommodation'}${a.status ? ` — status: ${String(a.status).replace(/_/g, ' ')}` : ''}`, 14);
      const dates = [
        a.date_requested ? `Requested ${fmt(a.date_requested)}` : null,
        a.review_date ? `Review ${fmt(a.review_date)}` : null,
      ].filter(Boolean).join(' • ');
      if (dates) body(dates, 28);
    });
  }
  y += 12;

  // Personal notes
  if (progress?.notes) {
    heading('Notes');
    body(progress.notes);
    y += 12;
  }

  // Discussion space for the meeting
  heading('Discussion Notes');
  doc.setDrawColor(205);
  for (let i = 0; i < 6; i++) {
    newPageIfNeeded(24);
    doc.line(MARGIN, y + 8, PAGE_W - MARGIN, y + 8);
    y += 24;
  }

  doc.save(`return-to-work-summary-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}