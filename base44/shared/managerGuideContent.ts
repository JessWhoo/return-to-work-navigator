// ============================================================================
// Premium Manager & HR Guide content — SERVER-SIDE ONLY.
// This module is imported exclusively by the `get-manager-guide` backend
// function, which re-checks the paid Base44Purchase entitlement before
// returning any of this data. It is never imported from client code, so
// the guide body (sections, checklists, email templates, Spanish edition)
// does NOT end up in the public JS bundle.
//
// Icons are stored as STRING names (e.g. 'Target') rather than lucide-react
// component references, so the data is JSON-serializable. The client maps the
// string back to a component via src/components/managerguide/iconMap.js.
// ============================================================================

// --- block helpers (same shape as the original client data files) ---
const p = (text) => ({ type: 'p', text });
const h = (text) => ({ type: 'h', text });
const list = (items, variant = 'plain') => ({ type: 'list', items, variant });
const quote = (text) => ({ type: 'quote', text });

// ============================================================================
// ENGLISH
// ============================================================================

export const MANAGER_GUIDE_SECTIONS = [
  {
    id: 'dealing-with',
    title: 'What Your Employee Is Dealing With',
    blocks: [
      p('Before we get into what you should do, understand what your employee is navigating:'),
      list([
        'Medically: Appointments that take hours. Treatment that causes debilitating side effects. Surgery and recovery. Radiation or chemotherapy schedules. Scans that trigger existential terror. A body that doesn\u2019t work the way it used to.',
        'Cognitively: Their brain might not work normally. \u201CChemo brain\u201D is real, but cognitive impacts happen even without chemo. They might struggle with focus, memory, decision-making, or processing information.',
        'Emotionally: They\u2019re terrified. They\u2019re grieving. They\u2019re exhausted. They\u2019re trying to hold it together while their life falls apart. And they\u2019re performing \u201Cfine-ness\u201D at work because they\u2019re afraid of seeming unreliable or incompetent.',
        'Financially: Medical bills are piling up. They might be facing unpaid leave. They desperately need their job and the insurance that comes with it. The financial stress is crushing.',
        'Professionally: They\u2019re worried about being seen as less capable. About losing opportunities. About being let go. About whether you\u2019ll still value them if they can\u2019t perform at 100%.',
      ]),
      quote('Your employee is drowning. How you respond determines whether you throw them a life raft or watch them go under.'),
    ],
  },
  {
    id: 'what-helps',
    title: 'What Actually Helps',
    blocks: [
      h('1. Say Something (And Say It Right)'),
      p('When your employee discloses their diagnosis, your immediate response matters.'),
      list(['\u201CEverything happens for a reason\u201D', '\u201CStay positive!\u201D', '\u201CYou\u2019re so strong\u201D', '\u201CLet me know if you need anything\u201D (too vague, puts burden on them to ask)'], 'dont'),
      list(['\u201CI\u2019m sorry you\u2019re going through this\u201D', '\u201CThank you for telling me\u201D', '\u201CLet\u2019s figure out how to make this work\u201D', '\u201CWhat do you need right now?\u201D'], 'do'),
      p('Keep it simple, compassionate, and focused on support, not platitudes.'),
      h('2. Have a Real Conversation About Accommodation'),
      p('Don\u2019t wait for them to beg for help. Proactively offer to discuss accommodation. The conversation should cover:'),
      list([
        'Treatment schedule and how it affects their availability',
        'Whether they need flexible hours or remote work options',
        'Whether they need modified duties temporarily',
        'How to handle unexpected absences when they\u2019re too sick to work',
        'Who will cover their work when they\u2019re out',
        'How you\u2019ll communicate about their status with the team (with their permission)',
      ]),
      quote('Important: Let them lead this conversation. They know what they need better than you do. Your job is to listen and problem-solve, not decide for them what\u2019s \u201Creasonable.\u201D'),
      h('3. Put Everything in Writing'),
      p('After any conversation about accommodations, medical leave, or schedule changes, send a follow-up email summarizing what was discussed and agreed to.'),
      quote('Example: \u201CThanks for meeting with me today. Just to confirm our conversation: You\u2019ll be out for surgery on [date] and recovering for approximately [timeframe]. During your recovery, [colleague] will cover [responsibilities]. When you return, we agreed to [flexible start times / work from home / modified duties] for [timeframe]. We\u2019ll check in again in [timeframe] to reassess. Please let me know if I\u2019ve missed anything or if you need anything else.\u201D'),
      p('This protects both of you. It ensures you\u2019re on the same page and creates documentation if there are any disputes later.'),
      h('4. Don\u2019t Make Them Repeat Themselves'),
      p('If they\u2019ve told you they have cancer and what their treatment plan is, don\u2019t make them re-explain it to HR, to upper management, to the whole team.'),
      p('Ask once: \u201CWould you like me to communicate this to [HR/team/leadership], or would you prefer to do that yourself?\u201D Then respect their answer.'),
      p('If they want you to handle it, handle it. Don\u2019t make them tell their story over and over. It\u2019s exhausting and traumatic.'),
      h('5. Respect Their Privacy'),
      p('Do not tell other people about their diagnosis without explicit permission. Not your boss. Not HR. Not the team. Not anyone.'),
      p('Even if you think everyone \u201Cshould know\u201D or it would \u201Chelp the team understand,\u201D it\u2019s not your information to share.'),
      p('Ask: \u201CWho are you comfortable with me sharing this information with, and how much detail would you like me to share?\u201D Then stick to exactly what they\u2019ve authorized.'),
      h('6. Be Flexible About Performance Expectations'),
      p('Your employee is not going to perform at 100% during treatment. That\u2019s not failure. That\u2019s reality. Adjust expectations accordingly:'),
      list([
        'Extend deadlines where possible',
        'Reassign high-stakes projects temporarily',
        'Reduce their workload if feasible',
        'Focus on what\u2019s essential vs. what can wait',
        'Don\u2019t add new responsibilities during active treatment',
      ]),
      p('But also: Don\u2019t assume they can\u2019t do anything. Some people want to work through treatment because it gives them normalcy and purpose. Let them tell you what they can handle.'),
      h('7. Check In Regularly (But Not Intrusively)'),
      p('\u201CHow are you doing?\u201D once a week is appropriate. \u201CHow are you feeling?\u201D every single day is intrusive.'),
      p('Find a balance. Show you care without making their cancer the only thing you talk about. And sometimes the best check-in is: \u201CDo you need anything this week?\u201D or \u201CHow can I support you right now?\u201D'),
      h('8. Cover Their Work Without Resentment'),
      p('When your employee is out for treatment or too sick to work, their responsibilities need to be covered. That might mean redistributing work to the team, hiring temporary help, or letting some things slide. Handle this as a team challenge, not as your sick employee being a burden.'),
      list(['\u201C[Employee] is out again so we all have to pick up the slack.\u201D'], 'dont'),
      list(['\u201C[Employee] is dealing with a serious health issue and we\u2019re going to support them by covering their work while they\u2019re out. Here\u2019s how we\u2019re distributing responsibilities.\u201D'], 'do'),
      p('If team members complain about the extra work, shut it down. \u201CThis is what we do for our colleagues when they need it. Someday you might need the same support.\u201D'),
      h('9. Don\u2019t Penalize Them for Being Sick'),
      p('This should be obvious, but:'),
      list([
        'Don\u2019t pass them over for promotions because they were out for treatment',
        'Don\u2019t give them poor performance reviews because they weren\u2019t at 100% during cancer',
        'Don\u2019t exclude them from projects or opportunities because you assume they can\u2019t handle it',
        'Don\u2019t make comments about their reliability or commitment',
      ], 'dont'),
      p('Cancer is not a performance issue. Treat it like the medical crisis it is, not like poor work ethic.'),
      h('10. Understand FMLA (And Actually Honor It)'),
      p('If your employee is eligible for FMLA, they have a legal right to job-protected leave.'),
      p('What FMLA covers:'),
      list([
        'Up to 12 weeks of unpaid leave per year',
        'Can be taken intermittently (a few hours here and there for appointments)',
        'Job protection (they get their job or an equivalent job back)',
        'Continuation of health insurance',
      ]),
      p('What FMLA doesn\u2019t cover:'),
      list([
        'Paid leave (unless they have PTO/sick time)',
        'Small employers (under 50 employees)',
        'Employees who haven\u2019t worked there long enough',
      ]),
      p('Even if your employee has FMLA, don\u2019t treat it like they\u2019re using a \u201Cget out of work free\u201D card. They\u2019re using it to survive cancer. Act accordingly.'),
    ],
  },
  {
    id: 'mistakes',
    title: 'What Doesn\u2019t Help (Common Mistakes)',
    blocks: [
      h('Mistake #1: \u201CLet me know if you need anything\u201D'),
      p('This sounds supportive but puts all the burden on them to figure out what they need and ask for it. They\u2019re overwhelmed. They don\u2019t know what they need. And they\u2019re afraid to ask because they don\u2019t want to seem demanding.'),
      p('Instead: Make specific offers. \u201CI can reassign the X project while you\u2019re in treatment. Does that help?\u201D or \u201CWould flexible start times make things easier?\u201D'),
      h('Mistake #2: Treating them like they\u2019re fragile'),
      p('They have cancer. They\u2019re not made of glass. Don\u2019t whisper around them. Don\u2019t exclude them from normal work conversations. Don\u2019t treat them like they can\u2019t handle regular work challenges. Ask them what they can handle. Then trust their answer.'),
      h('Mistake #3: Making it weird'),
      p('Your employee disclosed a serious health issue. That doesn\u2019t mean every interaction has to be somber or awkward. You can still talk about work. You can still have normal conversations. You can still joke around (if that was your relationship before). They\u2019re still the same person. They just have cancer now.'),
      h('Mistake #4: Comparing it to your aunt\u2019s cancer'),
      p('\u201CMy aunt had breast cancer and she did great!\u201D is not helpful. Every cancer is different. Every person\u2019s experience is different. Your aunt\u2019s outcome has nothing to do with your employee\u2019s prognosis. Don\u2019t share cancer stories unless specifically asked. And definitely don\u2019t share the ones where someone died.'),
      h('Mistake #5: Pressuring them to stay positive'),
      p('\u201CStay positive!\u201D is not support. It\u2019s a demand that they perform emotional labor for your comfort. They\u2019re allowed to be scared, angry, sad, or any other emotion. Don\u2019t police their feelings.'),
      h('Mistake #6: Making assumptions about what they can do'),
      p('Don\u2019t decide for them that they \u201Cprobably can\u2019t handle\u201D a project or opportunity. Ask. Let them decide. Respect their answer. Some people want to work through treatment because it gives them purpose. Some need to scale back significantly. You won\u2019t know unless you ask.'),
      h('Mistake #7: Disappearing'),
      p('Some managers get so uncomfortable with cancer that they just... avoid the employee. Stop checking in. Stop communicating. Let HR handle everything. Your employee notices. And it hurts.'),
      p('You don\u2019t have to be their therapist. You just have to be present and supportive. Show up.'),
    ],
  },
  {
    id: 'legal',
    title: 'The Legal Stuff You Need to Know',
    blocks: [
      p('FMLA: Family and Medical Leave Act. Job-protected unpaid leave. Know the rules.'),
      p('ADA: Americans with Disabilities Act. Cancer can qualify as a disability, which means you must provide reasonable accommodation. Reasonable accommodation might include:'),
      list(['Modified work schedules', 'Work from home options', 'Reduced hours temporarily', 'Modified duties', 'Additional breaks', 'Leave beyond FMLA']),
      p('What\u2019s \u201Creasonable\u201D depends on your business and the employee\u2019s specific needs. You\u2019re required to engage in an interactive process to figure it out. Don\u2019t just say no without exploring options.'),
      p('You cannot:'),
      list([
        'Fire someone for having cancer',
        'Retaliate against them for using FMLA or requesting accommodation',
        'Discriminate against them in pay, promotions, or opportunities because of their health',
      ], 'dont'),
      p('If you\u2019re not sure about the legal requirements, talk to HR or an employment attorney. Violating these laws is expensive and wrong.'),
    ],
  },
  {
    id: 'team',
    title: 'How to Talk to the Team',
    blocks: [
      p('Your employee\u2019s cancer affects the whole team. How you communicate about it matters. With the employee\u2019s permission, tell the team:'),
      list([
        '[Employee] is dealing with a serious health issue and will need some time off and flexibility',
        'Here\u2019s how we\u2019re covering their work while they\u2019re out',
        'Let\u2019s support them by [specific actions the team can take]',
        'Respect their privacy\u2014let them share details if and when they want to',
      ]),
      list([
        'Specific medical details unless the employee has explicitly authorized it',
        'Your opinions about their prognosis',
        'Anything that makes the employee sound like a burden',
      ], 'dont'),
      list([
        'This is how we support colleagues when they need it',
        'Complaining about covering extra work is not acceptable',
        'Respect [employee\u2019s] privacy and boundaries',
      ], 'do'),
    ],
  },
  {
    id: 'return',
    title: 'When They Come Back',
    blocks: [
      p('Returning to work after cancer treatment is complicated.'),
      list([
        'A phased return if possible (part-time building back to full-time)',
        'Continued flexibility as they adjust',
        'Patience with cognitive and physical limitations',
        'Clear communication about expectations',
        'Not treating them like they\u2019re \u201Call better now\u201D',
      ], 'do'),
      list([
        'Expecting them to be immediately back to 100%',
        'Asking invasive questions about their health',
        'Making a huge deal about their return in front of everyone',
        'Assuming they\u2019re \u201Cfine now\u201D because treatment ended',
      ], 'dont'),
      p('Check in: \u201CHow\u2019s the transition back going? What do you need from me to make this work?\u201D Then listen and adjust.'),
    ],
  },
  {
    id: 'why',
    title: 'Why This Matters',
    blocks: [
      p('How you support an employee through cancer affects:'),
      h('For them'),
      list([
        'Whether they can keep their job and insurance',
        'Whether they feel valued or expendable',
        'Whether they can focus on healing or have to fight their employer too',
        'Their financial stability during crisis',
        'Their mental and emotional wellbeing',
      ]),
      h('For your team'),
      list([
        'Morale and trust in leadership',
        'Willingness to be transparent about their own health needs',
        'Team cohesion and mutual support',
        'Productivity (a supported employee performs better than a terrified one)',
      ]),
      h('For you'),
      list([
        'Retention of a valuable employee',
        'Legal compliance and risk management',
        'Your reputation as a manager',
        'Whether your team trusts you when things get hard',
      ]),
    ],
  },
  {
    id: 'bottom-line',
    title: 'The Bottom Line',
    blocks: [
      p('Supporting an employee through cancer isn\u2019t complicated. It just requires:'),
      list(['Compassion', 'Flexibility', 'Clear communication', 'Respect for privacy and boundaries', 'Willingness to problem-solve', 'Following through on what you promise']),
      p('Your employee isn\u2019t asking for special treatment. They\u2019re asking for the accommodation they need to survive cancer without losing their livelihood. Be the manager who makes that possible.'),
      p('Because someday, someone on your team will need this kind of support. Maybe multiple people over your career. How you handle it now sets the precedent for how your team handles hard things.'),
      p('Be the manager who shows up. Who listens. Who makes it work. Who treats serious illness with the seriousness it deserves.'),
      quote('Your employee will remember how you handled this for the rest of their life. Make sure it\u2019s something they can look back on with gratitude, not bitterness.'),
    ],
  },
];

export const SUPPORT_TIPS = [
  {
    id: 'expectations',
    icon: 'Target',
    color: 'violet',
    title: 'Managing Expectations',
    intro: 'Recovery is not a switch that flips when treatment ends. Reset what "good performance" looks like for this season.',
    tips: [
      'Agree on priorities together: what is essential now, what can wait, and what can be reassigned.',
      'Set realistic, written goals for the first 30/60/90 days and revisit them at each check-in.',
      'Measure output and impact, not hours at a desk or speed of replies.',
      'Expect good days and bad days \u2014 plan buffers into deadlines instead of assuming a straight line.',
      'Ask "what can you handle this week?" rather than deciding for them.',
    ],
  },
  {
    id: 'medical-leave',
    icon: 'CalendarClock',
    color: 'sky',
    title: 'Understanding Medical Leave Impacts',
    intro: 'Leave rarely ends cleanly. Follow-up scans, ongoing therapy, and side effects continue long after the return date.',
    tips: [
      'Plan for intermittent leave: appointments, infusions, and recovery days will keep recurring.',
      'Know how FMLA, short-term disability, PTO, and ADA accommodations fit together at your company.',
      'Keep health insurance and benefits continuous \u2014 this is often the survivor\u2019s biggest fear.',
      'Cover their work with a clear, shared plan so they don\u2019t return to a backlog or a resentful team.',
      'Anticipate financial strain: connect them with HR benefits counselors and employee assistance programs.',
    ],
  },
  {
    id: 'inclusive-transition',
    icon: 'HeartHandshake',
    color: 'emerald',
    title: 'Fostering an Inclusive Transition',
    intro: 'A supportive return is a team effort. Make belonging the default, not something the survivor has to earn back.',
    tips: [
      'Offer a phased return \u2014 part-time or reduced duties building back to full capacity.',
      'Let the employee decide what the team knows and how their return is announced.',
      'Keep them in the loop on projects, decisions, and social moments while they\u2019re out, if they want that.',
      'Train the team on respectful language: no prognosis talk, no "you look great!" pressure, no burden framing.',
      'Model flexibility openly so no one feels singled out for needing accommodations.',
    ],
  },
];

export const MANAGER_CHECKLIST = [
  {
    phase: 'Before They Return',
    items: [
      'Meet (or call) 1\u20132 weeks before the return date to plan together \u2014 let the employee lead.',
      'Agree on a phased return schedule (e.g., part-time or reduced hours building to full-time).',
      'Confirm accommodations: flexible hours, remote days, modified duties, extra breaks.',
      'Document everything agreed in a follow-up email and share it with the employee.',
      'Ask who they want informed (HR, team, leadership) and exactly how much to share.',
      'Arrange coverage for ongoing appointments and unexpected sick days.',
      'Verify FMLA / ADA / disability paperwork and that health insurance stays continuous.',
      'Clear their backlog \u2014 they should not return to a pile of overdue work.',
    ],
  },
  {
    phase: 'First Week Back',
    items: [
      'Welcome them quietly \u2014 no big announcements unless they\u2019ve asked for one.',
      'Walk through what changed while they were out: projects, people, tools, decisions.',
      'Start with a reduced, clearly prioritized workload \u2014 essentials only.',
      'Remove or postpone high-stakes deadlines and new responsibilities.',
      'Schedule a short check-in at the end of the first week: \u201CHow is the transition going?\u201D',
      'Remind them (privately) how to flag a bad day without penalty.',
    ],
  },
  {
    phase: 'First 30 Days',
    items: [
      'Hold weekly 1:1 check-ins focused on support, not surveillance.',
      'Adjust workload up or down based on what they say they can handle \u2014 trust their answer.',
      'Be patient with fatigue and cognitive changes (focus, memory, processing speed).',
      'Keep flexibility in place for follow-up scans, therapy, and side effects.',
      'Address any team resentment about coverage immediately and firmly.',
      'Protect their privacy \u2014 share nothing beyond what they authorized.',
    ],
  },
  {
    phase: 'Days 30\u201390',
    items: [
      'Review the phased plan together and agree on the next step (more hours, more scope).',
      'Reassess accommodations \u2014 extend, adjust, or phase out with the employee\u2019s input.',
      'Set realistic 60/90-day goals in writing; measure impact, not hours logged.',
      'Ensure they are included in projects, opportunities, and promotions \u2014 no quiet sidelining.',
      'Move to bi-weekly check-ins if they prefer, but keep asking \u201Cwhat do you need?\u201D',
    ],
  },
  {
    phase: 'Ongoing',
    items: [
      'Never treat treatment-related absences or reduced output as a performance issue.',
      'Keep FMLA / ADA obligations top of mind; consult HR or counsel when unsure.',
      'Don\u2019t assume they\u2019re \u201Call better now\u201D because treatment ended \u2014 recovery continues.',
      'Model flexibility openly so accommodations feel normal, not special treatment.',
      'Follow through on every promise you make. They will remember how you handled this.',
    ],
  },
];

export const EMAIL_TEMPLATE_CATEGORIES = [
  { id: 'check_in', label: 'Regular Check-ins' },
  { id: 'workload', label: 'Workload Adjustments' },
  { id: 'return', label: 'Return & Re-entry' },
  { id: 'support', label: 'Support & Grace' },
];

export const MANAGER_EMAIL_TEMPLATES = [
  {
    id: 'recurring_catchup',
    category: 'check_in',
    title: 'Recurring 1:1 catch-up request',
    when_to_use: 'Use to set up or confirm a regular, low-pressure check-in cadence after a return.',
    subject: 'Catching up \u2014 [day/time]?',
    body: `Hi [Employee Name],

I'd like to set up a regular, informal check-in so we can stay connected as you settle back in \u2014 would [day/time] work as a standing slot?

There's no agenda to prep. It's just space for you to tell me how things are going, flag anything that feels off, and let me know where I can help. We can keep it to 15\u201320 minutes and adjust anytime.

If that time doesn't work, just send me a couple of options that fit your week.

Thanks,
[Your Name]`,
  },
  {
    id: 'midweek_checkin',
    category: 'check_in',
    title: 'Midweek check-in \u2014 no reply needed',
    when_to_use: 'A short, no-reply-needed pulse check during the first few weeks back.',
    subject: 'Just checking in \u2014 no reply needed',
    body: `Hi [Employee Name],

Wanted to drop a quick note to see how the week is shaping up. No need to reply unless you'd like to \u2014 this is just me checking that nothing's piling up on you and that the pace feels manageable so far.

If there's anything I can shift, defer, or take off your plate, just say the word.

Best,
[Your Name]`,
  },
  {
    id: 'workload_reduce',
    category: 'workload',
    title: 'Reducing / reprioritizing workload',
    when_to_use: 'When the employee seems stretched or you proactively want to lighten the load before burnout sets in.',
    subject: "Let's reset priorities for this week",
    body: `Hi [Employee Name],

I've been looking at the team's workload and I want to make sure your plate is realistic right now, not aspirational. Could we spend a few minutes this week pairing the list down?

Here's what I'd suggest we do:
- Mark the 1\u20132 things that genuinely must happen this week.
- Move or pause anything that can wait.
- Reassign [specific task/project] \u2014 I can hand that to [colleague] so it's off your desk.

Recovery and a sustainable pace come first; the rest can flex around that. Tell me what feels right and I'll handle the reshuffle.

Thanks,
[Your Name]`,
  },
  {
    id: 'workload_flexibility',
    category: 'workload',
    title: 'Offering schedule flexibility / phased return',
    when_to_use: 'To formalize adjusted hours, remote days, or a phased-return arrangement and signal it is genuinely welcome.',
    subject: "Adjusting your schedule \u2014 let's make it official",
    body: `Hi [Employee Name],

I want to put in writing what we talked about so there's no ambiguity: I'm completely supportive of [e.g., a phased return / reduced hours / working from home on appointment days]. This isn't a favor \u2014 it's how we set you up to succeed without running on empty.

Proposed arrangement:
- [Days/hours or remote setup]
- Review date: [date] \u2014 we'll check how it's working and adjust.

If anything about this feels off, or your needs shift week to week, tell me and we'll revise. Your wellbeing is the priority here, not the schedule.

Best,
[Your Name]`,
  },
  {
    id: 'deadline_relief',
    category: 'workload',
    title: 'Relieving deadline pressure',
    when_to_use: "When a deadline is unrealistic given the employee's current capacity and you want to remove the pressure yourself.",
    subject: "Moving the [project] deadline \u2014 you're cleared",
    body: `Hi [Employee Name],

I'm pushing the [project name] deadline from [old date] to [new date]. I want to take that pressure off your shoulders rather than have you carry it silently.

This isn't a reflection of your work \u2014 it's me making sure the timeline matches where things actually are. [Colleague] will handle [piece] in the meantime, and you can pick it back up when you're ready.

If you'd rather keep a smaller scope and hit the original date, we can talk about that too. Either way, no deadline here is worth your health.

Thanks,
[Your Name]`,
  },
  {
    id: 'welcome_back',
    category: 'return',
    title: 'Welcome back (first day)',
    when_to_use: 'Sent the morning of, or day before, the employee returns \u2014 warm, short, no pressure.',
    subject: "Welcome back \u2014 glad you're here",
    body: `Hi [Employee Name],

Welcome back. I'm glad you're here, and I want today to be as low-key as you need it to be.

A few things so you're not wondering:
- No meetings are booked for you today unless you asked for them.
- [Colleague] has been handling [project]; I'll catch you up whenever you're ready, no rush.
- Your first 1:1 with me is [day/time] \u2014 purely a check-in, nothing to prepare.

If today feels like a lot, tell me and we'll adjust. Glad to have you back.

[Your Name]`,
  },
  {
    id: 'post_appointment',
    category: 'return',
    title: 'Follow-up after a medical appointment',
    when_to_use: 'After a known appointment or treatment day \u2014 checking in without prying for medical detail.',
    subject: 'Thinking of you after today',
    body: `Hi [Employee Name],

Just wanted to send a quick note after your appointment today \u2014 hoping it went as well as it could.

No need to share any details; this is just me checking that you have what you need for the rest of the week. If you need tomorrow to recover, or want to dial back anything on your plate, say the word and I'll handle it.

Take whatever you need.

[Your Name]`,
  },
  {
    id: 'accommodation_checkin',
    category: 'support',
    title: 'Is the accommodation working?',
    when_to_use: 'A few weeks after an accommodation is in place, to check whether it actually helps or needs adjusting.',
    subject: 'Quick check on how [accommodation] is working',
    body: `Hi [Employee Name],

It's been a few weeks since we put [the adjusted schedule / remote days / reduced workload] in place, and I want to make sure it's actually helping rather than just "in place."

Is it doing what you needed it to do? Is there anything that's still a friction point \u2014 a meeting time, a deadline cadence, a task type \u2014 that we should look at next?

Nothing here is locked in. If it needs to change, let's change it.

Thanks,
[Your Name]`,
  },
  {
    id: 'hard_week',
    category: 'support',
    title: 'Acknowledging a hard week',
    when_to_use: 'When the employee has had a visibly tough stretch \u2014 offering grace without making them explain.',
    subject: 'No pressure this week',
    body: `Hi [Employee Name],

I can see this week has been a heavy one. I just wanted to say: you don't need to push through it to prove anything to me or the team.

If it helps, clear your calendar of anything non-essential, and I'll cover or defer what I can on my end. There's no expectation that you operate at full speed right now \u2014 just take the time you need and tell me if there's anything I can move for you.

We'll pick the work back up when you're ready.

[Your Name]`,
  },
];

export const MANAGER_GUIDE_FAQS = [
  {
    question: 'What should a manager say when an employee discloses a cancer diagnosis?',
    answer: 'Start with brief, genuine empathy and remove immediate pressure: say "I am so sorry you are dealing with this, and thank you for trusting me. Your health comes first, and we will figure out work together." Avoid platitudes like "everything happens for a reason," avoid comparing their diagnosis to a relative\u2019s cancer story, and ask who (if anyone) they authorize you to inform.',
  },
  {
    question: 'Can a manager tell coworkers or upper management about an employee\u2019s cancer diagnosis?',
    answer: 'No. Under the Americans with Disabilities Act (ADA), employee medical information is strictly confidential. A manager or HR representative may not share an employee\u2019s diagnosis with coworkers, clients, or other leaders without the employee\u2019s explicit permission. If work needs to be redistributed, explain only that the employee has an approved absence or schedule adjustment.',
  },
  {
    question: 'Does cancer qualify as a disability under the ADA even if the employee is in remission?',
    answer: 'Yes. Under the ADA Amendments Act (ADAAA), cancer almost always qualifies as a disability because it substantially limits normal cell growth\u2014an major bodily function. Protection applies during active treatment, during recovery, and when cancer is in remission or if the employee has a history ("record of") cancer.',
  },
  {
    question: 'How do FMLA and the ADA work together for an employee with cancer?',
    answer: 'Eligible employees at covered employers (50+ employees within 75 miles) can take up to 12 weeks of job-protected unpaid leave under the Family and Medical Leave Act (FMLA), either as a continuous block or intermittently for infusions, radiation, and follow-up scans. When FMLA is exhausted\u2014or if the employee is not eligible for FMLA\u2014the ADA (15+ employees) requires employers to consider reasonable workplace accommodations, which can include additional medical leave, part-time ramp-up schedules, remote work, or modified duties.',
  },
  {
    question: 'What does a phased return-to-work schedule after cancer treatment look like?',
    answer: 'A typical phased return starts at 40% to 50% of normal hours (for example, three half-days per week or four-hour mornings when energy is highest) and increases by 10% to 20% every one to two weeks based on medical clearance and treatment fatigue. Incorporating a mid-week rest day (such as Wednesday off) and temporary telework significantly improves retention.',
  },
  {
    question: 'How should a manager handle performance reviews for an employee in cancer treatment or recovery?',
    answer: 'Evaluate the employee fairly on the work assigned under their adjusted schedule or modified duties\u2014never penalize them for taking protected FMLA leave, using ADA accommodations, or having reduced output caused by approved medical leave. Put all agreed timeline adjustments and scope changes in writing so expectations remain clear.',
  },
  {
    question: 'What can HR ask for in medical documentation for an ADA accommodation request?',
    answer: 'HR may request limited documentation from the employee\u2019s healthcare provider confirming that the employee has a covered medical condition, describing the functional limitations at work (such as fatigue, lifting limits, or immunosuppression), and outlining recommended accommodations and their expected duration. Employers may not demand full oncology chart notes or genetic test results.',
  },
  {
    question: 'How do you support an employee experiencing "chemo brain" or cancer-related fatigue at work?',
    answer: 'Practical, low-cost adjustments make the biggest difference: follow up verbal meetings with short written bullet summaries, allow meetings to be recorded, help prioritize the top two or three weekly deliverables, protect uninterrupted focus blocks, and allow flexible start times or brief afternoon rest breaks.',
  },
];

// ============================================================================
// SPANISH
// ============================================================================

export const SUPPORT_TIPS_ES = [
  {
    id: 'communication',
    icon: 'MessageCircleHeart',
    title: 'Comunicaci\u00F3n Emp\u00E1tica',
    intro: 'Tus primeras palabras marcan la pauta de toda la experiencia de regreso al trabajo.',
    tips: [
      'Agradece la confianza del empleado sin pedir detalles m\u00E9dicos.',
      'Pregunta: "\u00BFQu\u00E9 necesitas de m\u00ED esta semana?" en lugar de decir "Av\u00EDsame si necesitas algo".',
      'Acuerda de antemano con qu\u00E9 frecuencia y por qu\u00E9 medio se comunicar\u00E1n.',
      'Respeta su privacidad: nunca compartas su diagn\u00F3stico con el equipo sin permiso expl\u00EDcito.',
    ],
  },
  {
    id: 'flexibility',
    icon: 'Sliders',
    title: 'Flexibilidad Pr\u00E1ctica (ADA y FMLA)',
    intro: 'Peque\u00F1os ajustes en el horario y la carga de trabajo permiten retener a empleados valiosos.',
    tips: [
      'Ofrece un regreso gradual (por ejemplo, 50 % de las horas durante las primeras semanas).',
      'Permite trabajo remoto o h\u00EDbrido, especialmente si el sistema inmunol\u00F3gico est\u00E1 comprometido.',
      'Env\u00EDa res\u00FAmenes por escrito despu\u00E9s de las reuniones para apoyar la memoria ("quimiocerebro").',
      'Protege bloques de tiempo para citas de oncolog\u00EDa, an\u00E1lisis y descanso.',
    ],
  },
  {
    id: 'culture',
    icon: 'HeartHandshake',
    title: 'Cultura de Equipo sin Culpa',
    intro: 'El empleado no debe sentir que su enfermedad es una carga para sus compa\u00F1eros.',
    tips: [
      'Redistribuye las tareas clave con claridad como un esfuerzo de equipo.',
      'Revisa las metas y plazos para evaluar de manera justa el trabajo acordado.',
      'No excluyas al empleado de proyectos futuros ni asumas lo que puede o no puede hacer: preg\u00FAntale.',
      'Programa revisiones peri\u00F3dicas (cada 30 o 60 d\u00EDas) para ajustar las adaptaciones seg\u00FAn su recuperaci\u00F3n.',
    ],
  },
];

export const MANAGER_GUIDE_SECTIONS_ES = [
  {
    id: 'lo-que-enfrenta',
    title: 'Lo que tu empleado est\u00E1 enfrentando',
    blocks: [
      p('Antes de hablar sobre procedimientos, es fundamental comprender lo que vive un empleado durante y despu\u00E9s del tratamiento contra el c\u00E1ncer:'),
      list([
        'En lo m\u00E9dico: Citas que toman horas, cirug\u00EDas, sesiones de quimioterapia o radioterapia, efectos secundarios debilitantes y estudios de seguimiento que generan una enorme ansiedad.',
        'En lo cognitivo: El "quimiocerebro" (neblina mental) es real y puede ocurrir incluso sin quimioterapia. Puede afectar la concentraci\u00F3n, la memoria a corto plazo y la velocidad para procesar informaci\u00F3n.',
        'En lo emocional: Miedo, agotamiento profundo e incertidumbre, mientras intenta aparentar que "todo est\u00E1 bien" en el trabajo por temor a parecer poco confiable.',
        'En lo econ\u00F3mico: Las facturas m\u00E9dicas se acumulan y el empleado depende de su empleo y de su seguro m\u00E9dico para continuar su tratamiento.',
        'En lo profesional: Temor a perder oportunidades, a recibir malas evaluaciones o a ser reemplazado por no poder rendir al 100 % temporalmente.',
      ]),
      quote('Tu empleado est\u00E1 atravesando una crisis m\u00E9dica mayor. La forma en que respondas determinar\u00E1 si le tiendes un salvavidas o si le sumas una carga m\u00E1s.'),
    ],
  },
  {
    id: 'lo-que-ayuda',
    title: 'Lo que realmente ayuda (10 acciones clave)',
    blocks: [
      h('1. Responde con empat\u00EDa y sencillez desde el primer momento'),
      p('Cuando un empleado te informa sobre su diagn\u00F3stico o necesidad m\u00E9dica, tu primera reacci\u00F3n importa enormemente.'),
      list([
        '"Todo pasa por algo"',
        '"\u00A1Solo tienes que mantenerte positivo!"',
        '"Mi t\u00EDa tuvo ese mismo c\u00E1ncer y\u2026"',
        '"Av\u00EDsame si necesitas algo" (es demasiado vago y deja toda la carga en el empleado)',
      ], 'dont'),
      list([
        '"Lamento mucho que est\u00E9s pasando por esto y te agradezco que conf\u00EDes en m\u00ED."',
        '"Tu salud es lo primero. Vamos a encontrar juntos la forma de organizar el trabajo."',
        '"\u00BFQu\u00E9 es lo que m\u00E1s te ayudar\u00EDa en estas pr\u00F3ximas dos semanas?"',
      ], 'do'),
      h('2. Inicia una conversaci\u00F3n real sobre adaptaciones laborales (Proceso Interactivo de la ADA)'),
      p('No esperes a que el empleado tenga que suplicar ayuda. Ofrece proactivamente revisar opciones como:'),
      list([
        'Horarios flexibles de entrada y salida para citas m\u00E9dicas o fatiga matutina',
        'Opciones temporales de trabajo desde casa (teletrabajo)',
        'Regreso gradual (jornada parcial aumentando progresivamente a tiempo completo)',
        'Pausas breves de descanso durante el d\u00EDa',
        'Redistribuci\u00F3n temporal de tareas secundarias o f\u00EDsicas pesadas',
      ]),
      quote('Deja que el empleado gu\u00EDe la conversaci\u00F3n: nadie conoce mejor sus niveles de energ\u00EDa y las recomendaciones de su equipo m\u00E9dico.'),
      h('3. Pon todos los acuerdos por escrito'),
      p('Despu\u00E9s de cualquier conversaci\u00F3n sobre licencias m\u00E9dicas, horarios o adaptaciones, env\u00EDa un correo breve confirmando lo acordado.'),
      quote('Ejemplo: "Gracias por reunirte conmigo hoy. Para confirmar nuestro acuerdo: contar\u00E1s con horario flexible y trabajo remoto los martes y jueves durante las pr\u00F3ximas 6 semanas mientras contin\u00FAas tu recuperaci\u00F3n. Durante tus citas m\u00E9dicas, [Nombre] cubrir\u00E1 las urgencias del proyecto X. Volveremos a conversar el [Fecha] para ver c\u00F3mo te sientes y ajustar lo necesario."'),
      h('4. No lo obligues a repetir su historia'),
      p('Preg\u00FAntale una sola vez: "\u00BFPrefieres que yo coordine los detalles operativos con Recursos Humanos, o prefieres hablar directamente con ellos?" Respeta su decisi\u00F3n.'),
      h('5. Protege estrictamente su confidencialidad m\u00E9dica'),
      p('Bajo la Ley de Estadounidenses con Discapacidades (ADA), la informaci\u00F3n m\u00E9dica de un empleado es confidencial. No compartas su diagn\u00F3stico con el equipo, clientes ni otros l\u00EDderes sin su autorizaci\u00F3n expl\u00EDcita.'),
      h('6. Ajusta las expectativas de desempe\u00F1o con realismo y justicia'),
      list([
        'Prioriza los 2 o 3 entregables esenciales y pospon lo secundario',
        'Env\u00EDa instrucciones y acuerdos por escrito para apoyar la concentraci\u00F3n',
        'Evita asignar proyectos de alta presi\u00F3n durante el tratamiento activo',
        'Eval\u00FAa al empleado seg\u00FAn las metas ajustadas, nunca penalizando el uso de licencia m\u00E9dica',
      ]),
      h('7. Mant\u00E9n el contacto sin ser invasivo'),
      p('Un mensaje semanal preguntando "\u00BFC\u00F3mo va todo esta semana y qu\u00E9 apoyo necesitas con tu carga de trabajo?" demuestra inter\u00E9s genuino sin invadir su privacidad m\u00E9dica.'),
      h('8. Cubre su trabajo sin generar resentimiento en el equipo'),
      list(['"[Nombre] volvi\u00F3 a faltar hoy, as\u00ED que nos toca hacer su trabajo."'], 'dont'),
      list(['"[Nombre] tiene una ausencia programada. As\u00ED es como distribuiremos las prioridades esta semana para apoyarnos como equipo."'], 'do'),
      h('9. Conoce y respeta las leyes federales (ADA y FMLA)'),
      p('La ley FMLA otorga hasta 12 semanas de licencia sin goce de sueldo con protecci\u00F3n del puesto (continua o intermitente) en empleadores elegibles (50+ empleados). La ley ADA (15+ empleados) protege contra la discriminaci\u00F3n y exige adaptaciones razonables, incluyendo horarios flexibles, teletrabajo o licencia m\u00E9dica adicional.'),
    ],
  },
  {
    id: 'errores-comunes',
    title: 'Errores comunes que debes evitar',
    blocks: [
      h('Error #1: Tratar al empleado como si fuera de cristal'),
      p('Muchos sobrevivientes desean trabajar porque el trabajo les brinda normalidad, prop\u00F3sito e ingresos. No decidas por ellos qu\u00E9 proyectos pueden asumir: preg\u00FAntales y conf\u00EDa en su respuesta.'),
      h('Error #2: Asumir que cuando termina el tratamiento "ya todo volvi\u00F3 a la normalidad"'),
      p('La fatiga relacionada con el c\u00E1ncer, la neuropat\u00EDa y los cambios cognitivos suelen durar meses despu\u00E9s de la \u00FAltima sesi\u00F3n de quimioterapia o radioterapia. El regreso debe ser gradual.'),
      h('Error #3: Desaparecer por incomodidad'),
      p('El silencio de un jefe genera ansiedad y temor al despido. No necesitas ser terapeuta; solo necesitas estar presente, ser claro y actuar con humanidad.'),
    ],
  },
  {
    id: 'el-regreso',
    title: 'C\u00F3mo estructurar un regreso exitoso al trabajo',
    blocks: [
      p('Las primeras cuatro semanas de regreso son cr\u00EDticas para la salud y la retenci\u00F3n del empleado:'),
      list([
        'Dise\u00F1a un horario escalonado (por ejemplo: Semana 1\u20132 al 50 %, Semana 3\u20134 al 75 %, Semana 5 al 100 %)',
        'Considera un d\u00EDa de descanso a mitad de semana (como los mi\u00E9rcoles) para evitar el agotamiento acumulado',
        'Establece reuniones breves de 15 minutos cada semana para revisar prioridades y niveles de energ\u00EDa',
        'Documenta los ajustes y fija una fecha de revisi\u00F3n a los 30, 60 y 90 d\u00EDas',
      ], 'do'),
    ],
  },
];

export const MANAGER_CHECKLIST_ES = [
  {
    phase: '1. Cuando el empleado comparte la noticia',
    items: [
      'Expresar empat\u00EDa genuina y agradecer su confianza sin pedir detalles cl\u00EDnicos',
      'Preguntar qui\u00E9n (si es que alguien) tiene autorizaci\u00F3n para conocer la situaci\u00F3n',
      'Conectar al empleado con Recursos Humanos para informaci\u00F3n sobre FMLA, ADA y beneficios',
      'Confirmar por escrito los primeros ajustes de horario o cobertura inmediata',
    ],
  },
  {
    phase: '2. Durante el tratamiento o licencia m\u00E9dica',
    items: [
      'Acordar la frecuencia y el canal de comunicaci\u00F3n preferido durante la ausencia',
      'Redistribuir la carga de trabajo del equipo de manera clara y justa',
      'Mantener la informaci\u00F3n m\u00E9dica en estricta confidencialidad (separada del expediente laboral)',
      'Preparar un resumen sencillo de novedades antes de su fecha de regreso',
    ],
  },
  {
    phase: '3. Planificaci\u00F3n antes del primer d\u00EDa de regreso',
    items: [
      'Acordar las adaptaciones razonables (horario gradual, teletrabajo, pausas de descanso)',
      'Definir las 2 o 3 prioridades principales para las primeras dos semanas',
      'Confirmar con el empleado qu\u00E9 mensaje desea que se comparta con el equipo a su regreso',
      'Asegurar que su estaci\u00F3n de trabajo, accesos y equipo ergon\u00F3mico est\u00E9n listos',
    ],
  },
  {
    phase: '4. Primeros 30 a 90 d\u00EDas de regreso',
    items: [
      'Realizar reuniones breves semanales para evaluar la carga de trabajo y la energ\u00EDa',
      'Enviar res\u00FAmenes por escrito despu\u00E9s de las reuniones para facilitar el seguimiento',
      'Proteger el horario de citas m\u00E9dicas y an\u00E1lisis de seguimiento sin penalizaci\u00F3n',
      'Revisar y actualizar el plan de adaptaciones a los 30, 60 y 90 d\u00EDas',
    ],
  },
];

export const MANAGER_EMAIL_TEMPLATES_ES = [
  {
    id: 'es-initial-support',
    title: 'Confirmaci\u00F3n de apoyo tras la conversaci\u00F3n inicial',
    when_to_use: 'Env\u00EDalo el mismo d\u00EDa o al d\u00EDa siguiente de que el empleado te informe sobre su situaci\u00F3n m\u00E9dica.',
    subject: 'Gracias por conversar conmigo hoy \u2014 Cuenta con todo nuestro apoyo',
    body: `Hola [Nombre del empleado]

Gracias por la confianza de conversar conmigo hoy. Quiero reiterarte que tu salud y tu bienestar son la prioridad n\u00FAmero uno, y que estamos aqu\u00ED para apoyarte en cada etapa.

Como acordamos:
\u2022 Mantendr\u00E9 esta informaci\u00F3n en total confidencialidad.
\u2022 [Recursos Humanos / Nombre] te compartir\u00E1 los detalles sobre tus opciones de licencia (FMLA) y adaptaciones laborales (ADA).
\u2022 Por ahora, ajustaremos [mencionar ajuste inmediato, ej. tus entregas de esta semana / tu horario de los jueves] para que puedas enfocarte en tus pr\u00F3ximas citas m\u00E9dicas.

Por favor, no dudes en decirme si hay algo adicional que podamos ajustar desde ahora.

Un saludo cordial,
[Tu Nombre]`,
  },
  {
    id: 'es-return-plan',
    title: 'Bienvenida y plan de regreso gradual (Primera semana)',
    when_to_use: 'Env\u00EDalo unos d\u00EDas antes de la fecha programada de regreso al trabajo.',
    subject: 'Plan para tu regreso la pr\u00F3xima semana \u2014 \u00A1Qu\u00E9 gusto tenerte de vuelta!',
    body: `Hola [Nombre del empleado]

Nos alegra mucho darte la bienvenida de regreso el [Fecha]. Para que tu transici\u00F3n sea tranquila y sostenible, prepar\u00E9 este resumen de lo que acordamos para tus primeras semanas:

\u2022 Horario de regreso gradual: [ej. Lunes, martes y jueves de 9:00 a.m. a 1:00 p.m. desde casa durante las primeras dos semanas].
\u2022 Prioridades iniciales: Durante la primera semana solo nos enfocaremos en ponerte al d\u00EDa con [Proyecto A] y revisar tu bandeja de entrada a tu propio ritmo.
\u2022 Reuni\u00F3n de seguimiento: Agend\u00E9 15 minutos el [D\u00EDa] para ver c\u00F3mo te sientes con el ritmo de trabajo y hacer cualquier ajuste necesario.

No tienes que responder a este correo antes de tu primer d\u00EDa. \u00A1Nos vemos el [D\u00EDa]!

Saludos,
[Tu Nombre]`,
  },
];

export const MANAGER_GUIDE_FAQS_ES = [
  {
    question: '\u00BFQu\u00E9 debe decir un gerente cuando un empleado le informa que tiene c\u00E1ncer?',
    answer: 'Comienza con empat\u00EDa sincera y quita presi\u00F3n de inmediato: di "Lamento mucho que est\u00E9s pasando por esto y te agradezco tu confianza. Tu salud es lo primero, y juntos veremos c\u00F3mo organizar el trabajo". Evita frases hechas como "todo pasa por algo", no compares su caso con el de un familiar y preg\u00FAntale a qui\u00E9n (si es que a alguien) autoriza informar.',
  },
  {
    question: '\u00BFPuede un gerente contarle al equipo o a otros jefes sobre el diagn\u00F3stico de c\u00E1ncer de un empleado?',
    answer: 'No. Bajo la Ley de Estadounidenses con Discapacidades (ADA), la informaci\u00F3n m\u00E9dica de un empleado es estrictamente confidencial. Un gerente o representante de Recursos Humanos no puede compartir el diagn\u00F3stico con compa\u00F1eros, clientes ni otros l\u00EDderes sin el permiso expl\u00EDcito del empleado. Si es necesario redistribuir tareas, solo se debe informar que el empleado cuenta con un ajuste de horario o licencia aprobada.',
  },
  {
    question: '\u00BFEl c\u00E1ncer califica como una discapacidad bajo la ley ADA aunque el empleado est\u00E9 en remisi\u00F3n?',
    answer: 'S\u00ED. Bajo la Ley de Enmiendas a la ADA (ADAAA), el c\u00E1ncer casi siempre califica como una discapacidad porque limita sustancialmente el crecimiento celular normal. La protecci\u00F3n legal aplica durante el tratamiento activo, durante la recuperaci\u00F3n y tambi\u00E9n cuando el c\u00E1ncer est\u00E1 en remisi\u00F3n o existe un antecedente de c\u00E1ncer.',
  },
  {
    question: '\u00BFC\u00F3mo funcionan juntas la licencia FMLA y la ley ADA para un empleado con c\u00E1ncer?',
    answer: 'En empleadores cubiertos (50 o m\u00E1s empleados en un radio de 75 millas), los empleados elegibles pueden tomar hasta 12 semanas de licencia sin sueldo con protecci\u00F3n del puesto bajo la FMLA, ya sea de forma continua o intermitente para sesiones de quimioterapia, radioterapia o estudios. Cuando se agota la FMLA \u2014o si el empleado a\u00FAn no cumple el a\u00F1o de antig\u00FCedad para FMLA\u2014, la ley ADA (15 o m\u00E1s empleados) exige considerar adaptaciones laborales razonables, que pueden incluir licencia m\u00E9dica adicional, regreso gradual a medio tiempo o teletrabajo.',
  },
  {
    question: '\u00BFC\u00F3mo es un horario de regreso gradual al trabajo despu\u00E9s del tratamiento contra el c\u00E1ncer?',
    answer: 'Un regreso gradual t\u00EDpico comienza con el 40 % al 50 % de la jornada habitual (por ejemplo, tres medios d\u00EDas por semana o ma\u00F1anas de cuatro horas cuando hay mayor energ\u00EDa) y aumenta un 10 % a 20 % cada una o dos semanas seg\u00FAn la tolerancia f\u00EDsica y la indicaci\u00F3n m\u00E9dica. Incluir un d\u00EDa de descanso a mitad de semana (como los mi\u00E9rcoles) y teletrabajo temporal mejora significativamente la recuperaci\u00F3n y retenci\u00F3n.',
  },
  {
    question: '\u00BFC\u00F3mo debe evaluar un gerente el desempe\u00F1o de un empleado en tratamiento o recuperaci\u00F3n de c\u00E1ncer?',
    answer: 'Eval\u00FAa al empleado de manera justa con base en el trabajo acordado bajo su horario ajustado o funciones modificadas; nunca lo penalices por haber tomado licencia protegida bajo la FMLA ni por utilizar adaptaciones de la ADA. Deja todos los ajustes de metas y plazos por escrito.',
  },
  {
    question: '\u00BFQu\u00E9 documentaci\u00F3n m\u00E9dica puede pedir Recursos Humanos para una adaptaci\u00F3n bajo la ADA?',
    answer: 'Recursos Humanos puede solicitar una carta breve del m\u00E9dico tratante que confirme que el empleado tiene una condici\u00F3n m\u00E9dica cubierta, describa las limitaciones funcionales en el trabajo (como fatiga, l\u00EDmite para levantar peso o defensas bajas) y recomiende las adaptaciones y su duraci\u00F3n estimada. El empleador no puede exigir el expediente oncol\u00F3gico completo ni pruebas gen\u00E9ticas.',
  },
  {
    question: '\u00BFC\u00F3mo apoyar a un empleado que experimenta "quimiocerebro" o fatiga relacionada con el c\u00E1ncer?',
    answer: 'Los ajustes pr\u00E1cticos de bajo costo marcan una gran diferencia: env\u00EDa res\u00FAmenes breves por escrito despu\u00E9s de las reuniones, permite grabar reuniones como apoyo de memoria, ayuda a priorizar las 2 o 3 entregas m\u00E1s importantes de la semana, protege bloques de concentraci\u00F3n sin interrupciones y permite flexibilidad de horario o pausas breves de descanso.',
  },
];

// ============================================================================
// Aggregated export — the shape the backend function returns to the client.
// ============================================================================
export function getManagerGuideContent() {
  return {
    en: {
      sections: MANAGER_GUIDE_SECTIONS,
      supportTips: SUPPORT_TIPS,
      checklist: MANAGER_CHECKLIST,
      emailTemplates: MANAGER_EMAIL_TEMPLATES,
      emailTemplateCategories: EMAIL_TEMPLATE_CATEGORIES,
      faqs: MANAGER_GUIDE_FAQS,
    },
    es: {
      sections: MANAGER_GUIDE_SECTIONS_ES,
      supportTips: SUPPORT_TIPS_ES,
      checklist: MANAGER_CHECKLIST_ES,
      emailTemplates: MANAGER_EMAIL_TEMPLATES_ES,
      faqs: MANAGER_GUIDE_FAQS_ES,
    },
  };
}