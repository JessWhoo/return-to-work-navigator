import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import PageHeader from '@/components/brand/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileDown, Loader2, CheckCircle, Users, MessageSquare, 
  TrendingUp, FileText, Activity, Stethoscope
} from 'lucide-react';
// jsPDF loaded dynamically to avoid React duplicate instance issues
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useAuth } from '@/lib/AuthContext';

const REPORT_TYPES = [
  {
    id: 'meeting_prep',
    title: 'Meeting Preparation Summary',
    description: 'All meeting preps with talking points, accommodation requests, and employer responses.',
    icon: Users,
    badge: 'For HR / Supervisors'
  },
  {
    id: 'communication',
    title: 'Communication Drafts Report',
    description: 'Saved communication drafts including accommodation requests and disclosure letters.',
    icon: MessageSquare,
    badge: 'For Professional Records'
  },
  {
    id: 'symptom_log',
    title: 'Symptom & Health Log',
    description: 'Chronological log of symptom entries for sharing with healthcare providers.',
    icon: Activity,
    badge: 'For Healthcare Providers'
  },
  {
    id: 'progress',
    title: 'Progress & Journey Report',
    description: 'Journey stage, energy logs, checklist progress, and accommodation statuses.',
    icon: TrendingUp,
    badge: 'Comprehensive Overview'
  },
  {
    id: 'full',
    title: 'Full Professional Summary',
    description: 'Complete report combining all sections — ideal for care team meetings.',
    icon: Stethoscope,
    badge: 'All-in-One'
  }
];

function addPageHeader(doc, title, pageWidth) {
  doc.setFillColor(15, 118, 110); // teal
  doc.rect(0, 0, pageWidth, 22, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Back to Life, Back to Work Navigator', 14, 10);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(title, 14, 17);
  doc.setTextColor(0, 0, 0);
}

function addSectionTitle(doc, text, y) {
  doc.setFillColor(240, 253, 250);
  doc.rect(10, y - 5, 190, 10, 'F');
  doc.setTextColor(15, 118, 110);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(text, 14, y + 1);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  return y + 12;
}

function checkPageBreak(doc, y, margin = 270) {
  if (y > margin) {
    doc.addPage();
    return 30;
  }
  return y;
}

function wrapText(doc, text, x, y, maxWidth, lineHeight = 6) {
  const lines = doc.splitTextToSize(String(text || ''), maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

function generateMeetingPrepSection(doc, meetings, y, pageWidth) {
  y = addSectionTitle(doc, 'Meeting Preparation Summary', y);
  if (!meetings?.length) {
    doc.setFontSize(10); doc.setTextColor(120, 120, 120);
    doc.text('No meeting preparations found.', 14, y);
    doc.setTextColor(0,0,0);
    return y + 10;
  }
  for (const m of meetings) {
    y = checkPageBreak(doc, y);
    doc.setFontSize(11); doc.setFont('helvetica', 'bold');
    doc.text(m.title || 'Untitled Meeting', 14, y);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(80,80,80);
    const meta = [m.meeting_type?.replace(/_/g,' '), m.meeting_date, m.status].filter(Boolean).join('  |  ');
    doc.text(meta, 14, y + 5);
    doc.setTextColor(0,0,0); y += 12;

    if (m.goals) {
      doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.text('Goals:', 14, y);
      doc.setFont('helvetica', 'normal');
      y = wrapText(doc, m.goals, 14, y + 5, 180);
      y += 3;
    }
    if (m.talking_points?.length) {
      y = checkPageBreak(doc, y);
      doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.text('Talking Points:', 14, y);
      doc.setFont('helvetica', 'normal'); y += 5;
      for (const tp of m.talking_points) {
        y = checkPageBreak(doc, y);
        y = wrapText(doc, `• ${tp}`, 18, y, 174);
      }
      y += 2;
    }
    if (m.accommodation_requests?.length) {
      y = checkPageBreak(doc, y);
      doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.text('Accommodation Requests:', 14, y);
      doc.setFont('helvetica', 'normal'); y += 5;
      for (const ar of m.accommodation_requests) {
        y = checkPageBreak(doc, y);
        y = wrapText(doc, `• ${ar.accommodation}${ar.reason ? ` — ${ar.reason}` : ''}`, 18, y, 174);
      }
      y += 2;
    }
    if (m.outcome_summary) {
      y = checkPageBreak(doc, y);
      doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.text('Outcome:', 14, y);
      doc.setFont('helvetica', 'normal');
      y = wrapText(doc, m.outcome_summary, 14, y + 5, 180);
      y += 2;
    }
    doc.setDrawColor(200, 200, 200); doc.line(14, y, pageWidth - 14, y);
    y += 8;
  }
  return y;
}

function generateCommunicationSection(doc, drafts, y, pageWidth) {
  y = addSectionTitle(doc, 'Communication Drafts', y);
  if (!drafts?.length) {
    doc.setFontSize(10); doc.setTextColor(120,120,120);
    doc.text('No saved drafts found.', 14, y);
    doc.setTextColor(0,0,0);
    return y + 10;
  }
  for (const d of drafts) {
    y = checkPageBreak(doc, y);
    doc.setFontSize(11); doc.setFont('helvetica', 'bold');
    doc.text(d.title || 'Untitled Draft', 14, y);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(80,80,80);
    doc.text([d.scenario_type?.replace(/_/g,' '), d.recipient, d.tone].filter(Boolean).join('  |  '), 14, y + 5);
    doc.setTextColor(0,0,0); y += 12;
    if (d.subject) {
      doc.setFont('helvetica', 'bold'); doc.text(`Subject: ${d.subject}`, 14, y);
      doc.setFont('helvetica', 'normal'); y += 7;
    }
    if (d.content) {
      y = checkPageBreak(doc, y);
      y = wrapText(doc, d.content, 14, y, 180);
      y += 3;
    }
    doc.setDrawColor(200,200,200); doc.line(14, y, pageWidth-14, y);
    y += 8;
  }
  return y;
}

function generateSymptomSection(doc, records, y, pageWidth) {
  y = addSectionTitle(doc, 'Symptom & Health Log', y);
  const symptoms = records?.filter(r => r.type === 'symptom' || r.type === 'medical') || [];
  if (!symptoms.length) {
    doc.setFontSize(10); doc.setTextColor(120,120,120);
    doc.text('No symptom or medical records found.', 14, y);
    doc.setTextColor(0,0,0);
    return y + 10;
  }
  for (const r of symptoms) {
    y = checkPageBreak(doc, y);
    doc.setFontSize(10); doc.setFont('helvetica', 'bold');
    doc.text(`${r.date || ''}  —  ${r.title}`, 14, y);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(80,80,80);
    doc.text(r.type, 14, y + 5);
    doc.setTextColor(0,0,0); y += 12;
    if (r.symptom_details) {
      const sd = r.symptom_details;
      if (sd.symptom_type?.length) { doc.text(`Symptoms: ${sd.symptom_type.join(', ')}`, 14, y); y += 5; }
      if (sd.severity) { doc.text(`Severity: ${sd.severity}/10`, 14, y); y += 5; }
      if (sd.triggers) { y = wrapText(doc, `Triggers: ${sd.triggers}`, 14, y, 180); }
      if (sd.relief_measures) { y = wrapText(doc, `Relief: ${sd.relief_measures}`, 14, y, 180); }
      y += 2;
    }
    if (r.content) {
      y = checkPageBreak(doc, y);
      y = wrapText(doc, r.content, 14, y, 180);
      y += 2;
    }
    doc.setDrawColor(200,200,200); doc.line(14, y, pageWidth-14, y);
    y += 8;
  }
  return y;
}

function generateProgressSection(doc, progress, y, _pageWidth) {
  y = addSectionTitle(doc, 'Progress & Journey Overview', y);
  if (!progress) {
    doc.setFontSize(10); doc.setTextColor(120,120,120);
    doc.text('No progress data found.', 14, y);
    doc.setTextColor(0,0,0);
    return y + 10;
  }
  doc.setFontSize(10);
  doc.text(`Journey Stage: ${progress.journey_stage?.replace(/_/g,' ') || 'N/A'}`, 14, y); y += 7;
  doc.text(`Return Date: ${progress.return_date || 'Not set'}`, 14, y); y += 7;
  doc.text(`Checklist Items Completed: ${progress.completed_checklist_items?.length || 0}`, 14, y); y += 7;
  doc.text(`Saved Resources: ${progress.bookmarked_resources?.length || 0}`, 14, y); y += 10;

  if (progress.accommodations_requested?.length) {
    y = checkPageBreak(doc, y);
    doc.setFont('helvetica', 'bold'); doc.text('Accommodations Requested:', 14, y);
    doc.setFont('helvetica', 'normal'); y += 6;
    for (const acc of progress.accommodations_requested) {
      doc.text(`• ${acc.type} — ${acc.status} (requested ${acc.date_requested || 'N/A'})`, 18, y); y += 6;
    }
    y += 4;
  }

  if (progress.energy_logs?.length) {
    y = checkPageBreak(doc, y);
    doc.setFont('helvetica', 'bold'); doc.text(`Energy Log (last ${Math.min(7, progress.energy_logs.length)} entries):`, 14, y);
    doc.setFont('helvetica', 'normal'); y += 6;
    const recent = [...progress.energy_logs].slice(-7);
    for (const log of recent) {
      y = checkPageBreak(doc, y);
      doc.text(`${log.date}  |  Mood: ${log.mood || 'N/A'}  |  Stress: ${log.stress_level || 'N/A'}/10`, 18, y); y += 5;
      if (log.notes) { y = wrapText(doc, `  Notes: ${log.notes}`, 22, y, 170); }
    }
  }
  return y + 8;
}

async function buildPDF(type, { meetings, drafts, records, progress }) {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const generatedDate = format(new Date(), 'MMMM d, yyyy');

  const reportTitle = REPORT_TYPES.find(r => r.id === type)?.title || 'Report';
  addPageHeader(doc, `Generated ${generatedDate}`, pageWidth);

  // Cover title
  doc.setFontSize(20); doc.setFont('helvetica', 'bold'); doc.setTextColor(15,118,110);
  doc.text(reportTitle, 14, 38);
  doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(100,100,100);
  doc.text('This report was generated by the Back to Life, Back to Work Navigator for professional use.', 14, 45);
  doc.setTextColor(0,0,0);
  doc.setDrawColor(15,118,110); doc.line(14, 48, pageWidth-14, 48);

  let y = 58;

  if (type === 'meeting_prep' || type === 'full') {
    y = checkPageBreak(doc, y);
    y = generateMeetingPrepSection(doc, meetings, y, pageWidth);
    y += 4;
  }
  if (type === 'communication' || type === 'full') {
    y = checkPageBreak(doc, y);
    y = generateCommunicationSection(doc, drafts, y, pageWidth);
    y += 4;
  }
  if (type === 'symptom_log' || type === 'full') {
    y = checkPageBreak(doc, y);
    y = generateSymptomSection(doc, records, y, pageWidth);
    y += 4;
  }
  if (type === 'progress' || type === 'full') {
    y = checkPageBreak(doc, y);
    generateProgressSection(doc, progress, y, pageWidth);
  }

  // Footer on each page
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8); doc.setTextColor(150,150,150);
    doc.text(`Page ${i} of ${totalPages}  |  Confidential — For professional use only`, 14, 290);
    doc.text(generatedDate, pageWidth - 40, 290);
  }

  return doc;
}

export default function ExportReports({ embedded = false }) {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const [generating, setGenerating] = useState(null);
  const [done, setDone] = useState(null);
  const authed = !isLoadingAuth && !!isAuthenticated;

  const { data: meetings } = useQuery({ queryKey: ['meetingPreps'], enabled: authed, queryFn: () => base44.entities.MeetingPrep.list('-meeting_date') });
  const { data: drafts } = useQuery({ queryKey: ['communicationDrafts'], enabled: authed, queryFn: () => base44.entities.CommunicationDraft.list('-updated_date') });
  const { data: records } = useQuery({ queryKey: ['records'], enabled: authed, queryFn: () => base44.entities.Record.list('-date') });
  const { data: progress } = useUserProgress();

  const handleExport = async (type) => {
    setGenerating(type);
    setDone(null);
    try {
      const doc = await buildPDF(type, { meetings, drafts, records, progress });
      const filename = `navigator-${type}-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      doc.save(filename);
      setDone(type);
      toast.success('PDF downloaded successfully!');
      setTimeout(() => setDone(null), 3000);
    } catch {
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader center={!embedded} headingLevel={embedded ? 'h2' : 'h1'} title="Export & Download Reports" subtitle="Generate professional PDF summaries of your data to share with healthcare providers, HR teams, or for your own records." />

      <div className="grid gap-5">
        {REPORT_TYPES.map((report) => {
          const Icon = report.icon;
          const isGenerating = generating === report.id;
          const isDone = done === report.id;

          return (
            <Card key={report.id}>
              <CardContent className="p-6">
                <div className="flex flex-col items-stretch gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
                    <div className="shrink-0 rounded-pill bg-brand-muted p-3">
                      <Icon className="h-6 w-6 text-brand-primary" strokeWidth={1.75} aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-foreground">{report.title}</h3>
                        <Badge variant="secondary">{report.badge}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleExport(report.id)}
                    disabled={!!generating}
                    variant={isDone ? 'secondary' : 'default'}
                    className="w-full shrink-0 !whitespace-normal sm:w-auto sm:min-w-[130px]"
                  >
                    {isGenerating ? (
                      <><Loader2 className="h-4 w-4 animate-spin" />Generating…</>
                    ) : isDone ? (
                      <><CheckCircle className="h-4 w-4" />Downloaded!</>
                    ) : (
                      <><FileDown className="h-4 w-4" />Export PDF</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="nv-card--muted">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <FileText className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">About these reports</p>
              <p>All reports are generated locally in your browser — your data never leaves your device during this process. PDFs are marked confidential and include the generation date for professional use.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}