import { jsPDF } from 'jspdf';

export function generateClinicHandoutPdf() {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 44;
  const contentWidth = pageWidth - margin * 2;
  let y = 44;

  // Header band
  doc.setFillColor(53, 45, 53); // #352d35
  doc.roundedRect(margin, y, contentWidth, 74, 12, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('The Return to Work Navigator', margin + 20, y + 30);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text('Free Workplace & ADA Toolkit for Cancer Survivors | return-to-work-navigator.org', margin + 20, y + 52);

  y += 96;

  // Subtitle
  doc.setTextColor(47, 42, 56);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Returning to Work After Cancer Treatment? You Do Not Have to Navigate It Alone.', margin, y);
  y += 20;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(80, 72, 90);
  const intro = doc.splitTextToSize(
    'Back to Life, Back to Work Navigator is a 100% free, private online toolkit built by a cancer survivor and HR leader to help you plan a safe phased return, request workplace accommodations, manage treatment fatigue, and protect your job and benefits.',
    contentWidth
  );
  doc.text(intro, margin, y);
  y += intro.length * 14 + 14;

  // Core Tools Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(53, 45, 53);
  doc.text('What You Can Do Today (100% Free — No Sign-In Required to Browse or Draft):', margin, y);
  y += 16;

  const tools = [
    [
      '1. ADA Accommodation Letter Generator (/AccommodationLetterGenerator)',
      'Build a customized, ADA-aligned workplace accommodation request letter in 3 steps for fatigue, remote work, flexible hours, chemo brain, or oncology follow-ups.',
    ],
    [
      '2. Phased Return-to-Work Schedule Planner (/ReturnPlanning)',
      'Design a gradual week-by-week return schedule and download a printable PDF summary to review with your oncologist, nurse navigator, or supervisor.',
    ],
    [
      '3. Workplace Disclosure & HR Email Scripts (/DisclosureGuide & /EmployerEmailGenerator)',
      'Decide whether, when, and how much to share at work — with word-for-word scripts and AI-assisted email templates for HR, managers, and coworkers.',
    ],
    [
      '4. Plain-Language Legal Rights Hub (/LegalPolicyHub & /LegalRightsAdvisor)',
      'Understand your federal and state protections under the ADA, Intermittent FMLA, COBRA, and state paid medical leave programs.',
    ],
    [
      '5. Daily Energy, Fatigue & Symptom Pacing (/EnergyManagement & /WellnessLibrary)',
      'Track morning, afternoon, and evening energy levels and learn practical workplace strategies for cancer-related fatigue and cognitive fog.',
    ],
  ];

  tools.forEach(([title, desc]) => {
    doc.setFillColor(246, 244, 238);
    doc.roundedRect(margin, y, contentWidth, 48, 8, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(47, 42, 56);
    doc.text(title, margin + 12, y + 17);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(90, 82, 102);
    const lines = doc.splitTextToSize(desc, contentWidth - 24);
    doc.text(lines, margin + 12, y + 32);
    y += 56;
  });

  y += 8;

  // Privacy Box
  doc.setDrawColor(217, 211, 223);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, y, contentWidth, 72, 8, 8, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(53, 45, 53);
  doc.text('Your Privacy Comes First', margin + 14, y + 20);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(80, 72, 90);
  const privacyLines = doc.splitTextToSize(
    '• Always 100% free for patients and care teams — no subscriptions, paywalls, or upsells.\n• Browse guides, generate ADA letters, and download PDF worksheets without creating an account.\n• We never sell or share your information with employers, insurers, or third-party marketers.',
    contentWidth - 28
  );
  doc.text(privacyLines, margin + 14, y + 36);

  y += 92;

  // Footer CTA
  doc.setFillColor(236, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 50, 8, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(47, 42, 56);
  doc.text('Visit Today: https://return-to-work-navigator.org', margin + 16, y + 22);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(90, 82, 102);
  doc.text('Educational workplace resource — always consult your oncology care team and qualified legal counsel.', margin + 16, y + 38);

  doc.save('Return-to-Work-Navigator-Patient-Handout.pdf');
}