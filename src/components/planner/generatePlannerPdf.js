import { jsPDF } from 'jspdf';
import { format, addDays, startOfWeek } from 'date-fns';

/**
 * Generate a printable weekly planner PDF with daily fields for
 * energy levels, fatigue tracking, and workplace goals.
 * One page per day, 7 days starting from the given start date (or today).
 */
export function generatePlannerPdf({ weeks = 1, startDate } = {}) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const PAGE_W = doc.internal.pageSize.getWidth();
  const PAGE_H = doc.internal.pageSize.getHeight();
  const MARGIN = 40;

  const start = startDate ? new Date(startDate) : startOfWeek(new Date(), { weekStartsOn: 1 });
  const totalDays = weeks * 7;

  // Cover page
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text('Back to Life, Back to Work', PAGE_W / 2, 140, { align: 'center' });
  doc.setFontSize(18);
  doc.text('Daily Planner', PAGE_W / 2, 170, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(
    'Track your energy, fatigue, and workplace goals each day.',
    PAGE_W / 2, 210, { align: 'center' }
  );
  doc.text(
    `Week of ${format(start, 'MMMM d, yyyy')}`,
    PAGE_W / 2, 232, { align: 'center' }
  );

  doc.setFontSize(11);
  const tips = [
    'Fill this out at the start of each day, then check in at midday and evening.',
    'Rate energy and fatigue on a 1–10 scale (1 = very low, 10 = very high).',
    'Set 1–3 realistic workplace goals — small wins build momentum.',
    'Use the notes section to spot patterns over time.',
  ];
  let y = 280;
  tips.forEach((t) => {
    doc.text('• ' + t, MARGIN, y, { maxWidth: PAGE_W - MARGIN * 2 });
    y += 22;
  });

  // Daily pages
  for (let i = 0; i < totalDays; i++) {
    doc.addPage();
    const day = addDays(start, i);
    renderDailyPage(doc, day, { PAGE_W, PAGE_H, MARGIN });
  }

  doc.save(`daily-planner-${format(start, 'yyyy-MM-dd')}.pdf`);
}

function renderDailyPage(doc, day, { PAGE_W, PAGE_H, MARGIN }) {
  const contentW = PAGE_W - MARGIN * 2;
  let y = MARGIN;

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(format(day, 'EEEE'), MARGIN, y + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(format(day, 'MMMM d, yyyy'), PAGE_W - MARGIN, y + 4, { align: 'right' });
  y += 20;
  doc.setDrawColor(180);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 20;

  // Energy Levels
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Energy Levels (circle one per time of day)', MARGIN, y);
  y += 16;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  ['Morning', 'Afternoon', 'Evening'].forEach((label) => {
    doc.text(label, MARGIN, y + 10);
    drawScale(doc, MARGIN + 90, y + 6, contentW - 90, 10);
    y += 22;
  });
  y += 6;

  // Fatigue Tracking
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Fatigue Tracking', MARGIN, y);
  y += 16;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text('Overall fatigue today:', MARGIN, y + 10);
  drawScale(doc, MARGIN + 145, y + 6, contentW - 145, 10);
  y += 26;

  doc.text('Peak fatigue time:', MARGIN, y);
  drawWriteLine(doc, MARGIN + 115, y + 2, contentW - 115);
  y += 22;

  doc.text('Triggers / activities:', MARGIN, y);
  drawWriteLine(doc, MARGIN + 125, y + 2, contentW - 125);
  y += 22;

  doc.text('Rest breaks taken:', MARGIN, y);
  drawWriteLine(doc, MARGIN + 115, y + 2, contentW - 115);
  y += 30;

  // Workplace Goals
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Workplace Goals for Today', MARGIN, y);
  y += 16;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  for (let g = 1; g <= 3; g++) {
    drawCheckbox(doc, MARGIN, y - 8);
    doc.text(`Goal ${g}:`, MARGIN + 18, y);
    drawWriteLine(doc, MARGIN + 60, y + 2, contentW - 60);
    y += 24;
  }
  y += 4;

  // Wins & Notes
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text("Today's Wins", MARGIN, y);
  y += 12;
  drawNoteLines(doc, MARGIN, y, contentW, 3);
  y += 3 * 22 + 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Notes & Reflection', MARGIN, y);
  y += 12;
  const remaining = PAGE_H - MARGIN - y;
  const lines = Math.max(3, Math.floor(remaining / 22) - 1);
  drawNoteLines(doc, MARGIN, y, contentW, lines);
}

function drawScale(doc, x, y, width, count) {
  doc.setDrawColor(120);
  const step = width / (count - 1);
  for (let i = 0; i < count; i++) {
    const cx = x + i * step;
    doc.circle(cx, y, 5);
    doc.setFontSize(8);
    doc.text(String(i + 1), cx, y + 16, { align: 'center' });
    doc.setFontSize(11);
  }
}

function drawWriteLine(doc, x, y, width) {
  doc.setDrawColor(160);
  doc.line(x, y + 8, x + width, y + 8);
}

function drawCheckbox(doc, x, y) {
  doc.setDrawColor(120);
  doc.rect(x, y, 10, 10);
}

function drawNoteLines(doc, x, y, width, count) {
  doc.setDrawColor(200);
  for (let i = 0; i < count; i++) {
    const ly = y + i * 22 + 14;
    doc.line(x, ly, x + width, ly);
  }
}