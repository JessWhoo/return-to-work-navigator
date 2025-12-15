import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, ExternalLink, Building2, DollarSign, 
  BookOpen, Users, Filter, FileText, Landmark,
  Bookmark, MessageCircle, BookmarkCheck
} from 'lucide-react';
import { toast } from 'sonner';

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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showBookmarked, setShowBookmarked] = useState(false);

  const { data: progress } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const progressList = await base44.entities.UserProgress.list();
      if (progressList.length > 0) return progressList[0];
      
      return await base44.entities.UserProgress.create({
        completed_checklist_items: [],
        journey_stage: 'planning',
        bookmarked_resources: []
      });
    }
  });

  const toggleBookmarkMutation = useMutation({
    mutationFn: async (resourceId) => {
      const currentBookmarks = progress?.bookmarked_resources || [];
      const isBookmarked = currentBookmarks.includes(resourceId);
      const updatedBookmarks = isBookmarked
        ? currentBookmarks.filter(id => id !== resourceId)
        : [...currentBookmarks, resourceId];
      
      return await base44.entities.UserProgress.update(progress.id, {
        bookmarked_resources: updatedBookmarks
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userProgress']);
      toast.success('Bookmark updated');
    }
  });

  const handleDiscussWithCoach = (resource) => {
    const message = `I'd like to learn more about this resource:\n\n${resource.name} (${resource.org})\n${resource.description}\n\nCan you help me understand how to use this resource for my return-to-work journey?`;
    localStorage.setItem('pendingCoachMessage', message);
    navigate(createPageUrl('Coach'));
  };

  const isBookmarked = (resourceId) => {
    return progress?.bookmarked_resources?.includes(resourceId) || false;
  };

  const colorMap = {
    purple: { from: 'from-purple-100', via: 'via-purple-50', border: 'border-purple-200', iconFrom: 'from-purple-400', iconTo: 'to-purple-600', badge: 'bg-purple-500' },
    green: { from: 'from-green-100', via: 'via-green-50', border: 'border-green-200', iconFrom: 'from-green-400', iconTo: 'to-green-600', badge: 'bg-green-500' },
    blue: { from: 'from-blue-100', via: 'via-blue-50', border: 'border-blue-200', iconFrom: 'from-blue-400', iconTo: 'to-blue-600', badge: 'bg-blue-500' },
    indigo: { from: 'from-indigo-100', via: 'via-indigo-50', border: 'border-indigo-200', iconFrom: 'from-indigo-400', iconTo: 'to-indigo-600', badge: 'bg-indigo-500' },
    rose: { from: 'from-rose-100', via: 'via-rose-50', border: 'border-rose-200', iconFrom: 'from-rose-400', iconTo: 'to-rose-600', badge: 'bg-rose-500' }
  };

  const filteredResources = resources.map(category => ({
    ...category,
    items: category.items
      .map((item, idx) => ({
        ...item,
        id: `${category.category}-${idx}`
      }))
      .filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.org.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesBookmark = !showBookmarked || isBookmarked(item.id);
        
        return matchesSearch && matchesBookmark;
      })
  })).filter(category => 
    (selectedCategory === 'all' || category.category === selectedCategory) &&
    category.items.length > 0
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
          <div className="flex flex-col gap-4">
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
            <div className="flex items-center justify-between">
              <Button
                variant={showBookmarked ? "default" : "outline"}
                size="sm"
                onClick={() => setShowBookmarked(!showBookmarked)}
                className={showBookmarked ? "bg-indigo-600" : ""}
              >
                <Bookmark className="h-4 w-4 mr-2" />
                My Bookmarks ({progress?.bookmarked_resources?.length || 0})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources by Category */}
      <div className="space-y-8">
        {filteredResources.map((category) => {
          if (category.items.length === 0) return null;
          
          const Icon = category.icon;
          const colors = colorMap[category.color];
          return (
            <div key={category.category} className="space-y-4">
              <div className={`flex items-center space-x-3 p-5 bg-gradient-to-r ${colors.from} ${colors.via} to-white rounded-2xl shadow-md border-2 ${colors.border} hover:shadow-xl transition-all`}>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.iconFrom} ${colors.iconTo} shadow-lg`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{category.category}</h2>
                <Badge className={`ml-auto ${colors.badge} text-white shadow-md`}>
                  {category.items.length} resources
                </Badge>
              </div>

              <div className="grid gap-5">
                {category.items.map((resource) => {
                  const cardColors = colorMap[category.color];
                  const bookmarked = isBookmarked(resource.id);
                  return (
                    <Card key={resource.id} className="bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group border-2 border-gray-100 hover:border-indigo-200 overflow-hidden">
                      <CardContent className="pt-6 relative">
                        <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${cardColors.iconFrom} ${cardColors.iconTo}`}></div>
                        <div className="pl-3 space-y-3">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge className={`bg-gradient-to-r ${cardColors.iconFrom} ${cardColors.iconTo} text-white shadow-sm`}>
                                  {resource.type}
                                </Badge>
                                {bookmarked && (
                                  <Badge className="bg-amber-100 text-amber-700">
                                    <BookmarkCheck className="h-3 w-3 mr-1" />
                                    Saved
                                  </Badge>
                                )}
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
                          <div className="flex gap-2 pt-2 border-t border-gray-100">
                            <Button
                              variant={bookmarked ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleBookmarkMutation.mutate(resource.id)}
                              className="flex-1"
                            >
                              {bookmarked ? <BookmarkCheck className="h-4 w-4 mr-2" /> : <Bookmark className="h-4 w-4 mr-2" />}
                              {bookmarked ? 'Saved' : 'Save'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDiscussWithCoach(resource)}
                              className="flex-1"
                            >
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Discuss with Coach
                            </Button>
                          </div>
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