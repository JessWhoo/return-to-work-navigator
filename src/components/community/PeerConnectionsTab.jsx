import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, CheckCircle, Edit3, Heart, Briefcase, ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/AuthContext';

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

const LOOKING_FOR_OPTIONS = [
  'Workplace advice', 'Emotional support', 'Industry-specific tips',
  'Accommodation guidance', 'General encouragement'
];

const STAGE_COLORS = {
  planning: 'bg-brand-compass-cream text-brand-text',
  first_week: 'bg-brand-sky text-brand-text',
  ongoing: 'bg-brand-muted text-brand-text',
  completed: 'bg-brand-secondary text-brand-text',
};

function ProfileForm({ existing, onSave, onCancel }) {
  const [form, setForm] = useState({
    display_name: existing?.display_name || '',
    industry: existing?.industry || '',
    return_stage: existing?.return_stage || '',
    bio: existing?.bio || '',
    looking_for: existing?.looking_for || [],
    is_active: existing?.is_active ?? true,
  });

  const toggle = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  return (
    <Card className="border-brand-primary">
      <CardHeader>
        <CardTitle className="text-brand-primary flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          {existing ? 'Edit Your Profile' : 'Create Your Peer Profile'}
        </CardTitle>
        <p className="text-brand-muted-foreground text-sm">Your profile is anonymous — no personal info is shared.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-brand-text text-sm font-medium block mb-1">Anonymous Display Name *</label>
          <Input
            aria-label="Anonymous Display Name"
            value={form.display_name}
            onChange={e => setForm(prev => ({ ...prev, display_name: e.target.value }))}
            placeholder="e.g. HopefulTeacher, TechSurvivor42"
            className="nv-input"
          />
        </div>

        <div>
          <label className="text-brand-text text-sm font-medium block mb-1">Industry *</label>
          <select
            value={form.industry}
            onChange={e => setForm(prev => ({ ...prev, industry: e.target.value }))}
            aria-label="Industry" className="nv-input min-h-11 w-full px-3 py-2 text-sm"
          >
            <option value="">Select your industry…</option>
            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>

        <div>
          <label className="text-brand-text text-sm font-medium block mb-1">Return-to-Work Stage *</label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {STAGES.map(s => (
              <button
                key={s.value}
                type="button"
                aria-pressed={form.return_stage === s.value}
                onClick={() => setForm(prev => ({ ...prev, return_stage: s.value }))}
                className={`nv-btn nv-btn--sm !whitespace-normal ${form.return_stage === s.value ? '' : 'nv-btn--outline'}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-brand-text text-sm font-medium block mb-1">I'm looking for…</label>
          <div className="flex flex-wrap gap-2">
            {LOOKING_FOR_OPTIONS.map(opt => (
              <button
                key={opt}
                type="button"
                aria-pressed={form.looking_for.includes(opt)}
                onClick={() => toggle('looking_for', opt)}
                className={`nv-btn nv-btn--sm !whitespace-normal ${form.looking_for.includes(opt) ? '' : 'nv-btn--outline'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-brand-text text-sm font-medium block mb-1">Short Bio (optional)</label>
          <textarea
            aria-label="Short Bio"
            value={form.bio}
            onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
            rows={3}
            placeholder="Share a little about your journey or what you hope to give/receive…"
            className="nv-input w-full px-3 py-2 text-sm resize-none"
          />
        </div>

        <div className="flex flex-col gap-3 border-t border-brand-border pt-4 sm:flex-row">
          <Button
            onClick={() => onSave(form)}
            disabled={!form.display_name.trim() || !form.industry || !form.return_stage}
            className="flex-1 !whitespace-normal"
          >
            <CheckCircle className="h-4 w-4" />
            {existing ? 'Save Changes' : 'Join Peer Network'}
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel} className="!whitespace-normal">
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function PeerCard({ peer, isSelf, onConnect, alreadyConnected }) {
  const stageLabel = STAGES.find(s => s.value === peer.return_stage)?.label || peer.return_stage;

  return (
    <Card className="">
      <CardContent className="pt-5 space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-brand-text font-semibold">{peer.display_name}</span>
              {isSelf && <Badge className="bg-brand-muted text-brand-primary text-xs">You</Badge>}
            </div>
            <div className="flex items-center gap-1 text-brand-muted-foreground text-sm mt-1">
              <Briefcase className="h-3.5 w-3.5" />
              {peer.industry}
            </div>
          </div>
          <Badge variant="outline" className={`rounded-pill text-xs ${STAGE_COLORS[peer.return_stage] || 'bg-brand-muted text-brand-text'}`}>
            {stageLabel}
          </Badge>
        </div>

        {peer.bio && (
          <p className="text-brand-muted-foreground text-sm">{peer.bio}</p>
        )}

        {peer.looking_for?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {peer.looking_for.map(item => (
              <Badge key={item} variant="outline" className="text-xs border-brand-border text-brand-muted-foreground">
                {item}
              </Badge>
            ))}
          </div>
        )}

        {!isSelf && (
          <Button
            size="sm"
            disabled={alreadyConnected}
            onClick={() => onConnect(peer)}
            className="w-full !whitespace-normal"
          >
            {alreadyConnected ? (
              <><CheckCircle className="h-4 w-4" /> Request Sent</>
            ) : (
              <><Heart className="h-4 w-4" /> Request Connection</>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function PeerConnectionsTab() {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [filterStage, setFilterStage] = useState('all');

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    enabled: !isLoadingAuth && !!isAuthenticated,
  });

  const { data: allPeers = [], isLoading } = useQuery({
    queryKey: ['peerConnections'],
    enabled: !isLoadingAuth && !!isAuthenticated,
    queryFn: () => base44.entities.PeerConnection.filter({ is_active: true }),
  });

  const myProfile = allPeers.find(p => p.created_by_id === currentUser?.id);

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.PeerConnection.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['peerConnections'] });
      setEditing(false);
      toast.success('Your peer profile is live!');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.PeerConnection.update(myProfile.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['peerConnections'] });
      setEditing(false);
      toast.success('Profile updated!');
    }
  });

  const connectMutation = useMutation({
    mutationFn: async (peer) => {
      // Add peer's id to my sent list, and add my profile id to their received list
      const mySentList = [...(myProfile.connection_requests_sent || []), peer.id];
      const theirReceivedList = [...(peer.connection_requests_received || []), myProfile.id];
      await Promise.all([
        base44.entities.PeerConnection.update(myProfile.id, { connection_requests_sent: mySentList }),
        base44.entities.PeerConnection.update(peer.id, { connection_requests_received: theirReceivedList }),
      ]);
    },
    onSuccess: (_, peer) => {
      queryClient.invalidateQueries({ queryKey: ['peerConnections'] });
      toast.success(`Connection request sent to ${peer.display_name}! They'll see your interest anonymously.`);
    }
  });

  const handleSave = (form) => {
    if (myProfile) {
      updateMutation.mutate(form);
    } else {
      createMutation.mutate(form);
    }
  };

  const filteredPeers = allPeers.filter(p => {
    if (filterIndustry !== 'all' && p.industry !== filterIndustry) return false;
    if (filterStage !== 'all' && p.return_stage !== filterStage) return false;
    return true;
  });

  const hasRequestedConnection = (peer) => {
    return myProfile?.connection_requests_sent?.includes(peer.id) || false;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4 [overflow-wrap:anywhere]">
      {/* Header */}
      <div className="nv-card nv-card--muted p-5 flex items-start gap-4">
        <div className="bg-brand-surface rounded-xl p-3 flex-shrink-0">
          <Users className="h-6 w-6 text-brand-primary" />
        </div>
        <div>
          <h2 className="text-brand-text font-bold text-lg">Peer Connections</h2>
          <p className="text-brand-text text-sm mt-1">
            Anonymously connect with fellow cancer survivors who are on a similar return-to-work journey. 
            Match by industry or stage — no personal info shared.
          </p>
        </div>
      </div>

      {/* My Profile Section */}
      {!myProfile && !editing && (
        <Card className="nv-card--muted">
          <CardContent className="py-10 text-center space-y-4">
            <Sparkles className="h-10 w-10 text-brand-primary mx-auto" />
            <div>
              <h3 className="text-brand-text font-semibold text-lg">Join the Peer Network</h3>
              <p className="text-brand-muted-foreground text-sm mt-1 max-w-sm mx-auto">
                Create an anonymous profile to connect with survivors in similar industries or stages.
              </p>
            </div>
            <Button onClick={() => setEditing(true)} className="max-w-full !whitespace-normal">
              <UserPlus className="h-4 w-4" />
              Create My Anonymous Profile
            </Button>
          </CardContent>
        </Card>
      )}

      {myProfile && !editing && (
        <Card className="nv-card--muted">
          <CardContent className="pt-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="nv-eyebrow nv-eyebrow--primary">Your Profile</p>
                <h3 className="text-brand-text font-bold text-lg">{myProfile.display_name}</h3>
                <p className="text-brand-muted-foreground text-sm">{myProfile.industry} · {STAGES.find(s => s.value === myProfile.return_stage)?.label}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => setEditing(true)} className="">
                <Edit3 className="h-4 w-4" /> Edit
              </Button>
            </div>
            {myProfile.bio && <p className="text-brand-muted-foreground text-sm">{myProfile.bio}</p>}
            {myProfile.connection_requests_received?.length > 0 && (
              <div className="bg-brand-secondary/20 border border-brand-secondary rounded-lg px-4 py-2 flex items-center gap-2">
                <Heart className="h-4 w-4 text-brand-primary" />
                <span className="text-brand-text text-sm">
                  <strong>{myProfile.connection_requests_received.length}</strong> peer{myProfile.connection_requests_received.length !== 1 ? 's' : ''} want to connect with you!
                </span>
                <ArrowRight className="h-4 w-4 text-brand-primary ml-auto" />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {editing && (
        <ProfileForm
          existing={myProfile}
          onSave={handleSave}
          onCancel={myProfile ? () => setEditing(false) : null}
        />
      )}

      {/* Filters */}
      {allPeers.length > 0 && (
        <div className="flex flex-wrap gap-3">
          <select
            aria-label="Filter by industry"
            value={filterIndustry}
            onChange={e => setFilterIndustry(e.target.value)}
            className="nv-input min-h-11 w-full min-w-0 px-3 py-2 text-sm sm:w-auto sm:max-w-full"
          >
            <option value="all">All Industries</option>
            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
          <select
            aria-label="Filter by return stage"
            value={filterStage}
            onChange={e => setFilterStage(e.target.value)}
            className="nv-input min-h-11 w-full min-w-0 px-3 py-2 text-sm sm:w-auto sm:max-w-full"
          >
            <option value="all">All Stages</option>
            {STAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <span className="text-brand-muted-foreground text-sm self-center">
            {filteredPeers.length} peer{filteredPeers.length !== 1 ? 's' : ''} found
          </span>
        </div>
      )}

      {/* Peer Grid */}
      {filteredPeers.length === 0 && !isLoading && (
        <div className="text-center py-10 text-brand-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p>No peers found yet. Be the first to join!</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredPeers.map(peer => (
          <PeerCard
            key={peer.id}
            peer={peer}
            isSelf={peer.created_by_id === currentUser?.id}
            alreadyConnected={hasRequestedConnection(peer)}
            onConnect={(p) => {
              if (!myProfile) {
                toast.error('Create your peer profile first to connect with others!');
                setEditing(true);
                return;
              }
              connectMutation.mutate(p);
            }}
          />
        ))}
      </div>
    </div>
  );
}