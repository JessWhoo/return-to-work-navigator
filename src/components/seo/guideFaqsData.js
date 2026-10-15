// Authoritative FAQ datasets for the three flagship guides:
// - /ManagerGuide
// - /Accommodations
// - /DisclosureGuide
// Shared between the visible on-page GuideFaqSection component and the
// JSON-LD FAQPage schema in StructuredData.jsx so visible text and schema
// always match 1:1.

export const MANAGER_GUIDE_FAQS = [
  {
    question: 'What should a manager say when an employee discloses a cancer diagnosis?',
    answer:
      'Start with brief, genuine empathy and remove immediate pressure: say "I am so sorry you are dealing with this, and thank you for trusting me. Your health comes first, and we will figure out work together." Avoid platitudes like "everything happens for a reason," avoid comparing their diagnosis to a relative’s cancer story, and ask who (if anyone) they authorize you to inform.',
  },
  {
    question: 'Can a manager tell coworkers or upper management about an employee’s cancer diagnosis?',
    answer:
      'No. Under the Americans with Disabilities Act (ADA), employee medical information is strictly confidential. A manager or HR representative may not share an employee’s diagnosis with coworkers, clients, or other leaders without the employee’s explicit permission. If work needs to be redistributed, explain only that the employee has an approved absence or schedule adjustment.',
  },
  {
    question: 'Does cancer qualify as a disability under the ADA even if the employee is in remission?',
    answer:
      'Yes. Under the ADA Amendments Act (ADAAA), cancer almost always qualifies as a disability because it substantially limits normal cell growth—an major bodily function. Protection applies during active treatment, during recovery, and when cancer is in remission or if the employee has a history ("record of") cancer.',
  },
  {
    question: 'How do FMLA and the ADA work together for an employee with cancer?',
    answer:
      'Eligible employees at covered employers (50+ employees within 75 miles) can take up to 12 weeks of job-protected unpaid leave under the Family and Medical Leave Act (FMLA), either as a continuous block or intermittently for infusions, radiation, and follow-up scans. When FMLA is exhausted—or if the employee is not eligible for FMLA—the ADA (15+ employees) requires employers to consider reasonable workplace accommodations, which can include additional medical leave, part-time ramp-up schedules, remote work, or modified duties.',
  },
  {
    question: 'What does a phased return-to-work schedule after cancer treatment look like?',
    answer:
      'A typical phased return starts at 40% to 50% of normal hours (for example, three half-days per week or four-hour mornings when energy is highest) and increases by 10% to 20% every one to two weeks based on medical clearance and treatment fatigue. Incorporating a mid-week rest day (such as Wednesday off) and temporary telework significantly improves retention.',
  },
  {
    question: 'How should a manager handle performance reviews for an employee in cancer treatment or recovery?',
    answer:
      'Evaluate the employee fairly on the work assigned under their adjusted schedule or modified duties—never penalize them for taking protected FMLA leave, using ADA accommodations, or having reduced output caused by approved medical leave. Put all agreed timeline adjustments and scope changes in writing so expectations remain clear.',
  },
  {
    question: 'What can HR ask for in medical documentation for an ADA accommodation request?',
    answer:
      'HR may request limited documentation from the employee’s healthcare provider confirming that the employee has a covered medical condition, describing the functional limitations at work (such as fatigue, lifting limits, or immunosuppression), and outlining recommended accommodations and their expected duration. Employers may not demand full oncology chart notes or genetic test results.',
  },
  {
    question: 'How do you support an employee experiencing "chemo brain" or cancer-related fatigue at work?',
    answer:
      'Practical, low-cost adjustments make the biggest difference: follow up verbal meetings with short written bullet summaries, allow meetings to be recorded, help prioritize the top two or three weekly deliverables, protect uninterrupted focus blocks, and allow flexible start times or brief afternoon rest breaks.',
  },
];

export const ACCOMMODATIONS_GUIDE_FAQS = [
  {
    question: 'Is cancer covered as a disability for workplace accommodations under the ADA?',
    answer:
      'Yes. Under the federal Americans with Disabilities Act (ADA), which covers employers with 15 or more employees, cancer is recognized as a qualifying disability because it substantially limits normal cell growth and major life activities. Many state fair-employment laws cover even smaller employers (sometimes down to 1 to 5 employees).',
  },
  {
    question: 'What are the most common workplace accommodations for cancer survivors?',
    answer:
      'The most frequently approved accommodations include flexible start and end times, intermittent leave for oncology appointments and lab work, temporary remote or hybrid work (especially while immunocompromised or fatigued), a phased part-time-to-full-time return schedule, written task instructions and meeting notes for cognitive fog ("chemo brain"), ergonomic seating or lifting modifications for neuropathy and post-surgical recovery, and short scheduled rest breaks.',
  },
  {
    question: 'Do I have to use the words "ADA" or "reasonable accommodation" when making a request?',
    answer:
      'Legally, no—the Equal Employment Opportunity Commission (EEOC) states that you only need to let your employer know you need an adjustment or change at work due to a medical condition. However, submitting a clear written request that explicitly references "reasonable accommodations under the ADA" creates a formal paper trail and triggers your employer’s legal obligation to engage in the interactive process.',
  },
  {
    question: 'Do I have to tell my employer I have cancer to get an ADA accommodation?',
    answer:
      'You do not need to disclose your specific cancer diagnosis to coworkers or even to your direct supervisor if your organization routes medical documentation through HR or a third-party leave administrator. Your healthcare provider’s letter only needs to confirm that you have a covered medical condition, describe your functional limitations (for example, stamina, immunity, or concentration), and state the workplace adjustments needed.',
  },
  {
    question: 'What is the ADA "interactive process" and how long does it take?',
    answer:
      'The interactive process is a collaborative dialogue between you and your employer (typically HR and/or your manager) to review your requested accommodations and identify effective solutions. Employers must respond promptly—unnecessary delay can violate the ADA. Often, employers and employees agree to a 30-, 60-, or 90-day trial period with a scheduled check-in to adjust as recovery progresses.',
  },
  {
    question: 'Can my employer deny my workplace accommodation request?',
    answer:
      'An employer can only deny a reasonable accommodation if they can demonstrate that it causes "undue hardship" (significant difficulty or expense relative to the organization’s resources and operations) or if it eliminates an essential job function. Even if your exact first-choice accommodation is declined, the employer is legally required to explore alternative effective accommodations with you.',
  },
  {
    question: 'Can I request accommodations months or years after finishing cancer treatment?',
    answer:
      'Yes. Long-term and late effects of cancer treatment—including chronic cancer-related fatigue, peripheral neuropathy, lymphedema, cognitive changes, and endocrine therapy side effects—remain covered under the ADA long after active chemotherapy, radiation, or surgery ends.',
  },
  {
    question: 'What should my oncologist or doctor include in an accommodation support letter?',
    answer:
      'A strong medical support letter is written on clinic letterhead and includes: (1) confirmation that you are under medical care for a health condition affecting specific functional abilities, (2) a clear list of recommended workplace accommodations tied to those limitations, (3) confirmation that these adjustments enable you to perform your essential job duties, and (4) an estimated duration (such as 3 months, 6 months, or ongoing with periodic review).',
  },
];

export const DISCLOSURE_GUIDE_FAQS = [
  {
    question: 'Am I legally required to tell my employer that I have cancer?',
    answer:
      'No. In the United States, you are not legally required to disclose a cancer diagnosis to your employer, supervisor, or coworkers. If you do not need medical leave or workplace accommodations, you do not have to say anything. If you do request FMLA leave or ADA accommodations, you only need to provide limited medical certification of your functional limitations and need for leave or adjustments—often directly to HR rather than your day-to-day manager.',
  },
  {
    question: 'Should I tell HR or my direct manager first about my cancer diagnosis or accommodation needs?',
    answer:
      'If your primary goal is securing legal protection, FMLA paperwork, or formal ADA accommodations while keeping medical details private, start with HR. HR is legally required to keep medical documentation in a confidential file separate from your personnel record. Once your protections and boundaries are documented, you and HR can decide what operational details (like schedule changes) your direct manager needs to know.',
  },
  {
    question: 'How can I ask for workplace accommodations without naming cancer?',
    answer:
      'Use functional, work-focused language rather than diagnostic labels. For example: "I am managing a medical condition under my physician’s care. To perform my role effectively during treatment and recovery, my doctor recommends temporary remote work three days a week and flexible start times for medical appointments."',
  },
  {
    question: 'Can HR share my cancer diagnosis with my supervisor or team?',
    answer:
      'No, not without your consent. Under the ADA’s confidentiality rules, medical information obtained through an accommodation request or FMLA certification must be kept confidential. Supervisors and managers may be told only about necessary restrictions on your work or duties and necessary accommodations—not your underlying diagnosis.',
  },
  {
    question: 'Do I have to disclose my cancer history during a job interview?',
    answer:
      'No. Under the ADA, prospective employers are prohibited from asking about your medical history, disabilities, or past medical leaves before making a conditional job offer. Even if you have a resume gap from treatment, you can simply state that you took planned time away for personal or health reasons that are resolved and that you are excited and ready for full return.',
  },
  {
    question: 'What if I need accommodations during a job interview or after receiving a job offer?',
    answer:
      'You may request an accommodation for the interview process itself (such as a video interview or schedule adjustment), or wait until you have received a written job offer—or even started the role—before requesting workplace accommodations for your day-to-day duties.',
  },
  {
    question: 'Why is it so important to follow up every workplace disclosure conversation in writing?',
    answer:
      'A polite, same-day recap email creates a timestamped record that you notified your employer of a protected medical need and requested accommodations or leave. If a misunderstanding, manager turnover, or unfair performance action occurs later, written documentation is your strongest legal protection.',
  },
  {
    question: 'What should I do if my manager or coworkers ask invasive medical questions?',
    answer:
      'Prepare a short, warm boundary script in advance so you are never caught off guard. For example: "I really appreciate your concern. I’m keeping the medical details private so I can focus on my work while I’m here, but I will definitely let you know if anything changes with my schedule."',
  },
];

export const GUIDE_FAQ_BY_PATH = {
  '/managerguide': MANAGER_GUIDE_FAQS,
  '/accommodations': ACCOMMODATIONS_GUIDE_FAQS,
  '/disclosureguide': DISCLOSURE_GUIDE_FAQS,
};