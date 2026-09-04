import { jsPDF } from 'jspdf';

// Renders the plain-text letter as a clean, single-column PDF.
export function downloadLetterPdf(text, filename = 'accommodation-request-letter.pdf') {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const margin = 72;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - margin * 2;
  const lineHeight = 16;
  let y = margin;

  doc.setFont('times', 'normal');
  doc.setFontSize(12);

  text.split('\n').forEach((raw) => {
    const isSubject = raw.startsWith('Re: ');
    doc.setFont('times', isSubject ? 'bold' : 'normal');
    const lines = raw === '' ? [''] : doc.splitTextToSize(raw, maxWidth);
    lines.forEach((line) => {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });
  });

  doc.save(filename);
}