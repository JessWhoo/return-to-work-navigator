import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, Download, Mail, Lock, 
  CheckCircle2, Shield, Loader2 
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function ShareReportDialog({ open, onClose, progress, metrics }) {
  const [selectedSections, setSelectedSections] = useState({
    summary: true,
    energyTrends: true,
    moodData: true,
    checklistProgress: true,
    accommodations: false,
    notes: false
  });
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const sections = [
    { id: 'summary', label: 'Progress Summary', icon: CheckCircle2, recommended: true },
    { id: 'energyTrends', label: 'Energy & Fatigue Trends', icon: CheckCircle2, recommended: true },
    { id: 'moodData', label: 'Mood & Stress Levels', icon: CheckCircle2, recommended: true },
    { id: 'checklistProgress', label: 'Checklist Completion', icon: CheckCircle2, recommended: true },
    { id: 'accommodations', label: 'Accommodation Requests', icon: Shield, recommended: false },
    { id: 'notes', label: 'Personal Notes', icon: FileText, recommended: false }
  ];

  const toggleSection = (sectionId) => {
    setSelectedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const generateReport = () => {
    const report = [];
    
    report.push(`RETURN-TO-WORK PROGRESS REPORT`);
    report.push(`Generated: ${format(new Date(), 'MMMM d, yyyy')}`);
    report.push(`\n${'='.repeat(50)}\n`);

    if (selectedSections.summary && metrics) {
      report.push(`PROGRESS SUMMARY`);
      report.push(`Journey Stage: ${progress.journey_stage?.replace('_', ' ').toUpperCase()}`);
      report.push(`Checklist Completion: ${metrics.completionRate}% (${metrics.completedItems}/${metrics.totalChecklistItems} items)`);
      if (progress.return_date) {
        report.push(`Return Date: ${format(new Date(progress.return_date), 'MMMM d, yyyy')}`);
      }
      report.push(`Days Tracked: ${metrics.daysTracked}`);
      report.push(``);
    }

    if (selectedSections.energyTrends && progress.energy_logs?.length > 0) {
      report.push(`ENERGY & FATIGUE TRENDS`);
      const recentLogs = progress.energy_logs.slice(-7);
      report.push(`Average Energy Level (last 7 days): ${metrics.avgEnergy}/10`);
      report.push(`\nDaily Breakdown:`);
      recentLogs.forEach(log => {
        const avg = ((log.morning_energy + log.afternoon_energy + log.evening_energy) / 3).toFixed(1);
        report.push(`  ${format(new Date(log.date), 'MMM d')}: Morning ${log.morning_energy}, Afternoon ${log.afternoon_energy}, Evening ${log.evening_energy} (Avg: ${avg})`);
      });
      report.push(``);
    }

    if (selectedSections.moodData && progress.energy_logs?.length > 0) {
      report.push(`MOOD & STRESS LEVELS`);
      report.push(`Average Stress Level: ${metrics.avgStress}/10`);
      const moodCounts = progress.energy_logs.reduce((acc, log) => {
        acc[log.mood] = (acc[log.mood] || 0) + 1;
        return acc;
      }, {});
      report.push(`\nMood Distribution:`);
      Object.entries(moodCounts).forEach(([mood, count]) => {
        report.push(`  ${mood.replace('_', ' ')}: ${count} days`);
      });
      report.push(``);
    }

    if (selectedSections.checklistProgress) {
      report.push(`CHECKLIST PROGRESS`);
      report.push(`Completed Items: ${metrics.completedItems}`);
      report.push(`Remaining Items: ${metrics.totalChecklistItems - metrics.completedItems}`);
      report.push(`Completion Rate: ${metrics.completionRate}%`);
      report.push(``);
    }

    if (selectedSections.accommodations && progress.accommodations_requested?.length > 0) {
      report.push(`ACCOMMODATION REQUESTS`);
      progress.accommodations_requested.forEach((acc, idx) => {
        report.push(`${idx + 1}. ${acc.type} - Status: ${acc.status}`);
        report.push(`   Requested: ${format(new Date(acc.date_requested), 'MMM d, yyyy')}`);
        if (acc.review_date) {
          report.push(`   Review: ${format(new Date(acc.review_date), 'MMM d, yyyy')}`);
        }
      });
      report.push(``);
    }

    if (selectedSections.notes && progress.notes) {
      report.push(`PERSONAL NOTES`);
      report.push(progress.notes);
      report.push(``);
    }

    report.push(`\n${'='.repeat(50)}`);
    report.push(`This report is generated from the "Back to Life, Back to Work" toolkit.`);
    report.push(`It is intended for healthcare providers and trusted advisors to support`);
    report.push(`the patient's return-to-work journey.`);

    return report.join('\n');
  };

  const handleDownload = () => {
    // Track report download
    base44.analytics.track({
      eventName: 'progress_report_downloaded',
      properties: {
        sections_included: Object.keys(selectedSections).filter(k => selectedSections[k]),
        journey_stage: progress.journey_stage
      }
    });

    const reportText = generateReport();
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `progress-report-${format(new Date(), 'yyyy-MM-dd')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Report downloaded');
  };

  const handleEmailReport = async () => {
    if (!recipientEmail) {
      toast.error('Please enter recipient email');
      return;
    }

    setIsGenerating(true);
    try {
      const reportText = generateReport();
      const user = await base44.auth.me();
      
      await base44.integrations.Core.SendEmail({
        to: recipientEmail,
        subject: `Return-to-Work Progress Report - ${format(new Date(), 'MMM d, yyyy')}`,
        body: `Dear Healthcare Provider,

Please find attached the return-to-work progress report for ${user.full_name}.

${reportText}

If you have any questions or need additional information, please feel free to reach out.

Best regards,
${user.full_name}
Generated via Back to Life, Back to Work Toolkit`
      });

      // Track report share
      base44.analytics.track({
        eventName: 'progress_report_shared',
        properties: {
          method: 'email',
          sections_included: Object.keys(selectedSections).filter(k => selectedSections[k]),
          journey_stage: progress.journey_stage
        }
      });

      toast.success('Report sent successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to send report: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-indigo-600" />
            <span>Share Progress Report</span>
          </DialogTitle>
          <DialogDescription>
            Generate a secure report to share with healthcare providers or trusted advisors
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Privacy Notice */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Privacy & Security</p>
                <p>This report will only include the sections you select below. Your data remains secure and is only shared when you explicitly choose to send it.</p>
              </div>
            </div>
          </div>

          {/* Section Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Select Sections to Include</Label>
            {sections.map(section => {
              const Icon = section.icon;
              return (
                <div
                  key={section.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedSections[section.id]
                      ? 'bg-indigo-50 border-indigo-300'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleSection(section.id)}
                >
                  <Checkbox
                    checked={selectedSections[section.id]}
                    onCheckedChange={() => toggleSection(section.id)}
                  />
                  <Icon className="h-4 w-4 text-gray-600" />
                  <span className="flex-1 text-sm font-medium">{section.label}</span>
                  {section.recommended && (
                    <Badge variant="secondary" className="text-xs">
                      Recommended
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>

          {/* Email Option */}
          <div className="space-y-3 border-t pt-4">
            <Label className="text-base font-semibold flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Email Report (Optional)</span>
            </Label>
            <Input
              type="email"
              placeholder="healthcare.provider@example.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Leave blank to only download the report
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleDownload}
              variant="outline"
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
            <Button
              onClick={handleEmailReport}
              disabled={isGenerating || !recipientEmail}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Email Report
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}