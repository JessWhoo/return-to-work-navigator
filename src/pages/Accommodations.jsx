import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import { 
  FileText, Download, 
  Clock, Home, Utensils, Briefcase 
} from 'lucide-react';

const commonAccommodations = [
  {
    category: 'Schedule Flexibility',
    icon: Clock,
    color: 'blue',
    items: [
      'Flexible start/end times for medical appointments',
      'Compressed work week (e.g., 4 longer days instead of 5)',
      'Intermittent FMLA for treatment days',
      'Gradual return schedule (part-time to full-time)',
      'Extended breaks for rest or medication',
      'No early morning meetings'
    ]
  },
  {
    category: 'Work Location',
    icon: Home,
    color: 'teal',
    items: [
      'Work from home 2-3 days per week',
      'Full remote work during treatment',
      'Hybrid schedule flexibility',
      'Closer parking space',
      'Workspace near restroom',
      'Private office or quieter workspace'
    ]
  },
  {
    category: 'Physical Accommodations',
    icon: Briefcase,
    color: 'purple',
    items: [
      'Ergonomic chair or standing desk',
      'Modified desk height or equipment',
      'Reduced physical job duties temporarily',
      'Access to refrigerator for medications',
      'Temperature control in workspace',
      'Lighter workload during recovery'
    ]
  },
  {
    category: 'Breaks & Rest',
    icon: Utensils,
    color: 'rose',
    items: [
      'Additional rest breaks as needed',
      'Longer lunch break for medical needs',
      'Access to quiet room for rest',
      'Flexible break schedule',
      'Permission to lie down if needed',
      'Snack breaks for medication timing'
    ]
  }
];

export default function Accommodations() {
  const [selectedAccommodations, setSelectedAccommodations] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    supervisor: '',
    startDate: '',
    duration: '',
    additionalNotes: ''
  });

  const handleAccommodationToggle = (item) => {
    setSelectedAccommodations(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const generateLetter = () => {
    if (selectedAccommodations.length === 0) {
      toast.error('Please select at least one accommodation');
      return;
    }

    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - margin * 2;
    let y = margin;

    const addLine = (text, fontSize = 11, bold = false, extraSpacing = 0) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach(line => {
        if (y > 270) { doc.addPage(); y = margin; }
        doc.text(line, margin, y);
        y += fontSize * 0.5 + 2;
      });
      y += extraSpacing;
    };

    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    addLine(today, 11, false, 4);
    addLine('To: ' + (formData.supervisor || '[Supervisor/HR Name]'), 11, false, 8);
    addLine('Re: Request for Reasonable Workplace Accommodation', 13, true, 6);
    addLine('Dear ' + (formData.supervisor || '[Supervisor/HR Name]') + ',', 11, false, 4);

    addLine(
      'I am writing to formally request reasonable workplace accommodations under the Americans with Disabilities Act (ADA). I have a medical condition for which my healthcare provider has recommended workplace modifications to enable me to continue performing my essential job functions.',
      11, false, 4
    );

    addLine('Specifically, I am requesting the following accommodations:', 11, true, 2);
    selectedAccommodations.forEach(acc => {
      addLine('  \u2022 ' + acc, 11, false, 1);
    });
    y += 4;

    if (formData.additionalNotes) {
      addLine('Additional Context:', 11, true, 2);
      addLine(formData.additionalNotes, 11, false, 4);
    }

    addLine(
      'These accommodations would be needed starting ' + (formData.startDate || '[date]') + ' and continuing for approximately ' + (formData.duration || '[duration]') + '. I have attached supporting medical documentation from my healthcare provider.',
      11, false, 4
    );

    addLine(
      "I am happy to discuss these accommodations and explore alternatives that meet both my medical needs and the company's operational requirements. Please let me know when we can schedule a meeting.",
      11, false, 6
    );

    addLine('Thank you for your consideration.', 11, false, 8);
    addLine('Sincerely,', 11, false, 10);
    addLine(formData.name || '[Your Name]', 11, true);

    doc.save('accommodation-request-letter.pdf');
    toast.success('Accommodation letter downloaded as PDF!');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
          Workplace Accommodations
        </h1>
        <p className="text-lg text-slate-700 max-w-2xl mx-auto">
          Select the accommodations you need and generate a formal request letter
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border-slate-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-purple-600" />
                <span>Select Your Accommodations</span>
              </CardTitle>
              <p className="text-sm text-slate-700 mt-2">
                Choose from common accommodations. You can customize or add more in the form.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {commonAccommodations.map((category) => {
                const Icon = category.icon;
                return (
                  <div key={category.category} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg bg-${category.color}-100`}>
                        <Icon className={`h-5 w-5 text-${category.color}-600`} />
                      </div>
                      <h3 className="font-semibold text-slate-900">{category.category}</h3>
                    </div>
                    <div className="space-y-2 ml-2">
                      {category.items.map((item, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Checkbox
                            id={`${category.category}-${index}`}
                            checked={selectedAccommodations.includes(item)}
                            onCheckedChange={() => handleAccommodationToggle(item)}
                            className="mt-1"
                          />
                          <label
                            htmlFor={`${category.category}-${index}`}
                            className="text-sm text-slate-800 cursor-pointer flex-1 leading-relaxed"
                          >
                            {item}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-white border-slate-300 sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Jane Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supervisor">Supervisor/HR Name</Label>
                <Input
                  id="supervisor"
                  value={formData.supervisor}
                  onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })}
                  placeholder="John Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="6 months / ongoing"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                  placeholder="Any additional context..."
                  rows={3}
                />
              </div>
              <div className="pt-4 space-y-3">
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-300">
                  <p className="text-sm font-medium text-purple-800 mb-1">Selected:</p>
                  <p className="text-2xl font-bold text-purple-800">{selectedAccommodations.length}</p>
                  <p className="text-xs text-purple-700">accommodations</p>
                </div>
                <Button
                  onClick={generateLetter}
                  className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                  size="lg"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Generate & Download Letter
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="bg-white border-teal-500">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Doctor's Documentation Template</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const template = `[Date]

To Whom It May Concern:

[Patient name] is under my care for a medical condition. Due to their condition and treatment, I recommend the following workplace accommodations:

• [Specific accommodation with medical justification]
• [Specific accommodation with medical justification]
• [Specific accommodation with medical justification]

These accommodations are medically necessary and would enable [patient name] to continue performing their essential job functions. The expected duration of these accommodations is [timeframe/ongoing].

If you have questions regarding these recommendations, please contact my office at [phone].

Sincerely,
[Doctor name] [Title]
[Practice name]`;
                const blob = new Blob([template], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'doctor-accommodation-template.txt';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                toast.success('Doctor template downloaded!');
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-700 mb-4">
            Give this template to your doctor to complete on their letterhead. This documentation 
            supports your accommodation request.
          </p>
          <pre className="whitespace-pre-wrap font-sans text-sm text-slate-800 bg-slate-100 p-4 rounded-lg leading-relaxed border border-slate-300">
{`[Date]

To Whom It May Concern:

[Patient name] is under my care for a medical condition. Due to their condition and treatment, I recommend the following workplace accommodations:

• [Specific accommodation with medical justification]
• [Specific accommodation with medical justification]
• [Specific accommodation with medical justification]

These accommodations are medically necessary and would enable [patient name] to continue performing their essential job functions. The expected duration of these accommodations is [timeframe/ongoing].

If you have questions regarding these recommendations, please contact my office at [phone].

Sincerely,
[Doctor name] [Title]
[Practice name]`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}