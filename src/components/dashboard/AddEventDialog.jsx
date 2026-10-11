import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import BrandChoice from '@/components/brand/BrandChoice';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Stethoscope, Star, Bell, MoreHorizontal } from 'lucide-react';

const eventTypes = [
  { value: 'meeting', label: 'Meeting', icon: CalendarIcon, color: 'purple' },
  { value: 'medical', label: 'Medical Appointment', icon: Stethoscope, color: 'rose' },
  { value: 'milestone', label: 'Milestone', icon: Star, color: 'indigo' },
  { value: 'reminder', label: 'Reminder', icon: Bell, color: 'orange' },
  { value: 'other', label: 'Other', icon: MoreHorizontal, color: 'gray' }
];

export default function AddEventDialog({ open, onClose, onAddEvent }) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    type: 'meeting',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newEvent = {
      id: `custom-${Date.now()}`,
      ...formData,
      color: eventTypes.find(t => t.value === formData.type)?.color || 'gray'
    };
    
    onAddEvent(newEvent);
    setFormData({ title: '', date: '', type: 'meeting', description: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add Calendar Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Follow-up with manager"
              required
            />
          </div>

          <div>
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>Event Type *</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {eventTypes.map(type => <BrandChoice key={type.value} selected={formData.type === type.value} icon={type.icon} onClick={() => setFormData({ ...formData, type: type.value })}>{type.label}</BrandChoice>)}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add any additional details..."
              rows={3}
            />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-brand-border pt-4 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="!whitespace-normal"
            >
              Add Event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}