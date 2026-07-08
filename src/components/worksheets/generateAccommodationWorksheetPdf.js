import jsPDF from 'jspdf';

// Generate a clean, printable Accommodation Meeting Worksheet PDF.
// Uses only jspdf primitives so it prints reliably from any browser.
export function generateAccommodationWorksheetPdf(data) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 54;
  const contentWidth = pageWidth - marginX * 2;
  let y = 60;

  const ensureSpace = (needed) => {
    if (y + needed > pageHeight - 60) {
      doc.addPage();
      y = 60;
    }
  };

  const heading = (text) => {
    ensureSpace(28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(30, 41, 59);
    doc.text(text, marginX, y);
    y += 8;
    doc.setDrawColor(124, 58, 237);
    doc.setLineWidth(1);
    doc.line(marginX, y, marginX + contentWidth, y);
    y += 16;
  };

  const label = (text) => {
    ensureSpace(18);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(text.toUpperCase(), marginX, y);
    y += 14;
  };

  const paragraph = (text) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    const lines = doc.splitTextToSize(text || '—', contentWidth);
    ensureSpace(lines.length * 14 + 6);
    doc.text(lines, marginX, y);
    y += lines.length * 14 + 6;
  };

  const blankLines = (count) => {
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.6);
    for (let i = 0; i < count; i++) {
      ensureSpace(22);
      doc.line(marginX, y + 12, marginX + contentWidth, y + 12);
      y += 22;
    }
    y += 4;
  };

  const bulletList = (items) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    items.forEach((item) => {
      const lines = doc.splitTextToSize(item, contentWidth - 16);
      ensureSpace(lines.length * 14 + 4);
      doc.text('•', marginX, y);
      doc.text(lines, marginX + 14, y);
      y += lines.length * 14 + 4;
    });
    y += 4;
  };

  // ----- Header -----
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42);
  doc.text('Accommodation Meeting Worksheet', marginX, y);
  y += 24;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'A simple guide to help you prepare, take notes, and follow up.',
    marginX,
    y
  );
  y += 22;

  // ----- Meeting details -----
  heading('Meeting details');

  const details = [
    ['Employee name', data.employeeName],
    ['Meeting date', data.meetingDate],
    ['Meeting time', data.meetingTime],
    ['Location / Format', data.meetingLocation],
    ['Attendees', data.attendees],
  ];
  details.forEach(([k, v]) => {
    label(k);
    paragraph(v || '');
  });

  // ----- Goals -----
  heading('My goals for this meeting');
  paragraph(data.goals || '');
  if (!data.goals) blankLines(3);

  // ----- Accommodations requested -----
  heading('Accommodations I am requesting');
  const requests = (data.requests || '')
    .split('\n')
    .map((r) => r.trim())
    .filter(Boolean);
  if (requests.length) {
    bulletList(requests);
  } else {
    blankLines(4);
  }

  // ----- Why these help -----
  heading('Why these accommodations help me do my job');
  paragraph(data.rationale || '');
  if (!data.rationale) blankLines(3);

  // ----- Talking points -----
  heading('Talking points to remember');
  const points = (data.talkingPoints || '')
    .split('\n')
    .map((r) => r.trim())
    .filter(Boolean);
  if (points.length) {
    bulletList(points);
  } else {
    blankLines(4);
  }

  // ----- Questions to ask -----
  heading('Questions I want to ask');
  const questions = (data.questions || '')
    .split('\n')
    .map((r) => r.trim())
    .filter(Boolean);
  if (questions.length) {
    bulletList(questions);
  } else {
    blankLines(4);
  }

  // ----- Notes during meeting -----
  heading('Notes during the meeting');
  blankLines(8);

  // ----- Agreed next steps -----
  heading('Agreed next steps');
  blankLines(5);

  // ----- Follow-up -----
  heading('Follow-up');
  label('Follow-up date');
  blankLines(1);
  label('Person responsible');
  blankLines(1);

  // ----- Footer -----
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'Back to Life, Back to Work Navigator · Educational use only, not legal advice.',
      marginX,
      pageHeight - 30
    );
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - marginX,
      pageHeight - 30,
      { align: 'right' }
    );
  }

  const filename = `accommodation-worksheet-${(data.meetingDate || 'draft').replace(/[^0-9-]/g, '') || 'draft'}.pdf`;
  doc.save(filename);
}