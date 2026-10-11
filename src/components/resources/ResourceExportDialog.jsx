import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import DialogContent from '@/components/resources/ResourceDialogContent';
import { Checkbox } from '@/components/ui/checkbox';
import { FileDown, Loader2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { base44 } from '@/api/base44Client';

async function exportResourcesToPDF(selectedResources) {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const generatedDate = format(new Date(), 'MMMM d, yyyy');

  // Header
  doc.setFillColor(15, 118, 110);
  doc.rect(0, 0, pageWidth, 22, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Back to Life, Back to Work Navigator', 14, 10);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Generated ${generatedDate}`, 14, 17);
  doc.setTextColor(0, 0, 0);

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 118, 110);
  doc.text('My Resource List', 14, 36);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`${selectedResources.length} resource${selectedResources.length !== 1 ? 's' : ''} — curated from the Back to Life, Back to Work Navigator`, 14, 43);
  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(15, 118, 110);
  doc.line(14, 46, pageWidth - 14, 46);

  let y = 56;

  for (const resource of selectedResources) {
    // Check for page break
    if (y > 255) {
      doc.addPage();
      y = 20;
    }

    // Resource name
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    const nameLines = doc.splitTextToSize(resource.name, pageWidth - 28);
    doc.text(nameLines, 14, y);
    y += nameLines.length * 6;

    // Organization & type
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 118, 110);
    const orgType = [resource.org, resource.type].filter(Boolean).join('  ·  ');
    doc.text(orgType, 14, y);
    y += 6;

    // Category badge
    if (resource.category) {
      doc.setTextColor(100, 100, 100);
      doc.text(`Category: ${resource.category}`, 14, y);
      y += 6;
    }

    // Description
    if (resource.description) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      const descLines = doc.splitTextToSize(resource.description, pageWidth - 28);
      if (y + descLines.length * 5 > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(descLines, 14, y);
      y += descLines.length * 5 + 3;
    }

    // URL
    if (resource.url) {
      doc.setFontSize(8);
      doc.setTextColor(37, 99, 235);
      const urlText = doc.splitTextToSize(resource.url, pageWidth - 28);
      doc.text(urlText, 14, y);
      y += urlText.length * 5;
    }

    // Divider
    doc.setDrawColor(220, 220, 220);
    y += 4;
    doc.line(14, y, pageWidth - 14, y);
    y += 8;
  }

  // Footer on every page
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${totalPages}  |  Back to Life, Back to Work Navigator`, 14, 290);
    doc.text(generatedDate, pageWidth - 40, 290);
  }

  return doc;
}

export default function ResourceExportDialog({ resources, bookmarkedIds }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [generating, setGenerating] = useState(false);
  const [filter, setFilter] = useState('bookmarked');

  // Flatten all resources with category info
  const allFlat = resources.flatMap(cat =>
    cat.items.map((item, idx) => ({
      ...item,
      id: `${cat.category}-${idx}`,
      category: cat.category
    }))
  );

  const displayList = filter === 'bookmarked'
    ? allFlat.filter(r => bookmarkedIds.includes(r.id))
    : allFlat;

  const toggleItem = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(displayList.map(r => r.id)));
  const clearAll = () => setSelected(new Set());

  const handleOpen = (val) => {
    if (val) {
      // Pre-select bookmarked resources when opening
      setSelected(new Set(allFlat.filter(r => bookmarkedIds.includes(r.id)).map(r => r.id)));
      setFilter('bookmarked');
      base44.analytics.track({ eventName: 'export_resources_button_clicked', properties: { bookmarked_count: bookmarkedIds.length } });
    }
    setOpen(val);
  };

  const handleExport = async () => {
    if (selected.size === 0) {
      toast.error('Please select at least one resource.');
      return;
    }
    setGenerating(true);
    try {
      const toExport = allFlat.filter(r => selected.has(r.id));
      const doc = await exportResourcesToPDF(toExport);
      doc.save(`my-resources-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      toast.success('Resource PDF downloaded!');
      setOpen(false);
    } catch {
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild><Button className="gap-2 !whitespace-normal"><FileDown className="h-4 w-4" />Export Resources to PDF</Button></DialogTrigger>
      <DialogContent className="max-w-2xl flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-brand-primary shrink-0" />Export Resources to PDF</DialogTitle>
          <p className="text-sm text-brand-muted-foreground">Select resources to compile into a printer-friendly document.</p>
        </DialogHeader>
        <div className="space-y-2 pt-1">
          <div className="nv-tabs">
            <button className="nv-tab !whitespace-normal" data-state={filter === 'bookmarked' ? 'active' : 'inactive'} onClick={() => setFilter('bookmarked')}>Saved ({bookmarkedIds.length})</button>
            <button className="nv-tab !whitespace-normal" data-state={filter === 'all' ? 'active' : 'inactive'} onClick={() => setFilter('all')}>All Resources ({allFlat.length})</button>
          </div>
          <div className="flex justify-end gap-2"><button onClick={selectAll} className="nv-btn nv-btn--text nv-btn--sm">Select All</button><button onClick={clearAll} className="nv-btn nv-btn--text nv-btn--sm">Clear</button></div>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0">
          {displayList.length === 0 ? (
            <div className="text-center py-10 text-brand-muted-foreground"><BookOpen className="h-10 w-10 mx-auto mb-3 opacity-40" /><p>No saved resources yet. Bookmark some first, or switch to "All Resources".</p></div>
          ) : displayList.map(resource => (
            <label key={resource.id} className={`nv-card flex items-start gap-3 p-3 cursor-pointer ${selected.has(resource.id) ? 'nv-card--muted ring-1 ring-primary' : ''}`}>
              <Checkbox checked={selected.has(resource.id)} onCheckedChange={() => toggleItem(resource.id)} className="mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-brand-text">{resource.name}</p>
                <p className="text-xs text-brand-primary mt-0.5">{resource.org}</p>
                <p className="text-xs text-brand-muted-foreground mt-1 line-clamp-2">{resource.description}</p>
                <div className="flex gap-1.5 mt-1.5 flex-wrap"><Badge variant="secondary" className="text-xs">{resource.type}</Badge><Badge variant="outline" className="text-xs">{resource.category}</Badge></div>
              </div>
            </label>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-brand-border shrink-0">
          <span className="text-sm text-brand-muted-foreground">{selected.size} resource{selected.size !== 1 ? 's' : ''} selected</span>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleExport} disabled={generating || selected.size === 0} className="gap-2">
              {generating ? <><Loader2 className="h-4 w-4 animate-spin" />Generating…</> : <><FileDown className="h-4 w-4" />Export {selected.size > 0 ? `(${selected.size})` : ''}</>}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}