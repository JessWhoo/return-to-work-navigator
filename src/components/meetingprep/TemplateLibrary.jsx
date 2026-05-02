import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Printer, ChevronDown, ChevronUp, Mail, FileText, Check } from 'lucide-react';
import { toast } from 'sonner';

const TEMPLATES = [
  {
    id: 'schedule_adjustment',
    category: 'Email',
    title: 'Request a Schedule Adjustment',
    description: 'Ask your manager for a temporary or permanent change to your work hours.',
    color: 'teal',
    body: `Subject: Request for Schedule Adjustment – [Your Name]

Dear [Manager's Name],

I hope this message finds you well. I am writing to formally request a temporary adjustment to my work schedule as part of my ongoing recovery. My healthcare provider has recommended [specific change, e.g., reduced hours or a later start time] to help manage my energy levels and support my continued treatment.

Specifically, I am requesting [describe the adjustment, e.g., "to work from 9:00 AM to 3:00 PM, Monday through Friday, for the next eight weeks"]. I am confident this arrangement will allow me to maintain my productivity while prioritizing my health.

I have attached [any supporting documentation, if available] and am happy to meet at your earliest convenience to discuss further. I remain fully committed to my responsibilities and will continue to communicate proactively about my progress.

Thank you for your understanding and support.

Sincerely,
[Your Name]
[Your Job Title]
[Contact Information]`
  },
  {
    id: 'medical_disclosure',
    category: 'Email',
    title: 'Disclose a Medical Condition to HR',
    description: 'Formally notify HR of a diagnosis to initiate the accommodations process.',
    color: 'purple',
    body: `Subject: Confidential – Medical Condition Disclosure – [Your Name]

Dear [HR Representative's Name],

I am writing to notify you, in confidence, that I have recently been diagnosed with [general description, e.g., "a serious medical condition requiring ongoing treatment"]. I am sharing this information because I would like to discuss potential workplace accommodations that may help me continue to perform my role effectively during my treatment and recovery.

I understand my rights under the Americans with Disabilities Act (ADA) and am requesting an interactive process meeting to explore reasonable accommodations. My doctor is prepared to provide supporting documentation as needed.

I want to assure you that I am committed to my position and to maintaining open communication throughout this process. Please treat this matter with the utmost confidentiality.

I am available to meet at your convenience. Please let me know what next steps are required on my end.

Thank you for your support.

Sincerely,
[Your Name]
[Your Job Title]
[Contact Information]`
  },
  {
    id: 'fatigue_explanation',
    category: 'Email',
    title: 'Explain Fatigue-Related Limitations',
    description: 'Professionally communicate how fatigue impacts your work and what support helps.',
    color: 'amber',
    body: `Subject: Following Up on My Return-to-Work Plan – [Your Name]

Dear [Manager's Name],

Thank you for your ongoing support as I continue my recovery. I wanted to provide a brief update and address some aspects of my work that may require temporary adjustments.

Cancer-related fatigue is a documented side effect of my treatment that can affect concentration, stamina, and cognitive performance. On some days, particularly [mention any patterns, e.g., "following chemotherapy sessions"], I may experience reduced capacity. This is a temporary and medically recognized condition.

To help manage this effectively, the following adjustments would be greatly beneficial:
• [Adjustment 1, e.g., "Permission to take a short rest break mid-morning and mid-afternoon"]
• [Adjustment 2, e.g., "Flexibility to complete focused tasks earlier in the day when my energy is highest"]
• [Adjustment 3, e.g., "Temporary reduction in non-essential meetings or travel"]

I remain dedicated to meeting my core responsibilities and will keep you informed of any changes in my condition. I am happy to meet to discuss how we can best structure my workload during this period.

Thank you for your understanding.

Sincerely,
[Your Name]
[Your Job Title]`
  },
  {
    id: 'accommodation_formal',
    category: 'Email',
    title: 'Formal Accommodation Request',
    description: 'Submit a written request for specific workplace accommodations under the ADA.',
    color: 'blue',
    body: `Subject: Formal Request for Reasonable Accommodations – [Your Name]

Dear [HR Representative's Name],

Pursuant to the Americans with Disabilities Act (ADA), I am formally requesting reasonable workplace accommodations to assist me in performing the essential functions of my position as [Your Job Title].

Due to my medical condition, I require the following accommodations:

1. [Accommodation #1, e.g., "Remote work on days following medical treatment"]
   Reason: [Brief medical basis, e.g., "To manage treatment side effects that impact my ability to commute"]

2. [Accommodation #2, e.g., "Ergonomic workstation modifications"]
   Reason: [Brief medical basis]

3. [Accommodation #3 if applicable]
   Reason: [Brief medical basis]

My healthcare provider is prepared to provide documentation supporting these requests. I am open to discussing alternative accommodations that achieve the same goal of enabling my effective job performance.

I request a response to this accommodation request within a reasonable timeframe. Please let me know how you would like to proceed.

Sincerely,
[Your Name]
[Your Job Title]
[Date]
[Employee ID if applicable]`
  },
  {
    id: 'return_to_work_plan',
    category: 'Agenda',
    title: 'Return-to-Work Meeting Agenda',
    description: 'Structure a meeting to create a formal return plan with your employer.',
    color: 'green',
    body: `MEETING AGENDA
Return-to-Work Planning Meeting

Date: [Meeting Date]
Time: [Time]
Attendees: [Your Name], [Manager/HR Name(s)]
Location / Call Link: [Details]

---

1. WELCOME & PURPOSE (5 minutes)
   • Brief overview of meeting goals
   • Confirm confidentiality expectations

2. HEALTH UPDATE (10 minutes)
   • Current status and anticipated treatment timeline
   • Current functional abilities and limitations
   • Any medical restrictions (if comfortable sharing)

3. PROPOSED RETURN SCHEDULE (15 minutes)
   • Proposed start date for return
   • Phased schedule proposal (e.g., 3 days/week increasing to full-time)
   • Review of essential job functions vs. modified duties

4. ACCOMMODATIONS DISCUSSION (15 minutes)
   • Specific accommodations being requested
   • Review of any supporting documentation
   • Employer's response and next steps

5. COMMUNICATION PLAN (5 minutes)
   • Check-in frequency and format
   • Designated point of contact for concerns
   • Process for requesting further adjustments

6. ACTION ITEMS & FOLLOW-UP (5 minutes)
   • Document agreed-upon accommodations in writing
   • Set date for first formal review (recommended: 30 days)
   • Clarify any remaining questions

---
Notes / Additional Items:
[Space for notes]`
  },
  {
    id: 'supervisor_checkin',
    category: 'Agenda',
    title: 'Ongoing Supervisor Check-In Agenda',
    description: 'Keep regular check-ins structured and productive as you navigate your return.',
    color: 'cyan',
    body: `MEETING AGENDA
Regular Return-to-Work Check-In

Date: [Date]
Attendees: [Your Name] & [Supervisor's Name]

---

1. WELLBEING UPDATE (5 minutes)
   • Brief general update on health status
   • Any upcoming medical appointments that may affect schedule

2. WORKLOAD REVIEW (10 minutes)
   • Tasks completed since last check-in
   • Any tasks that required more time or difficulty than expected
   • Current workload and capacity assessment

3. ACCOMMODATION EFFECTIVENESS (5 minutes)
   • Are current accommodations working as needed?
   • Any adjustments required?
   • New concerns or needs to address

4. UPCOMING PRIORITIES (5 minutes)
   • Key projects or deadlines in the next period
   • Any potential conflicts with treatment schedule
   • Support needed from manager

5. OPEN DISCUSSION (5 minutes)
   • Feedback from either party
   • Questions or concerns
   • Recognition of progress

Next check-in date: _______________`
  },
  {
    id: 'performance_concern',
    category: 'Email',
    title: 'Respond to a Performance Concern',
    description: 'Professionally address a performance concern in the context of your health situation.',
    color: 'rose',
    body: `Subject: Response to Performance Discussion – [Your Name]

Dear [Manager's Name],

Thank you for taking the time to meet with me regarding [the performance concern discussed]. I appreciate your directness and want to address this matter openly.

As you are aware, I have been managing [general reference to health condition] which has presented some temporary challenges to my performance, specifically [briefly acknowledge the specific concern]. I want to assure you that this does not reflect my typical standards or my commitment to this role.

I have been actively working with my healthcare team to manage [symptom/challenge, e.g., "fatigue and cognitive focus"] and I believe the following steps will help me get back to my full performance level:

• [Step 1, e.g., "Adjusting my work schedule to focus complex tasks in the morning"]
• [Step 2, e.g., "Requesting a temporary extension on the [specific project]"]
• [Step 3, e.g., "Weekly check-ins with you to track progress"]

I would like to formally request a discussion about reasonable accommodations that may help address these challenges under the ADA. I am also happy to provide medical documentation if that would be helpful.

I value my role here and am fully committed to improving and supporting the team.

Thank you for your understanding.

Sincerely,
[Your Name]`
  },
  {
    id: 'leave_return_notice',
    category: 'Email',
    title: 'Notice of Return from Medical Leave',
    description: 'Notify your employer of your planned return date and any transition needs.',
    color: 'indigo',
    body: `Subject: Return from Medical Leave – [Your Name] – Effective [Date]

Dear [HR Representative / Manager's Name],

I am writing to formally notify you of my planned return to work from medical leave. My anticipated return date is [Date].

My healthcare provider has cleared me to return to work [with / without] restrictions. [If with restrictions, briefly describe: e.g., "I will be returning on a part-time basis for the first four weeks, working Monday through Wednesday."]

In preparation for my return, I would appreciate the opportunity to:
• Meet with you prior to my return date to discuss my transition plan
• Review any updates to my projects, team, or responsibilities
• Confirm any workplace accommodations that will be in place

I am enthusiastic about returning and am committed to a smooth reintegration. Please let me know if there is any paperwork or formal process required on my end.

I look forward to reconnecting with the team and am available by phone or email should you need to reach me before my return date.

Sincerely,
[Your Name]
[Your Job Title]
[Contact Information]`
  }
];

const COLOR_MAP = {
  teal: { badge: 'bg-teal-900/50 text-teal-300 border-teal-700/50', border: 'border-teal-700/40', header: 'text-teal-300' },
  purple: { badge: 'bg-purple-900/50 text-purple-300 border-purple-700/50', border: 'border-purple-700/40', header: 'text-purple-300' },
  amber: { badge: 'bg-amber-900/50 text-amber-300 border-amber-700/50', border: 'border-amber-700/40', header: 'text-amber-300' },
  blue: { badge: 'bg-blue-900/50 text-blue-300 border-blue-700/50', border: 'border-blue-700/40', header: 'text-blue-300' },
  green: { badge: 'bg-green-900/50 text-green-300 border-green-700/50', border: 'border-green-700/40', header: 'text-green-300' },
  cyan: { badge: 'bg-cyan-900/50 text-cyan-300 border-cyan-700/50', border: 'border-cyan-700/40', header: 'text-cyan-300' },
  rose: { badge: 'bg-rose-900/50 text-rose-300 border-rose-700/50', border: 'border-rose-700/40', header: 'text-rose-300' },
  indigo: { badge: 'bg-indigo-900/50 text-indigo-300 border-indigo-700/50', border: 'border-indigo-700/40', header: 'text-indigo-300' },
};

function TemplateCard({ template }) {
  const [expanded, setExpanded] = useState(false);
  const [edited, setEdited] = useState(template.body);
  const [copied, setCopied] = useState(false);
  const colors = COLOR_MAP[template.color] || COLOR_MAP.teal;

  const handleCopy = () => {
    navigator.clipboard.writeText(edited);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head>
          <title>${template.title}</title>
          <style>
            body { font-family: Georgia, serif; max-width: 700px; margin: 40px auto; color: #1a1a2e; line-height: 1.7; }
            h1 { font-size: 1.4rem; color: #2d3a8c; margin-bottom: 4px; }
            .meta { color: #6b7280; font-size: 0.85rem; margin-bottom: 24px; }
            pre { font-family: Georgia, serif; white-space: pre-wrap; font-size: 0.95rem; background: #f9fafb; border-left: 4px solid #6366f1; padding: 16px 20px; border-radius: 4px; }
            .footer { margin-top: 32px; font-size: 0.75rem; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 10px; }
          </style>
        </head>
        <body>
          <h1>${template.title}</h1>
          <div class="meta">${template.category} Template · Back to Life, Back to Work Navigator</div>
          <pre>${edited}</pre>
          <div class="footer">Printed ${new Date().toLocaleDateString()} · Replace all [bracketed placeholders] before sending.</div>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <Card className={`bg-slate-800/80 border ${colors.border} transition-all`}>
      <CardHeader className="pb-3 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Badge className={`text-xs border ${colors.badge}`}>
                {template.category === 'Email' ? <Mail className="h-3 w-3 mr-1" /> : <FileText className="h-3 w-3 mr-1" />}
                {template.category}
              </Badge>
            </div>
            <CardTitle className={`text-base ${colors.header}`}>{template.title}</CardTitle>
            <p className="text-slate-400 text-xs mt-1">{template.description}</p>
          </div>
          <button className="text-slate-400 hover:text-slate-200 flex-shrink-0 mt-1">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0 space-y-3">
          <div className="bg-slate-900/60 rounded-lg p-1">
            <Textarea
              value={edited}
              onChange={e => setEdited(e.target.value)}
              className="bg-transparent border-none text-slate-300 text-xs font-mono leading-relaxed min-h-[320px] resize-y focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <p className="text-xs text-slate-500 italic">Edit the template above, then copy or print. Replace all [bracketed] placeholders with your details.</p>
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" onClick={handleCopy}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs">
              {copied ? <Check className="h-3.5 w-3.5 mr-1.5 text-green-400" /> : <Copy className="h-3.5 w-3.5 mr-1.5" />}
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </Button>
            <Button size="sm" variant="outline" onClick={handlePrint}
              className="border-slate-600 text-slate-300 hover:text-white text-xs">
              <Printer className="h-3.5 w-3.5 mr-1.5" />
              Print / Save as PDF
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setEdited(template.body)}
              className="text-slate-500 hover:text-slate-300 text-xs">
              Reset
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default function TemplateLibrary() {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Email', 'Agenda'];

  const filtered = filter === 'All' ? TEMPLATES : TEMPLATES.filter(t => t.category === filter);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-slate-300 text-sm">
            Ready-to-use templates for common workplace scenarios. Click any template to expand, customize, and copy or print.
          </p>
        </div>
        <div className="flex gap-2">
          {categories.map(cat => (
            <button key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                filter === cat
                  ? 'bg-purple-600 border-purple-500 text-white'
                  : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-purple-500 hover:text-purple-300'
              }`}>
              {cat === 'Email' && <Mail className="h-3 w-3 inline mr-1" />}
              {cat === 'Agenda' && <FileText className="h-3 w-3 inline mr-1" />}
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(t => <TemplateCard key={t.id} template={t} />)}
      </div>
    </div>
  );
}