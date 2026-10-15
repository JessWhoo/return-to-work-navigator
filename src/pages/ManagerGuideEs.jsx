import React, { useRef, useState, useEffect } from 'react';
import { Printer, Loader2, ClipboardCheck, Check, Mail, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import useSEO from '@/hooks/useSEO';
import PageHeader from '@/components/brand/PageHeader';
import { generateManagerGuidePdf } from '@/components/managerguide/generateManagerGuidePdf';
import GuideTableOfContents from '@/components/managerguide/GuideTableOfContents';
import GuideSection from '@/components/managerguide/GuideSection';
import SupportTipCard from '@/components/managerguide/SupportTipCard';
import GuideFaqSection from '@/components/seo/GuideFaqSection';
import GuideLanguageSwitch from '@/components/seo/GuideLanguageSwitch';
import { MANAGER_GUIDE_FAQS_ES } from '@/components/seo/guideFaqsData';
import {
  SUPPORT_TIPS_ES,
  MANAGER_GUIDE_SECTIONS_ES,
  MANAGER_CHECKLIST_ES,
  MANAGER_EMAIL_TEMPLATES_ES,
} from '@/components/managerguide/managerGuideDataEs';

const STORAGE_KEY = 'managerRtwChecklistProgressEs';

const TOC_SECTIONS_ES = [
  ...MANAGER_GUIDE_SECTIONS_ES,
  { id: 'lista-verificacion', title: 'Lista de Verificación para el Regreso al Trabajo' },
  { id: 'plantillas-correo', title: 'Plantillas de Correo para Gerentes y RR. HH.' },
  { id: 'preguntas-frecuentes', title: 'Preguntas Frecuentes (FAQ)' },
];

export default function ManagerGuideEs() {
  const guideRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [checked, setChecked] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setChecked(JSON.parse(saved));
    } catch {}
  }, []);

  const toggleCheck = (key) => {
    setChecked((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const resetChecklist = () => {
    setChecked({});
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  const allKeys = MANAGER_CHECKLIST_ES.flatMap((s, sIdx) => s.items.map((_, iIdx) => `${sIdx}-${iIdx}`));
  const checkedCount = allKeys.filter((k) => checked[k]).length;
  const percent = allKeys.length ? Math.round((checkedCount / allKeys.length) * 100) : 0;

  const handleExport = async () => {
    if (!guideRef.current || isExporting) return;
    setIsExporting(true);
    try {
      await generateManagerGuidePdf(guideRef.current);
      toast.success('Guía en PDF descargada.');
    } catch {
      toast.error('No se pudo generar el PDF. Inténtalo de nuevo.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyTemplate = async (tpl) => {
    try {
      await navigator.clipboard.writeText(`Asunto: ${tpl.subject}\n\n${tpl.body}`);
      setCopiedId(tpl.id);
      toast.success('Plantilla copiada al portapapeles.');
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      toast.error('No se pudo copiar la plantilla.');
    }
  };

  useSEO({
    title: 'Guía para Gerentes y Recursos Humanos: Apoyo a Empleados con Cáncer',
    description:
      'Guía práctica en español para gerentes y Recursos Humanos sobre cómo apoyar a un empleado con cáncer: qué decir, adaptaciones bajo la ADA, licencia FMLA, confidencialidad y regreso gradual.',
    path: '/ManagerGuideEs',
  });

  return (
    <div ref={guideRef} lang="es" className="max-w-4xl mx-auto space-y-8">
      <PageHeader
        eyebrow="Para Gerentes y Recursos Humanos · Edición en Español"
        title="Cómo Apoyar a un Empleado Durante el Cáncer y en su Regreso al Trabajo"
        subtitle="Guía práctica sobre lo que enfrenta tu empleado, qué palabras y acciones ayudan realmente, errores que debes evitar y tus responsabilidades legales bajo la ADA y la FMLA."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <GuideLanguageSwitch
              englishPath="/ManagerGuide"
              spanishPath="/ManagerGuideEs"
              currentLang="es"
            />
            <Button variant="outline" onClick={handleExport} disabled={isExporting}>
              {isExporting
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Generando…</>
                : <><Printer className="h-4 w-4" /> Imprimir o guardar PDF</>}
            </Button>
          </div>
        }
      />

      <Card>
        <CardContent className="p-6 sm:p-8 space-y-3">
          <p className="nv-eyebrow nv-eyebrow--primary">Resumen Ejecutivo para Líderes y RR. HH.</p>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-brand-text">
            Cómo Apoyar a un Empleado con Cáncer: El Marco de los 4 Pilares
          </h2>
          <p className="text-sm sm:text-base text-brand-text leading-relaxed">
            Cuando un empleado recibe un diagnóstico de cáncer o regresa tras su tratamiento, los gerentes y profesionales de Recursos Humanos deben combinar un <strong>liderazgo humano y empático</strong> con el <strong>cumplimiento estricto de la ley</strong> bajo la Ley de Estadounidenses con Discapacidades (ADA) y la Ley de Ausencia Familiar y Médica (FMLA). La respuesta laboral más eficaz se basa en cuatro pilares: (1) <strong>Proteger la confidencialidad médica</strong>: nunca compartir el diagnóstico con compañeros sin autorización explícita; (2) <strong>Iniciar temprano el proceso interactivo de la ADA</strong> para ofrecer horarios flexibles, teletrabajo o un regreso gradual; (3) <strong>Documentar por escrito cada acuerdo de adaptación y licencia</strong>; y (4) <strong>Gestionar la carga del equipo con transparencia</strong> sin hacer que el empleado se sienta como una carga.
          </p>
        </CardContent>
      </Card>

      <GuideTableOfContents sections={TOC_SECTIONS_ES} />

      <section aria-labelledby="pilares-heading" className="space-y-4">
        <div>
          <p className="nv-eyebrow nv-eyebrow--primary">Pilares Fundamentales</p>
          <h2 id="pilares-heading" className="font-heading text-2xl sm:text-3xl font-bold text-brand-text mt-1">
            Consejos Rápidos: Cómo Apoyar Mejor a los Sobrevivientes
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {SUPPORT_TIPS_ES.map((tip) => (
            <SupportTipCard key={tip.id} tip={tip} />
          ))}
        </div>
      </section>

      <div className="space-y-6">
        {MANAGER_GUIDE_SECTIONS_ES.map((section) => (
          <GuideSection key={section.id} section={section} />
        ))}
      </div>

      {/* Interactive Checklist in Spanish */}
      <section id="lista-verificacion" aria-labelledby="checklist-es-heading" className="scroll-mt-28 nv-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-pill bg-brand-muted text-brand-primary shrink-0">
              <ClipboardCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 id="checklist-es-heading" className="font-heading text-2xl font-bold text-brand-text">
                Lista de Verificación de Apoyo para el Regreso al Trabajo
              </h2>
              <p className="text-brand-muted-foreground mt-1 text-sm sm:text-base">
                Marca cada paso a medida que lo completes; tu progreso se guarda automáticamente en este dispositivo.
              </p>
            </div>
          </div>
          <Button onClick={resetChecklist} variant="outline" className="whitespace-nowrap">
            Reiniciar lista
          </Button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-bold text-brand-text">{checkedCount} de {allKeys.length} pasos completados</span>
            <span className="text-sm font-extrabold text-brand-primary">{percent}%</span>
          </div>
          <div className="h-3 bg-brand-muted rounded-full overflow-hidden" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full bg-brand-primary rounded-full transition-all duration-300" style={{ width: `${percent}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {MANAGER_CHECKLIST_ES.map((section, sIdx) => (
            <div key={section.phase} className="rounded-brand border border-brand-border bg-brand-background p-5">
              <h3 className="font-heading text-base font-bold text-brand-text mb-3">{section.phase}</h3>
              <ul className="space-y-1.5">
                {section.items.map((item, iIdx) => {
                  const key = `${sIdx}-${iIdx}`;
                  const isChecked = !!checked[key];
                  return (
                    <li key={key}>
                      <button
                        type="button"
                        onClick={() => toggleCheck(key)}
                        aria-pressed={isChecked}
                        className="flex gap-2.5 text-left text-sm text-brand-text leading-relaxed w-full py-1.5 rounded-brand hover:bg-brand-surface transition-colors px-1.5"
                      >
                        <span
                          className={`flex-shrink-0 mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center transition-colors ${
                            isChecked ? 'bg-brand-primary border-brand-primary' : 'bg-brand-surface border-brand-border'
                          }`}
                        >
                          {isChecked && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                        </span>
                        <span className={isChecked ? 'line-through text-brand-muted-foreground' : ''}>{item}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Spanish Email Templates */}
      <section id="plantillas-correo" aria-labelledby="plantillas-es-heading" className="scroll-mt-28 space-y-5">
        <div className="flex items-center gap-2">
          <Mail className="h-6 w-6 text-brand-primary" />
          <h2 id="plantillas-es-heading" className="font-heading text-xl sm:text-2xl font-bold text-brand-text">
            Plantillas de Correo para Gerentes y Recursos Humanos
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {MANAGER_EMAIL_TEMPLATES_ES.map((tpl) => (
            <article key={tpl.id} className="nv-card p-5 flex flex-col">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-heading text-base font-bold text-brand-text leading-snug">{tpl.title}</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => handleCopyTemplate(tpl)}>
                  {copiedId === tpl.id ? <><Check className="h-3.5 w-3.5" /> Copiado</> : <><Copy className="h-3.5 w-3.5" /> Copiar</>}
                </Button>
              </div>
              <p className="text-xs text-brand-muted-foreground italic mb-3">{tpl.when_to_use}</p>
              <div className="nv-eyebrow mb-1">Asunto</div>
              <p className="text-sm font-semibold text-brand-text mb-3">{tpl.subject}</p>
              <div className="nv-eyebrow mb-1">Mensaje</div>
              <pre className="whitespace-pre-wrap font-body text-xs sm:text-sm text-brand-text bg-brand-background border border-brand-border rounded-brand p-3.5 leading-relaxed flex-1">
                {tpl.body}
              </pre>
            </article>
          ))}
        </div>
      </section>

      <GuideFaqSection
        id="preguntas-frecuentes"
        eyebrow="Preguntas Frecuentes · Gerentes y RR. HH."
        title="Preguntas Frecuentes: Cómo Apoyar a un Empleado con Cáncer"
        subtitle="Respuestas claras sobre las obligaciones legales bajo la ADA y la FMLA, confidencialidad médica, regreso gradual y apoyo en el lugar de trabajo."
        faqs={MANAGER_GUIDE_FAQS_ES}
      />
    </div>
  );
}