import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import {
  Search, ExternalLink, Briefcase, Star, Globe,
  Heart, Shield, Users, Zap, Filter
} from 'lucide-react';

const jobBoards = [
  {
    category: 'Cancer Survivor Focused',
    icon: Heart,
    color: 'rose',
    boards: [
      {
        name: 'Cancer and Careers',
        url: 'https://www.cancerandcareers.org',
        description: 'Job board and career coaching specifically for cancer survivors returning to the workforce. Includes employer partners committed to hiring survivors.',
        tags: ['Career Coaching', 'Survivor-Focused', 'Free'],
        featured: true
      },
      {
        name: 'Stupid Cancer Job Board',
        url: 'https://stupidcancer.org/resources',
        description: 'Resources and opportunities for young adult cancer survivors, including job listings and career development.',
        tags: ['Young Adults', 'Community', 'Resources']
      }
    ]
  },
  {
    category: 'Disability & Accessibility Inclusive',
    icon: Shield,
    color: 'blue',
    boards: [
      {
        name: 'Disability Jobs',
        url: 'https://www.disabilityjobs.net',
        description: 'Connects job seekers with disabilities to employers who actively seek diverse, inclusive candidates.',
        tags: ['Disability Inclusive', 'ADA Employers', 'Free'],
        featured: true
      },
      {
        name: 'AbilityJobs',
        url: 'https://www.abilityjobs.com',
        description: 'The largest job board focused on people with disabilities. Employers are committed to inclusive hiring practices.',
        tags: ['Disability Inclusive', 'Remote Options', 'Free']
      },
      {
        name: 'Getting Hired',
        url: 'https://www.gettinghired.com',
        description: 'Job board and career center for job seekers with disabilities. Employers have pledged inclusive hiring.',
        tags: ['Disability Inclusive', 'Career Center']
      },
      {
        name: 'Lime Connect',
        url: 'https://www.limeconnect.com',
        description: 'Connecting high-achieving students and professionals with disabilities to leading employers.',
        tags: ['High-Achieving', 'Corporate Partners']
      }
    ]
  },
  {
    category: 'Flexible & Remote Work',
    icon: Globe,
    color: 'teal',
    boards: [
      {
        name: 'FlexJobs',
        url: 'https://www.flexjobs.com',
        description: 'Curated remote, flexible, part-time, and freelance job listings. Great for phased return-to-work plans.',
        tags: ['Remote', 'Flexible Hours', 'Part-Time'],
        featured: true
      },
      {
        name: 'Remote.co',
        url: 'https://remote.co',
        description: 'Fully remote job listings across all industries. Ideal for those who need to work from home.',
        tags: ['Remote', 'Work From Home', 'All Industries']
      },
      {
        name: 'We Work Remotely',
        url: 'https://weworkremotely.com',
        description: 'One of the largest remote work communities. Strong in tech, design, and marketing roles.',
        tags: ['Remote', 'Tech', 'Design', 'Marketing']
      },
      {
        name: 'Part-Time Jobs',
        url: 'https://www.indeed.com/q-Part-Time-jobs.html',
        description: 'Indeed filtered for part-time roles — useful for a gradual return-to-work schedule.',
        tags: ['Part-Time', 'Gradual Return', 'All Industries']
      }
    ]
  },
  {
    category: 'General Job Boards',
    icon: Briefcase,
    color: 'purple',
    boards: [
      {
        name: 'LinkedIn Jobs',
        url: 'https://www.linkedin.com/jobs',
        description: 'The largest professional network. Filter for remote work, part-time, or specific industries. Great for networking.',
        tags: ['Networking', 'All Levels', 'Remote Filter'],
        featured: true
      },
      {
        name: 'Indeed',
        url: 'https://www.indeed.com',
        description: 'Largest general job board. Use filters for remote, part-time, or salary requirements.',
        tags: ['All Industries', 'Free', 'Easy Apply']
      },
      {
        name: 'Glassdoor',
        url: 'https://www.glassdoor.com',
        description: 'Jobs with company reviews, salary data, and interview insights to help you choose the right employer.',
        tags: ['Company Reviews', 'Salary Data', 'Culture Insights']
      },
      {
        name: 'ZipRecruiter',
        url: 'https://www.ziprecruiter.com',
        description: 'AI-powered job matching. Apply once and get matched to relevant positions automatically.',
        tags: ['AI Matching', 'One-Click Apply', 'All Industries']
      }
    ]
  },
  {
    category: 'Government & Nonprofit',
    icon: Users,
    color: 'green',
    boards: [
      {
        name: 'USAJOBS',
        url: 'https://www.usajobs.gov',
        description: 'Official federal government job site. Federal jobs come with strong ADA protections and benefits.',
        tags: ['Federal Jobs', 'Strong Benefits', 'ADA Protected'],
        featured: true
      },
      {
        name: 'Idealist',
        url: 'https://www.idealist.org',
        description: 'Nonprofit and social impact jobs. Many mission-driven organizations offer flexible, supportive work environments.',
        tags: ['Nonprofit', 'Mission-Driven', 'Flexible']
      },
      {
        name: 'Work for Good',
        url: 'https://www.workforgood.org',
        description: 'UK-based charity and nonprofit job board, also with some international roles.',
        tags: ['Nonprofit', 'Charity Sector']
      }
    ]
  },
  {
    category: 'Freelance & Contract',
    icon: Zap,
    color: 'amber',
    boards: [
      {
        name: 'Upwork',
        url: 'https://www.upwork.com',
        description: 'Largest freelance platform. Set your own hours and workload — ideal while managing energy levels.',
        tags: ['Freelance', 'Set Own Hours', 'All Skills'],
        featured: true
      },
      {
        name: 'Fiverr',
        url: 'https://www.fiverr.com',
        description: 'Offer services at your own pace. Great for building income while managing health appointments.',
        tags: ['Freelance', 'Your Own Pace', 'Creative & Tech']
      },
      {
        name: 'Toptal',
        url: 'https://www.toptal.com',
        description: 'Elite network for top freelancers in software, design, and finance. High pay, fully remote.',
        tags: ['Elite Freelance', 'High Pay', 'Remote']
      }
    ]
  }
];

const colorMap = {
  rose: { bg: 'bg-rose-900/30', border: 'border-rose-700', icon: 'bg-rose-700', text: 'text-rose-300', badge: 'bg-rose-800 text-rose-200' },
  blue: { bg: 'bg-blue-900/30', border: 'border-blue-700', icon: 'bg-blue-700', text: 'text-blue-300', badge: 'bg-blue-800 text-blue-200' },
  teal: { bg: 'bg-teal-900/30', border: 'border-teal-700', icon: 'bg-teal-700', text: 'text-teal-300', badge: 'bg-teal-800 text-teal-200' },
  purple: { bg: 'bg-purple-900/30', border: 'border-purple-700', icon: 'bg-purple-700', text: 'text-purple-300', badge: 'bg-purple-800 text-purple-200' },
  green: { bg: 'bg-green-900/30', border: 'border-green-700', icon: 'bg-green-700', text: 'text-green-300', badge: 'bg-green-800 text-green-200' },
  amber: { bg: 'bg-amber-900/30', border: 'border-amber-700', icon: 'bg-amber-700', text: 'text-amber-300', badge: 'bg-amber-800 text-amber-200' },
};

export default function JobBoards() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Featured', 'Remote', 'Disability Inclusive', 'Freelance', 'Part-Time'];

  const handleLinkClick = (name, url) => {
    base44.analytics.track({ eventName: 'job_board_clicked', properties: { name, url } });
    window.open(url, '_blank', 'noopener noreferrer');
  };

  const filteredBoards = jobBoards.map(category => ({
    ...category,
    boards: category.boards.filter(board => {
      const matchesSearch =
        search === '' ||
        board.name.toLowerCase().includes(search.toLowerCase()) ||
        board.description.toLowerCase().includes(search.toLowerCase()) ||
        board.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));

      const matchesFilter =
        activeFilter === 'All' ||
        (activeFilter === 'Featured' && board.featured) ||
        board.tags.some(t => t.toLowerCase().includes(activeFilter.toLowerCase()));

      return matchesSearch && matchesFilter;
    })
  })).filter(category => category.boards.length > 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Job Boards & Career Resources
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Curated job boards for cancer survivors — including flexible, remote, and disability-inclusive employers
        </p>
      </div>

      {/* Tip Card */}
      <Card className="bg-cyan-900/30 border-cyan-700">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Star className="h-6 w-6 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-cyan-300 mb-1">Tips for Your Job Search</h3>
              <ul className="text-sm text-cyan-200 space-y-1">
                <li>• You are <strong>not required</strong> to disclose your cancer history to employers</li>
                <li>• Look for employers with strong ADA accommodation policies</li>
                <li>• Freelance or part-time work can be a great bridge back to full-time employment</li>
                <li>• Filter for remote roles to reduce commute energy drain</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search & Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search job boards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-500"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeFilter === filter
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800 text-slate-300 border border-slate-600 hover:border-cyan-500'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Job Board Categories */}
      {filteredBoards.length === 0 ? (
        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="pt-6 text-center text-slate-400">
            No job boards found for "{search}". Try a different search term.
          </CardContent>
        </Card>
      ) : (
        filteredBoards.map((category) => {
          const Icon = category.icon;
          const colors = colorMap[category.color];
          return (
            <div key={category.category} className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${colors.icon}`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h2 className={`text-xl font-bold ${colors.text}`}>{category.category}</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {category.boards.map((board) => (
                  <Card
                    key={board.name}
                    className={`bg-slate-800 border-slate-600 hover:border-slate-500 transition-all ${board.featured ? `border-l-4 ${colors.border}` : ''}`}
                  >
                    <CardContent className="pt-5 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-bold text-slate-100">{board.name}</h3>
                            {board.featured && (
                              <Badge className={`text-xs ${colors.badge}`}>⭐ Featured</Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed">{board.description}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {board.tags.map(tag => (
                          <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 border border-slate-600">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <Button
                        onClick={() => handleLinkClick(board.name, board.url)}
                        className={`w-full bg-slate-700 hover:bg-slate-600 text-slate-100 border border-slate-500`}
                        variant="outline"
                        size="sm"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit {board.name}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })
      )}

      {/* Footer Note */}
      <Card className="bg-slate-800 border-slate-600">
        <CardContent className="pt-6 text-center space-y-2">
          <Briefcase className="h-10 w-10 text-slate-400 mx-auto" />
          <h3 className="font-semibold text-slate-200">You Deserve Meaningful Work</h3>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Finding the right job after cancer treatment takes time. Be patient with yourself, and remember 
            that your experience, resilience, and perspective are assets — not liabilities.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}