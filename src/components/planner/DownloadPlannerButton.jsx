import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { generatePlannerPdf } from './generatePlannerPdf';

/**
 * A button that downloads a printable weekly planner PDF.
 * Users can print it and fill in energy, fatigue, and workplace goals daily.
 */
export default function DownloadPlannerButton({ weeks = 1, className = '' }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      generatePlannerPdf({ weeks });
      toast.success('Planner PDF downloaded — ready to print!');
    } catch (err) {
      toast.error('Could not generate PDF: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={loading}
      className={`bg-gradient-to-r from-violet-600 to-sky-600 text-white hover:from-violet-700 hover:to-sky-700 ${className}`}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Printer className="h-4 w-4 mr-2" />
      )}
      <span className="hidden sm:inline">Download Printable Planner</span>
      <span className="sm:hidden">Printable Planner</span>
      {!loading && <Download className="h-4 w-4 ml-2" />}
    </Button>
  );
}