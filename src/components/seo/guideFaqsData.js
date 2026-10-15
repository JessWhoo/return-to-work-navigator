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

export const GENERAL_SITE_FAQS = [
  {
    question: 'How do I start planning my return to work after cancer treatment?',
    answer:
      'Begin by consulting your oncology team about your stamina, immunity, and any physical or cognitive restrictions. Next, review your workplace protections under the ADA and FMLA, identify 2 to 4 practical accommodations (such as a phased part-time schedule or hybrid work), and put your return plan and accommodation request in writing before your first day back.',
  },
  {
    question: 'What accommodations can I request when returning to work after cancer?',
    answer:
      'Common ADA accommodations include a gradual part-time-to-full-time return schedule, flexible start times, intermittent leave for oncology appointments and scans, remote or hybrid work, written task summaries for chemo brain, scheduled rest breaks for cancer-related fatigue, and ergonomic or lifting modifications.',
  },
  {
    question: 'How much do I have to tell my employer and coworkers about my cancer diagnosis?',
    answer:
      'You control what you share. To receive ADA accommodations or FMLA leave, you only need to provide HR with medical certification of your functional limitations and needed adjustments—you never have to share your diagnosis with coworkers or explain oncology details to your team.',
  },
  {
    question: 'How do I manage cancer-related fatigue and "chemo brain" at work?',
    answer:
      'Combine workplace accommodations with energy pacing: schedule high-focus work during your peak morning energy window, take brief 10-to-15-minute restorative breaks before exhaustion hits, ask for written follow-ups after meetings, and use a single prioritized daily task list.',
  },
  {
    question: 'Can my employer fire me because of my cancer diagnosis?',
    answer:
      'No. Under the federal Americans with Disabilities Act (ADA) and state fair-employment laws, employers cannot fire, demote, or retaliate against you because you have or had cancer, provided you can perform your essential job duties with or without reasonable accommodations.',
  },
];

export const MANAGER_GUIDE_FAQS_ES = [
  {
    question: '¿Qué debe decir un gerente cuando un empleado le informa que tiene cáncer?',
    answer:
      'Comienza con empatía sincera y quita presión de inmediato: di "Lamento mucho que estés pasando por esto y te agradezco tu confianza. Tu salud es lo primero, y juntos veremos cómo organizar el trabajo". Evita frases hechas como "todo pasa por algo", no compares su caso con el de un familiar y pregúntale a quién (si es que a alguien) autoriza informar.',
  },
  {
    question: '¿Puede un gerente contarle al equipo o a otros jefes sobre el diagnóstico de cáncer de un empleado?',
    answer:
      'No. Bajo la Ley de Estadounidenses con Discapacidades (ADA), la información médica de un empleado es estrictamente confidencial. Un gerente o representante de Recursos Humanos no puede compartir el diagnóstico con compañeros, clientes ni otros líderes sin el permiso explícito del empleado. Si es necesario redistribuir tareas, solo se debe informar que el empleado cuenta con un ajuste de horario o licencia aprobada.',
  },
  {
    question: '¿El cáncer califica como una discapacidad bajo la ley ADA aunque el empleado esté en remisión?',
    answer:
      'Sí. Bajo la Ley de Enmiendas a la ADA (ADAAA), el cáncer casi siempre califica como una discapacidad porque limita sustancialmente el crecimiento celular normal. La protección legal aplica durante el tratamiento activo, durante la recuperación y también cuando el cáncer está en remisión o existe un antecedente de cáncer.',
  },
  {
    question: '¿Cómo funcionan juntas la licencia FMLA y la ley ADA para un empleado con cáncer?',
    answer:
      'En empleadores cubiertos (50 o más empleados en un radio de 75 millas), los empleados elegibles pueden tomar hasta 12 semanas de licencia sin sueldo con protección del puesto bajo la FMLA, ya sea de forma continua o intermitente para sesiones de quimioterapia, radioterapia o estudios. Cuando se agota la FMLA —o si el empleado aún no cumple el año de antigüedad para FMLA—, la ley ADA (15 o más empleados) exige considerar adaptaciones laborales razonables, que pueden incluir licencia médica adicional, regreso gradual a medio tiempo o teletrabajo.',
  },
  {
    question: '¿Cómo es un horario de regreso gradual al trabajo después del tratamiento contra el cáncer?',
    answer:
      'Un regreso gradual típico comienza con el 40 % al 50 % de la jornada habitual (por ejemplo, tres medios días por semana o mañanas de cuatro horas cuando hay mayor energía) y aumenta un 10 % a 20 % cada una o dos semanas según la tolerancia física y la indicación médica. Incluir un día de descanso a mitad de semana (como los miércoles) y teletrabajo temporal mejora significativamente la recuperación y retención.',
  },
  {
    question: '¿Cómo debe evaluar un gerente el desempeño de un empleado en tratamiento o recuperación de cáncer?',
    answer:
      'Evalúa al empleado de manera justa con base en el trabajo acordado bajo su horario ajustado o funciones modificadas; nunca lo penalices por haber tomado licencia protegida bajo la FMLA ni por utilizar adaptaciones de la ADA. Deja todos los ajustes de metas y plazos por escrito.',
  },
  {
    question: '¿Qué documentación médica puede pedir Recursos Humanos para una adaptación bajo la ADA?',
    answer:
      'Recursos Humanos puede solicitar una carta breve del médico tratante que confirme que el empleado tiene una condición médica cubierta, describa las limitaciones funcionales en el trabajo (como fatiga, límite para levantar peso o defensas bajas) y recomiende las adaptaciones y su duración estimada. El empleador no puede exigir el expediente oncológico completo ni pruebas genéticas.',
  },
  {
    question: '¿Cómo apoyar a un empleado que experimenta "quimiocerebro" o fatiga relacionada con el cáncer?',
    answer:
      'Los ajustes prácticos de bajo costo marcan una gran diferencia: envía resúmenes breves por escrito después de las reuniones, permite grabar reuniones como apoyo de memoria, ayuda a priorizar las 2 o 3 entregas más importantes de la semana, protege bloques de concentración sin interrupciones y permite flexibilidad de horario o pausas breves de descanso.',
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

export const GUIDE_FAQ_BY_PATH = {
  '/managerguide': MANAGER_GUIDE_FAQS,
  '/accommodations': ACCOMMODATIONS_GUIDE_FAQS,
  '/disclosureguide': DISCLOSURE_GUIDE_FAQS,
  '/legalrights': LEGAL_RIGHTS_FAQS,
  '/faq': GENERAL_SITE_FAQS,
  '/managerguidees': MANAGER_GUIDE_FAQS_ES,
  '/accommodationses': ACCOMMODATIONS_GUIDE_FAQS_ES,
  '/disclosureguidees': DISCLOSURE_GUIDE_FAQS_ES,
};