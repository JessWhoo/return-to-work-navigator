import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import PageHeader from '@/components/brand/PageHeader';
import GuideFaqSection from '@/components/seo/GuideFaqSection';
import GuideLanguageSwitch from '@/components/seo/GuideLanguageSwitch';
import { DISCLOSURE_GUIDE_FAQS_ES } from '@/components/seo/guideFaqsData';
import useSEO from '@/hooks/useSEO';
import {
  Shield, Users, MessageSquareQuote, Copy, Check, RotateCcw,
  CheckCircle2, ArrowRight, Scale, ClipboardList, FileCheck, ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

const STORAGE_KEY = 'disclosure_guide_checked_es_v1';

const DISCLOSURE_LEVELS_ES = [
  {
    level: '1. Divulgación Funcional (Solo para Adaptaciones)',
    whoSeesIt: 'Únicamente Recursos Humanos o el Administrador de Licencias',
    whenToChoose:
      'Ideal cuando deseas protección legal (adaptaciones bajo la ADA o licencia FMLA) manteniendo tu diagnóstico de cáncer totalmente privado frente a tu jefe y compañeros.',
    whatYouSay:
      'Informas únicamente que tienes una condición médica bajo cuidado médico y entregas una carta de tu doctor indicando las limitaciones funcionales y los ajustes recomendados (ej. teletrabajo temporal o flexibilidad de horario) sin mencionar la palabra cáncer.',
  },
  {
    level: '2. Divulgación Selectiva (Recursos Humanos + Jefe Directo)',
    whoSeesIt: 'Recursos Humanos y tu supervisor directo (con límites claros de privacidad)',
    whenToChoose:
      'Ideal cuando confías en tu supervisor, necesitas coordinar horarios por tratamientos o estudios frecuentes y deseas mantener al resto del equipo al margen de tus detalles médicos.',
    whatYouSay:
      'Compartes tu calendario general y las adaptaciones necesarias con RR. HH. y tu jefe, aclarando expresamente: "Prefiero mantener mi diagnóstico en privado frente al resto del equipo; por favor refiéranse únicamente a mis ajustes de horario aprobados".',
  },
  {
    level: '3. Divulgación Abierta al Equipo (En Tus Propios Términos)',
    whoSeesIt: 'RR. HH., tu supervisor y los compañeros que tú decidas',
    whenToChoose:
      'Ideal cuando los cambios físicos del tratamiento, una licencia prolongada o una relación cercana con el equipo hacen que compartir la noticia te resulte más cómodo, estableciendo límites claros.',
    whatYouSay:
      'Tú decides si quieres contarlo personalmente o pedirle a tu gerente que comparta un mensaje breve y aprobado por ti que explique cómo se cubrirán las tareas y cómo el equipo puede respetar tu energía.',
  },
];

const DISCLOSURE_SCRIPTS_ES = [
  {
    id: 'es-hr-functional',
    audience: 'Para Recursos Humanos (Solicitar adaptaciones bajo la ADA sin mencionar el cáncer)',
    subject: 'Solicitud de adaptación laboral razonable bajo la ADA',
    script: `Estimado/a [Nombre de Recursos Humanos]:

Le escribo para solicitar formalmente adaptaciones laborales temporales bajo la Ley de Estadounidenses con Discapacidades (ADA) debido a una condición médica que actualmente se encuentra bajo el cuidado de mi médico.

Para continuar desempeñando las funciones esenciales de mi puesto de manera eficaz durante mi tratamiento y recuperación, mi médico recomienda:
• [Adaptación 1, ej. Trabajar de forma remota 3 días por semana]
• [Adaptación 2, ej. Horario flexible los martes por la mañana para asistir a citas médicas]

Adjunto la carta de certificación médica de mi doctor que respalda estas recomendaciones hasta el [Fecha/Plazo]. Por favor, indíqueme los siguientes pasos dentro del proceso interactivo y mantenga esta documentación médica en estricta confidencialidad conforme a las normas de la ADA.

Atentamente,
[Tu Nombre]`,
  },
  {
    id: 'es-manager-direct',
    audience: 'Para tu Supervisor Directo (Compartir diagnóstico + Plan de trabajo)',
    subject: 'Actualización privada y planificación de horario',
    script: `Hola [Nombre del Gerente]:

Gracias por tomarte el tiempo de reunirte conmigo en privado. Quiero comentarte que me han diagnosticado una condición médica [o: cáncer] y estaré recibiendo tratamiento durante los próximos [plazo].

Estoy muy comprometido/a con mi puesto y he trabajado con mi equipo médico para organizar un plan realista de modo que nuestras entregas clave continúen a tiempo. Estoy coordinando con Recursos Humanos [licencia FMLA intermitente / trabajo híbrido temporal / flexibilidad en los días de tratamiento], y preparé una lista de seguimiento para los días en que deba ausentarme.

Por ahora prefiero mantener mi diagnóstico en privado frente al resto del equipo. Con tu apoyo, me gustaría que al equipo solo se le informe que cuento con un ajuste de horario aprobado. Revisemos juntos las prioridades de las próximas dos semanas.

Un saludo cordial,
[Tu Nombre]`,
  },
  {
    id: 'es-coworker-boundary',
    audience: 'Para Compañeros Bienintencionados (Límite amable de privacidad)',
    subject: 'Respuesta en persona, por chat o teléfono',
    script: `"Muchas gracias por preguntar por mí, de verdad valoro mucho tu apoyo. Todo está bien atendido con mis médicos y, mientras estoy en el trabajo, lo que más me ayuda es concentrarme en nuestros proyectos y en la rutina normal en lugar de hablar de temas de salud. ¡Me da mucho gusto estar de vuelta trabajando contigo en [Nombre del Proyecto]!"`,
  },
  {
    id: 'es-job-interview',
    audience: 'En una Entrevista de Trabajo (Explicar una pausa laboral por tratamiento)',
    subject: 'Respuesta verbal sobre un espacio en el currículum',
    script: `"Tomé una pausa médica planificada para atender un tema de salud que ya está resuelto [o: bien controlado]. Durante la etapa final de mi recuperación me mantuve actualizado/a en [habilidad o área profesional], y cuento con autorización médica completa y toda la energía para este puesto. De hecho, esa etapa fortaleció mucho mi capacidad de organización y enfoque en prioridades, y estoy muy entusiasmado/a por aportar eso a su equipo."`,
  },
];

const DISCLOSURE_STEPS_ES = [
  {
    id: 'paso-1',
    icon: Scale,
    title: 'Conoce primero tus protecciones legales',
    summary:
      'Antes de hablar con tu empleador, comprende las leyes que te respaldan. El cáncer casi siempre se considera una discapacidad protegida bajo la ADA, lo que te da derecho a adaptaciones razonables sin discriminación.',
    bullets: [
      'En EE. UU., la ley ADA protege a los empleados con cáncer en empresas de 15 o más empleados.',
      'La ley FMLA otorga hasta 12 semanas de licencia sin sueldo con protección del empleo en empresas elegibles (50+ empleados).',
      'No estás legalmente obligado/a a revelar tu diagnóstico exacto; solo que necesitas una adaptación por motivos médicos.',
      'Las leyes estatales pueden ofrecer protecciones adicionales (licencia médica pagada o cobertura en empresas más pequeñas).',
    ],
    checklistItems: [
      'Comprendo los conceptos básicos de la ADA y la FMLA',
      'Revisé las protecciones adicionales de mi estado',
      'Sé que puedo solicitar adaptaciones sin nombrar mi diagnóstico exacto',
    ],
  },
  {
    id: 'paso-2',
    icon: ClipboardList,
    title: 'Decide qué — y cuánto — deseas compartir',
    summary:
      'La divulgación es tu decisión. Define qué información necesita saber Recursos Humanos, qué necesita saber tu jefe directo y qué prefieres mantener en privado.',
    bullets: [
      'Puedes describir tus necesidades funcionales sin mencionar el cáncer (ej. "una condición médica bajo tratamiento").',
      'Decide si compartirás fechas generales de tratamiento o únicamente los ajustes de horario.',
      'Recuerda que tus compañeros de trabajo no necesitan conocer detalles médicos.',
    ],
    checklistItems: [
      'Decidí mi nivel de divulgación (funcional con RR. HH., selectiva o abierta)',
      'Hice una lista de quién necesita saber qué información operativa',
      'Definí mis límites de privacidad frente a mis compañeros',
    ],
  },
  {
    id: 'paso-3',
    icon: FileCheck,
    title: 'Reúne tu documentación antes de la conversación',
    summary:
      'Contar con respaldo por escrito protege tus derechos y agiliza la aprobación de tus adaptaciones o licencia FMLA.',
    bullets: [
      'Una carta breve de tu médico indicando tus limitaciones funcionales y las adaptaciones recomendadas.',
      'Una lista clara de los ajustes específicos que estás solicitando (teletrabajo, horario gradual, pausas).',
      'Copias de tus evaluaciones de desempeño previas guardadas en tu correo o carpeta personal.',
    ],
    checklistItems: [
      'Tengo la carta de mi médico describiendo mis necesidades laborales',
      'Escribí mi lista de adaptaciones razonables solicitadas',
      'Guardé copias de mis documentos importantes fuera del correo del trabajo',
    ],
  },
  {
    id: 'paso-4',
    icon: ShieldCheck,
    title: 'Da seguimiento por escrito — siempre',
    summary:
      'Después de la reunión con Recursos Humanos o con tu supervisor, envía un correo electrónico resumiendo lo conversado y acordado.',
    bullets: [
      'Envía un correo el mismo día o al día siguiente confirmando los acuerdos.',
      'Enumera las adaptaciones aprobadas, la fecha de inicio y la fecha de revisión (ej. en 30 o 60 días).',
      'Guarda una copia de toda la correspondencia en tu archivo personal.',
    ],
    checklistItems: [
      'Envié un correo de confirmación por escrito después de la reunión',
      'Guardé copia personal de los acuerdos y fechas de revisión',
      'Planifiqué una actividad tranquila de autocuidado para después de la reunión',
    ],
  },
];

export default function DisclosureGuideEs() {
  useSEO({
    title: 'Guía sobre la Divulgación del Cáncer en el Trabajo: Derechos, Privacidad y Guiones',
    description:
      'Guía práctica en español sobre si debes decir en el trabajo que tienes cáncer: privacidad bajo la ADA y la FMLA, diferencias entre RR. HH. y tu jefe, y guiones listos para usar.',
    path: '/DisclosureGuideEs',
  });

  const [checkedItems, setCheckedItems] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCheckedItems(JSON.parse(raw));
    } catch {}
  }, []);

  const toggleItem = (key) => {
    setCheckedItems((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const resetChecklist = () => {
    setCheckedItems([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  const handleCopyScript = async (item) => {
    try {
      await navigator.clipboard.writeText(item.script);
      setCopiedId(item.id);
      toast.success('Guion copiado al portapapeles.');
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      toast.error('No se pudo copiar el guion.');
    }
  };

  const totalItems = DISCLOSURE_STEPS_ES.reduce((sum, s) => sum + s.checklistItems.length, 0);
  const pct = totalItems > 0 ? Math.round((checkedItems.length / totalItems) * 100) : 0;

  return (
    <div lang="es" className="max-w-4xl mx-auto space-y-8 pb-12">
      <PageHeader
        eyebrow="Privacidad Laboral y Comunicación · Edición en Español"
        title="Guía sobre la Divulgación del Cáncer en el Trabajo"
        subtitle="Tú tienes el control sobre qué compartir, con quién y cuándo. Conoce tus derechos de privacidad bajo la ADA y la FMLA y utiliza guiones listos para cada situación."
        actions={
          <GuideLanguageSwitch
            englishPath="/DisclosureGuide"
            spanishPath="/DisclosureGuideEs"
            currentLang="es"
          />
        }
      />

      {/* Section 1: Three Levels of Disclosure */}
      <section aria-labelledby="niveles-divulgacion-heading" className="space-y-4">
        <Card>
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-brand-primary font-heading font-bold">
              <Shield className="h-5 w-5 shrink-0" />
              <span className="text-xs uppercase tracking-wider">Tus Derechos de Privacidad</span>
            </div>
            <h2 id="niveles-divulgacion-heading" className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
              ¿Estás Obligado/a a Decir en tu Trabajo que Tienes Cáncer?
            </h2>
            <p className="text-sm sm:text-base text-brand-text leading-relaxed">
              Bajo las leyes laborales de los Estados Unidos, <strong>nunca estás obligado/a a anunciar un diagnóstico de cáncer a tu jefe ni a tus compañeros de trabajo</strong>. La divulgación no es una decisión de "todo o nada": existen distintos niveles de privacidad. Puedes acceder a toda la protección legal de la <strong>Ley de Estadounidenses con Discapacidades (ADA)</strong> y la <strong>Ley de Ausencia Familiar y Médica (FMLA)</strong> entregando documentación médica funcional a Recursos Humanos mientras mantienes tu diagnóstico específico en reserva.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
              {DISCLOSURE_LEVELS_ES.map((item) => (
                <div
                  key={item.level}
                  className="rounded-brand border border-brand-border bg-brand-background p-5 space-y-2.5 flex flex-col"
                >
                  <h3 className="font-heading text-base font-bold text-brand-text">{item.level}</h3>
                  <p className="text-xs font-semibold text-brand-primary">Quién lo sabe: {item.whoSeesIt}</p>
                  <p className="text-xs text-brand-muted-foreground leading-relaxed">
                    <strong className="text-brand-text">Cuándo elegirlo:</strong> {item.whenToChoose}
                  </p>
                  <p className="text-xs text-brand-muted-foreground leading-relaxed flex-1">
                    <strong className="text-brand-text">Cómo funciona:</strong> {item.whatYouSay}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 2: HR vs. Supervisor vs. Coworkers */}
      <section aria-labelledby="quien-sabe-que-heading" className="space-y-4">
        <Card className="nv-card--muted">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-brand-primary font-heading font-bold">
              <Users className="h-5 w-5 shrink-0" />
              <span className="text-xs uppercase tracking-wider">Reglas de Confidencialidad</span>
            </div>
            <h2 id="quien-sabe-que-heading" className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
              Recursos Humanos vs. Supervisor Directo vs. Compañeros: ¿Quién Necesita Saber Qué?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-brand border border-brand-border bg-brand-surface p-4 space-y-1.5">
                <h3 className="font-heading text-sm font-bold text-brand-text">1. Recursos Humanos (RR. HH.)</h3>
                <p className="text-xs sm:text-sm text-brand-muted-foreground leading-relaxed">
                  RR. HH. gestiona las certificaciones de FMLA y las cartas de adaptación de la ADA. Por ley federal (29 CFR § 1630.14), debe guardar tu información médica en un <strong>archivo médico confidencial y separado</strong> de tu expediente de personal.
                </p>
              </div>
              <div className="rounded-brand border border-brand-border bg-brand-surface p-4 space-y-1.5">
                <h3 className="font-heading text-sm font-bold text-brand-text">2. Tu Supervisor Directo</h3>
                <p className="text-xs sm:text-sm text-brand-muted-foreground leading-relaxed">
                  Tu jefe directo solo necesita conocer los <strong>ajustes operativos</strong>: tu horario, días de teletrabajo aprobados, modificaciones temporales de tareas y fechas de ausencia. No necesita conocer tu diagnóstico ni los detalles de tu quimioterapia.
                </p>
              </div>
              <div className="rounded-brand border border-brand-border bg-brand-surface p-4 space-y-1.5">
                <h3 className="font-heading text-sm font-bold text-brand-text">3. Tus Compañeros y Clientes</h3>
                <p className="text-xs sm:text-sm text-brand-muted-foreground leading-relaxed">
                  Tus compañeros no tienen <strong>ningún derecho legal</strong> a conocer tu información médica. Ni RR. HH. ni tu gerente pueden contarle al equipo por qué estás de licencia o usando adaptaciones sin tu permiso explícito.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 3: Copy-Ready Scripts in Spanish */}
      <section aria-labelledby="guiones-es-heading" className="space-y-4">
        <div className="space-y-1.5">
          <p className="nv-eyebrow nv-eyebrow--primary flex items-center gap-1.5">
            <MessageSquareQuote className="h-4 w-4" />
            <span>Plantillas Listas para Copiar</span>
          </p>
          <h2 id="guiones-es-heading" className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
            Guiones Palabra por Palabra para Hablar en el Trabajo
          </h2>
          <p className="text-sm sm:text-base text-brand-muted-foreground max-w-3xl">
            Adapta estos guiones profesionales para Recursos Humanos, tu supervisor directo, compañeros de trabajo o entrevistas laborales:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DISCLOSURE_SCRIPTS_ES.map((item) => (
            <Card key={item.id} className="flex flex-col">
              <CardContent className="p-6 flex flex-col flex-1 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-heading text-base font-bold text-brand-text">{item.audience}</h3>
                    <p className="text-xs font-semibold text-brand-primary mt-0.5">{item.subject}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleCopyScript(item)} className="shrink-0">
                    {copiedId === item.id ? <><Check className="h-3.5 w-3.5" /> Copiado</> : <><Copy className="h-3.5 w-3.5" /> Copiar</>}
                  </Button>
                </div>
                <pre className="whitespace-pre-wrap font-body text-xs sm:text-sm text-brand-text bg-brand-background border border-brand-border rounded-brand p-3.5 leading-relaxed flex-1">
                  {item.script}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Section 4: Interactive Checklist */}
      <section aria-labelledby="checklist-divulgacion-heading" className="space-y-5">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-brand-primary" />
                <span className="text-sm font-bold text-brand-text">Tu progreso de preparación</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-brand-primary">
                  {checkedItems.length}/{totalItems} ({pct}%)
                </span>
                {checkedItems.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={resetChecklist} className="h-7 px-2 text-xs">
                    <RotateCcw className="h-3 w-3 mr-1" /> Reiniciar
                  </Button>
                )}
              </div>
            </div>
            <Progress value={pct} className="h-2.5" />
          </CardContent>
        </Card>

        <h2 id="checklist-divulgacion-heading" className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
          Plan de Acción Paso a Paso para Preparar tu Conversación
        </h2>

        {DISCLOSURE_STEPS_ES.map((step, idx) => {
          const Icon = step.icon;
          return (
            <Card key={step.id}>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 p-3 rounded-brand bg-brand-muted">
                    <Icon className="h-6 w-6 text-brand-primary" />
                  </div>
                  <div>
                    <span className="nv-eyebrow">Paso {idx + 1}</span>
                    <h3 className="text-xl font-bold text-brand-text mt-1">{step.title}</h3>
                  </div>
                </div>
                <p className="text-brand-text font-medium text-sm sm:text-base">{step.summary}</p>
                <ul className="space-y-2 list-disc list-inside text-sm text-brand-muted-foreground font-medium">
                  {step.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
                <div className="nv-card nv-card--muted p-4">
                  <p className="nv-eyebrow mb-3">Lista de verificación</p>
                  <div className="space-y-2">
                    {step.checklistItems.map((item) => {
                      const key = `${step.id}::${item}`;
                      const isChecked = checkedItems.includes(key);
                      return (
                        <label key={key} className="flex items-start gap-3 cursor-pointer">
                          <Checkbox checked={isChecked} onCheckedChange={() => toggleItem(key)} className="mt-0.5" />
                          <span className={`text-sm font-medium ${isChecked ? 'text-brand-muted-foreground line-through' : 'text-brand-text'}`}>
                            {item}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <GuideFaqSection
        id="preguntas-frecuentes-divulgacion"
        eyebrow="Preguntas Frecuentes · Privacidad y Divulgación"
        title="Preguntas Frecuentes sobre Cómo Hablar del Cáncer en el Trabajo"
        subtitle="Respuestas claras en español sobre privacidad médica, conversaciones con RR. HH. y supervisores, entrevistas de trabajo y protecciones bajo la ADA."
        faqs={DISCLOSURE_GUIDE_FAQS_ES}
      />

      <Card className="nv-card--muted">
        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-brand-text mb-1">¿Listo/a para redactar tu mensaje o practicar la conversación?</h2>
            <p className="text-sm text-brand-muted-foreground">
              Explora nuestras herramientas de comunicación o conversa en español con el Coach de IA para personalizar tu guion.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Link to="/AccommodationsEs">
              <Button variant="outline">
                Adaptaciones ADA (ES) <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
            <Link to="/Coach">
              <Button>Practicar con el Coach de IA</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}