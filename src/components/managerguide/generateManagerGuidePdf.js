import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Capture a rendered DOM node and export it as a multi-page A4 PDF.
// Used instead of window.print() so the button works inside the sandboxed
// app preview iframe (where window.print() / modal dialogs are blocked).
export async function generateManagerGuidePdf(node) {
  if (!node) return;

  const canvas = await html2canvas(node, {
    scale: 2,
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false,
    windowWidth: node.scrollWidth,
  });

  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'p' });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  const imgW = pageW;
  const imgH = (canvas.height * imgW) / canvas.width;

  const imgData = canvas.toDataURL('image/jpeg', 0.92);

  let heightLeft = imgH;
  let position = 0;
  pdf.addImage(imgData, 'JPEG', 0, position, imgW, imgH, undefined, 'FAST');
  heightLeft -= pageH;

  while (heightLeft > 0) {
    position -= pageH;
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, position, imgW, imgH, undefined, 'FAST');
    heightLeft -= pageH;
  }

  pdf.save('Manager-Guide-Supporting-Employee-Through-Cancer.pdf');
}