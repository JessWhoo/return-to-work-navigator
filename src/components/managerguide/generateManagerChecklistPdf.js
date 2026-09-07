import { jsPDF } from 'jspdf';
import { MANAGER_CHECKLIST } from './managerChecklistData';

const MARGIN = 18;
const LINE = 6;

export function generateManagerChecklistPdf() {
  const doc = new jsPDF({ unit: 'mm', format: 'letter' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const textWidth = pageWidth - MARGIN * 2 - 8;
  let y = MARGIN;

  const ensureSpace = (needed) => {
    if (y + needed > pageHeight - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  };

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(76, 29, 149);
  doc.text('Manager & HR Return-to-Work Support Checklist', MARGIN, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text('Practical steps to support an employee returning to work after cancer treatment.', MARGIN, y);
  y += 5;
  doc.text('Employee: ____________________   Return date: ____________   Manager: ____________________', MARGIN, y);
  y += 10;

  MANAGER_CHECKLIST.forEach((section) => {
    ensureSpace(14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text(section.phase, MARGIN, y);
    y += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    section.items.forEach((item) => {
      const lines = doc.splitTextToSize(item, textWidth);
      ensureSpace(lines.length * LINE + 2);
      doc.setDrawColor(100, 116, 139);
      doc.rect(MARGIN, y - 4, 4, 4);
      doc.text(lines, MARGIN + 8, y);
      y += lines.length * LINE + 1.5;
    });
    y += 5;
  });

  ensureSpace(12);
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Back to Life, Back to Work Navigator — Educational information only; not legal advice.', MARGIN, pageHeight - 10);

  doc.save('Manager-Return-to-Work-Support-Checklist.pdf');
}