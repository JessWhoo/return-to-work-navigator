import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap, Star, UserPlus, CheckCircle, Edit3,
  Briefcase, Heart, Users, Sparkles, Clock
} from 'lucide-react';
import { toast } from 'sonner';
import BottomSheetSelect from '@/components/ui/bottom-sheet-select';

const INDUSTRIES = [
  'Healthcare', 'Education', 'Technology', 'Finance',
  'Retail & Hospitality', 'Manufacturing', 'Government & Nonprofit',
  'Creative & Media', 'Legal & Professional Services', 'Other'
];

const STAGES = [
  { value: 'planning', label: 'Planning my return' },
  { value: 'first_week', label: 'First week back' },
  { value: 'ongoing', label: 'Ongoing return' },
  { value: 'completed', label: 'Successfully returned' },
];

const STAGE_ORDER = ['planning', 'first_week', 'ongoing', 'completed'];

const TOPICS = [
  'Disclosing to employer', 'Requesting accommodations', 'Managing fatigue at work',
  'Navigating HR conversations', 'Rebuilding confidence', 'Legal rights (ADA/FMLA)',
  'Emotional support', 'Industry-specific advice', 'Work-life balance'
];

const AVAILABILITY_OPTIONS = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'as_needed', label: 'As needed' },
];

const STAGE_COLORS = {
  planning: 'bg-yellow-100 text-yellow-800',
  first_week: 'bg-blue-100 text-blue-800',
  ongoing: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
};

function MentorshipForm({ existing, onSave, onCancel }) {
  const [form, setForm] = useState({
    display_name: existing?.display_name || '',
    role: existing?.role || 'mentee',
    industry: existing?.industry || '',
    return_stage: existing?.return_stage || '',
    offer_or_seek: existing?.offer_or_seek || [],
    availability: existing?.availability || '',
    bio: existing?.bio || '',
    is_active: existing?.is_active ?? true,
  });

  const toggleTopic = (topic) => {
    setForm(prev => ({
      ...prev,
      offer_or_seek: prev.offer_or_seek.includes(topic)
        ? prev.offer_or_seek.filter(t => t !== topic)
        : [...prev.offer_or_seek, topic]
    }));
  };

  const isValid = form.display_name.trim() && form.industry && form.return_stage && form.availability;

  return (
    <Card className="bg-slate-800 border-purple-600 border-2">
      <CardHeader>
        <CardTitle className="text-purple-300 flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          {existing ? 'Edit Mentorship Profile' : 'Join the Mentorship Program'}
        </CardTitle>
        <p className="text-slate-400 text-sm">All profiles are anonymous — no personal info is shared.</p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Role */}
        <div>
          <label className="text-slate-300 text-sm font-medium block mb-2">I want to…</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'mentee', label: 'Find a Mentor', desc: 'Get guidance from someone further along', icon: Star },
              { value: 'mentor', label: 'Be a Mentor', desc: 'Support someone earlier in their journey', icon: GraduationCap },
            ].map(({ value, label, desc, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, role: value }))}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  form.role === value
                    ? 'border-purple-500 bg-purple-900/40'
                    : 'border-slate-600 bg-slate-900/60 hover:border-purple-500/50'
                }`}
              >
                <Icon className={`h-5 w-5 mb-1 ${form.role === value ? 'text-purple-300' : 'text-slate-400'}`} />
                <p className={`font-semibold text-sm ${form.role === value ? 'text-purple-200' : 'text-slate-300'}`}>{label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="text-slate-300 text-sm font-medium block mb-1">Anonymous Display Name *</label>
          <Input
            value={form.display_name}
            onChange={e => setForm(prev => ({ ...prev, display_name: e.target.value }))}
            placeholder="e.g. HopefulTeacher, TechSurvivor42"
            className="bg-slate-900 border-slate-600 text-slate-200 placeholder:text-slate-500"
          />
        </div>

        {/* Industry */}
        <div>
          <label className="text-slate-300 text-sm font-medium block mb-1">Industry *</label>
          <BottomSheetSelect
            value={form.industry}
            onValueChange={(v) => setForm(prev => ({ ...prev, industry: v }))}
            title="Select your industry"
            placeholder="Select your industry…"
            options={INDUSTRIES.map(i => ({ value: i, label: i }))}
          />
        </div>

        {/* Stage */}
        <div>
          <label className="text-slate-300 text-sm font-medium block mb-2">Return-to-Work Stage *</label>
          <div className="grid grid-cols-2 gap-2">
            {STAGES.map(s => (
              <button
                key={s.value}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, return_stage: s.value }))}
                className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                  form.return_stage === s.value
                    ? 'bg-purple-600 text-white border-purple-500'
                    : 'bg-slate-900 text-slate-300 border-slate-600 hover:border-purple-500'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Topics */}
        <div>
          <label className="text-slate-300 text-sm font-medium block mb-2">
            {form.role === 'mentor' ? 'Topics I can help with…' : 'Topics I want support with…'}
          </label>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map(topic => (
              <button
                key={topic}
                type="button"
                onClick={() => toggleTopic(topic)}
                className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                  form.offer_or_seek.includes(topic)
                    ? 'bg-purple-600 text-white border-purple-500'
                    : 'bg-slate-900 text-slate-300 border-slate-600 hover:border-purple-500'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div>
          <label className="text-slate-300 text-sm font-medium block mb-2">Availability *</label>
          <div className="grid grid-cols-2 gap-2">
            {AVAILABILITY_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, availability: opt.value }))}
                className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                  form.availability === opt.value
                    ? 'bg-purple-600 text-white border-purple-500'
                    : 'bg-slate-900 text-slate-300 border-slate-600 hover:border-purple-500'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="text-slate-300 text-sm font-medium block mb-1">Short Bio (optional)</label>
          <textarea
            value={form.bio}
            onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
            rows={3}
            placeholder={form.role === 'mentor'
              ? "Share what you've learned and how you can help others..."
              : "Share a bit about your journey and what kind of support you're looking for..."}
            className="w-full px-3 py-2 text-sm border border-slate-600 rounded-lg bg-slate-900 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
          />
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            onClick={() => onSave(form)}
            disabled={!isValid}
            className="bg-purple-600 hover:bg-purple-700 text-white flex-1"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {existing ? 'Save Changes' : `Join as ${form.role === 'mentor' ? 'Mentor' : 'Mentee'}`}
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel} className="border-slate-600 text-slate-300">
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function MentorCard({ profile, isSelf, onRequestMatch, alreadyRequested, myRole }) {
  const stageLabel = STAGES.find(s => s.value === profile.return_stage)?.label || profile.return_stage;
  const availLabel = AVAILABILITY_OPTIONS.find(a => a.value === profile.availability)?.label || profile.availability;
  const isCompatible = myRole === 'mentee' && profile.role === 'mentor';

  return (
    <Card className="bg-slate-800/80 border border-slate-600 hover:border-purple-500 transition-all">
      <CardContent className="pt-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white font-semibold">{profile.display_name}</span>
              {isSelf && <Badge className="bg-purple-700 text-purple-200 text-xs">You</Badge>}
              <Badge className={`text-xs ${profile.role === 'mentor' ? 'bg-purple-100 text-purple-800' : 'bg-cyan-100 text-cyan-800'}`}>
                {profile.role === 'mentor' ? '🎓 Mentor' : '🌱 Mentee'}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm mt-1 flex-wrap">
              <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{profile.industry}</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{availLabel}</span>
            </div>
          </div>
          <Badge className={`text-xs flex-shrink-0 ${STAGE_COLORS[profile.return_stage] || 'bg-slate-600 text-slate-200'}`}>
            {stageLabel}
          </Badge>
        </div>

        {profile.bio && (
          <p className="text-slate-400 text-sm leading-relaxed">{profile.bio}</p>
        )}

        {profile.offer_or_seek?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {profile.offer_or_seek.slice(0, 4).map(t => (
              <Badge key={t} variant="outline" className="text-xs border-slate-600 text-slate-400">{t}</Badge>
            ))}
            {profile.offer_or_seek.length > 4 && (
              <Badge variant="outline" className="text-xs border-slate-600 text-slate-500">+{profile.offer_or_seek.length - 4} more</Badge>
            )}
          </div>
        )}

        {!isSelf && (
          <Button
            size="sm"
            disabled={alreadyRequested}
            onClick={() => onRequestMatch(profile)}
            className={alreadyRequested
              ? 'bg-slate-700 text-slate-400 cursor-default w-full'
              : isCompatible
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white w-full'
                : 'bg-gradient-to-r from-cyan-700 to-teal-700 hover:from-cyan-600 hover:to-teal-600 text-white w-full'
            }
          >
            {alreadyRequested ? (
              <><CheckCircle className="h-4 w-4 mr-2" />Match Requested</>
            ) : (
              <><Heart className="h-4 w-4 mr-2" />Request Match</>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function MentorshipTab() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [filterRole, setFilterRole] = useState('all');
  const [filterIndustry, setFilterIndustry] = useState('all');

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: allProfiles = [], isLoading } = useQuery({
    queryKey: ['mentorshipProfiles'],
    queryFn: () => base44.entities.MentorshipProfile.filter({ is_active: true }),
  });

  const myProfile = allProfiles.find(p => p.created_by === currentUser?.email);

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.MentorshipProfile.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['mentorshipProfiles']);
      setEditing(false);
      toast.success('Your mentorship profile is live!');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.MentorshipProfile.update(myProfile.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['mentorshipProfiles']);
      setEditing(false);
      toast.success('Profile updated!');
    }
  });

  const matchMutation = useMutation({
    mutationFn: async (profile) => {
      const mySent = [...(myProfile.match_requests_sent || []), profile.id];
      const theirReceived = [...(profile.match_requests_received || []), myProfile.id];
      await Promise.all([
        base44.entities.MentorshipProfile.update(myProfile.id, { match_requests_sent: mySent }),
        base44.entities.MentorshipProfile.update(profile.id, { match_requests_received: theirReceived }),
      ]);
    },
    onSuccess: (_, profile) => {
      queryClient.invalidateQueries(['mentorshipProfiles']);
      toast.success(`Match request sent to ${profile.display_name}! They'll see your interest anonymously.`);
    }
  });

  const handleSave = (form) => {
    myProfile ? updateMutation.mutate(form) : createMutation.mutate(form);
  };

  const hasRequested = (profile) => myProfile?.match_requests_sent?.includes(profile.id) || false;

  // Smart filtering: mentees see mentors at same/more advanced stage; mentors see mentees at earlier stage
  const filteredProfiles = allProfiles.filter(p => {
    if (filterRole !== 'all' && p.role !== filterRole) return false;
    if (filterIndustry !== 'all' && p.industry !== filterIndustry) return false;
    return true;
  });

  // Suggested matches for mentees: mentors at same or later stage, same industry prioritized
  const suggestedMatches = myProfile?.role === 'mentee'
    ? allProfiles
        .filter(p => p.role === 'mentor' && p.created_by !== currentUser?.email)
        .filter(p => STAGE_ORDER.indexOf(p.return_stage) >= STAGE_ORDER.indexOf(myProfile.return_stage))
        .sort((a, b) => {
          const sameIndustryA = a.industry === myProfile.industry ? -1 : 0;
          const sameIndustryB = b.industry === myProfile.industry ? -1 : 0;
          return sameIndustryA - sameIndustryB;
        })
        .slice(0, 3)
    : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/60 to-pink-900/40 border border-purple-700 rounded-2xl p-5 flex items-start gap-4">
        <div className="bg-purple-700/50 rounded-xl p-3 flex-shrink-0">
          <GraduationCap className="h-6 w-6 text-purple-300" />
        </div>
        <div>
          <h2 className="text-white font-bold text-lg">Peer Mentorship Program</h2>
          <p className="text-slate-300 text-sm mt-1">
            Get matched with a mentor who's been through a similar journey, or offer your experience to someone just starting out. All connections are anonymous.
          </p>
          <div className="flex gap-3 mt-3 flex-wrap">
            <span className="flex items-center gap-1.5 text-xs text-purple-300">
              <GraduationCap className="h-3.5 w-3.5" /> {allProfiles.filter(p => p.role === 'mentor').length} mentors available
            </span>
            <span className="flex items-center gap-1.5 text-xs text-cyan-300">
              <Users className="h-3.5 w-3.5" /> {allProfiles.filter(p => p.role === 'mentee').length} mentees enrolled
            </span>
          </div>
        </div>
      </div>

      {/* My Profile */}
      {!myProfile && !editing && (
        <Card className="bg-slate-800/60 border-2 border-dashed border-slate-600 hover:border-purple-500 transition-all">
          <CardContent className="py-10 text-center space-y-4">
            <Sparkles className="h-10 w-10 text-purple-400 mx-auto" />
            <div>
              <h3 className="text-white font-semibold text-lg">Opt In to Mentorship</h3>
              <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
                Whether you're seeking guidance or ready to give back, join the program and get matched anonymously.
              </p>
            </div>
            <Button onClick={() => setEditing(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
              <UserPlus className="h-4 w-4 mr-2" />
              Join Mentorship Program
            </Button>
          </CardContent>
        </Card>
      )}

      {myProfile && !editing && (
        <Card className="bg-gradient-to-br from-purple-900/40 to-slate-800 border border-purple-600">
          <CardContent className="pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-xs font-medium uppercase tracking-wide">Your Mentorship Profile</p>
                <h3 className="text-white font-bold text-lg">{myProfile.display_name}</h3>
                <div className="flex items-center gap-2 flex-wrap mt-1">
                  <Badge className={`text-xs ${myProfile.role === 'mentor' ? 'bg-purple-100 text-purple-800' : 'bg-cyan-100 text-cyan-800'}`}>
                    {myProfile.role === 'mentor' ? '🎓 Mentor' : '🌱 Mentee'}
                  </Badge>
                  <span className="text-slate-400 text-sm">{myProfile.industry}</span>
                  <span className="text-slate-400 text-sm">·</span>
                  <span className="text-slate-400 text-sm">{STAGES.find(s => s.value === myProfile.return_stage)?.label}</span>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => setEditing(true)} className="border-slate-500 text-slate-300 hover:bg-slate-700">
                <Edit3 className="h-4 w-4 mr-1" /> Edit
              </Button>
            </div>
            {myProfile.bio && <p className="text-slate-400 text-sm">{myProfile.bio}</p>}
            {myProfile.match_requests_received?.length > 0 && (
              <div className="bg-purple-800/40 border border-purple-600 rounded-lg px-4 py-2 flex items-center gap-2">
                <Heart className="h-4 w-4 text-purple-400" />
                <span className="text-purple-200 text-sm">
                  <strong>{myProfile.match_requests_received.length}</strong> {myProfile.role === 'mentor' ? 'mentee' : 'mentor'}{myProfile.match_requests_received.length !== 1 ? 's' : ''} want to connect with you!
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {editing && (
        <MentorshipForm
          existing={myProfile}
          onSave={handleSave}
          onCancel={myProfile ? () => setEditing(false) : null}
        />
      )}

      {/* Smart Suggested Matches */}
      {suggestedMatches.length > 0 && !editing && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <h3 className="text-white font-semibold">Suggested Matches for You</h3>
            <Badge className="bg-purple-900 text-purple-300 text-xs">Smart Match</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {suggestedMatches.map(profile => (
              <MentorCard
                key={profile.id}
                profile={profile}
                isSelf={false}
                alreadyRequested={hasRequested(profile)}
                myRole={myProfile?.role}
                onRequestMatch={(p) => {
                  if (!myProfile) { toast.error('Create your profile first!'); setEditing(true); return; }
                  matchMutation.mutate(p);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Browse All */}
      {allProfiles.length > 0 && !editing && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h3 className="text-white font-semibold">Browse All Participants</h3>
            <div className="flex gap-2 flex-wrap items-center">
              <div className="min-w-[150px]">
                <BottomSheetSelect
                  value={filterRole}
                  onValueChange={setFilterRole}
                  title="Filter by role"
                  options={[
                    { value: 'all', label: 'All Roles' },
                    { value: 'mentor', label: 'Mentors only' },
                    { value: 'mentee', label: 'Mentees only' },
                  ]}
                />
              </div>
              <div className="min-w-[170px]">
                <BottomSheetSelect
                  value={filterIndustry}
                  onValueChange={setFilterIndustry}
                  title="Filter by industry"
                  options={[
                    { value: 'all', label: 'All Industries' },
                    ...INDUSTRIES.map(i => ({ value: i, label: i })),
                  ]}
                />
              </div>
              <span className="text-slate-400 text-sm self-center">{filteredProfiles.length} found</span>
            </div>
          </div>

          {filteredProfiles.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p>No participants match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredProfiles.map(profile => (
                <MentorCard
                  key={profile.id}
                  profile={profile}
                  isSelf={profile.created_by === currentUser?.email}
                  alreadyRequested={hasRequested(profile)}
                  myRole={myProfile?.role}
                  onRequestMatch={(p) => {
                    if (!myProfile) { toast.error('Create your profile first!'); setEditing(true); return; }
                    matchMutation.mutate(p);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {allProfiles.length === 0 && !editing && (
        <div className="text-center py-10 text-slate-400">
          <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p>No one has joined yet — be the first!</p>
        </div>
      )}
    </div>
  );
}