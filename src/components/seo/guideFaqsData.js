// Authoritative FAQ datasets for the three flagship guides:
// - /ManagerGuide
// - /Accommodations
// - /DisclosureGuide
// Shared between the visible on-page GuideFaqSection component and the
// JSON-LD FAQPage schema in StructuredData.jsx so visible text and schema
// always match 1:1.
import { FAQ_PAGE_FAQS } from './faqPageData';

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

export const CHEMO_BRAIN_FAQS = [
  {
    question: 'What is chemo brain, and how long does it last?',
    answer:
      'Chemo brain is the umbrella term for thinking and memory changes caused by cancer and its treatment. Survivors notice trouble concentrating, slower recall, word-finding gaps, and difficulty multitasking. For most people it eases over weeks to a few months after treatment ends, though some effects can linger for a year or more and can flare on fatigued days.',
  },
  {
    question: 'Is chemo brain a real medical condition or just stress?',
    answer:
      'It is real. Imaging and cognitive studies confirm measurable changes in memory, attention, and processing speed during and after cancer treatment. Stress and poor sleep can make it worse, but the underlying cognitive changes are a documented effect of cancer treatment, not a personal failing or a sign of aging.',
  },
  {
    question: 'Can I get workplace accommodations for chemo brain under the ADA?',
    answer:
      'Yes. Under the Americans with Disabilities Act (ADA), cancer-related cognitive impairment is treated as a covered disability because it can substantially limit concentration and thinking. Reasonable accommodations can include written instructions and meeting summaries, permission to record meetings, a prioritized top deliverables list, protected focus blocks, a quieter workspace, and flexible start times or short rest breaks.',
  },
  {
    question: 'Do I have to tell my employer I have cancer to get help with chemo brain?',
    answer:
      'No. You do not need to share your diagnosis with coworkers or your direct supervisor. A short note from your healthcare provider confirming a medical condition that affects concentration is enough to start the ADA interactive process, and medical documentation is typically routed through HR and kept in a confidential file separate from your personnel record.',
  },
  {
    question: 'What are the best strategies to manage chemo brain at work?',
    answer:
      'Single-task in short focus blocks with notifications off, write a bullet recap after every meeting, tackle demanding work during your clearest hours (often the morning), ask to record meetings for later review, and protect brief rest breaks. Pacing your workload around your energy curve usually helps more than pushing through.',
  },
  {
    question: 'How is chemo brain different from normal cancer fatigue?',
    answer:
      'Fatigue is a drain of physical and mental energy, while chemo brain specifically affects thinking and memory. They often appear together and can feed each other, but they are distinct. Tracking daily energy and mood helps you spot the days when cognitive fog is worst so you can plan demanding tasks around it.',
  },
  {
    question: 'Can chemo brain affect my performance review or get me fired?',
    answer:
      'An employer cannot legally fire, demote, or penalize you because of cancer-related cognitive changes, nor for requesting ADA accommodations or taking protected leave. If your role is evaluated under an adjusted schedule or modified duties, your review should reflect that agreed scope. Keep your accommodation requests and agreed adjustments in writing.',
  },
  {
    question: 'How can I explain chemo brain to coworkers without oversharing?',
    answer:
      'Use functional, work-focused language: "I am managing a medical condition that sometimes affects my focus, so I am following a few adjustments to stay on track." You do not have to name cancer. Mentioning the practical adjustments (like written follow-ups or fewer context switches) is usually enough to set expectations without disclosing your diagnosis.',
  },
];

export const LEGAL_RIGHTS_FAQS = [
  {
    question: 'What is the difference between the ADA and FMLA for cancer survivors?',
    answer:
      'The Family and Medical Leave Act (FMLA) provides up to 12 weeks of job-protected unpaid leave per year (taken continuously or intermittently) at employers with 50+ employees within 75 miles, provided you have worked there 12 months and 1,250 hours. The Americans with Disabilities Act (ADA) applies to employers with 15+ employees from day one of employment, prohibits disability discrimination, and requires reasonable workplace accommodations—including schedule flexibility, remote work, or additional leave after FMLA runs out.',
  },
  {
    question: 'Can my employer fire me while I am in cancer treatment or on FMLA leave?',
    answer:
      'An employer cannot legally fire, demote, or retaliate against you because of a cancer diagnosis, because you took protected FMLA leave, or because you requested ADA accommodations. While FMLA does not shield an employee from a legitimate, company-wide layoff unrelated to health, terminating an employee due to medical leave or disability violates federal law.',
  },
  {
    question: 'What happens when my 12 weeks of FMLA leave run out and I still need recovery time?',
    answer:
      'Under EEOC guidance on the ADA, additional unpaid medical leave for a definite recovery period—or a part-time phased return-to-work schedule—can qualify as a reasonable accommodation under the ADA unless the employer can prove undue hardship.',
  },
  {
    question: 'How does COBRA work if I leave my job during or after cancer treatment?',
    answer:
      'COBRA allows employees at companies with 20 or more workers to continue their exact employer-sponsored health insurance plan for 18 months (and up to 29 months if determined disabled by Social Security) after leaving a job or dropping below full-time hours. You have 60 days from the notice date to elect COBRA or compare Marketplace plans under the Affordable Care Act (ACA), which cannot deny coverage or charge more for pre-existing cancer history.',
  },
  {
    question: 'What should I do if I believe my employer discriminated against me because of cancer?',
    answer:
      'Save copies of your performance reviews, accommodation requests, doctor letters, and emails in a personal folder outside your work account. Contact the U.S. Equal Employment Opportunity Commission (EEOC) or your state fair-employment agency—federal ADA discrimination charges generally must be filed within 180 to 300 days of the violation.',
  },
];

export const ACCOMMODATIONS_GUIDE_FAQS_ES = [
  {
    question: '¿Está cubierto el cáncer como discapacidad para adaptaciones laborales bajo la ley ADA?',
    answer:
      'Sí. Bajo la Ley de Estadounidenses con Discapacidades (ADA) a nivel federal, que cubre a empleadores con 15 o más trabajadores, el cáncer está reconocido como una discapacidad calificada porque limita el crecimiento celular normal y actividades importantes de la vida. Además, muchas leyes estatales protegen a empleados en empresas aún más pequeñas.',
  },
  {
    question: '¿Cuáles son las adaptaciones laborales más comunes para sobrevivientes de cáncer?',
    answer:
      'Las adaptaciones más solicitadas y aprobadas incluyen horarios flexibles de entrada y salida, licencia intermitente para citas de oncología y análisis, trabajo remoto o híbrido temporal (especialmente si hay bajas defensas o fatiga severa), regreso gradual de medio tiempo a tiempo completo, instrucciones por escrito para la neblina mental ("quimiocerebro"), equipo ergonómico o límites para levantar peso por neuropatía o cirugía, y pausas breves de descanso.',
  },
  {
    question: '¿Tengo que mencionar las palabras "ADA" o "adaptación razonable" al hacer mi solicitud?',
    answer:
      'Legalmente no es obligatorio usar palabras técnicas: según la Comisión para la Igualdad de Oportunidades en el Empleo (EEOC), basta con informar que necesitas un ajuste en el trabajo debido a una condición médica. Sin embargo, presentar una solicitud por escrito que mencione explícitamente "adaptaciones razonables bajo la ADA" crea un respaldo formal e inicia la obligación legal del empleador de participar en el proceso interactivo.',
  },
  {
    question: '¿Debo decirle a mi jefe que tengo cáncer para obtener una adaptación bajo la ADA?',
    answer:
      'No necesitas revelar tu diagnóstico específico de cáncer a tus compañeros ni siquiera a tu supervisor directo si tu empresa gestiona la documentación médica a través de Recursos Humanos. La carta de tu médico solo necesita confirmar que tienes una condición médica cubierta, describir tus limitaciones funcionales (por ejemplo, resistencia física, inmunidad o concentración) e indicar los ajustes laborales necesarios.',
  },
  {
    question: '¿Qué es el "proceso interactivo" de la ADA y cuánto tiempo toma?',
    answer:
      'El proceso interactivo es un diálogo colaborativo entre tú y tu empleador (generalmente Recursos Humanos y tu supervisor) para revisar las adaptaciones solicitadas y acordar soluciones eficaces. El empleador debe responder con prontitud. Con frecuencia se acuerda un periodo de prueba de 30, 60 o 90 días con una fecha de revisión para ajustar el plan según avance tu recuperación.',
  },
  {
    question: '¿Puede mi empleador negar mi solicitud de adaptación laboral?',
    answer:
      'Un empleador solo puede negar una adaptación razonable si demuestra que causa una "dificultad excesiva" (undue hardship, es decir, una dificultad o gasto significativo en relación con los recursos de la empresa) o si elimina una función esencial del puesto. Incluso si tu primera opción no es viable, el empleador está obligado por ley a explorar alternativas eficaces contigo.',
  },
  {
    question: '¿Puedo solicitar adaptaciones meses o años después de haber terminado el tratamiento contra el cáncer?',
    answer:
      'Sí. Los efectos secundarios a largo plazo o tardíos del tratamiento —como la fatiga crónica relacionada con el cáncer, la neuropatía periférica, el linfedema, los cambios cognitivos y los efectos de la terapia hormonal— siguen estando protegidos por la ADA mucho después de finalizar la quimioterapia, la radioterapia o la cirugía.',
  },
  {
    question: '¿Qué debe incluir la carta de apoyo de mi oncólogo o médico?',
    answer:
      'Una carta médica eficaz se redacta en hoja membretada de la clínica e incluye: (1) confirmación de que estás bajo atención médica por una condición que afecta funciones específicas, (2) una lista clara de las adaptaciones laborales recomendadas, (3) confirmación de que estos ajustes te permiten cumplir con las funciones esenciales de tu puesto y (4) una duración estimada (por ejemplo, 3 o 6 meses con revisión periódica).',
  },
];

export const DISCLOSURE_GUIDE_FAQS_ES = [
  {
    question: '¿Estoy legalmente obligado/a a decirle a mi empleador que tengo cáncer?',
    answer:
      'No. En los Estados Unidos no tienes ninguna obligación legal de revelar un diagnóstico de cáncer a tu empleador, supervisor ni compañeros. Si no necesitas licencia médica ni adaptaciones laborales, no tienes que compartir nada. Si solicitas licencia FMLA o adaptaciones bajo la ADA, solo debes entregar a Recursos Humanos una certificación médica sobre tus limitaciones funcionales y los ajustes que necesitas.',
  },
  {
    question: '¿Debo hablar primero con Recursos Humanos o con mi jefe directo?',
    answer:
      'Si tu prioridad es asegurar tu protección legal, tramitar la licencia FMLA o solicitar adaptaciones formales bajo la ADA manteniendo reservados tus detalles clínicos, habla primero con Recursos Humanos. RR. HH. está obligado por ley a guardar tu documentación médica en un expediente confidencial separado. Luego podrás acordar qué información puramente operativa (como tu horario) debe conocer tu supervisor.',
  },
  {
    question: '¿Cómo puedo pedir adaptaciones laborales sin mencionar la palabra cáncer?',
    answer:
      'Utiliza un lenguaje funcional y enfocado en el trabajo en lugar de etiquetas médicas. Por ejemplo: "Estoy atendiendo una condición médica bajo el cuidado de mi doctor. Para desempeñar mi puesto de manera eficaz durante mi tratamiento y recuperación, mi médico recomienda trabajar de forma remota tres días por semana y contar con flexibilidad de horario para citas médicas".',
  },
  {
    question: '¿Puede Recursos Humanos compartir mi diagnóstico de cáncer con mi supervisor o compañeros?',
    answer:
      'No sin tu consentimiento. Bajo las reglas de confidencialidad de la ADA, la información médica entregada para una adaptación o licencia debe mantenerse confidencial. A los supervisores solo se les puede informar sobre las restricciones laborales necesarias y las adaptaciones aprobadas, nunca sobre tu diagnóstico subyacente.',
  },
  {
    question: '¿Tengo que revelar que tuve cáncer durante una entrevista de trabajo?',
    answer:
      'No. Bajo la ley ADA, los empleadores tienen prohibido hacer preguntas sobre tu historial médico, discapacidades o licencias médicas previas antes de realizar una oferta condicional de empleo. Si tienes una pausa en tu currículum por el tratamiento, basta con explicar que tomaste una pausa planificada por motivos personales o de salud ya resueltos y que estás listo/a para reincorporarte por completo.',
  },
  {
    question: '¿Qué pasa si necesito adaptaciones después de recibir una oferta de empleo?',
    answer:
      'Puedes esperar a recibir la oferta formal por escrito —o incluso a haber iniciado en el puesto— antes de solicitar adaptaciones razonables para tus tareas diarias. Un empleador no puede retirar legalmente una oferta de trabajo por el hecho de que tengas antecedentes de cáncer o solicites una adaptación razonable.',
  },
  {
    question: '¿Por qué es tan importante dar seguimiento por escrito después de hablar con RR. HH. o con mi jefe?',
    answer:
      'Un correo breve enviado el mismo día crea un registro con fecha y hora de que notificaste a tu empleador sobre una necesidad médica protegida y solicitaste adaptaciones o licencia. Si más adelante ocurre un malentendido, un cambio de jefe o una evaluación injusta, ese respaldo escrito es tu mejor protección legal.',
  },
  {
    question: '¿Qué puedo responder si mis compañeros hacen preguntas médicas incómodas o invasivas?',
    answer:
      'Prepara de antemano una frase breve y amable para marcar tu límite sin sentirte incómodo/a. Por ejemplo: "Te agradezco mucho que preguntes por mí. Prefiero mantener los detalles médicos en privado para poder enfocarme en mis proyectos mientras estoy aquí, pero todo va avanzando bien".',
  },
];

export const COMMUNITY_GUIDELINES_FAQS = [
  {
    question: 'Who can read and post in the Community Forum?',
    answer:
      'The forum is private to signed-in members. Discussions are not visible to anyone who is not signed in, and they are not indexed by search engines. Creating an account is free, and once you are signed in you can read every topic, post a question, and reply to others.',
  },
  {
    question: 'Can I post or reply anonymously?',
    answer:
      'Yes. Choose the anonymous option when you post or reply and your display name will show as "Anonymous" to everyone else in the community. Anonymous posts are treated exactly like named ones. In our own records an anonymous post still belongs to your account so we can act on a report or a safety concern, but that link is never shown to other members.',
  },
  {
    question: 'Can I share or screenshot someone else’s post outside the forum?',
    answer:
      'No, not without the author’s permission. Members share candid details about their health, their employers, and their colleagues on the understanding that the room is private. Ask the author first, and never include screenshots or names alongside a quote.',
  },
  {
    question: 'Can I ask for medical or legal advice in the forum?',
    answer:
      'You can ask for peer experience, and members can describe what worked for them. You should not rely on the forum for medical or legal advice. For anything clinical, talk with your oncology team. For anything legal, speak with a qualified attorney or legal aid service — the Legal & Policy Hub and the Legal Rights Advisor are good starting points.',
  },
  {
    question: 'What happens if a post breaks the guidelines?',
    answer:
      'A moderator may edit or remove the post, close the thread, or send a private reminder about the guidelines. Accounts that repeatedly cause harm can have their community access paused or permanently removed. Posts that put a member at risk are removed first and reviewed afterwards.',
  },
  {
    question: 'How do I report a post that feels harmful or off-topic?',
    answer:
      'Use the Contact page and include the post title, its topic, and what felt wrong. Reports are confidential: the author is never told who reported the post. If someone appears to be in immediate danger, the Emergency Contacts page lists free 24/7 crisis and cancer support lines you can share with them.',
  },
];

export const GUIDE_FAQ_BY_PATH = {
  '/accommodations': ACCOMMODATIONS_GUIDE_FAQS,
  '/disclosureguide': DISCLOSURE_GUIDE_FAQS,
  '/chemobrainguide': CHEMO_BRAIN_FAQS,
  '/legalrights': LEGAL_RIGHTS_FAQS,
  '/faq': FAQ_PAGE_FAQS,
  '/communityguidelines': COMMUNITY_GUIDELINES_FAQS,
  '/accommodationses': ACCOMMODATIONS_GUIDE_FAQS_ES,
  '/disclosureguidees': DISCLOSURE_GUIDE_FAQS_ES,
};