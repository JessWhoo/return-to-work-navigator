import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, CheckCircle2, Loader2, AlertTriangle, TrendingUp, Lightbulb, XCircle, ClipboardList } from 'lucide-react';

export default function ResumeAnalyzer({ sharedResumeUrl, sharedResumeFile, onResumeUploaded }) {
  const [resumeFile, setResumeFile] = useState(sharedResumeFile || null);
  const [resumeUrl, setResumeUrl] = useState(sharedResumeUrl || '');
  const [uploading, setUploading] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setResumeFile(file);
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setResumeUrl(file_url);
    setUploading(false);
    if (onResumeUploaded) onResumeUploaded(file_url, file);
  };

  const handleAnalyze = async () => {
    if (!resumeUrl || !jobDescription.trim()) return;
    setAnalyzing(true);
    setAnalysis(null);

    const result = (await base44.functions.invoke('aiGateway', {
      operation: 'resume_analysis',
      data: { jobDescription, resumeUrl },
    })).data.result;

    setAnalysis(result);
    setAnalyzing(false);
  };

  const scoreBg = (score) => {
    if (score >= 80) return 'nv-card--sage';
    if (score >= 60) return 'nv-card--muted';
    if (score >= 40) return 'nv-card--pink';
    return 'nv-card--pink !border-destructive';
  };

  const importanceColor = (imp) => {
    if (imp === 'High') return 'bg-destructive/10 text-destructive border-destructive/30';
    if (imp === 'Medium') return 'bg-brand-muted text-brand-primary border-brand-border';
    return 'bg-brand-background text-brand-muted-foreground border-brand-border';
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="nv-card nv-card--muted p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-2">
          <ClipboardList className="h-7 w-7 text-brand-text" />
          <h2 className="text-2xl font-bold">Resume Analyzer</h2>
        </div>
        <p className="text-brand-muted-foreground text-sm ">
          Paste a job description and our AI will compare it to your resume — highlighting missing keywords, skills gaps, and exactly how to improve your application.
        </p>
      </div>

      {/* Resume Upload */}
      <Card className="">
        <CardHeader className="pb-3">
          <CardTitle className="text-brand-text flex items-center gap-2 text-base">
            <FileText className="h-5 w-5 text-brand-primary" />
            Your Resume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <label className="flex min-h-36 flex-col items-center justify-center gap-1 rounded-brand border border-dashed border-brand-primary bg-brand-background p-6 text-center cursor-pointer hover:bg-brand-muted transition-colors">
            <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} />
            {uploading ? (
              <Loader2 className="h-7 w-7 text-brand-primary animate-spin mb-2" />
            ) : resumeFile ? (
              <CheckCircle2 className="h-7 w-7 text-brand-primary mb-2" />
            ) : (
              <Upload className="h-7 w-7 text-brand-muted-foreground mb-2" />
            )}
            <span className="text-sm text-brand-text font-medium">
              {uploading ? 'Uploading...' : resumeFile ? resumeFile.name : 'Click to upload your resume'}
            </span>
            {!resumeFile && <span className="text-xs text-brand-muted-foreground mt-1">PDF, DOC, DOCX supported</span>}
          </label>
        </CardContent>
      </Card>

      {/* Job Description */}
      <Card className="">
        <CardHeader className="pb-3">
          <CardTitle className="text-brand-text flex items-center gap-2 text-base">
            <ClipboardList className="h-5 w-5 text-brand-primary" />
            Job Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here (requirements, responsibilities, qualifications)..."
            rows={8}
            className="nv-input w-full resize-y p-3 text-sm"
          />
          <p className="text-xs text-brand-muted-foreground mt-1">Include the full posting for best results</p>
        </CardContent>
      </Card>

      <Button
        onClick={handleAnalyze}
        disabled={!resumeUrl || !jobDescription.trim() || analyzing}
        className="min-h-12 w-full !whitespace-normal"
      >
        {analyzing ? (
          <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Analyzing your resume...</>
        ) : (
          <><TrendingUp className="h-5 w-5 mr-2" /> Analyze Resume Match</>
        )}
      </Button>

      {/* Results */}
      {analysis && (
        <div className="space-y-5">
          {/* Score Banner */}
          <div className={`nv-card ${scoreBg(analysis.match_score)} p-5 text-brand-text sm:p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80 mb-1">Overall Match Score</p>
                <p className="text-5xl font-bold">{analysis.match_score}<span className="text-2xl">%</span></p>
                <p className="text-lg font-semibold mt-1 opacity-90">{analysis.match_label} Match</p>
              </div>
              <div className="text-right">
                <div className="w-24 h-24 rounded-full border-4 border-brand-border flex items-center justify-center">
                  <TrendingUp className="h-10 w-10 text-brand-text/80" />
                </div>
              </div>
            </div>
            {analysis.summary && (
              <p className="text-sm mt-4 opacity-90  border-t border-brand-border pt-4">{analysis.summary}</p>
            )}
          </div>

          {/* Strengths */}
          {analysis.strengths?.length > 0 && (
            <Card className="nv-card--sage">
              <CardHeader className="pb-2">
                <CardTitle className="text-brand-primary flex items-center gap-2 text-base">
                  <CheckCircle2 className="h-5 w-5" /> Your Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-brand-text">
                      <CheckCircle2 className="h-4 w-4 text-brand-primary mt-0.5 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Present Keywords */}
          {analysis.present_keywords?.length > 0 && (
            <Card className="">
              <CardHeader className="pb-2">
                <CardTitle className="text-brand-primary flex items-center gap-2 text-base">
                  <CheckCircle2 className="h-5 w-5" /> Keywords Already in Your Resume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.present_keywords.map((kw, i) => (
                    <span key={i} className="px-2.5 py-1 bg-secondary text-secondary-foreground border border-brand-border rounded-full text-xs font-medium">
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Missing Keywords */}
          {analysis.missing_keywords?.length > 0 && (
            <Card className="nv-card--pink">
              <CardHeader className="pb-2">
                <CardTitle className="text-destructive flex items-center gap-2 text-base">
                  <XCircle className="h-5 w-5" /> Missing Keywords
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-brand-muted-foreground mb-3">These keywords appear in the job description but not your resume. Add them where relevant.</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.missing_keywords.map((kw, i) => (
                    <span key={i} className="px-2.5 py-1 bg-destructive/10 text-destructive border border-destructive/30 rounded-full text-xs font-medium">
                      ✕ {kw}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Missing Skills */}
          {analysis.missing_skills?.length > 0 && (
            <Card className="nv-card--pink">
              <CardHeader className="pb-2">
                <CardTitle className="text-brand-primary flex items-center gap-2 text-base">
                  <AlertTriangle className="h-5 w-5" /> Skills Gaps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis.missing_skills.map((item, i) => (
                  <div key={i} className="bg-brand-surface rounded-brand p-4 border border-brand-border">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-brand-text">{item.skill}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs border ${importanceColor(item.importance)}`}>
                        {item.importance}
                      </span>
                    </div>
                    <p className="text-xs text-brand-muted-foreground">{item.suggestion}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Resume Improvements */}
          {analysis.resume_improvements?.length > 0 && (
            <Card className="nv-card--muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-brand-primary flex items-center gap-2 text-base">
                  <Lightbulb className="h-5 w-5" /> How to Improve Your Resume
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis.resume_improvements.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-brand-surface rounded-brand p-4 border border-brand-border">
                    <div className="px-2 py-0.5 bg-brand-muted text-brand-primary rounded-pill text-xs font-semibold whitespace-nowrap mt-0.5">
                      {item.section}
                    </div>
                    <p className="text-xs text-brand-text ">{item.suggestion}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Button
            variant="outline"
            onClick={() => { setAnalysis(null); setJobDescription(''); }}
            className="w-full !whitespace-normal"
          >
            Analyze Another Job
          </Button>
        </div>
      )}
    </div>
  );
}