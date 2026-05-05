import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Upload, Sparkles, Briefcase, MapPin, DollarSign,
  CheckCircle2, Clock, XCircle, FileText, Loader2, Plus, X
} from 'lucide-react';

const MOCK_JOBS = [
  { id: 1, title: 'HR Coordinator', company: 'HealthFirst', location: 'Remote', salary: '$55k–$70k', match: 94, tags: ['Part-Time', 'Flexible', 'Healthcare'] },
  { id: 2, title: 'Patient Advocate', company: 'CareConnect', location: 'Denver, CO', salary: '$50k–$65k', match: 89, tags: ['Cancer-Friendly', 'Hybrid'] },
  { id: 3, title: 'Program Coordinator', company: 'Non-Profit Alliance', location: 'Remote', salary: '$48k–$60k', match: 85, tags: ['Remote', 'Mission-Driven'] },
  { id: 4, title: 'Benefits Specialist', company: 'Acme Corp', location: 'Boulder, CO', salary: '$60k–$75k', match: 78, tags: ['Disability Inclusive', 'Hybrid'] },
];

export default function ApplyIQ() {
  const [step, setStep] = useState('setup'); // setup | results
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [preferences, setPreferences] = useState({
    jobTitle: '',
    location: '',
    jobType: [],
    salary: '',
  });
  const [applications, setApplications] = useState({});
  const [matchedJobs, setMatchedJobs] = useState([]);

  const jobTypes = ['Remote', 'Hybrid', 'In-Person', 'Part-Time', 'Full-Time', 'Flexible Hours'];

  const toggleJobType = (type) => {
    setPreferences(prev => ({
      ...prev,
      jobType: prev.jobType.includes(type)
        ? prev.jobType.filter(t => t !== type)
        : [...prev.jobType, type]
    }));
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setResumeFile(file);
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setResumeUrl(file_url);
    setUploading(false);
  };

  const handleFindJobs = async () => {
    setGenerating(true);
    // Simulate AI matching delay
    await new Promise(r => setTimeout(r, 2000));
    setMatchedJobs(MOCK_JOBS);
    setGenerating(false);
    setStep('results');
  };

  const handleApply = async (job) => {
    setApplications(prev => ({ ...prev, [job.id]: 'applying' }));
    await new Promise(r => setTimeout(r, 1500));
    setApplications(prev => ({ ...prev, [job.id]: 'applied' }));
  };

  const statusIcon = (status) => {
    if (status === 'applying') return <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />;
    if (status === 'applied') return <CheckCircle2 className="h-4 w-4 text-green-400" />;
    return null;
  };

  if (step === 'setup') {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Hero Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-6 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-7 w-7 text-yellow-300" />
            <h2 className="text-2xl font-bold">ApplyIQ</h2>
            <Badge className="bg-yellow-400 text-yellow-900 text-xs font-bold">FREE</Badge>
          </div>
          <p className="text-purple-100 text-sm leading-relaxed">
            Your personal AI job application agent. Upload your resume, tell us what you're looking for,
            and our smart AI will match you to the best jobs.
          </p>
        </div>

        {/* Resume Upload */}
        <Card className="bg-slate-800/60 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2 text-base">
              <FileText className="h-5 w-5 text-violet-400" />
              Step 1: Upload Your Resume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-600 rounded-xl p-8 cursor-pointer hover:border-violet-400 transition-colors bg-slate-900/40">
              <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} />
              {uploading ? (
                <Loader2 className="h-8 w-8 text-violet-400 animate-spin mb-2" />
              ) : resumeFile ? (
                <CheckCircle2 className="h-8 w-8 text-green-400 mb-2" />
              ) : (
                <Upload className="h-8 w-8 text-slate-400 mb-2" />
              )}
              <span className="text-sm text-slate-300 font-medium">
                {uploading ? 'Uploading...' : resumeFile ? resumeFile.name : 'Click to upload PDF or Word doc'}
              </span>
              {!resumeFile && <span className="text-xs text-slate-500 mt-1">PDF, DOC, DOCX supported</span>}
            </label>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="bg-slate-800/60 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2 text-base">
              <Briefcase className="h-5 w-5 text-cyan-400" />
              Step 2: Job Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Job Title / Role</label>
                <Input
                  placeholder="e.g. HR Coordinator, Nurse"
                  value={preferences.jobTitle}
                  onChange={e => setPreferences(p => ({ ...p, jobTitle: e.target.value }))}
                  className="bg-slate-900/60 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Location</label>
                <Input
                  placeholder="City, State or Remote"
                  value={preferences.location}
                  onChange={e => setPreferences(p => ({ ...p, location: e.target.value }))}
                  className="bg-slate-900/60 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-2 block">Work Style (select all that apply)</label>
              <div className="flex flex-wrap gap-2">
                {jobTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => toggleJobType(type)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                      preferences.jobType.includes(type)
                        ? 'bg-violet-600 border-violet-500 text-white'
                        : 'bg-slate-900/40 border-slate-600 text-slate-300 hover:border-violet-500'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Target Salary (optional)</label>
              <Input
                placeholder="e.g. $50,000 – $70,000"
                value={preferences.salary}
                onChange={e => setPreferences(p => ({ ...p, salary: e.target.value }))}
                className="bg-slate-900/60 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleFindJobs}
          disabled={!resumeUrl || !preferences.jobTitle || generating}
          className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-6 text-base rounded-xl shadow-lg"
        >
          {generating ? (
            <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Finding your best matches...</>
          ) : (
            <><Sparkles className="h-5 w-5 mr-2" /> Find My Jobs with AI</>
          )}
        </Button>
      </div>
    );
  }

  // Results step
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            Your AI-Matched Jobs
          </h2>
          <p className="text-sm text-slate-400">{matchedJobs.length} jobs matched to your profile</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setStep('setup')} className="border-slate-600 text-slate-300">
          Edit Preferences
        </Button>
      </div>

      <div className="space-y-4">
        {matchedJobs.map(job => (
          <Card key={job.id} className="bg-slate-800/60 border-slate-700 hover:border-violet-500 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-white">{job.title}</h3>
                    <Badge className="bg-violet-600/30 text-violet-300 border-violet-500/50 text-xs">
                      {job.match}% match
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-300 mb-2">{job.company}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                    <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{job.salary}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {job.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded-full text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleApply(job)}
                  disabled={!!applications[job.id]}
                  className={`shrink-0 ${
                    applications[job.id] === 'applied'
                      ? 'bg-green-600 hover:bg-green-600'
                      : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500'
                  } text-white`}
                >
                  {statusIcon(applications[job.id])}
                  {!applications[job.id] && 'Apply'}
                  {applications[job.id] === 'applying' && 'Applying...'}
                  {applications[job.id] === 'applied' && 'Applied!'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <p className="text-xs text-slate-500">
          Applied to {Object.values(applications).filter(s => s === 'applied').length} of {matchedJobs.length} jobs
        </p>
      </div>
    </div>
  );
}