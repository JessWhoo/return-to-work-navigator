import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import {
  Search, ExternalLink, Briefcase, Globe,
  Heart, Shield, Users, Zap, Bookmark, BookmarkCheck,
  RefreshCw, ChevronDown, ChevronUp, Lightbulb, MessageSquare
} from 'lucide-react';
import useSEO from '@/hooks/useSEO';

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
    category: 'Returnship Programs',
    icon: RefreshCw,
    color: 'violet',
    boards: [
      {
        name: 'iRelaunch',
        url: 'https://www.irelaunch.com',
        description: 'The #1 platform for career relaunchers. Hosts returnship programs from top employers designed for people returning after gaps due to illness, caregiving, or other reasons.',
        tags: ['Returnship', 'Career Gap', 'Top Employers'],
        featured: true
      },
      {
        name: 'Path Forward',
        url: 'https://www.pathforward.org',
        description: 'Returnship programs at leading companies for people returning to work after time off. Many roles are specifically supportive of medical gaps.',
        tags: ['Returnship', 'Paid Programs', 'Flexible']
      }
    ]
  },
  {
    category: 'How to Talk About Career Breaks',
    icon: MessageSquare,
    color: 'purple',
    boards: [
      {
        name: 'How to Talk About Career Breaks',
        url: 'https://www.linkedin.com/pulse/how-talk-career-breaks-rewriting-narrative-around-employment-gaps-tyyqe/',
        description: 'Practical article on rewriting the narrative around employment gaps — how to confidently explain a medical or personal career break to recruiters and hiring managers.',
        tags: ['Career Gap', 'Interview Prep', 'Free'],
        featured: true
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
  rose: { icon: 'bg-destructive', text: 'text-destructive', border: 'border-destructive', pill: 'bg-destructive text-white' },
  violet: { icon: 'bg-primary', text: 'text-primary', border: 'border-primary', pill: 'bg-primary text-white' },
  blue: { icon: 'bg-primary', text: 'text-primary', border: 'border-primary', pill: 'bg-primary text-white' },
  teal: { icon: 'bg-brand-secondary', text: 'text-brand-secondary', border: 'border-brand-secondary', pill: 'bg-brand-secondary text-brand-text' },
  purple: { icon: 'bg-primary', text: 'text-primary', border: 'border-primary', pill: 'bg-primary text-white' },
  green: { icon: 'bg-brand-secondary', text: 'text-brand-secondary', border: 'border-brand-secondary', pill: 'bg-brand-secondary text-brand-text' },
  amber: { icon: 'bg-primary', text: 'text-primary', border: 'border-primary', pill: 'bg-primary text-white' },
};

const totalBoards = jobBoards.reduce((sum, c) => sum + c.boards.length, 0);

export default function JobBoards({ embedded = false }) {
  useSEO({
    title: 'Flexible, Remote & Survivor-Friendly Job Boards',
    description:
      'Curated directory of flexible, remote, returnship, and disability-inclusive job boards for cancer survivors re-entering the workforce or changing careers.',
    path: '/JobBoards',
    enabled: !embedded,
  });
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('jobboard_bookmarks') || '[]'); } catch { return []; }
  });
  const [tipsExpanded, setTipsExpanded] = useState(false);

  const filters = ['All', 'Featured', 'Bookmarked', 'Returnship', 'Remote', 'Disability Inclusive', 'Freelance', 'Part-Time'];

  const toggleBookmark = (name) => {
    setBookmarks(prev => {
      const next = prev.includes(name) ? prev.filter(b => b !== name) : [...prev, name];
      localStorage.setItem('jobboard_bookmarks', JSON.stringify(next));
      return next;
    });
  };

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
        (activeFilter === 'Bookmarked' && bookmarks.includes(board.name)) ||
        board.tags.some(t => t.toLowerCase().includes(activeFilter.toLowerCase()));

      return matchesSearch && matchesFilter;
    })
  })).filter(category => category.boards.length > 0);

  const tips = [
    { icon: '🔒', text: 'You are NOT required to disclose your cancer history to employers during the application process.' },
    { icon: '🏠', text: 'Filter for remote roles to reduce commute fatigue — especially during your first weeks back.' },
    { icon: '📋', text: 'Look for employers with explicit ADA accommodation policies in their job postings.' },
    { icon: '🌱', text: 'Freelance or part-time work can be a great income bridge while building stamina.' },
    { icon: '📅', text: 'Returnship programs are designed for career gaps — many are explicitly open to medical leave.' },
    { icon: '💬', text: 'Use LinkedIn\'s "Career Break" feature to frame your time off professionally and authentically.' },
    { icon: '⭐', text: 'Research company culture via Glassdoor before applying — supportive environments matter.' },
    { icon: '🤝', text: 'Networking often surfaces unadvertised roles. Reconnect with former colleagues who respect your journey.' },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div className="space-y-3 text-center">
        {embedded ? (
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Flexible &amp; Survivor-Friendly Job Boards
          </h2>
        ) : (
          <h1 className="font-heading text-4xl font-bold text-foreground">
            Flexible &amp; Survivor-Friendly Job Boards
          </h1>
        )}
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Curated job boards for cancer survivors — flexible, remote, and disability-inclusive employers
        </p>
        {/* Stats Bar */}
        <div className="flex justify-center gap-6 pt-2">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{totalBoards}</p>
            <p className="text-xs text-muted-foreground">Job Boards</p>
          </div>
          <div className="w-px bg-border" />
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{jobBoards.length}</p>
            <p className="text-xs text-muted-foreground">Categories</p>
          </div>
          <div className="w-px bg-border" />
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{bookmarks.length}</p>
            <p className="text-xs text-muted-foreground">Bookmarked</p>
          </div>
        </div>
      </div>

      {/* Tips Card - Collapsible */}
      <Card className="nv-card--muted">
        <button
          onClick={() => setTipsExpanded(!tipsExpanded)}
          className="flex w-full items-center justify-between px-6 py-4 text-left"
        >
          <div className="flex items-center space-x-3">
            <Lightbulb className="h-5 w-5 flex-shrink-0 text-primary" />
            <span className="font-semibold text-foreground">Job Search Tips for Cancer Survivors</span>
            <span className="rounded-pill bg-primary px-2 py-0.5 text-xs text-white">{tips.length} tips</span>
          </div>
          {tipsExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>
        {tipsExpanded && (
          <CardContent className="pb-5 pt-0">
            <div className="grid gap-2 sm:grid-cols-2">
              {tips.map((tip, i) => (
                <div key={i} className="flex items-start space-x-2 rounded-brand border border-border bg-surface p-3">
                  <span className="flex-shrink-0 text-lg">{tip.icon}</span>
                  <p className="text-sm leading-relaxed text-muted-foreground">{tip.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Search & Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search job boards by name, type, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-pill px-3 py-1.5 text-sm font-medium transition-all ${
                activeFilter === filter
                  ? 'bg-primary text-white'
                  : 'border border-border bg-surface text-muted-foreground hover:border-primary hover:text-foreground'
              }`}
            >
              {filter}
              {filter === 'Bookmarked' && bookmarks.length > 0 && (
                <span className="ml-1.5 rounded-pill bg-primary px-1.5 py-0.5 text-xs text-white">{bookmarks.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Job Board Categories */}
      {filteredBoards.length === 0 ? (
        <Card>
          <CardContent className="pb-8 pt-8 text-center">
            <Search className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">No job boards found for "{search || activeFilter}". Try a different search or filter.</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => { setSearch(''); setActiveFilter('All'); }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        filteredBoards.map((category) => {
          const Icon = category.icon;
          const colors = colorMap[category.color];
          return (
            <div key={category.category} className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className={`rounded-brand p-2 ${colors.icon}`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h2 className={`font-heading text-2xl font-bold ${colors.text}`}>{category.category}</h2>
                <span className="rounded-pill border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {category.boards.length} board{category.boards.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {category.boards.map((board) => {
                  const isBookmarked = bookmarks.includes(board.name);
                  return (
                    <Card
                      key={board.name}
                      className={`transition-all ${board.featured ? `border-l-4 ${colors.border}` : ''}`}
                    >
                      <CardContent className="space-y-3 pt-5">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 pr-2">
                            <div className="mb-1 flex items-center space-x-2">
                              <h3 className="text-base font-bold text-foreground">{board.name}</h3>
                              {board.featured && (
                                <span className={`rounded-pill border px-1.5 py-0.5 text-xs ${colors.pill}`}>⭐ Top Pick</span>
                              )}
                            </div>
                            <p className="text-sm leading-relaxed text-muted-foreground">{board.description}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleBookmark(board.name)}
                            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this board'}
                            aria-pressed={isBookmarked}
                            className={`flex-shrink-0 rounded-brand p-1.5 transition-all ${isBookmarked ? 'bg-muted text-primary' : 'text-muted-foreground hover:bg-muted hover:text-primary'}`}
                            title={isBookmarked ? 'Remove bookmark' : 'Bookmark this board'}
                          >
                            {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {board.tags.map(tag => (
                            <button
                              key={tag}
                              type="button"
                              aria-pressed={activeFilter === tag}
                              className="cursor-pointer rounded-pill border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:border-primary"
                              onClick={() => setActiveFilter(tag)}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>

                        <Button
                          onClick={() => handleLinkClick(board.name, board.url)}
                          className="w-full"
                          variant="outline"
                          size="sm"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Visit {board.name}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })
      )}

      {/* Footer */}
      <Card className="nv-card--muted">
        <CardContent className="space-y-2 pt-6 text-center">
          <Briefcase className="mx-auto h-10 w-10 text-primary" />
          <h3 className="font-heading text-lg font-semibold text-foreground">You Deserve Meaningful Work</h3>
          <p className="mx-auto max-w-xl text-sm text-muted-foreground">
            Finding the right job after cancer treatment takes time. Be patient with yourself, and remember
            that your experience, resilience, and perspective are assets — not liabilities.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}