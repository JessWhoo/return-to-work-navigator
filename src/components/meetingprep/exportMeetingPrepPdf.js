import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

const MEETING_TYPE_LABELS = {
  accommodation_request: 'Accommodation Request',
  return_to_work_plan: 'Return to Work Plan',
  performance_review: 'Performance Review',
  hr_discussion: 'HR Discussion',
  supervisor_checkin: 'Supervisor Check-in',
  disclosure: 'Medical Disclosure',
  other: 'Other'
};

const STATUS_LABELS = {
  drafting: 'Drafting',
  ready: 'Ready',
  completed: 'Completed',
  follow_up: 'Follow-up Needed'
};

const OUTCOME_LABELS = {
  approved: 'Approved',
  denied: 'Denied',
  pending: 'Pending',
  partial: 'Partial',
  follow_up_needed: 'Follow-up Needed'
};

// A polished, printable summary of a MeetingPrep record.
export function exportMeetingPrepPdf(meeting) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 54;
  const contentWidth = pageWidth - marginX * 2;
  let y = 60;

  const ensureSpace = (needed) => {
    if (y + needed > pageHeight - 54) {
      doc.addPage();
      y = 60;
    }
  };

  const writeParagraph = (text, opts = {}) => {
    const { size = 11, style = 'normal', color = [30, 41, 59], lineGap = 4 } = opts;
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(String(text ?? ''), contentWidth);
    lines.forEach((line) => {
      ensureSpace(size + lineGap);
      doc.text(line, marginX, y);
      y += size + lineGap;
    });
  };

  const sectionHeading = (label) => {
    ensureSpace(28);
    y += 8;
    doc.setDrawColor(139, 92, 246); // purple accent
    doc.setLineWidth(2);
    doc.line(marginX, y, marginX + 24, y);
    y += 14;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(88, 28, 135);
    doc.text(label.toUpperCase(), marginX, y);
    y += 14;
  };

  // ---- Header ----
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42);
  doc.text('Meeting Preparation', marginX, y);
  y += 26;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(30, 41, 59);
  const titleLines = doc.splitTextToSize(meeting.title || 'Untitled meeting', contentWidth);
  titleLines.forEach((line) => {
    doc.text(line, marginX, y);
    y += 20;
  });

  // Meta line
  const metaParts = [];
  if (meeting.meeting_type) metaParts.push(MEETING_TYPE_LABELS[meeting.meeting_type] || meeting.meeting_type);
  if (meeting.meeting_date) {
    try { metaParts.push(format(new Date(meeting.meeting_date), 'MMMM d, yyyy')); } catch { /* ignore invalid date */ }
  }
  if (meeting.status) metaParts.push(`Status: ${STATUS_LABELS[meeting.status] || meeting.status}`);
  if (metaParts.length) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(metaParts.join('  •  '), marginX, y);
    y += 16;
  }

  if (meeting.attendees) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    const attendeeLines = doc.splitTextToSize(`Attendees: ${meeting.attendees}`, contentWidth);
    attendeeLines.forEach((line) => {
      ensureSpace(14);
      doc.text(line, marginX, y);
      y += 14;
    });
  }

  y += 6;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.8);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 8;

  // ---- Sections ----
  if (meeting.goals) {
    sectionHeading('Goals');
    writeParagraph(meeting.goals);
  }

  if (meeting.talking_points?.length) {
    sectionHeading('Talking Points');
    meeting.talking_points.forEach((pt, i) => {
      writeParagraph(`${i + 1}.  ${pt}`);
    });
  }

  if (meeting.accommodation_requests?.length) {
    sectionHeading('Accommodation Requests');
    meeting.accommodation_requests.forEach((req, i) => {
      writeParagraph(`${i + 1}.  ${req.accommodation || ''}`, { style: 'bold' });
      if (req.reason) writeParagraph(`Reason: ${req.reason}`, { color: [71, 85, 105] });
      y += 2;
    });
  }

  if (meeting.anticipated_objections?.length) {
    sectionHeading('Anticipated Objections');
    meeting.anticipated_objections.forEach((obj) => {
      writeParagraph(`•  ${obj}`);
    });
  }

  if (meeting.documents_to_bring?.length) {
    sectionHeading('Documents to Bring');
    meeting.documents_to_bring.forEach((doc_) => {
      writeParagraph(`☐  ${doc_}`);
    });
  }

  if (meeting.employer_responses?.length) {
    sectionHeading('Employer Responses');
    meeting.employer_responses.forEach((r, i) => {
      let header = `${i + 1}.`;
      if (r.date) {
        try { header += `  ${format(new Date(r.date), 'MMM d, yyyy')}`; } catch { /* ignore */ }
      }
      if (r.outcome) header += `  —  ${OUTCOME_LABELS[r.outcome] || r.outcome}`;
      writeParagraph(header, { style: 'bold' });
      if (r.response_text) writeParagraph(r.response_text);
      if (r.notes) writeParagraph(`Notes: ${r.notes}`, { color: [71, 85, 105] });
      y += 2;
    });
  }

  if (meeting.outcome_summary) {
    sectionHeading('Outcome Summary');
    writeParagraph(meeting.outcome_summary);
  }

  if (meeting.description) {
    sectionHeading('Additional Notes');
    writeParagraph(meeting.description);
  }

  // ---- Footer on every page ----
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    const footer = `Generated ${format(new Date(), 'MMM d, yyyy')}  •  Page ${i} of ${pageCount}`;
    doc.text(footer, pageWidth / 2, pageHeight - 30, { align: 'center' });
  }

  // ---- Save ----
  const safeTitle = (meeting.title || 'meeting-prep')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'meeting-prep';
  doc.save(`${safeTitle}.pdf`);
}