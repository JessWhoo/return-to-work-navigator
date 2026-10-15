import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import BrandChoice from '@/components/brand/BrandChoice';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Stethoscope, Briefcase, BookOpen, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import BottomSheetSelect from '@/components/ui/bottom-sheet-select';

// Local calendar date — a UTC date rolls a day ahead in the evening for anyone
// behind UTC, which would file the record under the wrong day.
const localToday = () => format(new Date(), 'yyyy-MM-dd');

export default function AddRecordDialog({ open, onClose, editRecord }) {
  const queryClient = useQueryClient();
  const [type, setType] = useState('journal');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(localToday());
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  
  // Type-specific fields
  const [medicalDetails, setMedicalDetails] = useState({});
  const [workplaceDetails, setWorkplaceDetails] = useState({});

  useEffect(() => {
    if (editRecord) {
      setType(editRecord.type === 'symptom' ? 'journal' : editRecord.type);
      setTitle(editRecord.title);
      setDate(editRecord.date);
      setContent(editRecord.content);
      setTags(editRecord.tags || []);
      setMedicalDetails(editRecord.medical_details || {});
      setWorkplaceDetails(editRecord.workplace_details || {});
    } else {
      resetForm();
    }
  }, [editRecord, open]);

  const resetForm = () => {
    setType('journal');
    setTitle('');
    setDate(localToday());
    setContent('');
    setTags([]);
    setTagInput('');
    setMedicalDetails({});
    setWorkplaceDetails({});
  };

  const saveMutation = useMutation({
    mutationFn: async (recordData) => {
      if (editRecord) {
        return await base44.entities.Record.update(editRecord.id, recordData);
      }
      return await base44.entities.Record.create(recordData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['records']);
      toast.success(editRecord ? 'Record updated!' : 'Record created!');
      onClose();
      resetForm();
    }
  });

  const handleSubmit = () => {
    if (!title || !content) {
      toast.error('Please fill in title and content');
      return;
    }

    const recordData = {
      type,
      title,
      date,
      content,
      tags,
      ...(type === 'medical' && { medical_details: medicalDetails }),
      ...(type === 'workplace' && { workplace_details: workplaceDetails })
    };

    saveMutation.mutate(recordData);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const recordTypes = [
    { value: 'medical', label: 'Medical', icon: Stethoscope },
    { value: 'workplace', label: 'Workplace', icon: Briefcase },
    { value: 'journal', label: 'Journal', icon: BookOpen }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editRecord ? 'Edit Record' : 'New Record'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Type Selection */}
          <div>
            <Label>Record Type</Label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {recordTypes.map(t => <BrandChoice key={t.value} stacked selected={type === t.value} icon={t.icon} onClick={() => setType(t.value)}>{t.label}</BrandChoice>)}
            </div>
          </div>

          {/* Basic Fields */}
          <div>
            <Label>Title *</Label>
            <Input
              aria-label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief description of this record"
              className="mt-2"
            />
          </div>

          <div>
            <Label>Date *</Label>
            <Input
              aria-label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-2"
            />
          </div>

          {/* Type-Specific Fields */}
          {type === 'medical' && (
            <div className="nv-card nv-card--pink space-y-4 p-4">
              <h4 className="font-semibold text-brand-text">Medical Details</h4>
              <Input
                aria-label="Doctor's name"
                placeholder="Doctor's Name"
                value={medicalDetails.doctor_name || ''}
                onChange={(e) => setMedicalDetails({ ...medicalDetails, doctor_name: e.target.value })}
              />
              <Input
                aria-label="Work restrictions"
                placeholder="Work Restrictions"
                value={medicalDetails.work_restrictions || ''}
                onChange={(e) => setMedicalDetails({ ...medicalDetails, work_restrictions: e.target.value })}
              />
              <Input
                aria-label="Next appointment"
                type="date"
                placeholder="Next Appointment"
                value={medicalDetails.next_appointment || ''}
                onChange={(e) => setMedicalDetails({ ...medicalDetails, next_appointment: e.target.value })}
              />
            </div>
          )}

          {type === 'workplace' && (
            <div className="nv-card nv-card--muted space-y-4 p-4">
              <h4 className="font-semibold text-brand-text">Workplace Details</h4>
              <BottomSheetSelect
                value={workplaceDetails.meeting_type || 'other'}
                onValueChange={(v) => setWorkplaceDetails({ ...workplaceDetails, meeting_type: v })}
                title="Meeting type"
                className="text-sm"
                options={[
                  { value: 'supervisor', label: 'Supervisor Meeting' },
                  { value: 'hr', label: 'HR Meeting' },
                  { value: 'team', label: 'Team Meeting' },
                  { value: 'accommodation_review', label: 'Accommodation Review' },
                  { value: 'other', label: 'Other' },
                ]}
              />
              <Textarea
                aria-label="Outcomes and action items"
                placeholder="Outcomes and action items"
                value={workplaceDetails.outcomes || ''}
                onChange={(e) => setWorkplaceDetails({ ...workplaceDetails, outcomes: e.target.value })}
              />
            </div>
          )}

          {/* Content */}
          <div>
            <Label>Notes *</Label>
            <Textarea
              aria-label="Notes"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Detailed notes..."
              className="mt-2 min-h-[150px]"
            />
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mt-2">
              <Input
                aria-label="Add tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tag..."
              />
              <Button onClick={addTag} variant="outline" size="icon" aria-label="Add tag">
                <Tag className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => setTags(tags.filter((_, i) => i !== idx))}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-brand-border pt-4 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saveMutation.isPending}
              className="!whitespace-normal"
            >
              {saveMutation.isPending ? 'Saving...' : editRecord ? 'Update' : 'Create Record'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}