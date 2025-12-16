import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Clock, Stethoscope, Star, Bell, MoreHorizontal } from 'lucide-react';

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
              {eventTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = formData.type === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.value })}
                    className={`
                      flex items-center space-x-2 p-3 rounded-lg border-2 transition-all
                      ${isSelected 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                      }
                    `}
                  >
                    <Icon className={`h-5 w-5 ${isSelected ? 'text-indigo-600' : 'text-gray-500'}`} />
                    <span className={`text-sm font-medium ${isSelected ? 'text-indigo-700' : 'text-gray-700'}`}>
                      {type.label}
                    </span>
                  </button>
                );
              })}
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

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              Add Event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}