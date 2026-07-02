// Curated expert tips organized by category.
// Each tip includes a short summary and a longer body suitable for expanded reading.

export const CATEGORIES = [
  {
    id: 'workplace_adjustments',
    label: 'Workplace Adjustments',
    tagline: 'Practical tips for adapting your work environment and routine',
    color: 'from-emerald-500 to-teal-600',
    bg: 'from-emerald-50 to-teal-50',
    border: 'border-emerald-300',
  },
  {
    id: 'emotional_readiness',
    label: 'Emotional Readiness',
    tagline: 'Building confidence and managing the emotional return',
    color: 'from-rose-500 to-fuchsia-600',
    bg: 'from-rose-50 to-fuchsia-50',
    border: 'border-rose-300',
  },
  {
    id: 'career_conversations',
    label: 'Career Conversations',
    tagline: 'How to talk with managers, HR, and colleagues',
    color: 'from-sky-500 to-indigo-600',
    bg: 'from-sky-50 to-indigo-50',
    border: 'border-sky-300',
  },
];

export const TIPS = [
  // -------- Workplace Adjustments --------
  {
    id: 'wa-1',
    category: 'workplace_adjustments',
    title: 'Design your day around your energy peaks',
    summary: 'Schedule cognitively demanding work when your energy is highest — usually mid-morning for most survivors.',
    body: `Post-treatment fatigue rarely follows a 9-to-5 rhythm. Track your energy for two weeks in a simple journal — note a 1–10 score at 9am, noon, 3pm, and 5pm. Patterns emerge quickly.

Once you know your peaks, protect them. Block your two most productive hours for deep, focused work: writing, analysis, planning. Save meetings, email triage, and repetitive tasks for the lower-energy windows.

If you have autonomy over your calendar, decline non-essential meetings during peak hours. If you don't, ask your manager to move recurring meetings to your low-energy times. Frame it as productivity, not limitation: "I'm most effective before 11am and want to protect that block for [key project]."`,
    expert: 'Dr. Maya Chen',
    title_expert: 'Oncology Social Worker, MSW',
    readTime: '3 min read',
  },
  {
    id: 'wa-2',
    category: 'workplace_adjustments',
    title: 'Build recovery breaks into your workday',
    summary: 'Short, structured rest breaks prevent the mid-afternoon crash that derails so many returning survivors.',
    body: `The instinct is to power through. Don't. Survivors who take deliberate breaks report significantly less fatigue by week's end than those who push through.

Try the 90/15 rule: 90 minutes of focused work, then 15 minutes of true rest — not scrolling, not checking email. Step outside, close your eyes, do gentle stretching, or lie down if you can.

Ask for a private space if your workplace is open-plan. Many employers will designate a quiet room, medical room, or unused office as a reasonable accommodation. Bring a small pillow or eye mask. Set a timer so breaks don't stretch into guilt.`,
    expert: 'Priya Anand',
    title_expert: 'HR Consultant & ADA Specialist',
    readTime: '2 min read',
  },
  {
    id: 'wa-3',
    category: 'workplace_adjustments',
    title: 'The phased return: a proven template',
    summary: 'A structured 4–8 week ramp-up dramatically improves both retention and long-term wellbeing.',
    body: `Research consistently shows that survivors who return gradually stay employed longer than those who jump straight back to full-time. A common template:

• Weeks 1–2: 2–3 half-days per week, no meetings before 10am
• Weeks 3–4: 4 half-days per week, one full day
• Weeks 5–6: 3 full days per week
• Weeks 7–8: 4 full days per week
• Week 9+: Full schedule with one flexible remote day

Bring this template to your first HR conversation. Employers respond well to concrete plans. Adjust based on your treatment, role, and how you feel — this is a starting point, not a prescription.`,
    expert: 'Dr. Maya Chen',
    title_expert: 'Oncology Social Worker, MSW',
    readTime: '4 min read',
  },
  {
    id: 'wa-4',
    category: 'workplace_adjustments',
    title: 'Adapt your physical workspace',
    summary: 'Small ergonomic and environmental changes reduce pain, fatigue, and cognitive load.',
    body: `Post-treatment bodies often need different setups. Common adjustments:

• A supportive chair with lumbar support and adjustable armrests
• A footrest to reduce circulation issues (especially after chemo)
• A second monitor to reduce head/neck strain
• Task lighting to reduce eye fatigue
• Noise-canceling headphones for concentration
• A standing desk option for lymphedema or circulation
• A small heater or fan — temperature regulation is often affected

Most of these are inexpensive and, under the ADA, reasonable to request. Document what helps and what doesn't; you may need to iterate.`,
    expert: 'Priya Anand',
    title_expert: 'HR Consultant & ADA Specialist',
    readTime: '3 min read',
  },

  // -------- Emotional Readiness --------
  {
    id: 'er-1',
    category: 'emotional_readiness',
    title: "You don't have to feel 'ready' to return",
    summary: "Waiting for full confidence often delays return indefinitely. Small, structured steps build confidence faster than reflection alone.",
    body: `Many survivors describe a paralyzing loop: "I'll go back when I feel ready" — but readiness doesn't arrive on its own. Confidence is built through small acts, not by waiting.

Start with low-stakes contact: a coffee with a former colleague, a brief email to your manager, a visit to the office building on a quiet day. Each small step generates evidence that you can do this.

Name the fear specifically. "I'm scared" is harder to work with than "I'm afraid I'll cry in a meeting" or "I'm worried I've lost my professional edge." Once named, most fears become smaller and more manageable.`,
    expert: 'Dr. Elena Ruiz',
    title_expert: 'Clinical Psychologist, PhD',
    readTime: '3 min read',
  },
  {
    id: 'er-2',
    category: 'emotional_readiness',
    title: 'Managing the "why me?" spiral at work',
    summary: 'Grief and anger show up unexpectedly at work. Have a plan for what to do when they hit.',
    body: `A colleague complains about a small stressor. A team meeting stretches too long. Suddenly you're flooded with anger, sadness, or a wave of "you have no idea what I've been through." This is normal — and it will pass.

Build a small toolkit for these moments:
• A pre-planned 5-minute exit ("I need to grab water") that lets you reset
• A grounding technique — name 5 things you can see, 4 you can touch, 3 you can hear
• A text buddy — one person who understands and can respond quickly
• A short walk outside, even a lap around the parking lot

You don't owe anyone an explanation. "I need a moment" is a complete sentence.`,
    expert: 'Dr. Elena Ruiz',
    title_expert: 'Clinical Psychologist, PhD',
    readTime: '3 min read',
  },
  {
    id: 'er-3',
    category: 'emotional_readiness',
    title: 'Rebuilding professional identity after treatment',
    summary: "Cancer often shifts what work means to you. That shift is real — and it's an opportunity, not a problem.",
    body: `Many survivors return to find that the ambitions they had before treatment no longer fit. The 60-hour weeks feel unthinkable. The promotion track feels less important. This is one of the most common — and least discussed — aspects of survivorship.

Give yourself permission to reassess without deciding immediately. Ask:
• What parts of my work still energize me?
• What did I do out of obligation that I'd like to release?
• What would "enough" look like for me now?

Some survivors return to the same job with new boundaries. Others pivot careers. Others reduce hours permanently. None of these is failure — each is a legitimate response to a life-changing experience.`,
    expert: 'Dr. Elena Ruiz',
    title_expert: 'Clinical Psychologist, PhD',
    readTime: '4 min read',
  },
  {
    id: 'er-4',
    category: 'emotional_readiness',
    title: 'Handling well-meaning but exhausting questions',
    summary: 'Prepare short, boundaried answers for the "How are you REALLY?" moments.',
    body: `Colleagues will ask how you're doing — often with genuine care, sometimes for hours. You get to decide how much you share.

Have three levels of response ready:

• Short: "I'm doing well, thanks. Excited to be back."
• Medium: "It was a hard year, but I'm feeling stronger. Appreciate you asking."
• Long: Reserved for people you trust, on your terms.

If someone pushes past your comfort level, it's fine to redirect: "I'd rather not get into it at work — but tell me what I've missed on the [project]." Most people take the cue.`,
    expert: 'Dr. Maya Chen',
    title_expert: 'Oncology Social Worker, MSW',
    readTime: '2 min read',
  },

  // -------- Career Conversations --------
  {
    id: 'cc-1',
    category: 'career_conversations',
    title: 'The first conversation with your manager',
    summary: "Come with a plan, not a problem. Managers respond to proposals far better than to open-ended limitations.",
    body: `The single most important framing: you are bringing a plan for a successful return, not asking permission to be less capable.

A strong opening: "I want to talk about coming back well. I've drafted a phased return plan that I think will let me deliver reliably from day one. Can we walk through it together?"

Prepare a one-page document with:
• Your intended return date
• Proposed schedule for the first 4–8 weeks
• Any accommodations you're requesting (be specific)
• What you'll deliver in the first 30/60/90 days

Managers who see a concrete plan tend to become allies. Managers presented with vague concerns often become nervous.`,
    expert: 'Jordan Reyes, Esq.',
    title_expert: 'Employment Attorney',
    readTime: '4 min read',
  },
  {
    id: 'cc-2',
    category: 'career_conversations',
    title: 'How to ask for accommodations without oversharing',
    summary: "You can request accommodations without disclosing your diagnosis. Focus on function, not diagnosis.",
    body: `Under the ADA, you're only required to describe the functional limitations that require accommodation — not the underlying medical condition. Your doctor's note can say "the patient requires reduced hours for 8 weeks" without naming cancer.

Sample language that keeps things functional:
• "I'm managing a medical condition that requires flexible scheduling for the next 3 months."
• "My doctor has recommended reduced hours as I recover from treatment."
• "I need [accommodation] to perform at my best."

You can always share more later if you choose. Once information is out, you can't take it back — start conservative and expand only if it helps you.`,
    expert: 'Jordan Reyes, Esq.',
    title_expert: 'Employment Attorney',
    readTime: '3 min read',
  },
  {
    id: 'cc-3',
    category: 'career_conversations',
    title: 'Talking to your team without making it awkward',
    summary: "Set the tone early. A brief, warm message from you prevents weeks of speculation and eggshell-walking.",
    body: `Colleagues often don't know what to say — so they say nothing, or too much. A short, direct message from you resets the dynamic.

A template that works:

"Hi team — I'm so glad to be back. I dealt with a serious health issue over the past [X] months and I'm now on the mend. I'm returning gradually and may need to lean on you a bit during the first few weeks. I'd love to just get back to the work — please treat me normally, and thank you for the space and support."

Send it before or on your first day. It gives permission for normalcy, acknowledges reality, and asks for what you need without dwelling.`,
    expert: 'Dr. Maya Chen',
    title_expert: 'Oncology Social Worker, MSW',
    readTime: '2 min read',
  },
  {
    id: 'cc-4',
    category: 'career_conversations',
    title: 'Navigating performance reviews after treatment',
    summary: 'Your first review post-return needs context. Set that context before the review, not during it.',
    body: `A standard review that ignores your medical leave can penalize you unfairly. A month before your review, request a pre-review conversation with your manager.

Bring:
• A summary of what you delivered since returning (be specific — projects, outcomes, wins)
• Context about ramp-up (e.g., "I worked 60% of full time in Q3, so my output should be assessed proportionally")
• Any accommodations that are still in place
• Your goals for the next review period

Ask directly: "How will my leave and phased return be factored into this review?" Get the answer in writing if you can. Under the ADA, employers cannot penalize you for using approved medical leave or accommodations.`,
    expert: 'Jordan Reyes, Esq.',
    title_expert: 'Employment Attorney',
    readTime: '4 min read',
  },
  {
    id: 'cc-5',
    category: 'career_conversations',
    title: 'When to escalate beyond your manager',
    summary: 'HR, EAP, and (rarely) an attorney each play a role. Know which one, when.',
    body: `Most return-to-work issues are resolved with your direct manager. When they aren't, know your escalation path.

• HR: Best for formal accommodation requests, policy questions, and documenting concerns. Ask for everything in writing.
• Employee Assistance Program (EAP): Free, confidential counseling and often career coaching. Underused — start here for gray areas.
• Ombudsperson (if your employer has one): Neutral, confidential; good for interpersonal issues.
• Employment attorney: When you're being penalized for taking leave, denied reasonable accommodation, or facing retaliation. Many offer free consultations.
• EEOC: You have 180–300 days (state-dependent) to file a discrimination charge. Don't wait until the last minute.

Document everything — dates, who said what, in writing where possible. A paper trail is your best protection.`,
    expert: 'Jordan Reyes, Esq.',
    title_expert: 'Employment Attorney',
    readTime: '4 min read',
  },
];