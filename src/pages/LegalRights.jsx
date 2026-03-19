import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, Scale, FileText, AlertCircle, 
  CheckCircle2, Building, Users, Clock 
} from 'lucide-react';

const laws = [
  {
    id: 'ada',
    name: 'Americans with Disabilities Act (ADA)',
    year: 'Amended 2008',
    icon: Shield,
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'from-blue-50 to-cyan-50',
    border: 'border-blue-300',
    iconBg: 'from-blue-600 to-cyan-600',
    summary: 'Protects you from discrimination and requires employers to provide reasonable accommodations',
    sections: [
      {
        title: 'Who is Covered?',
        content: [
          'Private employers with 15+ employees',
          'State and local governments',
          'Employment agencies and labor unions'
        ]
      },
      {
        title: 'Key Protections',
        content: [
          'Cannot discriminate in hiring, firing, advancement, or compensation',
          'Must provide reasonable accommodations unless it causes undue hardship',
          'Medical information must be kept confidential',
          'Protection from retaliation',
          'No pre-employment medical exams or disability questions'
        ]
      },
      {
        title: 'When Cancer Qualifies',
        content: [
          'Cancer almost always qualifies as a disability under the 2008 amendments',
          'Substantially limits major life activity (like normal cell growth)',
          'History of cancer counts, even if in remission',
          'Being "regarded as" having a disability is enough'
        ]
      },
      {
        title: 'Reasonable Accommodations Examples',
        content: [
          'Flexible schedules for appointments',
          'Remote work options',
          'Modified break schedules',
          'Reduced or part-time hours',
          'Reserved parking',
          'Ergonomic equipment',
          'Temperature adjustments'
        ]
      }
    ]
  },
  {
    id: 'fmla',
    name: 'Family and Medical Leave Act (FMLA)',
    year: 'Enacted 1993',
    icon: Clock,
    color: 'teal',
    gradient: 'from-emerald-500 to-teal-500',
    bg: 'from-emerald-50 to-teal-50',
    border: 'border-emerald-300',
    iconBg: 'from-emerald-600 to-teal-600',
    summary: 'Guarantees job-protected, unpaid leave for medical reasons',
    sections: [
      {
        title: 'Employer Coverage',
        content: [
          'Private employers with 50+ employees within 75 miles',
          'All public agencies regardless of size',
          'Public and private schools regardless of size'
        ]
      },
      {
        title: 'Employee Eligibility',
        content: [
          'Worked for employer at least 12 months',
          'Worked at least 1,250 hours in past 12 months',
          'Work location has 50+ employees within 75 miles'
        ]
      },
      {
        title: 'Leave Entitlement',
        content: [
          'Up to 12 weeks unpaid leave per year',
          'Can be continuous, intermittent, or reduced schedule',
          'Job protection - right to return to same or equivalent position',
          'Health insurance continues during leave',
          'Up to 26 weeks for military caregiver leave'
        ]
      },
      {
        title: 'Using FMLA for Cancer',
        content: [
          'Continuous: All at once for surgery/recovery',
          'Intermittent: Separate blocks for treatment days',
          'Reduced schedule: Fewer hours during treatment',
          'Can run concurrently with other leave types'
        ]
      }
    ]
  },
  {
    id: 'cobra',
    name: 'COBRA',
    year: 'Enacted 1985',
    icon: FileText,
    color: 'purple',
    gradient: 'from-purple-500 to-violet-500',
    bg: 'from-purple-50 to-violet-50',
    border: 'border-purple-300',
    iconBg: 'from-purple-600 to-violet-600',
    summary: 'Allows you to continue employer health insurance after leaving employment',
    sections: [
      {
        title: 'Who is Covered?',
        content: [
          'Employers with 20+ employees',
          'You must have been enrolled in the health plan',
          'Applies after job loss, hour reduction, or other qualifying events'
        ]
      },
      {
        title: 'Coverage Duration',
        content: [
          '18-36 months depending on qualifying event',
          '29 months if disabled at time of job loss',
          'You pay full premium plus up to 2% admin fee'
        ]
      },
      {
        title: 'Important Deadlines',
        content: [
          'You have 60 days to elect COBRA from notice date',
          'Missing deadline = loss of coverage rights',
          'Must notify plan of disability within 60 days for extended coverage'
        ]
      }
    ]
  },
  {
    id: 'aca',
    name: 'Affordable Care Act (ACA)',
    year: 'Enacted 2010',
    icon: Building,
    color: 'rose',
    gradient: 'from-rose-500 to-pink-500',
    bg: 'from-rose-50 to-pink-50',
    border: 'border-rose-300',
    iconBg: 'from-rose-600 to-pink-600',
    summary: 'Critical health insurance protections including pre-existing condition coverage',
    sections: [
      {
        title: 'Pre-Existing Condition Protections',
        content: [
          'No denial of coverage based on cancer history',
          'No higher premiums because of health status',
          'No waiting periods for pre-existing conditions',
          'Applies to all health insurance plans'
        ]
      },
      {
        title: 'Coverage Limits',
        content: [
          'No lifetime limits on essential health benefits',
          'No annual limits on essential benefits',
          'Out-of-pocket maximum protections',
          'Free preventive services including cancer screenings'
        ]
      },
      {
        title: 'Additional Protections',
        content: [
          'Young adults can stay on parent\'s plan until age 26',
          'Cannot cancel coverage when you get sick',
          'Must cover essential health benefits'
        ]
      }
    ]
  }
];

export default function LegalRights() {
  const [activeTab, setActiveTab] = useState('ada');

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Your Legal Rights
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Understanding your workplace protections as a cancer survivor
        </p>
      </div>

      {/* Important Notice */}
      <Alert className="bg-amber-50 border-amber-200">
        <AlertCircle className="h-5 w-5 text-amber-600" />
        <AlertDescription className="text-amber-900">
          <strong>Important Notice:</strong> This information is for educational purposes only and should not be 
          considered legal advice. For specific guidance about your situation, please consult with a 
          qualified employment attorney or contact the EEOC.
        </AlertDescription>
      </Alert>

      {/* Laws Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-white/60 p-1">
          {laws.map((law) => {
            const Icon = law.icon;
            return (
              <TabsTrigger 
                key={law.id} 
                value={law.id}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-100 data-[state=active]:to-gray-200"
              >
                <Icon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{law.id.toUpperCase()}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {laws.map((law) => {
          const Icon = law.icon;
          return (
            <TabsContent key={law.id} value={law.id} className="space-y-6">
              {/* Law Overview */}
              <Card className={`bg-gradient-to-r ${law.bg} border-2 ${law.border}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${law.iconBg}`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h2 className={`text-2xl font-bold bg-gradient-to-r ${law.gradient} bg-clip-text text-transparent`}>{law.name}</h2>
                        <Badge className={`bg-gradient-to-r ${law.gradient} text-white`}>{law.year}</Badge>
                      </div>
                      <p className="text-gray-800 font-medium leading-relaxed">{law.summary}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Sections */}
              <div className="grid gap-6">
                {law.sections.map((section, index) => (
                  <Card key={index} className={`bg-white border-2 ${law.border} shadow-md`}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <CheckCircle2 className={`h-5 w-5 text-${law.color}-600`} />
                        <span className={`bg-gradient-to-r ${law.gradient} bg-clip-text text-transparent font-bold`}>{section.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {section.content.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start space-x-3">
                            <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${law.gradient} mt-2 flex-shrink-0`} />
                            <span className="text-gray-800 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Resources for Help */}
      <Card className="bg-white/80 backdrop-blur-sm border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Scale className="h-6 w-6 text-green-600" />
            <span>Where to Get Help</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">EEOC</h4>
              <p className="text-sm text-green-800 mb-2">Enforces ADA and employment discrimination laws</p>
              <p className="text-sm text-green-700">📞 1-800-669-4000</p>
              <p className="text-sm text-green-700">🌐 www.eeoc.gov</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Dept. of Labor</h4>
              <p className="text-sm text-blue-800 mb-2">Enforces FMLA</p>
              <p className="text-sm text-blue-700">📞 1-866-487-2365</p>
              <p className="text-sm text-blue-700">🌐 www.dol.gov</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">Job Accommodation Network</h4>
              <p className="text-sm text-purple-800 mb-2">Free guidance on accommodations</p>
              <p className="text-sm text-purple-700">📞 1-800-526-7234</p>
              <p className="text-sm text-purple-700">🌐 askjan.org</p>
            </div>

            <div className="bg-rose-50 p-4 rounded-lg">
              <h4 className="font-semibold text-rose-900 mb-2">Triage Cancer</h4>
              <p className="text-sm text-rose-800 mb-2">Legal info for cancer patients</p>
              <p className="text-sm text-rose-700">🌐 triagecancer.org</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}