import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, ExternalLink, Building2, DollarSign, 
  BookOpen, Users, Filter, FileText, Landmark
} from 'lucide-react';

const resources = [
  {
    category: 'Cancer Organizations',
    icon: Building2,
    color: 'purple',
    items: [
      {
        name: 'American Cancer Society - Working During Treatment',
        org: 'American Cancer Society',
        description: 'Comprehensive workplace resources, including return to work guidance and talking to your employer about cancer',
        url: 'https://www.cancer.org',
        type: 'WEBSITE'
      },
      {
        name: 'Breastcancer.org - Working During Treatment',
        org: 'Breastcancer.org',
        description: 'Practical advice for balancing work with breast cancer treatment, including accommodations and communication tips',
        url: 'https://www.breastcancer.org',
        type: 'WEBSITE'
      },
      {
        name: 'Cancer and Careers',
        org: 'Cancer and Careers',
        description: 'Dedicated to empowering cancer patients and survivors to thrive in their workplace, with tools, resources, and support',
        url: 'https://www.cancerandcareers.org',
        type: 'WEBSITE'
      },
      {
        name: 'CancerCare',
        org: 'CancerCare',
        description: 'Professional support services, including counseling, support groups, and assistance with workplace issues',
        url: 'https://www.cancercare.org',
        type: 'WEBSITE'
      },
      {
        name: 'National Coalition for Cancer Survivorship',
        org: 'NCCS',
        description: 'Advocacy organization providing resources and support for cancer survivors',
        url: 'https://www.canceradvocacy.org',
        type: 'WEBSITE'
      },
      {
        name: 'Stupid Cancer',
        org: 'Stupid Cancer',
        description: 'Community and resources for adolescents and young adults affected by cancer',
        url: 'https://www.stupidcancer.org',
        type: 'WEBSITE'
      },
      {
        name: 'Susan G. Komen - Work and Cancer',
        org: 'Susan G. Komen',
        description: 'Information about managing work during and after breast cancer treatment, including talking to employers',
        url: 'https://www.komen.org',
        type: 'WEBSITE'
      },
      {
        name: 'Triage Cancer - Employment Resources',
        org: 'Triage Cancer',
        description: 'Legal and practical information for cancer survivors navigating employment issues',
        url: 'https://triagecancer.org',
        type: 'WEBSITE'
      }
    ]
  },
  {
    category: 'Financial Assistance',
    icon: DollarSign,
    color: 'green',
    items: [
      {
        name: 'Cancer Financial Assistance Coalition',
        org: 'Cancer FAC',
        description: 'Database of financial resources to help cancer patients with treatment-related expenses',
        url: 'https://www.cancerfac.org',
        type: 'TOOL'
      },
      {
        name: 'CancerCare Financial Assistance',
        org: 'CancerCare',
        description: 'Limited financial assistance for cancer-related costs including transportation, childcare, home care, and medication',
        url: 'https://www.cancercare.org/financial',
        type: 'WEBSITE'
      },
      {
        name: 'Family Reach',
        org: 'Family Reach',
        description: 'Financial assistance and support services for families facing cancer',
        url: 'https://www.familyreach.org',
        type: 'WEBSITE'
      },
      {
        name: 'HealthWell Foundation',
        org: 'HealthWell Foundation',
        description: 'Financial assistance for underinsured patients to cover coinsurance, copayments, and premiums',
        url: 'https://www.healthwellfoundation.org',
        type: 'WEBSITE'
      },
      {
        name: 'NeedyMeds',
        org: 'NeedyMeds',
        description: 'Database of patient assistance programs for medications and healthcare costs',
        url: 'https://www.needymeds.org',
        type: 'TOOL'
      },
      {
        name: 'Patient Advocate Foundation Co-Pay Relief',
        org: 'Patient Advocate Foundation',
        description: 'Co-payment assistance for patients with specific chronic, life-threatening, or debilitating diseases',
        url: 'https://www.copays.org',
        type: 'WEBSITE'
      },
      {
        name: 'Social Security Disability Insurance (SSDI) for People with Cancer',
        org: 'American Cancer Society',
        description: 'Comprehensive guide from the American Cancer Society explaining SSDI eligibility, application process, benefits, and what to do if your application is turned down. Includes information about Compassionate Allowances for faster approval',
        url: 'https://www.cancer.org/cancer/managing-cancer/financial-insurance-matters/social-security-disability-insurance.html',
        type: 'GUIDE'
      },
      {
        name: 'The SAMFund',
        org: 'The SAMFund',
        description: 'Financial assistance and support for young adult cancer survivors',
        url: 'https://www.thesamfund.org',
        type: 'WEBSITE'
      }
    ]
  },
  {
    category: 'Government Resources',
    icon: Landmark,
    color: 'blue',
    items: [
      {
        name: 'ADA Compliance Cheat Sheet',
        org: 'CustomGuide',
        description: 'Essential guide to the Americans with Disabilities Act (ADA). Covers hiring requirements, reasonable accommodations, interview accessibility, onboarding practices, and maintaining ADA compliance in the workplace',
        url: 'https://www.customguide.com',
        type: 'GUIDE'
      },
      {
        name: 'ADA National Network',
        org: 'ADA National Network',
        description: 'Information, guidance, and training on the Americans with Disabilities Act',
        url: 'https://adata.org',
        type: 'WEBSITE'
      },
      {
        name: 'CareerOneStop',
        org: 'U.S. Department of Labor',
        description: 'Job search, training, and career resources sponsored by the U.S. Department of Labor',
        url: 'https://www.careeronestop.org',
        type: 'WEBSITE'
      },
      {
        name: 'Department of Labor - FMLA',
        org: 'U.S. Department of Labor',
        description: 'Information about the Family and Medical Leave Act, including eligibility and how to request leave',
        url: 'https://www.dol.gov/agencies/whd/fmla',
        type: 'WEBSITE'
      },
      {
        name: 'Equal Employment Opportunity Commission (EEOC)',
        org: 'EEOC',
        description: 'Information on workplace rights and filing discrimination complaints under the Americans with Disabilities Act (ADA)',
        url: 'https://www.eeoc.gov',
        type: 'WEBSITE'
      },
      {
        name: 'FMLA Requirements Cheat Sheet',
        org: 'CustomGuide',
        description: 'Quick reference guide for the Family and Medical Leave Act (FMLA). Covers eligibility requirements, types of leave, documentation needs, implementation steps, and compliance best practices for managers',
        url: 'https://www.customguide.com',
        type: 'GUIDE'
      },
      {
        name: 'Job Accommodation Network (JAN)',
        org: 'Job Accommodation Network',
        description: 'Free guidance on workplace accommodations and the ADA. Provides personalized assistance and resources for cancer survivors',
        url: 'https://askjan.org',
        type: 'WEBSITE'
      },
      {
        name: 'Medicaid.gov',
        org: 'Centers for Medicare & Medicaid Services',
        description: 'Information about Medicaid eligibility and coverage for cancer treatment',
        url: 'https://www.medicaid.gov',
        type: 'WEBSITE'
      },
      {
        name: 'Medicare.gov',
        org: 'Centers for Medicare & Medicaid Services',
        description: 'Information about Medicare coverage for cancer treatment and related healthcare services',
        url: 'https://www.medicare.gov',
        type: 'WEBSITE'
      },
      {
        name: 'National Cancer Institute - Managing Cancer Care',
        org: 'National Cancer Institute',
        description: 'Comprehensive resources from the NCI on managing cancer treatment, including work and daily life considerations',
        url: 'https://www.cancer.gov',
        type: 'WEBSITE'
      },
      {
        name: 'Social Security Disability Insurance',
        org: 'Social Security Administration',
        description: 'Information about disability benefits and how to apply if your cancer prevents you from working',
        url: 'https://www.ssa.gov/benefits/disability',
        type: 'WEBSITE'
      },
      {
        name: 'State Vocational Rehabilitation Services',
        org: 'U.S. Department of Labor',
        description: 'State-run programs that help people with disabilities find and maintain employment',
        url: 'https://www.dol.gov/agencies/odep/program-areas/individuals/vocational-rehabilitation',
        type: 'WEBSITE'
      }
    ]
  },
  {
    category: 'Publications and Guides',
    icon: BookOpen,
    color: 'indigo',
    items: [
      {
        name: 'ASCO Cancer Survivorship Resources',
        org: 'ASCO',
        description: 'Clinical resources and patient information on survivorship care from the American Society of Clinical Oncology',
        url: 'https://www.cancer.net/survivorship',
        type: 'GUIDE'
      },
      {
        name: 'Cancer and Careers Workbook',
        org: 'Cancer and Careers',
        description: 'Practical guidance and worksheets for navigating work during and after cancer treatment',
        url: 'https://www.cancerandcareers.org/en/resources/publications',
        type: 'GUIDE'
      },
      {
        name: 'EEOC: Cancer in the Workplace and the ADA',
        org: 'EEOC',
        description: 'Official guidance on how the Americans with Disabilities Act applies to employees with cancer',
        url: 'https://www.eeoc.gov/laws/guidance/cancer-workplace-and-ada',
        type: 'GUIDE'
      },
      {
        name: 'Job Accommodation Network - Sample Letters',
        org: 'Job Accommodation Network',
        description: 'Templates and examples for requesting workplace accommodations under the ADA',
        url: 'https://askjan.org/publications/Sample-Accommodation-Request-Letters.cfm',
        type: 'GUIDE'
      },
      {
        name: 'National Cancer Institute - Facing Forward: Life After Cancer Treatment',
        org: 'National Cancer Institute',
        description: 'Comprehensive guide covering physical, emotional, and practical issues faced by cancer survivors, including returning to work',
        url: 'https://www.cancer.gov/publications/patient-education/facing-forward',
        type: 'GUIDE'
      },
      {
        name: 'Triage Cancer - Quick Guides',
        org: 'Triage Cancer',
        description: 'Short, easy-to-read guides on insurance, employment, finances, and other practical topics for cancer patients',
        url: 'https://triagecancer.org/quickguides',
        type: 'GUIDE'
      },
      {
        name: 'Working Through Cancer: Your Legal Rights',
        org: 'Triage Cancer',
        description: 'A comprehensive guide to employment rights for cancer survivors, covering ADA, FMLA, and more',
        url: 'https://triagecancer.org/employmentrights',
        type: 'GUIDE'
      }
    ]
  },
  {
    category: 'Support Services',
    icon: Users,
    color: 'rose',
    items: [
      {
        name: 'Cancer Support Community',
        org: 'Cancer Support Community',
        description: 'Support groups, education, and resources for cancer patients, survivors, and caregivers',
        url: 'https://www.cancersupportcommunity.org',
        type: 'WEBSITE'
      },
      {
        name: 'Cancer Survivors Network',
        org: 'American Cancer Society',
        description: 'Online community from the American Cancer Society connecting cancer survivors and caregivers',
        url: 'https://csn.cancer.org',
        type: 'WEBSITE'
      },
      {
        name: 'Disability Rights Advocates',
        org: 'Disability Rights Advocates',
        description: 'Legal advocacy organization fighting for the civil rights of people with disabilities',
        url: 'https://dralegal.org',
        type: 'WEBSITE'
      },
      {
        name: 'Imerman Angels',
        org: 'Imerman Angels',
        description: 'Free one-on-one cancer support by pairing you with someone who has fought the same cancer',
        url: 'https://www.imermanangels.org',
        type: 'WEBSITE'
      },
      {
        name: 'Living Beyond Breast Cancer',
        org: 'Living Beyond Breast Cancer',
        description: 'Education and support programs for people affected by breast cancer at every stage',
        url: 'https://www.lbbc.org',
        type: 'WEBSITE'
      },
      {
        name: 'National Disability Rights Network',
        org: 'NDRN',
        description: 'Legal advocacy network protecting the rights of people with disabilities',
        url: 'https://www.ndrn.org',
        type: 'WEBSITE'
      },
      {
        name: 'Patient Advocate Foundation',
        org: 'Patient Advocate Foundation',
        description: 'Case management services and financial aid to help patients access healthcare and overcome financial barriers',
        url: 'https://www.patientadvocate.org',
        type: 'WEBSITE'
      },
      {
        name: 'Triage Cancer Legal Resources',
        org: 'Triage Cancer',
        description: 'Free legal information and resources about cancer-related legal issues, including employment discrimination and workplace rights',
        url: 'https://triagecancer.org',
        type: 'WEBSITE'
      },
      {
        name: 'Workplace Fairness',
        org: 'Workplace Fairness',
        description: 'Non-profit providing information and resources about workers rights and employment law',
        url: 'https://www.workplacefairness.org',
        type: 'WEBSITE'
      },
      {
        name: 'Young Survival Coalition',
        org: 'Young Survival Coalition',
        description: 'Support and resources specifically for young adults diagnosed with breast cancer',
        url: 'https://www.youngsurvival.org',
        type: 'WEBSITE'
      }
    ]
  }
];

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredResources = resources.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.org.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => 
    selectedCategory === 'all' || category.category === selectedCategory
  );

  const totalResources = resources.reduce((sum, cat) => sum + cat.items.length, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
          Resource Library
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {totalResources} trusted organizations, guides, and support services to help you on your journey
        </p>
      </div>

      {/* Search and Filter */}
      <Card className="bg-gradient-to-br from-white via-indigo-50/30 to-blue-50/30 backdrop-blur-sm border-2 border-indigo-100 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border-2 border-indigo-200 rounded-lg bg-white hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all cursor-pointer"
            >
              <option value="all">All Categories</option>
              {resources.map(cat => (
                <option key={cat.category} value={cat.category}>{cat.category}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Resources by Category */}
      <div className="space-y-8">
        {filteredResources.map((category) => {
          if (category.items.length === 0) return null;
          
          const Icon = category.icon;
          return (
            <div key={category.category} className="space-y-4">
              <div className={`flex items-center space-x-3 p-4 bg-gradient-to-r from-${category.color}-50 to-${category.color}-100 rounded-xl`}>
                <Icon className={`h-6 w-6 text-${category.color}-700`} />
                <h2 className="text-2xl font-bold text-gray-800">{category.category}</h2>
                <Badge variant="secondary" className="ml-auto">
                  {category.items.length} resources
                </Badge>
              </div>

              <div className="grid gap-5">
                {category.items.map((resource, index) => {
                  const cardColors = colorMap[category.color];
                  return (
                    <Card key={index} className="bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group border-2 border-gray-100 hover:border-indigo-200 overflow-hidden">
                      <CardContent className="pt-6 relative">
                        <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${cardColors.iconFrom} ${cardColors.iconTo}`}></div>
                        <div className="flex items-start justify-between mb-3 pl-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge className={`bg-gradient-to-r ${cardColors.iconFrom} ${cardColors.iconTo} text-white shadow-sm`}>
                                {resource.type}
                              </Badge>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-indigo-700 transition-colors">{resource.name}</h3>
                            <p className="text-sm font-medium text-indigo-600 mb-2">{resource.org}</p>
                            <p className="text-sm text-gray-600 leading-relaxed">{resource.description}</p>
                          </div>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`ml-4 p-4 rounded-xl bg-gradient-to-br ${cardColors.from} ${cardColors.via} hover:${cardColors.iconFrom} hover:${cardColors.iconTo} hover:text-white transition-all duration-300 group-hover:scale-110 shadow-md hover:shadow-xl flex-shrink-0`}
                          >
                            <ExternalLink className="h-5 w-5" />
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {filteredResources.every(cat => cat.items.length === 0) && (
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 backdrop-blur-sm border-2 border-gray-200">
          <CardContent className="pt-16 pb-16 text-center">
            <div className="bg-gray-200 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No resources found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}