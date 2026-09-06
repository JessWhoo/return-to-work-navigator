// Content for the Manager & HR support guide. Block types:
// p = paragraph, h = sub-heading, list = bullets (variant: plain|do|dont), quote = callout
const p = (text) => ({ type: 'p', text });
const h = (text) => ({ type: 'h', text });
const list = (items, variant = 'plain') => ({ type: 'list', items, variant });
const quote = (text) => ({ type: 'quote', text });

export const MANAGER_GUIDE_SECTIONS = [
  {
    id: 'dealing-with',
    title: 'What Your Employee Is Dealing With',
    blocks: [
      p('Before we get into what you should do, understand what your employee is navigating:'),
      list([
        'Medically: Appointments that take hours. Treatment that causes debilitating side effects. Surgery and recovery. Radiation or chemotherapy schedules. Scans that trigger existential terror. A body that doesn’t work the way it used to.',
        'Cognitively: Their brain might not work normally. “Chemo brain” is real, but cognitive impacts happen even without chemo. They might struggle with focus, memory, decision-making, or processing information.',
        'Emotionally: They’re terrified. They’re grieving. They’re exhausted. They’re trying to hold it together while their life falls apart. And they’re performing “fine-ness” at work because they’re afraid of seeming unreliable or incompetent.',
        'Financially: Medical bills are piling up. They might be facing unpaid leave. They desperately need their job and the insurance that comes with it. The financial stress is crushing.',
        'Professionally: They’re worried about being seen as less capable. About losing opportunities. About being let go. About whether you’ll still value them if they can’t perform at 100%.',
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
      list(['“Everything happens for a reason”', '“Stay positive!”', '“You’re so strong”', '“Let me know if you need anything” (too vague, puts burden on them to ask)'], 'dont'),
      list(['“I’m sorry you’re going through this”', '“Thank you for telling me”', '“Let’s figure out how to make this work”', '“What do you need right now?”'], 'do'),
      p('Keep it simple, compassionate, and focused on support, not platitudes.'),

      h('2. Have a Real Conversation About Accommodation'),
      p('Don’t wait for them to beg for help. Proactively offer to discuss accommodation. The conversation should cover:'),
      list([
        'Treatment schedule and how it affects their availability',
        'Whether they need flexible hours or remote work options',
        'Whether they need modified duties temporarily',
        'How to handle unexpected absences when they’re too sick to work',
        'Who will cover their work when they’re out',
        'How you’ll communicate about their status with the team (with their permission)',
      ]),
      quote('Important: Let them lead this conversation. They know what they need better than you do. Your job is to listen and problem-solve, not decide for them what’s “reasonable.”'),

      h('3. Put Everything in Writing'),
      p('After any conversation about accommodations, medical leave, or schedule changes, send a follow-up email summarizing what was discussed and agreed to.'),
      quote('Example: “Thanks for meeting with me today. Just to confirm our conversation: You’ll be out for surgery on [date] and recovering for approximately [timeframe]. During your recovery, [colleague] will cover [responsibilities]. When you return, we agreed to [flexible start times / work from home / modified duties] for [timeframe]. We’ll check in again in [timeframe] to reassess. Please let me know if I’ve missed anything or if you need anything else.”'),
      p('This protects both of you. It ensures you’re on the same page and creates documentation if there are any disputes later.'),

      h('4. Don’t Make Them Repeat Themselves'),
      p('If they’ve told you they have cancer and what their treatment plan is, don’t make them re-explain it to HR, to upper management, to the whole team.'),
      p('Ask once: “Would you like me to communicate this to [HR/team/leadership], or would you prefer to do that yourself?” Then respect their answer.'),
      p('If they want you to handle it, handle it. Don’t make them tell their story over and over. It’s exhausting and traumatic.'),

      h('5. Respect Their Privacy'),
      p('Do not tell other people about their diagnosis without explicit permission. Not your boss. Not HR. Not the team. Not anyone.'),
      p('Even if you think everyone “should know” or it would “help the team understand,” it’s not your information to share.'),
      p('Ask: “Who are you comfortable with me sharing this information with, and how much detail would you like me to share?” Then stick to exactly what they’ve authorized.'),

      h('6. Be Flexible About Performance Expectations'),
      p('Your employee is not going to perform at 100% during treatment. That’s not failure. That’s reality. Adjust expectations accordingly:'),
      list([
        'Extend deadlines where possible',
        'Reassign high-stakes projects temporarily',
        'Reduce their workload if feasible',
        'Focus on what’s essential vs. what can wait',
        'Don’t add new responsibilities during active treatment',
      ]),
      p('But also: Don’t assume they can’t do anything. Some people want to work through treatment because it gives them normalcy and purpose. Let them tell you what they can handle.'),

      h('7. Check In Regularly (But Not Intrusively)'),
      p('“How are you doing?” once a week is appropriate. “How are you feeling?” every single day is intrusive.'),
      p('Find a balance. Show you care without making their cancer the only thing you talk about. And sometimes the best check-in is: “Do you need anything this week?” or “How can I support you right now?”'),

      h('8. Cover Their Work Without Resentment'),
      p('When your employee is out for treatment or too sick to work, their responsibilities need to be covered. That might mean redistributing work to the team, hiring temporary help, or letting some things slide. Handle this as a team challenge, not as your sick employee being a burden.'),
      list(['“[Employee] is out again so we all have to pick up the slack.”'], 'dont'),
      list(['“[Employee] is dealing with a serious health issue and we’re going to support them by covering their work while they’re out. Here’s how we’re distributing responsibilities.”'], 'do'),
      p('If team members complain about the extra work, shut it down. “This is what we do for our colleagues when they need it. Someday you might need the same support.”'),

      h('9. Don’t Penalize Them for Being Sick'),
      p('This should be obvious, but:'),
      list([
        'Don’t pass them over for promotions because they were out for treatment',
        'Don’t give them poor performance reviews because they weren’t at 100% during cancer',
        'Don’t exclude them from projects or opportunities because you assume they can’t handle it',
        'Don’t make comments about their reliability or commitment',
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
      p('What FMLA doesn’t cover:'),
      list([
        'Paid leave (unless they have PTO/sick time)',
        'Small employers (under 50 employees)',
        'Employees who haven’t worked there long enough',
      ]),
      p('Even if your employee has FMLA, don’t treat it like they’re using a “get out of work free” card. They’re using it to survive cancer. Act accordingly.'),
    ],
  },
  {
    id: 'mistakes',
    title: 'What Doesn’t Help (Common Mistakes)',
    blocks: [
      h('Mistake #1: “Let me know if you need anything”'),
      p('This sounds supportive but puts all the burden on them to figure out what they need and ask for it. They’re overwhelmed. They don’t know what they need. And they’re afraid to ask because they don’t want to seem demanding.'),
      p('Instead: Make specific offers. “I can reassign the X project while you’re in treatment. Does that help?” or “Would flexible start times make things easier?”'),
      h('Mistake #2: Treating them like they’re fragile'),
      p('They have cancer. They’re not made of glass. Don’t whisper around them. Don’t exclude them from normal work conversations. Don’t treat them like they can’t handle regular work challenges. Ask them what they can handle. Then trust their answer.'),
      h('Mistake #3: Making it weird'),
      p('Your employee disclosed a serious health issue. That doesn’t mean every interaction has to be somber or awkward. You can still talk about work. You can still have normal conversations. You can still joke around (if that was your relationship before). They’re still the same person. They just have cancer now.'),
      h('Mistake #4: Comparing it to your aunt’s cancer'),
      p('“My aunt had breast cancer and she did great!” is not helpful. Every cancer is different. Every person’s experience is different. Your aunt’s outcome has nothing to do with your employee’s prognosis. Don’t share cancer stories unless specifically asked. And definitely don’t share the ones where someone died.'),
      h('Mistake #5: Pressuring them to stay positive'),
      p('“Stay positive!” is not support. It’s a demand that they perform emotional labor for your comfort. They’re allowed to be scared, angry, sad, or any other emotion. Don’t police their feelings.'),
      h('Mistake #6: Making assumptions about what they can do'),
      p('Don’t decide for them that they “probably can’t handle” a project or opportunity. Ask. Let them decide. Respect their answer. Some people want to work through treatment because it gives them purpose. Some need to scale back significantly. You won’t know unless you ask.'),
      h('Mistake #7: Disappearing'),
      p('Some managers get so uncomfortable with cancer that they just... avoid the employee. Stop checking in. Stop communicating. Let HR handle everything. Your employee notices. And it hurts.'),
      p('You don’t have to be their therapist. You just have to be present and supportive. Show up.'),
    ],
  },
  {
    id: 'legal',
    title: 'The Legal Stuff You Need to Know',
    blocks: [
      p('FMLA: Family and Medical Leave Act. Job-protected unpaid leave. Know the rules.'),
      p('ADA: Americans with Disabilities Act. Cancer can qualify as a disability, which means you must provide reasonable accommodation. Reasonable accommodation might include:'),
      list(['Modified work schedules', 'Work from home options', 'Reduced hours temporarily', 'Modified duties', 'Additional breaks', 'Leave beyond FMLA']),
      p('What’s “reasonable” depends on your business and the employee’s specific needs. You’re required to engage in an interactive process to figure it out. Don’t just say no without exploring options.'),
      p('You cannot:'),
      list([
        'Fire someone for having cancer',
        'Retaliate against them for using FMLA or requesting accommodation',
        'Discriminate against them in pay, promotions, or opportunities because of their health',
      ], 'dont'),
      p('If you’re not sure about the legal requirements, talk to HR or an employment attorney. Violating these laws is expensive and wrong.'),
    ],
  },
  {
    id: 'team',
    title: 'How to Talk to the Team',
    blocks: [
      p('Your employee’s cancer affects the whole team. How you communicate about it matters. With the employee’s permission, tell the team:'),
      list([
        '[Employee] is dealing with a serious health issue and will need some time off and flexibility',
        'Here’s how we’re covering their work while they’re out',
        'Let’s support them by [specific actions the team can take]',
        'Respect their privacy—let them share details if and when they want to',
      ]),
      list([
        'Specific medical details unless the employee has explicitly authorized it',
        'Your opinions about their prognosis',
        'Anything that makes the employee sound like a burden',
      ], 'dont'),
      list([
        'This is how we support colleagues when they need it',
        'Complaining about covering extra work is not acceptable',
        'Respect [employee’s] privacy and boundaries',
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
        'Not treating them like they’re “all better now”',
      ], 'do'),
      list([
        'Expecting them to be immediately back to 100%',
        'Asking invasive questions about their health',
        'Making a huge deal about their return in front of everyone',
        'Assuming they’re “fine now” because treatment ended',
      ], 'dont'),
      p('Check in: “How’s the transition back going? What do you need from me to make this work?” Then listen and adjust.'),
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
      p('Supporting an employee through cancer isn’t complicated. It just requires:'),
      list(['Compassion', 'Flexibility', 'Clear communication', 'Respect for privacy and boundaries', 'Willingness to problem-solve', 'Following through on what you promise']),
      p('Your employee isn’t asking for special treatment. They’re asking for the accommodation they need to survive cancer without losing their livelihood. Be the manager who makes that possible.'),
      p('Because someday, someone on your team will need this kind of support. Maybe multiple people over your career. How you handle it now sets the precedent for how your team handles hard things.'),
      p('Be the manager who shows up. Who listens. Who makes it work. Who treats serious illness with the seriousness it deserves.'),
      quote('Your employee will remember how you handled this for the rest of their life. Make sure it’s something they can look back on with gratitude, not bitterness.'),
    ],
  },
];