import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Stethoscope, Briefcase, BookOpen, Activity, Calendar, Tag } from 'lucide-react';
import { toast } from 'sonner';

export default function AddRecordDialog({ open, onClose, editRecord }) {
  const queryClient = useQueryClient();
  const [type, setType] = useState('journal');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  
  // Type-specific fields
  const [medicalDetails, setMedicalDetails] = useState({});
  const [workplaceDetails, setWorkplaceDetails] = useState({});
  const [symptomDetails, setSymptomDetails] = useState({});

  useEffect(() => {
    if (editRecord) {
      setType(editRecord.type);
      setTitle(editRecord.title);
      setDate(editRecord.date);
      setContent(editRecord.content);
      setTags(editRecord.tags || []);
      setMedicalDetails(editRecord.medical_details || {});
      setWorkplaceDetails(editRecord.workplace_details || {});
      setSymptomDetails(editRecord.symptom_details || {});
    } else {
      resetForm();
    }
  }, [editRecord, open]);

  const resetForm = () => {
    setType('journal');
    setTitle('');
    setDate(new Date().toISOString().split('T')[0]);
    setContent('');
    setTags([]);
    setTagInput('');
    setMedicalDetails({});
    setWorkplaceDetails({});
    setSymptomDetails({});
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
      ...(type === 'workplace' && { workplace_details: workplaceDetails }),
      ...(type === 'symptom' && { symptom_details: symptomDetails })
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
    { value: 'medical', label: 'Medical', icon: Stethoscope, color: 'from-rose-500 to-pink-500' },
    { value: 'workplace', label: 'Workplace', icon: Briefcase, color: 'from-blue-500 to-cyan-500' },
    { value: 'journal', label: 'Journal', icon: BookOpen, color: 'from-purple-500 to-violet-500' },
    { value: 'symptom', label: 'Symptom', icon: Activity, color: 'from-amber-500 to-orange-500' }
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
              {recordTypes.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.value}
                    onClick={() => setType(t.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      type === t.value
                        ? `border-teal-500 bg-gradient-to-br ${t.color} bg-opacity-10`
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <Icon className={`h-6 w-6 mx-auto mb-2 ${type === t.value ? 'text-teal-400' : 'text-gray-400'}`} />
                    <p className={`text-sm font-medium ${type === t.value ? 'text-teal-300' : 'text-gray-300'}`}>
                      {t.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Basic Fields */}
          <div>
            <Label>Title *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief description of this record"
              className="mt-2"
            />
          </div>

          <div>
            <Label>Date *</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-2"
            />
          </div>

          {/* Type-Specific Fields */}
          {type === 'medical' && (
            <div className="space-y-4 p-4 bg-rose-50 rounded-lg">
              <h4 className="font-semibold text-gray-800">Medical Details</h4>
              <Input
                placeholder="Doctor's Name"
                value={medicalDetails.doctor_name || ''}
                onChange={(e) => setMedicalDetails({ ...medicalDetails, doctor_name: e.target.value })}
              />
              <Input
                placeholder="Work Restrictions"
                value={medicalDetails.work_restrictions || ''}
                onChange={(e) => setMedicalDetails({ ...medicalDetails, work_restrictions: e.target.value })}
              />
              <Input
                type="date"
                placeholder="Next Appointment"
                value={medicalDetails.next_appointment || ''}
                onChange={(e) => setMedicalDetails({ ...medicalDetails, next_appointment: e.target.value })}
              />
            </div>
          )}

          {type === 'workplace' && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-gray-800">Workplace Details</h4>
              <select
                value={workplaceDetails.meeting_type || 'other'}
                onChange={(e) => setWorkplaceDetails({ ...workplaceDetails, meeting_type: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="supervisor">Supervisor Meeting</option>
                <option value="hr">HR Meeting</option>
                <option value="team">Team Meeting</option>
                <option value="accommodation_review">Accommodation Review</option>
                <option value="other">Other</option>
              </select>
              <Textarea
                placeholder="Outcomes and action items"
                value={workplaceDetails.outcomes || ''}
                onChange={(e) => setWorkplaceDetails({ ...workplaceDetails, outcomes: e.target.value })}
              />
            </div>
          )}

          {type === 'symptom' && (
            <div className="space-y-4 p-4 bg-amber-50 rounded-lg">
              <h4 className="font-semibold text-gray-800">Symptom Details</h4>
              <div>
                <Label>Severity (1-10)</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={symptomDetails.severity || ''}
                  onChange={(e) => setSymptomDetails({ ...symptomDetails, severity: parseInt(e.target.value) })}
                />
              </div>
              <Input
                placeholder="Duration (e.g., 2 hours, all day)"
                value={symptomDetails.duration || ''}
                onChange={(e) => setSymptomDetails({ ...symptomDetails, duration: e.target.value })}
              />
              <Textarea
                placeholder="Relief measures that helped"
                value={symptomDetails.relief_measures || ''}
                onChange={(e) => setSymptomDetails({ ...symptomDetails, relief_measures: e.target.value })}
              />
            </div>
          )}

          {/* Content */}
          <div>
            <Label>Notes *</Label>
            <Textarea
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
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tag..."
              />
              <Button onClick={addTag} variant="outline">
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
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saveMutation.isPending}
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
            >
              {saveMutation.isPending ? 'Saving...' : editRecord ? 'Update' : 'Create Record'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}