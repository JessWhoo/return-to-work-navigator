import { 
  Building2, DollarSign, Landmark, BookOpen, Users, 
  Video, FileText, Mic, Heart, Brain, Briefcase, Shield
} from 'lucide-react';

export const resources = [
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
        type: 'WEBSITE',
        topics: ['workplace rights', 'communication', 'treatment'],
        stages: ['planning', 'first_week', 'ongoing']
      },
      {
        name: 'Breastcancer.org - Working During Treatment',
        org: 'Breastcancer.org',
        description: 'Practical advice for balancing work with breast cancer treatment, including accommodations and communication tips',
        url: 'https://www.breastcancer.org',
        type: 'WEBSITE',
        topics: ['breast cancer', 'accommodations', 'work-life balance'],
        stages: ['planning', 'ongoing']
      },
      {
        name: 'Cancer and Careers',
        org: 'Cancer and Careers',
        description: 'Dedicated to empowering cancer patients and survivors to thrive in their workplace, with tools, resources, and support',
        url: 'https://www.cancerandcareers.org',
        type: 'WEBSITE',
        topics: ['career', 'workplace rights', 'tools'],
        stages: ['planning', 'first_week', 'ongoing', 'completed']
      },
      {
        name: 'CancerCare',
        org: 'CancerCare',
        description: 'Professional support services, including counseling, support groups, and assistance with workplace issues',
        url: 'https://www.cancercare.org',
        type: 'WEBSITE',
        topics: ['counseling', 'support groups', 'workplace'],
        stages: ['planning', 'first_week', 'ongoing']
      },
      {
        name: 'National Coalition for Cancer Survivorship',
        org: 'NCCS',
        description: 'Advocacy organization providing resources and support for cancer survivors',
        url: 'https://www.canceradvocacy.org',
        type: 'WEBSITE',
        topics: ['advocacy', 'survivorship', 'resources'],
        stages: ['ongoing', 'completed']
      },
      {
        name: 'Stupid Cancer',
        org: 'Stupid Cancer',
        description: 'Community and resources for adolescents and young adults affected by cancer',
        url: 'https://www.stupidcancer.org',
        type: 'WEBSITE',
        topics: ['young adults', 'community', 'support'],
        stages: ['planning', 'first_week', 'ongoing', 'completed']
      },
      {
        name: 'Susan G. Komen - Work and Cancer',
        org: 'Susan G. Komen',
        description: 'Information about managing work during and after breast cancer treatment, including talking to employers',
        url: 'https://www.komen.org',
        type: 'WEBSITE',
        topics: ['breast cancer', 'work management', 'communication'],
        stages: ['planning', 'ongoing']
      },
      {
        name: 'Triage Cancer - Employment Resources',
        org: 'Triage Cancer',
        description: 'Legal and practical information for cancer survivors navigating employment issues',
        url: 'https://triagecancer.org',
        type: 'WEBSITE',
        topics: ['legal', 'employment', 'practical'],
        stages: ['planning', 'first_week', 'ongoing']
      },
      {
        name: 'Learn Look Locate - Back to Work',
        org: 'Learn Look Locate',
        description: 'Resources and guidance for cancer survivors returning to work',
        url: 'https://learnlooklocate.com/back-to-work/',
        type: 'WEBSITE',
        topics: ['return to work', 'resources', 'guidance'],
        stages: ['planning', 'first_week', 'ongoing']
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
        type: 'TOOL',
        topics: ['financial aid', 'treatment costs', 'database'],
        stages: ['planning', 'ongoing']
      },
      {
        name: 'CancerCare Financial Assistance',
        org: 'CancerCare',
        description: 'Limited financial assistance for cancer-related costs including transportation, childcare, home care, and medication',
        url: 'https://www.cancercare.org/financial',
        type: 'WEBSITE',
        topics: ['financial aid', 'transportation', 'medication'],
        stages: ['planning', 'ongoing']
      },
      {
        name: 'Family Reach',
        org: 'Family Reach',
        description: 'Financial assistance and support services for families facing cancer',
        url: 'https://www.familyreach.org',
        type: 'WEBSITE',
        topics: ['family support', 'financial aid'],
        stages: ['planning', 'ongoing']
      },
      {
        name: 'HealthWell Foundation',
        org: 'HealthWell Foundation',
        description: 'Financial assistance for underinsured patients to cover coinsurance, copayments, and premiums',
        url: 'https://www.healthwellfoundation.org',
        type: 'WEBSITE',
        topics: ['insurance', 'copayments', 'financial aid'],
        stages: ['planning', 'ongoing']
      },
      {
        name: 'NeedyMeds',
        org: 'NeedyMeds',
        description: 'Database of patient assistance programs for medications and healthcare costs',
        url: 'https://www.needymeds.org',
        type: 'TOOL',
        topics: ['medication', 'healthcare costs', 'database'],
        stages: ['planning', 'ongoing']
      },
      {
        name: 'Patient Advocate Foundation Co-Pay Relief',
        org: 'Patient Advocate Foundation',
        description: 'Co-payment assistance for patients with specific chronic, life-threatening, or debilitating diseases',
        url: 'https://www.copays.org',
        type: 'WEBSITE',
        topics: ['copayments', 'financial aid'],
        stages: ['planning', 'ongoing']
      },
      {
        name: 'Social Security Disability Insurance (SSDI) for People with Cancer',
        org: 'American Cancer Society',
        description: 'Comprehensive guide explaining SSDI eligibility, application process, benefits, and what to do if your application is turned down. Includes information about Compassionate Allowances for faster approval',
        url: 'https://www.cancer.org/cancer/managing-cancer/financial-insurance-matters/social-security-disability-insurance.html',
        type: 'GUIDE',
        topics: ['disability', 'benefits', 'SSDI'],
        stages: ['planning']
      },
      {
        name: 'The SAMFund',
        org: 'The SAMFund',
        description: 'Financial assistance and support for young adult cancer survivors',
        url: 'https://www.thesamfund.org',
        type: 'WEBSITE',
        topics: ['young adults', 'financial aid', 'survivorship'],
        stages: ['ongoing', 'completed']
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
        type: 'GUIDE',
        topics: ['ADA', 'accommodations', 'compliance'],
        stages: ['planning', 'first_week']
      },
      {
        name: 'ADA National Network',
        org: 'ADA National Network',
        description: 'Information, guidance, and training on the Americans with Disabilities Act',
        url: 'https://adata.org',
        type: 'WEBSITE',
        topics: ['ADA', 'guidance', 'training'],
        stages: ['planning', 'first_week', 'ongoing']
      },
      {
        name: 'CareerOneStop',
        org: 'U.S. Department of Labor',
        description: 'Job search, training, and career resources sponsored by the U.S. Department of Labor',
        url: 'https://www.careeronestop.org',
        type: 'WEBSITE',
        topics: ['job search', 'training', 'career'],
        stages: ['completed']
      },
      {
        name: 'Department of Labor - FMLA',
        org: 'U.S. Department of Labor',
        description: 'Information about the Family and Medical Leave Act, including eligibility and how to request leave',
        url: 'https://www.dol.gov/agencies/whd/fmla',
        type: 'WEBSITE',
        topics: ['FMLA', 'leave', 'eligibility'],
        stages: ['planning']
      },
      {
        name: 'Equal Employment Opportunity Commission (EEOC)',
        org: 'EEOC',
        description: 'Information on workplace rights and filing discrimination complaints under the Americans with Disabilities Act (ADA)',
        url: 'https://www.eeoc.gov',
        type: 'WEBSITE',
        topics: ['workplace rights', 'discrimination', 'ADA'],
        stages: ['planning', 'first_week', 'ongoing']
      },
      {
        name: 'FMLA Requirements Cheat Sheet',
        org: 'CustomGuide',
        description: 'Quick reference guide for the Family and Medical Leave Act (FMLA). Covers eligibility requirements, types of leave, documentation needs, implementation steps, and compliance best practices',
        url: 'https://www.customguide.com',
        type: 'GUIDE',
        topics: ['FMLA', 'eligibility', 'compliance'],
        stages: ['planning']
      },
      {
        name: 'Job Accommodation Network (JAN)',
        org: 'Job Accommodation Network',
        description: 'Free guidance on workplace accommodations and the ADA. Provides personalized assistance and resources for cancer survivors',
        url: 'https://askjan.org',
        type: 'WEBSITE',
        topics: ['accommodations', 'ADA', 'guidance'],
        stages: ['planning', 'first_week', 'ongoing']
      },
      {
        name: 'Medicaid.gov',
        org: 'Centers for Medicare & Medicaid Services',
        description: 'Information about Medicaid eligibility and coverage for cancer treatment',
        url: 'https://www.medicaid.gov',
        type: 'WEBSITE',
        topics: ['insurance', 'Medicaid', 'coverage'],
        stages: ['planning']
      },
      {
        name: 'Medicare.gov',
        org: 'Centers for Medicare & Medicaid Services',
        description: 'Information about Medicare coverage for cancer treatment and related healthcare services',
        url: 'https://www.medicare.gov',
        type: 'WEBSITE',
        topics: ['insurance', 'Medicare', 'coverage'],
        stages: ['planning']
      },
      {
        name: 'National Cancer Institute - Managing Cancer Care',
        org: 'National Cancer Institute',
        description: 'Comprehensive resources from the NCI on managing cancer treatment, including work and daily life considerations',
        url: 'https://www.cancer.gov',
        type: 'WEBSITE',
        topics: ['treatment', 'management', 'daily life'],
        stages: ['planning', 'ongoing']
      },
      {
        name: 'Social Security Disability Insurance',
        org: 'Social Security Administration',
        description: 'Information about disability benefits and how to apply if your cancer prevents you from working',
        url: 'https://www.ssa.gov/benefits/disability',
        type: 'WEBSITE',
        topics: ['disability', 'benefits', 'SSDI'],
        stages: ['planning']
      },
      {
        name: 'State Vocational Rehabilitation Services',
        org: 'U.S. Department of Labor',
        description: 'State-run programs that help people with disabilities find and maintain employment',
        url: 'https://www.dol.gov/agencies/odep/program-areas/individuals/vocational-rehabilitation',
        type: 'WEBSITE',
        topics: ['rehabilitation', 'employment', 'state programs'],
        stages: ['ongoing', 'completed']
      }
    ]
  },
  {
    category: 'Articles & Publications',
    icon: FileText,
    color: 'indigo',
    items: [
      {
        name: 'ASCO Cancer Survivorship Resources',
        org: 'ASCO',
        description: 'Clinical resources and patient information on survivorship care from the American Society of Clinical Oncology',
        url: 'https://www.cancer.net/survivorship',
        type: 'ARTICLE',
        topics: ['survivorship', 'clinical resources', 'care'],
        stages: ['ongoing', 'completed']
      },
      {
        name: 'Cancer and Careers Workbook',
        org: 'Cancer and Careers',
        description: 'Practical guidance and worksheets for navigating work during and after cancer treatment',
        url: 'https://www.cancerandcareers.org/en/resources/publications',
        type: 'GUIDE',
        topics: ['worksheets', 'guidance', 'navigation'],
        stages: ['planning', 'first_week', 'ongoing']
      },
      {
        name: 'EEOC: Cancer in the Workplace and the ADA',
        org: 'EEOC',
        description: 'Official guidance on how the Americans with Disabilities Act applies to employees with cancer',
        url: 'https://www.eeoc.gov/laws/guidance/cancer-workplace-and-ada',
        type: 'GUIDE',
        topics: ['ADA', 'workplace rights', 'legal'],
        stages: ['planning', 'first_week']
      },
      {
        name: 'Job Accommodation Network - Sample Letters',
        org: 'Job Accommodation Network',
        description: 'Templates and examples for requesting workplace accommodations under the ADA',
        url: 'https://askjan.org/publications/Sample-Accommodation-Request-Letters.cfm',
        type: 'GUIDE',
        topics: ['accommodations', 'templates', 'requests'],
        stages: ['planning', 'first_week']
      },
      {
        name: 'National Cancer Institute - Facing Forward: Life After Cancer Treatment',
        org: 'National Cancer Institute',
        description: 'Comprehensive guide covering physical, emotional, and practical issues faced by cancer survivors, including returning to work',
        url: 'https://www.cancer.gov/publications/patient-education/facing-forward',
        type: 'GUIDE',
        topics: ['survivorship', 'return to work', 'comprehensive'],
        stages: ['planning', 'ongoing', 'completed']
      },
      {
        name: 'Triage Cancer - Quick Guides',
        org: 'Triage Cancer',
        description: 'Short, easy-to-read guides on insurance, employment, finances, and other practical topics for cancer patients',
        url: 'https://triagecancer.org/quickguides',
        type: 'GUIDE',
        topics: ['insurance', 'employment', 'finances'],
        stages: ['planning', 'first_week', 'ongoing']
      },
      {
        name: 'Working Through Cancer: Your Legal Rights',
        org: 'Triage Cancer',
        description: 'A comprehensive guide to employment rights for cancer survivors, covering ADA, FMLA, and more',
        url: 'https://triagecancer.org/employmentrights',
        type: 'GUIDE',
        topics: ['legal rights', 'employment', 'ADA', 'FMLA'],
        stages: ['planning', 'first_week']
      },
      {
        name: 'Managing Fatigue During Cancer Treatment',
        org: 'Cancer Support Community',
        description: 'Evidence-based strategies for managing cancer-related fatigue in the workplace',
        url: 'https://www.cancersupportcommunity.org',
        type: 'ARTICLE',
        topics: ['fatigue', 'energy management', 'strategies'],
        stages: ['planning', 'first_week', 'ongoing']
      },
      {
        name: 'Talking to Your Employer About Cancer',
        org: 'Cancer and Careers',
        description: 'Step-by-step guide for having difficult conversations with supervisors and HR about your diagnosis',
        url: 'https://www.cancerandcareers.org',
        type: 'ARTICLE',
        topics: ['communication', 'disclosure', 'HR'],
        stages: ['planning', 'first_week']
      }
    ]
  },
  {
    category: 'Video Resources',
    icon: Video,
    color: 'rose',
    items: [
      {
        name: 'Returning to Work After Cancer: What to Expect',
        org: 'Cancer and Careers',
        description: '15-minute webinar covering the emotional and practical aspects of returning to work, featuring survivor stories',
        url: 'https://www.cancerandcareers.org',
        type: 'VIDEO',
        topics: ['return to work', 'expectations', 'stories'],
        stages: ['planning', 'first_week']
      },
      {
        name: 'Understanding Workplace Accommodations',
        org: 'Job Accommodation Network',
        description: 'Video tutorial explaining how to request and implement reasonable accommodations under the ADA',
        url: 'https://askjan.org',
        type: 'VIDEO',
        topics: ['accommodations', 'ADA', 'tutorial'],
        stages: ['planning', 'first_week']
      },
      {
        name: 'Managing Energy and Fatigue at Work',
        org: 'American Cancer Society',
        description: 'Practical video demonstrations of pacing techniques and energy conservation strategies',
        url: 'https://www.cancer.org',
        type: 'VIDEO',
        topics: ['fatigue', 'pacing', 'energy conservation'],
        stages: ['first_week', 'ongoing']
      },
      {
        name: 'Disclosure: To Tell or Not to Tell',
        org: 'Triage Cancer',
        description: 'Expert panel discussion on navigating disclosure decisions with real survivor perspectives',
        url: 'https://triagecancer.org',
        type: 'VIDEO',
        topics: ['disclosure', 'communication', 'panel'],
        stages: ['planning']
      },
      {
        name: 'Cancer Survivor Panel: First Week Back',
        org: 'CancerCare',
        description: 'Candid discussion with multiple survivors about their first week experiences and lessons learned',
        url: 'https://www.cancercare.org',
        type: 'VIDEO',
        topics: ['first week', 'survivor stories', 'lessons'],
        stages: ['planning', 'first_week']
      }
    ]
  },
  {
    category: 'Support Groups',
    icon: Users,
    color: 'amber',
    items: [
      {
        name: 'Cancer Support Community',
        org: 'Cancer Support Community',
        description: 'Support groups, education, and resources for cancer patients, survivors, and caregivers. Online and in-person options available',
        url: 'https://www.cancersupportcommunity.org',
        type: 'SUPPORT_GROUP',
        topics: ['support groups', 'education', 'community'],
        stages: ['planning', 'first_week', 'ongoing', 'completed']
      },
      {
        name: 'Cancer Survivors Network',
        org: 'American Cancer Society',
        description: 'Online community connecting cancer survivors and caregivers for peer support and discussion',
        url: 'https://csn.cancer.org',
        type: 'SUPPORT_GROUP',
        topics: ['online community', 'peer support', 'survivors'],
        stages: ['planning', 'first_week', 'ongoing', 'completed']
      },
      {
        name: 'Imerman Angels',
        org: 'Imerman Angels',
        description: 'Free one-on-one cancer support by pairing you with someone who has fought the same cancer',
        url: 'https://www.imermanangels.org',
        type: 'SUPPORT_GROUP',
        topics: ['one-on-one', 'mentorship', 'matching'],
        stages: ['planning', 'first_week', 'ongoing']
      },
      {
        name: 'Living Beyond Breast Cancer',
        org: 'Living Beyond Breast Cancer',
        description: 'Education and support programs for people affected by breast cancer at every stage',
        url: 'https://www.lbbc.org',
        type: 'SUPPORT_GROUP',
        topics: ['breast cancer', 'education', 'support'],
        stages: ['planning', 'ongoing', 'completed']
      },
      {
        name: 'Young Survival Coalition',
        org: 'Young Survival Coalition',
        description: 'Support and resources specifically for young adults diagnosed with breast cancer',
        url: 'https://www.youngsurvival.org',
        type: 'SUPPORT_GROUP',
        topics: ['young adults', 'breast cancer', 'community'],
        stages: ['planning', 'first_week', 'ongoing', 'completed']
      },
      {
        name: 'Return to Work Support Group',
        org: 'Cancer and Careers',
        description: 'Virtual support group specifically for survivors navigating return to work challenges',
        url: 'https://www.cancerandcareers.org',
        type: 'SUPPORT_GROUP',
        topics: ['return to work', 'virtual', 'peer support'],
        stages: ['planning', 'first_week', 'ongoing']
      },
      {
        name: 'Stupid Cancer Meetups',
        org: 'Stupid Cancer',
        description: 'Local and virtual meetups for adolescents and young adults dealing with cancer',
        url: 'https://www.stupidcancer.org',
        type: 'SUPPORT_GROUP',
        topics: ['young adults', 'meetups', 'social'],
        stages: ['planning', 'first_week', 'ongoing', 'completed']
      }
    ]
  },
  {
    category: 'Expert Interviews & Podcasts',
    icon: Mic,
    color: 'teal',
    items: [
      {
        name: 'The Work-Life Balance After Cancer',
        org: 'Cancer Support Community',
        description: 'Podcast interview with occupational therapist specializing in cancer survivorship and workplace wellness',
        url: 'https://www.cancersupportcommunity.org',
        type: 'PODCAST',
        topics: ['work-life balance', 'occupational therapy', 'wellness'],
        stages: ['planning', 'ongoing']
      },
      {
        name: 'Employment Lawyer Q&A: Your Rights',
        org: 'Triage Cancer',
        description: 'Expert interview covering ADA, FMLA, discrimination, and your legal protections at work',
        url: 'https://triagecancer.org',
        type: 'PODCAST',
        topics: ['legal rights', 'employment law', 'ADA', 'FMLA'],
        stages: ['planning']
      },
      {
        name: 'Managing Cognitive Changes at Work',
        org: 'Cancer and Careers',
        description: 'Neuropsychologist discusses "chemo brain" and practical strategies for workplace cognitive challenges',
        url: 'https://www.cancerandcareers.org',
        type: 'PODCAST',
        topics: ['cognitive changes', 'chemo brain', 'strategies'],
        stages: ['first_week', 'ongoing']
      },
      {
        name: 'The First Day Back: An HR Perspective',
        org: 'NCCS',
        description: 'Interview with HR professional on what to expect and how employers should support returning employees',
        url: 'https://www.canceradvocacy.org',
        type: 'PODCAST',
        topics: ['first day', 'HR perspective', 'employer support'],
        stages: ['planning', 'first_week']
      },
      {
        name: 'Financial Planning for Cancer Survivors',
        org: 'Family Reach',
        description: 'Financial advisor discusses navigating medical debt, insurance, and workplace benefits',
        url: 'https://www.familyreach.org',
        type: 'PODCAST',
        topics: ['financial planning', 'medical debt', 'benefits'],
        stages: ['planning', 'ongoing']
      }
    ]
  },
  {
    category: 'Professional Services',
    icon: Briefcase,
    color: 'cyan',
    items: [
      {
        name: 'Disability Rights Advocates',
        org: 'Disability Rights Advocates',
        description: 'Legal advocacy organization fighting for the civil rights of people with disabilities',
        url: 'https://dralegal.org',
        type: 'SERVICE',
        topics: ['legal advocacy', 'disability rights', 'civil rights'],
        stages: ['planning', 'ongoing']
      },
      {
        name: 'National Disability Rights Network',
        org: 'NDRN',
        description: 'Legal advocacy network protecting the rights of people with disabilities',
        url: 'https://www.ndrn.org',
        type: 'SERVICE',
        topics: ['legal advocacy', 'disability rights', 'network'],
        stages: ['planning', 'ongoing']
      },
      {
        name: 'Patient Advocate Foundation',
        org: 'Patient Advocate Foundation',
        description: 'Case management services and financial aid to help patients access healthcare and overcome financial barriers',
        url: 'https://www.patientadvocate.org',
        type: 'SERVICE',
        topics: ['case management', 'financial aid', 'healthcare access'],
        stages: ['planning', 'ongoing']
      },
      {
        name: 'Triage Cancer Legal Resources',
        org: 'Triage Cancer',
        description: 'Free legal information and resources about cancer-related legal issues, including employment discrimination and workplace rights',
        url: 'https://triagecancer.org',
        type: 'SERVICE',
        topics: ['legal information', 'discrimination', 'workplace rights'],
        stages: ['planning', 'first_week', 'ongoing']
      },
      {
        name: 'Workplace Fairness',
        org: 'Workplace Fairness',
        description: 'Non-profit providing information and resources about workers rights and employment law',
        url: 'https://www.workplacefairness.org',
        type: 'SERVICE',
        topics: ['workers rights', 'employment law', 'information'],
        stages: ['planning', 'first_week', 'ongoing']
      },
      {
        name: 'CancerCare Counseling Services',
        org: 'CancerCare',
        description: 'Free professional counseling services for cancer patients and their families, including workplace stress',
        url: 'https://www.cancercare.org',
        type: 'SERVICE',
        topics: ['counseling', 'mental health', 'workplace stress'],
        stages: ['planning', 'first_week', 'ongoing', 'completed']
      }
    ]
  },
  {
    category: 'Mental Health & Wellness',
    icon: Brain,
    color: 'pink',
    items: [
      {
        name: 'Anxiety Management for Return to Work',
        org: 'Mental Health America',
        description: 'Comprehensive guide to managing anxiety related to returning to work after serious illness',
        url: 'https://www.mhanational.org',
        type: 'ARTICLE',
        topics: ['anxiety', 'mental health', 'return to work'],
        stages: ['planning', 'first_week']
      },
      {
        name: 'Mindfulness Practices for Cancer Survivors',
        org: 'Mindful',
        description: 'Evidence-based mindfulness exercises specifically designed for cancer survivors dealing with workplace stress',
        url: 'https://www.mindful.org',
        type: 'VIDEO',
        topics: ['mindfulness', 'stress management', 'exercises'],
        stages: ['ongoing', 'completed']
      },
      {
        name: 'Building Confidence After Cancer',
        org: 'Cancer Support Community',
        description: 'Workshop recording on rebuilding professional confidence and self-esteem after treatment',
        url: 'https://www.cancersupportcommunity.org',
        type: 'VIDEO',
        topics: ['confidence', 'self-esteem', 'workshop'],
        stages: ['planning', 'first_week', 'ongoing']
      },
      {
        name: 'Sleep Strategies for Shift Workers',
        org: 'National Sleep Foundation',
        description: 'Specialized sleep hygiene advice for cancer survivors working non-traditional hours',
        url: 'https://www.thensf.org',
        type: 'ARTICLE',
        topics: ['sleep', 'shift work', 'hygiene'],
        stages: ['ongoing']
      }
    ]
  }
];

export default resources;