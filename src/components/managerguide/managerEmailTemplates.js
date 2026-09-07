// Email templates managers can adapt when checking in with an employee
// returning to work after cancer treatment. Placeholders in [brackets] are
// meant to be replaced before sending. Tone is warm, professional, and
// always leaves the employee in control of what they share.

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
    subject: 'Catching up — [day/time]?',
    body: `Hi [Employee Name],

I'd like to set up a regular, informal check-in so we can stay connected as you settle back in — would [day/time] work as a standing slot?

There's no agenda to prep. It's just space for you to tell me how things are going, flag anything that feels off, and let me know where I can help. We can keep it to 15–20 minutes and adjust anytime.

If that time doesn't work, just send me a couple of options that fit your week.

Thanks,
[Your Name]`,
  },
  {
    id: 'midweek_checkin',
    category: 'check_in',
    title: "Midweek check-in — no reply needed",
    when_to_use: 'A short, no-reply-needed pulse check during the first few weeks back.',
    subject: 'Just checking in — no reply needed',
    body: `Hi [Employee Name],

Wanted to drop a quick note to see how the week is shaping up. No need to reply unless you'd like to — this is just me checking that nothing's piling up on you and that the pace feels manageable so far.

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
- Mark the 1–2 things that genuinely must happen this week.
- Move or pause anything that can wait.
- Reassign [specific task/project] — I can hand that to [colleague] so it's off your desk.

Recovery and a sustainable pace come first; the rest can flex around that. Tell me what feels right and I'll handle the reshuffle.

Thanks,
[Your Name]`,
  },
  {
    id: 'workload_flexibility',
    category: 'workload',
    title: 'Offering schedule flexibility / phased return',
    when_to_use: 'To formalize adjusted hours, remote days, or a phased-return arrangement and signal it is genuinely welcome.',
    subject: "Adjusting your schedule — let's make it official",
    body: `Hi [Employee Name],

I want to put in writing what we talked about so there's no ambiguity: I'm completely supportive of [e.g., a phased return / reduced hours / working from home on appointment days]. This isn't a favor — it's how we set you up to succeed without running on empty.

Proposed arrangement:
- [Days/hours or remote setup]
- Review date: [date] — we'll check how it's working and adjust.

If anything about this feels off, or your needs shift week to week, tell me and we'll revise. Your wellbeing is the priority here, not the schedule.

Best,
[Your Name]`,
  },
  {
    id: 'deadline_relief',
    category: 'workload',
    title: 'Relieving deadline pressure',
    when_to_use: "When a deadline is unrealistic given the employee's current capacity and you want to remove the pressure yourself.",
    subject: "Moving the [project] deadline — you're cleared",
    body: `Hi [Employee Name],

I'm pushing the [project name] deadline from [old date] to [new date]. I want to take that pressure off your shoulders rather than have you carry it silently.

This isn't a reflection of your work — it's me making sure the timeline matches where things actually are. [Colleague] will handle [piece] in the meantime, and you can pick it back up when you're ready.

If you'd rather keep a smaller scope and hit the original date, we can talk about that too. Either way, no deadline here is worth your health.

Thanks,
[Your Name]`,
  },
  {
    id: 'welcome_back',
    category: 'return',
    title: 'Welcome back (first day)',
    when_to_use: 'Sent the morning of, or day before, the employee returns — warm, short, no pressure.',
    subject: "Welcome back — glad you're here",
    body: `Hi [Employee Name],

Welcome back. I'm glad you're here, and I want today to be as low-key as you need it to be.

A few things so you're not wondering:
- No meetings are booked for you today unless you asked for them.
- [Colleague] has been handling [project]; I'll catch you up whenever you're ready, no rush.
- Your first 1:1 with me is [day/time] — purely a check-in, nothing to prepare.

If today feels like a lot, tell me and we'll adjust. Glad to have you back.

[Your Name]`,
  },
  {
    id: 'post_appointment',
    category: 'return',
    title: 'Follow-up after a medical appointment',
    when_to_use: 'After a known appointment or treatment day — checking in without prying for medical detail.',
    subject: 'Thinking of you after today',
    body: `Hi [Employee Name],

Just wanted to send a quick note after your appointment today — hoping it went as well as it could.

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

Is it doing what you needed it to do? Is there anything that's still a friction point — a meeting time, a deadline cadence, a task type — that we should look at next?

Nothing here is locked in. If it needs to change, let's change it.

Thanks,
[Your Name]`,
  },
  {
    id: 'hard_week',
    category: 'support',
    title: 'Acknowledging a hard week',
    when_to_use: 'When the employee has had a visibly tough stretch — offering grace without making them explain.',
    subject: 'No pressure this week',
    body: `Hi [Employee Name],

I can see this week has been a heavy one. I just wanted to say: you don't need to push through it to prove anything to me or the team.

If it helps, clear your calendar of anything non-essential, and I'll cover or defer what I can on my end. There's no expectation that you operate at full speed right now — just take the time you need and tell me if there's anything I can move for you.

We'll pick the work back up when you're ready.

[Your Name]`,
  },
];