import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import PageHeader from '@/components/brand/PageHeader';
import GuideFaqSection from '@/components/seo/GuideFaqSection';
import GuideLanguageSwitch from '@/components/seo/GuideLanguageSwitch';
import { ACCOMMODATIONS_GUIDE_FAQS_ES } from '@/components/seo/guideFaqsData';
import useSEO from '@/hooks/useSEO';
import {
  FileText, Download, Copy, Check, Battery, Brain,
  Shield, Stethoscope, CheckCircle2, FileCheck, Clock, Home, Briefcase, Utensils,
} from 'lucide-react';
import { toast } from 'sonner';

const SYMPTOM_GUIDES_ES = [
  {
    icon: Battery,
    symptom: 'Fatiga Relacionada con el Cáncer (CRF) y Recuperación de Energía',
    whyItHappens:
      'A diferencia del cansancio común, la fatiga oncológica es un agotamiento físico y celular profundo causado por la quimioterapia, la radioterapia, la inmunoterapia, la anemia o las terapias hormonales, que no desaparece con una sola noche de sueño.',
    accommodations: [
      'Horario de regreso gradual (ej. 20 horas/semana en las semanas 1–2, 30 horas en las semanas 3–4, hasta llegar a jornada completa)',
      'Día de recuperación a mitad de semana (trabajar lunes/martes y jueves/viernes con los miércoles libres mediante FMLA intermitente o ADA)',
      'Horarios flexibles de entrada y salida alineados con las horas de mayor energía por la mañana',
      'Trabajo remoto o híbrido temporal para eliminar el desgaste físico del traslado diario',
      'Dos pausas programadas de 15 minutos en un espacio tranquilo para descansar',
    ],
  },
  {
    icon: Brain,
    symptom: 'Cambios Cognitivos ("Quimiocerebro" o Neblina Mental)',
    whyItHappens:
      'Los tratamientos contra el cáncer, la anestesia quirúrgica, las alteraciones del sueño y las terapias endocrinas suelen afectar la memoria de trabajo, la concentración y la capacidad de realizar múltiples tareas a la vez.',
    accommodations: [
      'Resúmenes por escrito y listas de tareas claras después de las reuniones verbales',
      'Autorización para grabar reuniones o usar herramientas de transcripción como referencia personal',
      'Bloques protegidos de 90 minutos de concentración sin interrupciones ni notificaciones',
      'Reubicación en un área de trabajo más silenciosa o uso de audífonos con cancelación de ruido',
      'Priorización semanal de 2 a 3 objetivos clave en lugar de cambios constantes de tarea',
    ],
  },
  {
    icon: Stethoscope,
    symptom: 'Neuropatía Periférica, Linfedema y Recuperación Posquirúrgica',
    whyItHappens:
      'El daño en los nervios de manos o pies por la quimioterapia, las restricciones de peso tras una cirugía o el manejo del linfedema pueden afectar el uso del teclado, el estar de pie o el levantar objetos.',
    accommodations: [
      'Software de dictado por voz, teclado ergonómico dividido o ratón vertical',
      'Escritorio de altura ajustable, tapete antifatiga o asiento para puestos que requieren estar de pie',
      'Restricción temporal para levantar más de 5 a 7 kg (10 a 15 libras) o estirar los brazos por encima del hombro',
      'Espacio de estacionamiento accesible más cercano a la entrada del edificio',
      'Control de temperatura o permiso para usar prendas de compresión y calzado médico cómodo',
    ],
  },
  {
    icon: Shield,
    symptom: 'Inmunosupresión y Citas Oncológicas Continuas',
    whyItHappens:
      'Durante el tratamiento activo, las infusiones de mantenimiento o la recuperación de las defensas (neutropenia), existe un mayor riesgo de infección además de análisis, estudios e infusiones frecuentes.',
    accommodations: [
      'Teletrabajo a tiempo completo durante periodos de bajas defensas o picos de enfermedades respiratorias',
      'Oficina privada o estación de trabajo alejada de áreas de alto tránsito público',
      'Licencia intermitente u horario flexible para asistir a citas de oncología, quimioterapia y estudios',
      'Acceso a un refrigerador limpio para medicamentos y un espacio privado para el manejo de síntomas',
    ],
  },
];

const INTERACTIVE_PROCESS_ES = [
  {
    step: '1. Presenta una solicitud clara y por escrito',
    detail:
      'Aunque puedes iniciar una solicitud bajo la ADA de forma verbal, hacerlo por escrito crea un registro con fecha. Indica que solicitas una adaptación laboral razonable por una condición médica, enumera los ajustes específicos y propón una fecha de inicio.',
  },
  {
    step: '2. Entrega documentación médica enfocada en tus funciones (no tu expediente completo)',
    detail:
      'Recursos Humanos puede pedir una carta breve de tu oncólogo o médico confirmando que tienes una condición médica cubierta, describiendo tus limitaciones funcionales en el trabajo (como fatiga o defensas bajas) y recomendando adaptaciones. Tu empleador no tiene derecho a exigir tu historial oncológico completo.',
  },
  {
    step: '3. Participa en el "Proceso Interactivo" de buena fe',
    detail:
      'Bajo la ADA, tu empleador debe dialogar contigo para evaluar cómo las adaptaciones te permitirán cumplir con las funciones esenciales de tu puesto. Propón un periodo de prueba de 30, 60 o 90 días con una fecha de revisión programada.',
  },
  {
    step: '4. Documenta el acuerdo (y conoce tus derechos si te lo niegan)',
    detail:
      'Envía un correo breve confirmando las adaptaciones acordadas. Un empleador solo puede rechazar una adaptación razonable si demuestra una "dificultad excesiva" (undue hardship) e incluso en ese caso está obligado a buscar alternativas eficaces contigo.',
  },
];

const ACCOMMODATION_CATEGORIES_ES = [
  {
    category: 'Horario y Flexibilidad',
    icon: Clock,
    items: [
      { id: 'flexible-hours', label: 'Horario flexible de entrada y salida' },
      { id: 'reduced-hours', label: 'Jornada reducida temporal o regreso gradual (medio tiempo a tiempo completo)' },
      { id: 'frequent-breaks', label: 'Pausas breves y frecuentes para descansar o tomar medicamentos' },
      { id: 'medical-leave', label: 'Tiempo libre o licencia intermitente para citas médicas y tratamientos' },
    ],
  },
  {
    category: 'Entorno de Trabajo y Teletrabajo',
    icon: Home,
    items: [
      { id: 'remote-work', label: 'Opciones de trabajo desde casa (teletrabajo total o híbrido)' },
      { id: 'quiet-space', label: 'Acceso a un espacio tranquilo y privado para descansar' },
      { id: 'close-parking', label: 'Estacionamiento reservado cerca de la entrada' },
      { id: 'ergonomic', label: 'Silla ergonómica, escritorio ajustable o teclado adaptado' },
    ],
  },
  {
    category: 'Ajustes de Tareas y Apoyo Cognitivo',
    icon: Briefcase,
    items: [
      { id: 'light-duty', label: 'Modificación temporal de tareas físicas pesadas o levantamiento de peso' },
      { id: 'written-instructions', label: 'Instrucciones y acuerdos de reuniones por escrito para apoyar la memoria' },
      { id: 'gradual-workload', label: 'Aumento gradual de la carga de trabajo durante las primeras semanas' },
      { id: 'restroom-access', label: 'Fácil acceso al baño y permiso para mantener agua y alimentos en el puesto', icon: Utensils },
    ],
  },
];

export default function AccommodationsEs() {
  useSEO({
    title: 'Adaptaciones Laborales bajo la ADA para Sobrevivientes de Cáncer (Guía y Carta)',
    description:
      'Guía completa en español sobre adaptaciones laborales razonables bajo la ADA para sobrevivientes de cáncer: fatiga, quimiocerebro, teletrabajo, regreso gradual y generador de carta para RR. HH.',
    path: '/AccommodationsEs',
  });

  const [selectedItems, setSelectedItems] = useState([]);
  const [copiedLetter, setCopiedLetter] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: '',
    employerName: '',
    supervisorName: '',
    position: '',
    returnDate: '',
    additionalInfo: '',
  });

  const handleCheck = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const buildSpanishLetter = () => {
    const selectedLabels = ACCOMMODATION_CATEGORIES_ES
      .flatMap((c) => c.items)
      .filter((item) => selectedItems.includes(item.id))
      .map((item) => item.label);

    return `${new Date().toLocaleDateString('es-US', { year: 'numeric', month: 'long', day: 'numeric' })}

Estimado/a ${formData.supervisorName || '[Nombre del Supervisor/a o Representante de RR. HH.]'}:

Le escribo para solicitar formalmente adaptaciones laborales razonables bajo la Ley de Estadounidenses con Discapacidades (Americans with Disabilities Act, ADA) mientras continúo mi recuperación médica y mi transición de regreso a mi puesto como ${formData.position || '[Tu Puesto]'} en ${formData.employerName || '[Nombre de la Empresa]'}. Mi fecha prevista de regreso o inicio de estos ajustes es el ${formData.returnDate || '[Fecha]'}.

Estoy plenamente comprometido/a con el cumplimiento de las funciones esenciales de mi puesto. Con base en las recomendaciones de mi equipo médico, solicito las siguientes adaptaciones temporales para desempeñar mi trabajo de manera eficaz y segura:

${selectedLabels.length > 0 ? selectedLabels.map((item) => `• ${item}`).join('\n') : '• [Selecciona una o más adaptaciones en la lista]'}

${formData.additionalInfo ? `\nContexto adicional:\n${formData.additionalInfo}\n` : ''}
Puedo proporcionar la certificación médica correspondiente de mi médico tratante que respalda estas recomendaciones funcionales. Le agradecería que programemos una breve reunión para conversar sobre estas adaptaciones como parte del proceso interactivo de la ADA y acordar una fecha de revisión en 30 a 60 días.

Le solicito amablemente que esta información médica se mantenga en estricta confidencialidad conforme a las normas de privacidad de la ADA.

Atentamente,

${formData.employeeName || '[Tu Nombre]'}`;
  };

  const handleCopyLetter = async () => {
    try {
      await navigator.clipboard.writeText(buildSpanishLetter());
      setCopiedLetter(true);
      toast.success('Carta copiada al portapapeles.');
      setTimeout(() => setCopiedLetter(false), 2500);
    } catch {
      toast.error('No se pudo copiar la carta.');
    }
  };

  const handleDownloadLetter = () => {
    const blob = new Blob([buildSpanishLetter()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'solicitud-adaptaciones-laborales-ada.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Carta descargada.');
  };

  return (
    <div lang="es" className="max-w-6xl mx-auto space-y-8">
      <PageHeader
        eyebrow="Guía Completa de la ADA y Generador de Carta · Español"
        title="Adaptaciones Laborales para Sobrevivientes de Cáncer"
        subtitle="Conoce cómo funcionan las adaptaciones laborales bajo la ley ADA para la fatiga, el quimiocerebro, la neuropatía y las citas médicas, y genera tu carta formal de solicitud."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <GuideLanguageSwitch
              englishPath="/Accommodations"
              spanishPath="/AccommodationsEs"
              currentLang="es"
            />
            <Link to="/AccommodationLetterGenerator" className="nv-btn !whitespace-normal">
              <FileText className="h-4 w-4" /> Generador guiado paso a paso
            </Link>
          </div>
        }
      />

      {/* Section 1: Complete Guide Overview */}
      <section aria-labelledby="ada-es-overview-heading" className="space-y-4">
        <Card>
          <CardContent className="p-6 sm:p-8 space-y-4">
            <p className="nv-eyebrow nv-eyebrow--primary">Guía para Sobrevivientes y Recursos Humanos</p>
            <h2 id="ada-es-overview-heading" className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
              Cómo Funcionan las Adaptaciones Laborales bajo la ADA para Sobrevivientes de Cáncer
            </h2>
            <p className="text-sm sm:text-base text-brand-text leading-relaxed">
              Bajo la <strong>Ley de Enmiendas a la Ley de Estadounidenses con Discapacidades (ADAAA)</strong> de los Estados Unidos, el cáncer casi siempre califica como una discapacidad protegida, ya sea que estés trabajando durante el tratamiento activo, regresando después de una cirugía o quimioterapia, o manejando efectos secundarios a largo plazo años después de entrar en remisión. Debido a que el cáncer afecta el crecimiento celular normal (una función corporal importante según la ley federal), los empleadores con <strong>15 o más empleados</strong> están legalmente obligados a proporcionar adaptaciones razonables, a menos que hacerlo implique una dificultad excesiva. Muchas leyes estatales protegen incluso a trabajadores en empresas más pequeñas.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="rounded-brand border border-brand-border bg-brand-background p-4">
                <p className="font-heading text-sm font-bold text-brand-text">Etapas Cubiertas</p>
                <p className="text-xs text-brand-muted-foreground mt-1 leading-relaxed">
                  Tratamiento activo, regreso gradual, remisión, terapia de mantenimiento y efectos tardíos (fatiga, neuropatía, quimiocerebro).
                </p>
              </div>
              <div className="rounded-brand border border-brand-border bg-brand-background p-4">
                <p className="font-heading text-sm font-bold text-brand-text">Estándar Legal Clave</p>
                <p className="text-xs text-brand-muted-foreground mt-1 leading-relaxed">
                  Ajustes prácticos que te permiten desempeñar las <strong>funciones esenciales</strong> de tu puesto sin causar una dificultad excesiva.
                </p>
              </div>
              <div className="rounded-brand border border-brand-border bg-brand-background p-4">
                <p className="font-heading text-sm font-bold text-brand-text">Privacidad Médica</p>
                <p className="text-xs text-brand-muted-foreground mt-1 leading-relaxed">
                  RR. HH. debe guardar las cartas médicas en un expediente confidencial separado y no puede divulgar tu diagnóstico a tus compañeros.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 2: Accommodations by Symptom */}
      <section aria-labelledby="symptom-es-heading" className="space-y-4">
        <div className="space-y-1.5">
          <p className="nv-eyebrow nv-eyebrow--primary">Soluciones según tus Síntomas</p>
          <h2 id="symptom-es-heading" className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
            Adaptaciones Laborales Prácticas según el Efecto Secundario
          </h2>
          <p className="text-sm sm:text-base text-brand-muted-foreground max-w-3xl">
            Las solicitudes de adaptación más sólidas conectan una limitación funcional específica con un ajuste práctico y concreto en el trabajo:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SYMPTOM_GUIDES_ES.map((group) => {
            const Icon = group.icon;
            return (
              <Card key={group.symptom} className="h-full">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-brand-muted text-brand-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-heading text-base sm:text-lg font-bold text-brand-text">
                        {group.symptom}
                      </h3>
                      <p className="text-xs text-brand-muted-foreground mt-1 leading-relaxed">
                        {group.whyItHappens}
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-1.5 pt-1">
                    {group.accommodations.map((acc) => (
                      <li key={acc} className="flex items-start gap-2 text-xs sm:text-sm text-brand-text">
                        <CheckCircle2 className="h-4 w-4 text-brand-primary shrink-0 mt-0.5" />
                        <span>{acc}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Section 3: Interactive Process */}
      <section aria-labelledby="interactive-es-heading" className="space-y-4">
        <Card className="nv-card--muted">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-brand-primary font-heading font-bold">
              <FileCheck className="h-5 w-5 shrink-0" />
              <span className="text-xs uppercase tracking-wider">Guía Paso a Paso</span>
            </div>
            <h2 id="interactive-es-heading" className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
              Cómo Funciona el Proceso Interactivo de la ADA
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {INTERACTIVE_PROCESS_ES.map((item) => (
                <div key={item.step} className="rounded-brand border border-brand-border bg-brand-surface p-4 space-y-1.5">
                  <h3 className="font-heading text-sm sm:text-base font-bold text-brand-text">{item.step}</h3>
                  <p className="text-xs sm:text-sm text-brand-muted-foreground leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Interactive Builder in Spanish */}
      <section aria-labelledby="builder-es-heading" className="space-y-4">
        <h2 id="builder-es-heading" className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
          Generador de Carta de Solicitud de Adaptaciones (en Español)
        </h2>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-brand-text">1. Selecciona las adaptaciones que necesitas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {ACCOMMODATION_CATEGORIES_ES.map((cat) => {
                  const CategoryIcon = cat.icon;
                  return (
                    <div key={cat.category} className="space-y-3">
                      <div className="flex items-center space-x-2 text-brand-primary font-semibold">
                        <CategoryIcon className="h-5 w-5" />
                        <h3 className="font-bold text-brand-text">{cat.category}</h3>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3 pl-7">
                        {cat.items.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => handleCheck(item.id)}
                            className={`flex items-start space-x-3 p-3 rounded-brand border transition-all cursor-pointer ${
                              selectedItems.includes(item.id)
                                ? 'bg-brand-muted border-primary'
                                : 'bg-brand-surface border-brand-border hover:border-primary'
                            }`}
                          >
                            <Checkbox
                              checked={selectedItems.includes(item.id)}
                              onCheckedChange={() => handleCheck(item.id)}
                              className="mt-1"
                            />
                            <label className="text-sm text-brand-text cursor-pointer flex-1 leading-snug">
                              {item.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-brand-text">2. Tus datos (opcional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="es-name">Tu nombre</Label>
                  <Input
                    id="es-name"
                    placeholder="María García"
                    value={formData.employeeName}
                    onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="es-employer">Empresa u organización</Label>
                  <Input
                    id="es-employer"
                    placeholder="Compañía ABC"
                    value={formData.employerName}
                    onChange={(e) => setFormData({ ...formData, employerName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="es-supervisor">Supervisor/a o contacto de RR. HH.</Label>
                  <Input
                    id="es-supervisor"
                    placeholder="Carlos López"
                    value={formData.supervisorName}
                    onChange={(e) => setFormData({ ...formData, supervisorName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="es-position">Tu puesto</Label>
                  <Input
                    id="es-position"
                    placeholder="Analista / Coordinadora"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="es-date">Fecha prevista de inicio o regreso</Label>
                  <Input
                    id="es-date"
                    type="date"
                    value={formData.returnDate}
                    onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="es-notes">Notas adicionales</Label>
                  <Textarea
                    id="es-notes"
                    rows={3}
                    placeholder="Cualquier contexto adicional sobre tu horario o funciones..."
                    value={formData.additionalInfo}
                    onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  <Button onClick={handleCopyLetter} className="w-full">
                    {copiedLetter ? <><Check className="h-4 w-4" /> Carta copiada</> : <><Copy className="h-4 w-4" /> Copiar carta en español</>}
                  </Button>
                  <Button variant="outline" onClick={handleDownloadLetter} className="w-full">
                    <Download className="h-4 w-4" /> Descargar carta (.txt)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-brand-text">Vista previa de tu carta de solicitud bajo la ADA</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap font-body text-xs sm:text-sm text-brand-text bg-brand-background border border-brand-border rounded-brand p-4 leading-relaxed">
              {buildSpanishLetter()}
            </pre>
          </CardContent>
        </Card>
      </section>

      <GuideFaqSection
        id="preguntas-frecuentes-adaptaciones"
        eyebrow="Preguntas Frecuentes sobre la ADA"
        title="Preguntas Frecuentes sobre Adaptaciones Laborales por Cáncer"
        subtitle="Respuestas claras en español sobre tus derechos bajo la ADA, documentación médica, el proceso interactivo y qué hacer si tu empleador rechaza una solicitud."
        faqs={ACCOMMODATIONS_GUIDE_FAQS_ES}
      />
    </div>
  );
}