import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Copy, MessageSquare, Mail, Users, AlertCircle, CheckCircle2, Sparkles, Plus, FileEdit } from 'lucide-react';
import { toast } from 'sonner';
import EmailDrafter from '../components/communication/EmailDrafter';
import DraftEditor from '../components/communication/DraftEditor';
import SavedDrafts from '../components/communication/SavedDrafts';

const emailTemplates = [
  {
    id: 'initial',
    title: 'Initial Accommodation Request',
    subject: 'Request for Reasonable Accommodation under ADA',
    body: `Dear [HR Person/Manager],

I am requesting reasonable accommodation under the Americans with Disabilities Act due to a medical condition. My doctor has provided documentation regarding my condition and recommended workplace modifications that would enable me to continue performing my essential job functions.

Specifically, I am requesting:
• [Specific accommodation 1]
• [Specific accommodation 2]
• [Specific accommodation 3]

These accommodations would be needed starting [date] and continuing for approximately [duration/ongoing]. I have attached medical documentation from my healthcare provider supporting these requests.

I am happy to discuss these accommodations and explore alternatives that would meet both my medical needs and the company's operational requirements. Please let me know when we can schedule a meeting to discuss this request.

Thank you for your consideration.

Sincerely,
[Your name]`
  },
  {
    id: 'schedule',
    title: 'Schedule Flexibility Request',
    subject: 'Schedule Modification Request - Medical Treatment',
    body: `Dear [Manager],

Due to ongoing medical treatment, I need to request a modified work schedule for the next [timeframe]. My healthcare team has scheduled treatments that require the following adjustments:

• [Day] appointments from [time] to [time]
• Potential need for 1-2 days recovery time following treatment
• Flexible start time on [days] due to morning appointments

I propose the following solutions to maintain productivity:
• Working remotely on days when I'm able but have appointments
• Adjusting my hours on other days to maintain weekly totals
• Being available via email/phone during standard hours when possible

I'm committed to maintaining my work quality and meeting all deadlines. Please let me know if you'd like to discuss alternative arrangements.

Thank you,
[Your name]`
  },
  {
    id: 'wfh',
    title: 'Work From Home Request',
    subject: 'Remote Work Accommodation Request',
    body: `Dear [HR/Manager],

I am requesting permission to work from home [frequency - e.g., 2-3 days per week] as a reasonable accommodation for my medical condition. This arrangement would help me manage treatment side effects while maintaining my productivity.

Benefits of this arrangement:
• Eliminates commute time, preserving energy for work tasks
• Provides immediate access to necessary medical supplies/equipment
• Reduces exposure to illness during immunocompromised periods
• Allows for rest breaks as needed without workplace disruption

I have reliable internet, a dedicated workspace, and all necessary equipment to perform my duties remotely. I will maintain regular communication and remain available during standard work hours.

I suggest a trial period of [timeframe] with regular check-ins to ensure this arrangement meets everyone's needs.

Thank you for considering this request.

Best regards,
[Your name]`
  },
  {
    id: 'return',
    title: 'Return to Work Plan',
    subject: 'Return to Work Plan Following Medical Leave',
    body: `Dear [HR/Manager],

I am planning to return to work on [date] following my medical leave. As I transition back, I am requesting the following temporary accommodations to ensure a successful return:

Week 1-2:
• Part-time schedule (20 hours)
• Work from home 2 days
• No meetings before 10 AM

Week 3-4:
• Increase to 30 hours
• Work from home 1 day
• Flexible break schedule

Week 5+:
• Full-time with flexible scheduling as needed
• Monthly check-ins to assess ongoing needs

My doctor has cleared me to return with these modifications and can provide additional documentation if needed. I'm eager to rejoin the team and appreciate your support during this transition.

Please let me know if you need any additional information.

Sincerely,
[Your name]`
  },
  {
    id: 'parking',
    title: 'Parking Accommodation',
    subject: 'Accessible Parking Accommodation Request',
    body: `Dear [HR],

I am requesting closer parking as a reasonable accommodation for my medical condition. Due to treatment-related fatigue and mobility limitations, the walk from the standard parking area has become challenging and affects my ability to maintain consistent attendance.

I am requesting either:
• A designated spot near the building entrance
• Permission to use visitor/accessible parking
• Reimbursement for daily garage parking closer to the entrance

This accommodation would significantly improve my ability to maintain regular attendance and preserve energy for work duties.

Thank you for your assistance.

Best regards,
[Your name]`
  }
];

const conversationScripts = [
  {
    title: 'Initial Disclosure to Boss',
    scenario: 'When first telling your supervisor about your diagnosis',
    script: `"I need to let you know I've been diagnosed with a medical condition that will require treatment. I'm working with my doctors on a treatment plan and will keep you updated on how this might affect my work schedule."`,
    tips: [
      'Keep it brief - you don\'t owe detailed medical information',
      'Focus on work impact, not medical details',
      'Always follow up with a written email'
    ]
  },
  {
    title: 'Declining Additional Work',
    scenario: 'When you need to say no to new projects or tasks',
    script: `"I appreciate you thinking of me for this project. Given my current workload and medical treatment schedule, I'm not able to take on additional responsibilities right now. I'm happy to revisit this conversation in [timeframe]."`,
    tips: [
      'You don\'t need to apologize for setting limits',
      'Be clear and direct - "no" is a complete sentence',
      'Offer an alternative timeframe if appropriate'
    ]
  },
  {
    title: 'Explaining Energy Limitations',
    scenario: 'When colleagues don\'t understand your fatigue',
    script: `"I'm managing some treatment side effects that affect my energy levels. I'm working with my doctor to optimize my work schedule. I appreciate your understanding as I navigate this."`,
    tips: [
      'You don\'t need to justify your limitations',
      'Focus on what you CAN do, not what you can\'t',
      'Set boundaries around questions about specifics'
    ]
  },
  {
    title: 'Addressing Performance Concerns',
    scenario: 'If your manager raises performance issues',
    script: `"I understand your concerns. My medical condition and treatment have impacted my work temporarily. I've requested accommodations that will help me return to my previous performance level. Let's discuss specific goals and timelines."`,
    tips: [
      'Acknowledge concerns without being defensive',
      'Reference your accommodation requests',
      'Request specific, measurable expectations'
    ]
  },
  {
    title: 'Response to "What kind of cancer?"',
    scenario: 'When colleagues ask for medical details',
    script: `"I'm keeping my medical details private, but thanks for your concern."`,
    tips: [
      'You are NOT required to share your diagnosis',
      'A simple boundary is enough',
      'Don\'t feel guilty about privacy'
    ]
  },
  {
    title: 'Response to "My aunt had that..."',
    scenario: 'When people share their own cancer stories',
    script: `"Everyone's experience is different. I'm focusing on my own treatment plan."`,
    tips: [
      'Politely redirect without engaging',
      'You don\'t need to hear their stories right now',
      'It\'s okay to change the subject'
    ]
  },
  {
    title: 'Response to "Are you going to be okay?"',
    scenario: 'When people ask about your prognosis',
    script: `"I'm following my doctor's treatment plan and taking it one day at a time."`,
    tips: [
      'You don\'t owe reassurance to others',
      'Keep responses neutral and non-committal',
      'Redirect to the present moment'
    ]
  },
  {
    title: 'Response to "Is there anything I can do?"',
    scenario: 'When colleagues offer help',
    script: `"Just treat me normally at work. That's the most helpful thing."`,
    tips: [
      'Most people want to help but don\'t know how',
      'Being specific helps them understand',
      'You can also say "I\'ll let you know if I think of something"'
    ]
  }
];

export default function Communication() {
  const [activeTab, setActiveTab] = useState('drafter');
  const [showDraftEditor, setShowDraftEditor] = useState(false);
  const [editingDraft, setEditingDraft] = useState(null);

  const handleEditDraft = (draft) => {
    setEditingDraft(draft);
    setShowDraftEditor(true);
    setActiveTab('my-drafts');
  };

  const handleCloseDraftEditor = () => {
    setShowDraftEditor(false);
    setEditingDraft(null);
  };

  const handleSaveDraft = () => {
    setShowDraftEditor(false);
    setEditingDraft(null);
  };

  const copyToClipboard = (text, title) => {
    navigator.clipboard.writeText(text);
    toast.success(`${title} copied to clipboard!`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Communication Tools
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Templates and scripts to help you navigate workplace conversations with confidence
        </p>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="font-semibold text-blue-900">Pro Tips for Using These Templates</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• BCC your personal email on everything</li>
                <li>• Send during business hours (schedule emails if needed)</li>
                <li>• Follow up if you don't hear back within 5 business days</li>
                <li>• Keep the tone professional, not apologetic</li>
                <li>• Don't over-explain or justify</li>
                <li>• These are your RIGHTS, not favors</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/60 p-1">
          <TabsTrigger value="drafter" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-100 data-[state=active]:to-pink-100">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Email Drafter
          </TabsTrigger>
          <TabsTrigger value="my-drafts" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-100 data-[state=active]:to-cyan-100">
            <FileEdit className="h-4 w-4 mr-2" />
            My Drafts
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-100 data-[state=active]:to-pink-100">
            <Mail className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="scripts" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-100 data-[state=active]:to-indigo-100">
            <MessageSquare className="h-4 w-4 mr-2" />
            Scripts
          </TabsTrigger>
        </TabsList>

        {/* AI Email Drafter Tab */}
        <TabsContent value="drafter">
          <EmailDrafter />
        </TabsContent>

        {/* My Drafts Tab */}
        <TabsContent value="my-drafts" className="space-y-6">
          {!showDraftEditor ? (
            <>
              <div className="flex justify-end">
                <Button
                  onClick={() => setShowDraftEditor(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Draft
                </Button>
              </div>
              <SavedDrafts onEdit={handleEditDraft} />
            </>
          ) : (
            <DraftEditor 
              draft={editingDraft}
              onClose={handleCloseDraftEditor}
              onSave={handleSaveDraft}
            />
          )}
        </TabsContent>

        {/* Email Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid gap-6">
            {emailTemplates.map((template) => (
              <Card key={template.id} className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl text-gray-800">{template.title}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">Subject: {template.subject}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(`Subject: ${template.subject}\n\n${template.body}`, template.title)}
                      className="flex items-center space-x-2"
                    >
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 bg-gray-50 p-4 rounded-lg leading-relaxed">
                    {template.body}
                  </pre>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Conversation Scripts Tab */}
        <TabsContent value="scripts" className="space-y-6">
          <div className="grid gap-6">
            {conversationScripts.map((script, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-800 mb-2">{script.title}</CardTitle>
                      <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                        {script.scenario}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(script.script, script.title)}
                      className="flex items-center space-x-2"
                    >
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <p className="text-gray-800 font-medium leading-relaxed">{script.script}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-700 text-sm">Tips:</h4>
                    <ul className="space-y-1">
                      {script.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="text-sm text-gray-600 flex items-start">
                          <span className="text-teal-500 mr-2">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Disclosure Decision Guide */}
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-purple-600" />
                <span>What to Tell Coworkers?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">Option 1: Tell Everyone</h4>
                  <p className="text-sm text-green-700 mb-2">✓ No secrets, might get support</p>
                  <p className="text-sm text-red-700">✗ Become the office cancer patient</p>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-amber-900 mb-2">Option 2: Tell No One</h4>
                  <p className="text-sm text-green-700 mb-2">✓ Privacy maintained</p>
                  <p className="text-sm text-red-700">✗ Exhausting, no support</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">Option 3: Tell Select People</h4>
                  <p className="text-sm text-green-700 mb-2">✓ Controlled info, chosen support</p>
                  <p className="text-sm text-red-700">✗ Requires active management</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Option 4: Brief & Professional (Recommended)</h4>
                  <p className="text-sm text-green-700 mb-2">✓ Honest without oversharing</p>
                  <p className="text-sm text-red-700">✗ Some will push for details</p>
                </div>
              </div>

              <div className="bg-blue-100 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-2">Recommended Script:</p>
                <p className="text-sm text-blue-800 italic">
                  "I'm dealing with a health issue that requires some treatment. I'll need some flexibility with my schedule but I'm managing it."
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Remember Section */}
      <Card className="bg-gradient-to-r from-rose-100 to-teal-100 border-rose-200">
        <CardContent className="pt-6 text-center">
          <MessageSquare className="h-12 w-12 text-rose-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-3">Remember</h3>
          <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Your boss is not your therapist or best friend. They're your boss. Keep it professional, 
            keep it factual, and keep your expectations appropriate. These are your RIGHTS, 
            not favors you're asking for.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}