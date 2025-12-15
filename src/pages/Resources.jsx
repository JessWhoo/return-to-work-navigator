import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, ExternalLink, Building2, DollarSign, 
  BookOpen, Users, Filter 
} from 'lucide-react';

const resources = [
  {
    category: 'Cancer Organizations',
    icon: Building2,
    color: 'purple',
    items: [
      {
        name: 'Cancer and Careers',
        org: 'Cancer and Careers',
        description: 'Dedicated to empowering cancer patients and survivors to thrive in their workplace, with tools, resources, and support',
        url: 'https://www.cancerandcareers.org',
        type: 'WEBSITE'
      },
      {
        name: 'American Cancer Society - Working During Treatment',
        org: 'American Cancer Society',
        description: 'Comprehensive workplace resources, including return to work guidance and talking to your employer about cancer',
        url: 'https://www.cancer.org',
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
        name: 'Triage Cancer',
        org: 'Triage Cancer',
        description: 'Legal and practical information for cancer survivors navigating employment issues',
        url: 'https://triagecancer.org',
        type: 'WEBSITE'
      }
    ]
  },
  {
    category: 'Government Resources',
    icon: BookOpen,
    color: 'blue',
    items: [
      {
        name: 'EEOC: Cancer in the Workplace and the ADA',
        org: 'EEOC',
        description: 'Official guidance on how the Americans with Disabilities Act applies to employees with cancer',
        url: 'https://www.eeoc.gov',
        type: 'GUIDE'
      },
      {
        name: 'Department of Labor - FMLA',
        org: 'U.S. Department of Labor',
        description: 'Information about the Family and Medical Leave Act, including eligibility and how to request leave',
        url: 'https://www.dol.gov/agencies/whd/fmla',
        type: 'WEBSITE'
      },
      {
        name: 'Job Accommodation Network (JAN)',
        org: 'Job Accommodation Network',
        description: 'Free guidance on workplace accommodations and the ADA. Provides personalized assistance',
        url: 'https://askjan.org',
        type: 'WEBSITE'
      },
      {
        name: 'Social Security Disability Insurance',
        org: 'Social Security Administration',
        description: 'Information about disability benefits and how to apply if your cancer prevents you from working',
        url: 'https://www.ssa.gov/benefits/disability',
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
        name: 'HealthWell Foundation',
        org: 'HealthWell Foundation',
        description: 'Financial assistance for underinsured patients to cover coinsurance, copayments, and premiums',
        url: 'https://www.healthwellfoundation.org',
        type: 'WEBSITE'
      },
      {
        name: 'Patient Advocate Foundation',
        org: 'Patient Advocate Foundation',
        description: 'Case management services and financial aid to help patients access healthcare',
        url: 'https://www.patientadvocate.org',
        type: 'WEBSITE'
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
        name: 'Imerman Angels',
        org: 'Imerman Angels',
        description: 'Free one-on-one cancer support by pairing you with someone who has fought the same cancer',
        url: 'https://www.imermanangels.org',
        type: 'WEBSITE'
      },
      {
        name: 'Cancer Legal Resource Center',
        org: 'Disability Rights Legal Center',
        description: 'Free legal information and resources about cancer-related legal issues, including employment discrimination',
        url: 'https://www.cancerlegalresourcecenter.org',
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

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
          Resource Library
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Trusted organizations, guides, and support services to help you on your journey
        </p>
      </div>

      {/* Search and Filter */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

              <div className="grid gap-4">
                {category.items.map((resource, index) => (
                  <Card key={index} className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all group">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge variant="outline" className={`bg-${category.color}-50 text-${category.color}-700 border-${category.color}-200`}>
                              {resource.type}
                            </Badge>
                          </div>
                          <h3 className="text-lg font-bold text-gray-800 mb-1">{resource.name}</h3>
                          <p className="text-sm text-gray-500 mb-2">{resource.org}</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{resource.description}</p>
                        </div>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`ml-4 p-3 rounded-lg bg-${category.color}-100 text-${category.color}-700 hover:bg-${category.color}-200 transition-colors group-hover:scale-110 transition-transform`}
                        >
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {filteredResources.every(cat => cat.items.length === 0) && (
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-12 pb-12 text-center">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No resources found matching your search</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}