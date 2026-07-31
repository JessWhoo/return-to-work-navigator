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

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert resume coach and ATS specialist helping a cancer survivor return to work.

Analyze the resume (from the attached file) against the job description below.

JOB DESCRIPTION:
${jobDescription}

Return a JSON object with this exact structure:
{
  "match_score": <number 0-100>,
  "match_label": <"Poor" | "Fair" | "Good" | "Strong">,
  "summary": "<2-sentence overview of the match>",
  "missing_keywords": ["<keyword1>", "<keyword2>", ...],
  "present_keywords": ["<keyword1>", "<keyword2>", ...],
  "missing_skills": [
    { "skill": "<skill name>", "importance": "<High|Medium|Low>", "suggestion": "<how to address this on the resume>" }
  ],
  "resume_improvements": [
    { "section": "<Resume Section e.g. Summary, Experience, Skills>", "suggestion": "<specific actionable suggestion>" }
  ],
  "strengths": ["<strength1>", "<strength2>", ...]
}`,
      file_urls: [resumeUrl],
      response_json_schema: {
        type: 'object',
        properties: {
          match_score: { type: 'number' },
          match_label: { type: 'string' },
          summary: { type: 'string' },
          missing_keywords: { type: 'array', items: { type: 'string' } },
          present_keywords: { type: 'array', items: { type: 'string' } },
          missing_skills: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                skill: { type: 'string' },
                importance: { type: 'string' },
                suggestion: { type: 'string' }
              }
            }
          },
          resume_improvements: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                section: { type: 'string' },
                suggestion: { type: 'string' }
              }
            }
          },
          strengths: { type: 'array', items: { type: 'string' } }
        }
      }
    });

    setAnalysis(result);
    setAnalyzing(false);
  };

  const scoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const scoreBg = (score) => {
    if (score >= 80) return 'from-green-600 to-emerald-600';
    if (score >= 60) return 'from-yellow-600 to-amber-600';
    if (score >= 40) return 'from-orange-600 to-amber-700';
    return 'from-red-600 to-rose-700';
  };

  const importanceColor = (imp) => {
    if (imp === 'High') return 'bg-red-500/20 text-red-300 border-red-500/40';
    if (imp === 'Medium') return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
    return 'bg-slate-600/40 text-slate-300 border-slate-500/40';
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <ClipboardList className="h-7 w-7 text-white" />
          <h2 className="text-2xl font-bold">Resume Analyzer</h2>
        </div>
        <p className="text-emerald-100 text-sm leading-relaxed">
          Paste a job description and our AI will compare it to your resume — highlighting missing keywords, skills gaps, and exactly how to improve your application.
        </p>
      </div>

      {/* Resume Upload */}
      <Card className="bg-slate-800/60 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2 text-base">
            <FileText className="h-5 w-5 text-emerald-400" />
            Your Resume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-600 rounded-xl p-6 cursor-pointer hover:border-emerald-400 transition-colors bg-slate-900/40">
            <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} />
            {uploading ? (
              <Loader2 className="h-7 w-7 text-emerald-400 animate-spin mb-2" />
            ) : resumeFile ? (
              <CheckCircle2 className="h-7 w-7 text-green-400 mb-2" />
            ) : (
              <Upload className="h-7 w-7 text-slate-400 mb-2" />
            )}
            <span className="text-sm text-slate-300 font-medium">
              {uploading ? 'Uploading...' : resumeFile ? resumeFile.name : 'Click to upload your resume'}
            </span>
            {!resumeFile && <span className="text-xs text-slate-500 mt-1">PDF, DOC, DOCX supported</span>}
          </label>
        </CardContent>
      </Card>

      {/* Job Description */}
      <Card className="bg-slate-800/60 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2 text-base">
            <ClipboardList className="h-5 w-5 text-cyan-400" />
            Job Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here (requirements, responsibilities, qualifications)..."
            rows={8}
            className="w-full bg-slate-900/60 border border-slate-600 rounded-lg p-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 resize-none"
          />
          <p className="text-xs text-slate-500 mt-1">Include the full posting for best results</p>
        </CardContent>
      </Card>

      <Button
        onClick={handleAnalyze}
        disabled={!resumeUrl || !jobDescription.trim() || analyzing}
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-6 text-base rounded-xl shadow-lg"
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
          <div className={`rounded-2xl bg-gradient-to-r ${scoreBg(analysis.match_score)} p-6 text-white shadow-xl`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80 mb-1">Overall Match Score</p>
                <p className="text-5xl font-bold">{analysis.match_score}<span className="text-2xl">%</span></p>
                <p className="text-lg font-semibold mt-1 opacity-90">{analysis.match_label} Match</p>
              </div>
              <div className="text-right">
                <div className="w-24 h-24 rounded-full border-4 border-white/30 flex items-center justify-center">
                  <TrendingUp className="h-10 w-10 text-white/80" />
                </div>
              </div>
            </div>
            {analysis.summary && (
              <p className="text-sm mt-4 opacity-90 leading-relaxed border-t border-white/20 pt-4">{analysis.summary}</p>
            )}
          </div>

          {/* Strengths */}
          {analysis.strengths?.length > 0 && (
            <Card className="bg-slate-800/60 border-green-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-green-400 flex items-center gap-2 text-base">
                  <CheckCircle2 className="h-5 w-5" /> Your Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Present Keywords */}
          {analysis.present_keywords?.length > 0 && (
            <Card className="bg-slate-800/60 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-teal-400 flex items-center gap-2 text-base">
                  <CheckCircle2 className="h-5 w-5" /> Keywords Already in Your Resume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.present_keywords.map((kw, i) => (
                    <span key={i} className="px-2.5 py-1 bg-teal-600/20 text-teal-300 border border-teal-600/40 rounded-full text-xs font-medium">
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Missing Keywords */}
          {analysis.missing_keywords?.length > 0 && (
            <Card className="bg-slate-800/60 border-red-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-red-400 flex items-center gap-2 text-base">
                  <XCircle className="h-5 w-5" /> Missing Keywords
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-400 mb-3">These keywords appear in the job description but not your resume. Add them where relevant.</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.missing_keywords.map((kw, i) => (
                    <span key={i} className="px-2.5 py-1 bg-red-500/20 text-red-300 border border-red-500/40 rounded-full text-xs font-medium">
                      ✕ {kw}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Missing Skills */}
          {analysis.missing_skills?.length > 0 && (
            <Card className="bg-slate-800/60 border-orange-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-orange-400 flex items-center gap-2 text-base">
                  <AlertTriangle className="h-5 w-5" /> Skills Gaps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis.missing_skills.map((item, i) => (
                  <div key={i} className="bg-slate-900/40 rounded-lg p-3 border border-slate-700">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white">{item.skill}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs border ${importanceColor(item.importance)}`}>
                        {item.importance}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{item.suggestion}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Resume Improvements */}
          {analysis.resume_improvements?.length > 0 && (
            <Card className="bg-slate-800/60 border-violet-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-violet-400 flex items-center gap-2 text-base">
                  <Lightbulb className="h-5 w-5" /> How to Improve Your Resume
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis.resume_improvements.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-slate-900/40 rounded-lg p-3 border border-slate-700">
                    <div className="px-2 py-0.5 bg-violet-600/30 text-violet-300 rounded text-xs font-semibold whitespace-nowrap mt-0.5">
                      {item.section}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.suggestion}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Button
            variant="outline"
            onClick={() => { setAnalysis(null); setJobDescription(''); }}
            className="w-full border-slate-600 text-slate-300"
          >
            Analyze Another Job
          </Button>
        </div>
      )}
    </div>
  );
}