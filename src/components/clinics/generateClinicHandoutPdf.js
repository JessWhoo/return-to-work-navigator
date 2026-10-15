import { jsPDF } from 'jspdf';
import { getQrMatrix } from './qrCodeMatrix';

function drawQrCodeOnPdf(doc, url, x, y, boxSize) {
  const matrix = getQrMatrix(url);
  const quietZone = 2;
  const totalModules = matrix.length + quietZone * 2;
  const cellSize = boxSize / totalModules;

  // White rounded container
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(x, y, boxSize, boxSize, 6, 6, 'F');

  // Dark modules
  doc.setFillColor(47, 42, 56);
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c]) {
        doc.rect(
          x + (c + quietZone) * cellSize,
          y + (r + quietZone) * cellSize,
          cellSize + 0.15,
          cellSize + 0.15,
          'F'
        );
      }
    }
  }
}

export function generateClinicHandoutPdf() {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  const siteUrl = 'https://return-to-work-navigator.org';
  let y = 38;

  // Header band with QR Code
  const headerHeight = 96;
  doc.setFillColor(53, 45, 53); // #352d35
  doc.roundedRect(margin, y, contentWidth, headerHeight, 12, 12, 'F');

  doc.setTextColor(232, 228, 200);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('FREE CANCER SURVIVORSHIP WORKPLACE RESOURCE', margin + 18, y + 22);

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('The Return to Work Navigator', margin + 18, y + 44);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(
    'Free, private tools for ADA accommodations, phased return plans, FMLA rights & fatigue pacing.',
    margin + 18,
    y + 63
  );
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('https://return-to-work-navigator.org   |   Scan QR Code With Phone Camera ->', margin + 18, y + 81);

  // Draw scannable vector QR code inside header right
  const qrSize = 76;
  drawQrCodeOnPdf(doc, siteUrl, margin + contentWidth - qrSize - 12, y + 10, qrSize);

  y += headerHeight + 22;

  // Subtitle
  doc.setTextColor(47, 42, 56);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13.5);
  doc.text('Returning to Work After Cancer Treatment? You Do Not Have to Navigate It Alone.', margin, y);
  y += 18;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(80, 72, 90);
  const intro = doc.splitTextToSize(
    'Back to Life, Back to Work Navigator is a 100% free, private online toolkit built by a cancer survivor and HR leader to help you plan a safe phased return, request workplace accommodations, manage treatment fatigue, and protect your job and benefits.',
    contentWidth
  );
  doc.text(intro, margin, y);
  y += intro.length * 13 + 12;

  // Core Tools Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(53, 45, 53);
  doc.text('5 Free Tools You Can Use Today (No Sign-In Required to Browse or Draft):', margin, y);
  y += 12;

  const tools = [
    [
      '1. ADA Accommodation Letter Generator (return-to-work-navigator.org/AccommodationLetterGenerator)',
      'Build a customized, ADA-aligned workplace accommodation request letter in 3 steps for fatigue, remote work, flexible hours, chemo brain, or oncology follow-ups.',
    ],
    [
      '2. Phased Return-to-Work Schedule Planner (return-to-work-navigator.org/ReturnPlanning)',
      'Design a gradual week-by-week return schedule and download a printable PDF summary to review with your oncologist, nurse navigator, or supervisor.',
    ],
    [
      '3. Workplace Disclosure & HR Email Scripts (return-to-work-navigator.org/DisclosureGuide)',
      'Decide whether, when, and how much to share at work — with word-for-word scripts and AI-assisted email templates for HR, managers, and coworkers.',
    ],
    [
      '4. Plain-Language Legal Rights Hub (return-to-work-navigator.org/LegalPolicyHub)',
      'Understand your federal and state protections under the ADA, Intermittent FMLA, COBRA, and state paid medical leave programs across all 50 states.',
    ],
    [
      '5. Daily Energy, Fatigue & Symptom Pacing (return-to-work-navigator.org/WellnessLibrary)',
      'Track morning, afternoon, and evening energy levels and learn practical workplace strategies for cancer-related fatigue and cognitive fog.',
    ],
  ];

  tools.forEach(([title, desc]) => {
    doc.setFillColor(246, 244, 238);
    doc.roundedRect(margin, y, contentWidth, 48, 8, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(47, 42, 56);
    doc.text(title, margin + 12, y + 17);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.2);
    doc.setTextColor(90, 82, 102);
    const lines = doc.splitTextToSize(desc, contentWidth - 24);
    doc.text(lines, margin + 12, y + 31);
    y += 55;
  });

  y += 6;

  // Bottom Row: Privacy Box (left) + QR Scan Card (right)
  const bottomBoxHeight = 96;
  const qrCardWidth = 150;
  const privacyWidth = contentWidth - qrCardWidth - 12;

  doc.setDrawColor(217, 211, 223);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, y, privacyWidth, bottomBoxHeight, 8, 8, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(53, 45, 53);
  doc.text('100% Free & Built Around Your Privacy', margin + 14, y + 20);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.2);
  doc.setTextColor(80, 72, 90);
  const privacyLines = doc.splitTextToSize(
    '• Always $0 for patients and care teams — no subscriptions, paywalls, or upsells.\n• Browse guides, generate ADA letters, and download PDF worksheets without creating an account.\n• We never sell or share your information with employers, HR, insurers, or third-party marketers.',
    privacyWidth - 24
  );
  doc.text(privacyLines, margin + 14, y + 36);

  // Right QR Scan Card
  const qrCardX = margin + privacyWidth + 12;
  doc.setFillColor(236, 232, 240);
  doc.roundedRect(qrCardX, y, qrCardWidth, bottomBoxHeight, 8, 8, 'F');
  drawQrCodeOnPdf(doc, siteUrl, qrCardX + (qrCardWidth - 62) / 2, y + 8, 62);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(47, 42, 56);
  doc.text('SCAN TO OPEN TOOLKIT', qrCardX + qrCardWidth / 2, y + 80, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('return-to-work-navigator.org', qrCardX + qrCardWidth / 2, y + 90, { align: 'center' });

  y += bottomBoxHeight + 14;

  // Footer disclaimer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(108, 101, 119);
  doc.text(
    'Educational workplace resource — always consult your oncology care team and qualified legal counsel.  |  https://return-to-work-navigator.org',
    margin,
    y
  );

  doc.save('Return-to-Work-Navigator-Patient-Handout.pdf');
}