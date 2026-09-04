import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileDown, Loader2, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/AuthContext';
import { useUserProgress } from '@/hooks/useUserProgress';
import { generateReturnSummaryPdf } from './generateReturnSummaryPdf';

/**
 * Card + button that generates a printable PDF summary of the user's
 * return-to-work schedule and accommodation list, ready to share in meetings.
 */
export default function DownloadReturnSummaryButton() {
  const { user } = useAuth();
  const { data: progress, isLoading } = useUserProgress();
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    setLoading(true);
    try {
      generateReturnSummaryPdf({ progress, userName: user?.full_name });
      toast.success('Summary downloaded — ready to print or share.');
    } catch (err) {
      toast.error('Could not generate PDF: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-2 border-slate-300 shadow-sm">
      <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Printer className="h-5 w-5 text-violet-700" />
            Printable Meeting Summary
          </h3>
          <p className="text-sm text-slate-700 font-medium">
            A one-page PDF with your return date, key milestones, and accommodation
            list — easy to hand to your supervisor or HR.
          </p>
        </div>
        <Button
          onClick={handleDownload}
          disabled={loading || isLoading}
          className="bg-gradient-to-r from-violet-600 to-emerald-600 text-white hover:opacity-90 shrink-0"
        >
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileDown className="h-4 w-4 mr-2" />}
          Download PDF
        </Button>
      </CardContent>
    </Card>
  );
}