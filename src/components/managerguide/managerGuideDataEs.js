import { MessageCircleHeart, Sliders, HeartHandshake } from 'lucide-react';

const p = (text) => ({ type: 'p', text });
const h = (text) => ({ type: 'h', text });
const list = (items, variant = 'plain') => ({ type: 'list', items, variant });
const quote = (text) => ({ type: 'quote', text });

export const SUPPORT_TIPS_ES = [
  {
    id: 'communication',
    icon: MessageCircleHeart,
    title: 'Comunicación Empática',
    intro: 'Tus primeras palabras marcan la pauta de toda la experiencia de regreso al trabajo.',
    tips: [
      'Agradece la confianza del empleado sin pedir detalles médicos.',
      'Pregunta: "¿Qué necesitas de mí esta semana?" en lugar de decir "Avísame si necesitas algo".',
      'Acuerda de antemano con qué frecuencia y por qué medio se comunicarán.',
      'Respeta su privacidad: nunca compartas su diagnóstico con el equipo sin permiso explícito.',
    ],
  },
  {
    id: 'flexibility',
    icon: Sliders,
    title: 'Flexibilidad Práctica (ADA y FMLA)',
    intro: 'Pequeños ajustes en el horario y la carga de trabajo permiten retener a empleados valiosos.',
    tips: [
      'Ofrece un regreso gradual (por ejemplo, 50 % de las horas durante las primeras semanas).',
      'Permite trabajo remoto o híbrido, especialmente si el sistema inmunológico está comprometido.',
      'Envía resúmenes por escrito después de las reuniones para apoyar la memoria ("quimiocerebro").',
      'Protege bloques de tiempo para citas de oncología, análisis y descanso.',
    ],
  },
  {
    id: 'culture',
    icon: HeartHandshake,
    title: 'Cultura de Equipo sin Culpa',
    intro: 'El empleado no debe sentir que su enfermedad es una carga para sus compañeros.',
    tips: [
      'Redistribuye las tareas clave con claridad como un esfuerzo de equipo.',
      'Revisa las metas y plazos para evaluar de manera justa el trabajo acordado.',
      'No excluyas al empleado de proyectos futuros ni asumas lo que puede o no puede hacer: pregúntale.',
      'Programa revisiones periódicas (cada 30 o 60 días) para ajustar las adaptaciones según su recuperación.',
    ],
  },
];

export const MANAGER_GUIDE_SECTIONS_ES = [
  {
    id: 'lo-que-enfrenta',
    title: 'Lo que tu empleado está enfrentando',
    blocks: [
      p('Antes de hablar sobre procedimientos, es fundamental comprender lo que vive un empleado durante y después del tratamiento contra el cáncer:'),
      list([
        'En lo médico: Citas que toman horas, cirugías, sesiones de quimioterapia o radioterapia, efectos secundarios debilitantes y estudios de seguimiento que generan una enorme ansiedad.',
        'En lo cognitivo: El "quimiocerebro" (neblina mental) es real y puede ocurrir incluso sin quimioterapia. Puede afectar la concentración, la memoria a corto plazo y la velocidad para procesar información.',
        'En lo emocional: Miedo, agotamiento profundo e incertidumbre, mientras intenta aparentar que "todo está bien" en el trabajo por temor a parecer poco confiable.',
        'En lo económico: Las facturas médicas se acumulan y el empleado depende de su empleo y de su seguro médico para continuar su tratamiento.',
        'En lo profesional: Temor a perder oportunidades, a recibir malas evaluaciones o a ser reemplazado por no poder rendir al 100 % temporalmente.',
      ]),
      quote('Tu empleado está atravesando una crisis médica mayor. La forma en que respondas determinará si le tiendes un salvavidas o si le sumas una carga más.'),
    ],
  },
  {
    id: 'lo-que-ayuda',
    title: 'Lo que realmente ayuda (10 acciones clave)',
    blocks: [
      h('1. Responde con empatía y sencillez desde el primer momento'),
      p('Cuando un empleado te informa sobre su diagnóstico o necesidad médica, tu primera reacción importa enormemente.'),
      list([
        '"Todo pasa por algo"',
        '"¡Solo tienes que mantenerte positivo!"',
        '"Mi tía tuvo ese mismo cáncer y…"',
        '"Avísame si necesitas algo" (es demasiado vago y deja toda la carga en el empleado)',
      ], 'dont'),
      list([
        '"Lamento mucho que estés pasando por esto y te agradezco que confíes en mí."',
        '"Tu salud es lo primero. Vamos a encontrar juntos la forma de organizar el trabajo."',
        '"¿Qué es lo que más te ayudaría en estas próximas dos semanas?"',
      ], 'do'),

      h('2. Inicia una conversación real sobre adaptaciones laborales (Proceso Interactivo de la ADA)'),
      p('No esperes a que el empleado tenga que suplicar ayuda. Ofrece proactivamente revisar opciones como:'),
      list([
        'Horarios flexibles de entrada y salida para citas médicas o fatiga matutina',
        'Opciones temporales de trabajo desde casa (teletrabajo)',
        'Regreso gradual (jornada parcial aumentando progresivamente a tiempo completo)',
        'Pausas breves de descanso durante el día',
        'Redistribución temporal de tareas secundarias o físicas pesadas',
      ]),
      quote('Deja que el empleado guíe la conversación: nadie conoce mejor sus niveles de energía y las recomendaciones de su equipo médico.'),

      h('3. Pon todos los acuerdos por escrito'),
      p('Después de cualquier conversación sobre licencias médicas, horarios o adaptaciones, envía un correo breve confirmando lo acordado.'),
      quote('Ejemplo: "Gracias por reunirte conmigo hoy. Para confirmar nuestro acuerdo: contarás con horario flexible y trabajo remoto los martes y jueves durante las próximas 6 semanas mientras continúas tu recuperación. Durante tus citas médicas, [Nombre] cubrirá las urgencias del proyecto X. Volveremos a conversar el [Fecha] para ver cómo te sientes y ajustar lo necesario."'),

      h('4. No lo obligues a repetir su historia'),
      p('Pregúntale una sola vez: "¿Prefieres que yo coordine los detalles operativos con Recursos Humanos, o prefieres hablar directamente con ellos?" Respeta su decisión.'),

      h('5. Protege estrictamente su confidencialidad médica'),
      p('Bajo la Ley de Estadounidenses con Discapacidades (ADA), la información médica de un empleado es confidencial. No compartas su diagnóstico con el equipo, clientes ni otros líderes sin su autorización explícita.'),

      h('6. Ajusta las expectativas de desempeño con realismo y justicia'),
      list([
        'Prioriza los 2 o 3 entregables esenciales y pospón lo secundario',
        'Envía instrucciones y acuerdos por escrito para apoyar la concentración',
        'Evita asignar proyectos de alta presión durante el tratamiento activo',
        'Evalúa al empleado según las metas ajustadas, nunca penalizando el uso de licencia médica',
      ]),

      h('7. Mantén el contacto sin ser invasivo'),
      p('Un mensaje semanal preguntando "¿Cómo va todo esta semana y qué apoyo necesitas con tu carga de trabajo?" demuestra interés genuino sin invadir su privacidad médica.'),

      h('8. Cubre su trabajo sin generar resentimiento en el equipo'),
      list(['"[Nombre] volvió a faltar hoy, así que nos toca hacer su trabajo."'], 'dont'),
      list(['"[Nombre] tiene una ausencia programada. Así es como distribuiremos las prioridades esta semana para apoyarnos como equipo."'], 'do'),

      h('9. Conoce y respeta las leyes federales (ADA y FMLA)'),
      p('La ley FMLA otorga hasta 12 semanas de licencia sin goce de sueldo con protección del puesto (continua o intermitente) en empleadores elegibles (50+ empleados). La ley ADA (15+ empleados) protege contra la discriminación y exige adaptaciones razonables, incluyendo horarios flexibles, teletrabajo o licencia médica adicional.'),
    ],
  },
  {
    id: 'errores-comunes',
    title: 'Errores comunes que debes evitar',
    blocks: [
      h('Error #1: Tratar al empleado como si fuera de cristal'),
      p('Muchos sobrevivientes desean trabajar porque el trabajo les brinda normalidad, propósito e ingresos. No decidas por ellos qué proyectos pueden asumir: pregúntales y confía en su respuesta.'),
      h('Error #2: Asumir que cuando termina el tratamiento "ya todo volvió a la normalidad"'),
      p('La fatiga relacionada con el cáncer, la neuropatía y los cambios cognitivos suelen durar meses después de la última sesión de quimioterapia o radioterapia. El regreso debe ser gradual.'),
      h('Error #3: Desaparecer por incomodidad'),
      p('El silencio de un jefe genera ansiedad y temor al despido. No necesitas ser terapeuta; solo necesitas estar presente, ser claro y actuar con humanidad.'),
    ],
  },
  {
    id: 'el-regreso',
    title: 'Cómo estructurar un regreso exitoso al trabajo',
    blocks: [
      p('Las primeras cuatro semanas de regreso son críticas para la salud y la retención del empleado:'),
      list([
        'Diseña un horario escalonado (por ejemplo: Semana 1–2 al 50 %, Semana 3–4 al 75 %, Semana 5 al 100 %)',
        'Considera un día de descanso a mitad de semana (como los miércoles) para evitar el agotamiento acumulado',
        'Establece reuniones breves de 15 minutos cada semana para revisar prioridades y niveles de energía',
        'Documenta los ajustes y fija una fecha de revisión a los 30, 60 y 90 días',
      ], 'do'),
    ],
  },
];

export const MANAGER_CHECKLIST_ES = [
  {
    phase: '1. Cuando el empleado comparte la noticia',
    items: [
      'Expresar empatía genuina y agradecer su confianza sin pedir detalles clínicos',
      'Preguntar quién (si es que alguien) tiene autorización para conocer la situación',
      'Conectar al empleado con Recursos Humanos para información sobre FMLA, ADA y beneficios',
      'Confirmar por escrito los primeros ajustes de horario o cobertura inmediata',
    ],
  },
  {
    phase: '2. Durante el tratamiento o licencia médica',
    items: [
      'Acordar la frecuencia y el canal de comunicación preferido durante la ausencia',
      'Redistribuir la carga de trabajo del equipo de manera clara y justa',
      'Mantener la información médica en estricta confidencialidad (separada del expediente laboral)',
      'Preparar un resumen sencillo de novedades antes de su fecha de regreso',
    ],
  },
  {
    phase: '3. Planificación antes del primer día de regreso',
    items: [
      'Acordar las adaptaciones razonables (horario gradual, teletrabajo, pausas de descanso)',
      'Definir las 2 o 3 prioridades principales para las primeras dos semanas',
      'Confirmar con el empleado qué mensaje desea que se comparta con el equipo a su regreso',
      'Asegurar que su estación de trabajo, accesos y equipo ergonómico estén listos',
    ],
  },
  {
    phase: '4. Primeros 30 a 90 días de regreso',
    items: [
      'Realizar reuniones breves semanales para evaluar la carga de trabajo y la energía',
      'Enviar resúmenes por escrito después de las reuniones para facilitar el seguimiento',
      'Proteger el horario de citas médicas y análisis de seguimiento sin penalización',
      'Revisar y actualizar el plan de adaptaciones a los 30, 60 y 90 días',
    ],
  },
];

export const MANAGER_EMAIL_TEMPLATES_ES = [
  {
    id: 'es-initial-support',
    title: 'Confirmación de apoyo tras la conversación inicial',
    when_to_use: 'Envíalo el mismo día o al día siguiente de que el empleado te informe sobre su situación médica.',
    subject: 'Gracias por conversar conmigo hoy — Cuenta con todo nuestro apoyo',
    body: `Hola [Nombre del empleado],

Gracias por la confianza de conversar conmigo hoy. Quiero reiterarte que tu salud y tu bienestar son la prioridad número uno, y que estamos aquí para apoyarte en cada etapa.

Como acordamos:
• Mantendré esta información en total confidencialidad.
• [Recursos Humanos / Nombre] te compartirá los detalles sobre tus opciones de licencia (FMLA) y adaptaciones laborales (ADA).
• Por ahora, ajustaremos [mencionar ajuste inmediato, ej. tus entregas de esta semana / tu horario de los jueves] para que puedas enfocarte en tus próximas citas médicas.

Por favor, no dudes en decirme si hay algo adicional que podamos ajustar desde ahora.

Un saludo cordial,
[Tu Nombre]`,
  },
  {
    id: 'es-return-plan',
    title: 'Bienvenida y plan de regreso gradual (Primera semana)',
    when_to_use: 'Envíalo unos días antes de la fecha programada de regreso al trabajo.',
    subject: 'Plan para tu regreso la próxima semana — ¡Qué gusto tenerte de vuelta!',
    body: `Hola [Nombre del empleado],

Nos alegra mucho darte la bienvenida de regreso el [Fecha]. Para que tu transición sea tranquila y sostenible, preparé este resumen de lo que acordamos para tus primeras semanas:

• Horario de regreso gradual: [ej. Lunes, martes y jueves de 9:00 a.m. a 1:00 p.m. desde casa durante las primeras dos semanas].
• Prioridades iniciales: Durante la primera semana solo nos enfocaremos en ponerte al día con [Proyecto A] y revisar tu bandeja de entrada a tu propio ritmo.
• Reunión de seguimiento: Agendé 15 minutos el [Día] para ver cómo te sientes con el ritmo de trabajo y hacer cualquier ajuste necesario.

No tienes que responder a este correo antes de tu primer día. ¡Nos vemos el [Día]!

Saludos,
[Tu Nombre]`,
  },
];