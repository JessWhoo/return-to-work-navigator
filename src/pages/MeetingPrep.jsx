import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useOfflineEntity } from '@/lib/useOfflineEntity';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus, Calendar, ChevronRight, Loader2, Users, FileText,
  CheckCircle2, Clock, AlertCircle, MessageSquare, Pencil, Trash2, Library, Download, Printer
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import MeetingPrepForm from '../components/meetingprep/MeetingPrepForm';
import EmployerResponseLog from '../components/meetingprep/EmployerResponseLog';
import ConversationSimulator from '../components/meetingprep/ConversationSimulator';
import TemplateLibrary from '../components/meetingprep/TemplateLibrary';
import TalkingPointsGenerator from '../components/meetingprep/TalkingPointsGenerator';
import { exportMeetingPrepPdf } from '../components/meetingprep/exportMeetingPrepPdf';
import PrintableMeetingDoc from '../components/meetingprep/PrintableMeetingDoc';
import useSEO from '@/hooks/useSEO';

const STATUS_CONFIG = {
  drafting: { label: 'Drafting', variant: 'outline', icon: Clock },
  ready: { label: 'Ready', variant: 'secondary', icon: CheckCircle2 },
  completed: { label: 'Completed', variant: 'secondary', icon: CheckCircle2 },
  follow_up: { label: 'Follow-up Needed', variant: 'destructive', icon: AlertCircle }
};

const MEETING_TYPE_LABELS = {
  accommodation_request: 'Accommodation Request',
  return_to_work_plan: 'Return to Work Plan',
  performance_review: 'Performance Review',
  hr_discussion: 'HR Discussion',
  supervisor_checkin: 'Supervisor Check-in',
  disclosure: 'Medical Disclosure',
  other: 'Other'
};

export default function MeetingPrep({ embedded = false }) {
  useSEO({
    title: 'HR & Supervisor Return-to-Work Meeting Prep Planner',
    description:
      'Plan your return-to-work and accommodation meetings with talking points, anticipated employer questions, response logs, and printable agendas.',
    path: '/MeetingPrep',
    enabled: !embedded,
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const [view, setView] = useState('list'); // 'list' | 'new' | 'detail' | 'templates'
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [activeTab, setActiveTab] = useState('prep');
  const [showPrintDoc, setShowPrintDoc] = useState(false);

  const meetingAPI = useOfflineEntity('MeetingPrep');

  const { data: meetings = [], isLoading } = useQuery({
    queryKey: ['meeting-preps'],
    enabled: !isLoadingAuth && !!isAuthenticated,
    queryFn: () => meetingAPI.list('-created_date', 50)
  });

  const handleDelete = async (id) => {
    if (!confirm('Delete this meeting prep?')) return;
    await meetingAPI.remove(id);
    queryClient.invalidateQueries({ queryKey: ['meeting-preps'] });
    if (selectedMeeting?.id === id) { setView('list'); setSelectedMeeting(null); }
  };

  const openDetail = (meeting) => {
    setSelectedMeeting(meeting);
    setActiveTab('prep');
    setView('detail');
  };

  const refreshSelected = async () => {
    const updated = await meetingAPI.list('-created_date', 50);
    queryClient.setQueryData({ queryKey: ['meeting-preps'] }, updated);
    const fresh = updated.find(m => m.id === selectedMeeting?.id);
    if (fresh) setSelectedMeeting(fresh);
  };

  // LIST VIEW
  if (view === 'list') {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            {embedded ? (
              <h2 className="font-heading text-2xl font-bold text-foreground">Workplace Meeting Preparation &amp; Talking Points</h2>
            ) : (
              <h1 className="font-heading text-3xl font-bold text-foreground">Workplace Meeting Preparation &amp; Talking Points</h1>
            )}
            <p className="mt-1 text-muted-foreground">Prepare talking points, track employer responses, and practice HR conversations.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setView('templates')}>
              <Library className="h-4 w-4" /> Templates
            </Button>
            <Button onClick={() => setView('new')}>
              <Plus className="h-4 w-4" /> New Meeting Prep
            </Button>
          </div>
        </div>

        <TalkingPointsGenerator />

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : meetings.length === 0 ? (
          <Card className="nv-card--muted">
            <CardContent className="space-y-4 py-16 text-center">
              <Users className="mx-auto h-16 w-16 text-muted-foreground" />
              <div>
                <h3 className="font-heading text-lg font-semibold text-foreground">No meeting preps yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">Create one to organize your talking points and track employer responses.</p>
              </div>
              <Button onClick={() => setView('new')}>
                <Plus className="h-4 w-4" /> Create Your First Meeting Prep
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {meetings.map(meeting => {
              const statusCfg = STATUS_CONFIG[meeting.status] || STATUS_CONFIG.drafting;
              const StatusIcon = statusCfg.icon;
              const responseCount = meeting.employer_responses?.length || 0;
              return (
                <Card key={meeting.id} className="group cursor-pointer" onClick={() => openDetail(meeting)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <h3 className="truncate font-semibold text-foreground">{meeting.title}</h3>
                          <Badge variant={statusCfg.variant} className="text-xs">
                            <StatusIcon className="h-3 w-3" />
                            {statusCfg.label}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {MEETING_TYPE_LABELS[meeting.meeting_type] || meeting.meeting_type}
                          </span>
                          {meeting.meeting_date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(parseISO(meeting.meeting_date), 'MMM d, yyyy')}
                            </span>
                          )}
                          <span>{meeting.talking_points?.length || 0} talking points</span>
                          {responseCount > 0 && (
                            <span className="flex items-center gap-1 text-primary">
                              <MessageSquare className="h-3 w-3" />
                              {responseCount} employer response{responseCount > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-wrap items-center gap-2">
                        <Button size="icon" variant="ghost"
                          onClick={e => { e.stopPropagation(); handleDelete(meeting.id); }}
                          aria-label="Delete meeting prep"
                          className="shrink-0">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // NEW MEETING VIEW
  if (view === 'new') {
    return (
      <div className="mx-auto max-w-3xl space-y-4 [overflow-wrap:anywhere]">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => setView('list')}>← Back</Button>
          <h1 className="font-heading text-2xl font-bold text-foreground">New Meeting Prep</h1>
        </div>
        <MeetingPrepForm
          onSave={() => setView('list')}
          onCancel={() => setView('list')}
        />
      </div>
    );
  }

  // DETAIL VIEW
  if (view === 'detail' && selectedMeeting) {
    const statusCfg = STATUS_CONFIG[selectedMeeting.status] || STATUS_CONFIG.drafting;
    const StatusIcon = statusCfg.icon;

    return (
      <div className="mx-auto max-w-3xl space-y-4 [overflow-wrap:anywhere]">
        {showPrintDoc && (
          <PrintableMeetingDoc meeting={selectedMeeting} onClose={() => setShowPrintDoc(false)} />
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => setView('list')}>← Back</Button>
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">{selectedMeeting.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant={statusCfg.variant} className="text-xs">
                  <StatusIcon className="h-3 w-3" /> {statusCfg.label}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {MEETING_TYPE_LABELS[selectedMeeting.meeting_type]}
                </span>
                {selectedMeeting.meeting_date && (
                  <span className="text-xs text-muted-foreground">
                    · {format(parseISO(selectedMeeting.meeting_date), 'MMM d, yyyy')}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Button size="sm" variant="ghost"
              onClick={() => setShowPrintDoc(true)}>
              <Printer className="h-4 w-4" /> Print Document
            </Button>
            <Button size="sm" variant="ghost"
              onClick={() => exportMeetingPrepPdf(selectedMeeting)}>
              <Download className="h-4 w-4" /> Export PDF
            </Button>
            <Button size="sm" variant="ghost"
              onClick={() => { setActiveTab('edit'); }}>
              <Pencil className="h-4 w-4" /> Edit
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="nv-tabs h-auto">
            <TabsTrigger className="nv-tab" value="prep">Meeting Prep</TabsTrigger>
            <TabsTrigger className="nv-tab" value="practice">Practice</TabsTrigger>
            <TabsTrigger className="nv-tab" value="responses">
              Responses
              {(selectedMeeting.employer_responses?.length || 0) > 0 && (
                <span className="ml-1.5 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                  {selectedMeeting.employer_responses.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger className="nv-tab" value="templates">Templates</TabsTrigger>
            <TabsTrigger className="nv-tab" value="edit">Edit</TabsTrigger>
          </TabsList>

          {/* PREP TAB - read-only summary */}
          <TabsContent value="prep" className="mt-4 space-y-4">
            {selectedMeeting.goals && (
              <Card>
                <CardContent className="pt-4">
                  <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Goals</p>
                  <p className="text-sm text-foreground">{selectedMeeting.goals}</p>
                </CardContent>
              </Card>
            )}

            {selectedMeeting.talking_points?.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Talking Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {selectedMeeting.talking_points.map((pt, i) => (
                      <li key={i} className="flex gap-2 text-sm text-foreground">
                        <span className="flex-shrink-0 font-semibold text-primary">{i + 1}.</span> {pt}
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}

            {selectedMeeting.accommodation_requests?.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Accommodation Requests</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedMeeting.accommodation_requests.map((req, i) => (
                    <div key={i} className="rounded-brand bg-muted p-3">
                      <p className="text-sm font-medium text-foreground">{req.accommodation}</p>
                      {req.reason && <p className="mt-1 text-xs text-muted-foreground">{req.reason}</p>}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {selectedMeeting.anticipated_objections?.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Anticipated Objections</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {selectedMeeting.anticipated_objections.map((obj, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5 flex-shrink-0 text-xs">?</Badge>
                      <p className="text-sm text-foreground">{obj}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {selectedMeeting.documents_to_bring?.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Documents to Bring</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {selectedMeeting.documents_to_bring.map((doc, i) => (
                      <li key={i} className="flex gap-2 text-sm text-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-secondary" /> {doc}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <Button variant="outline" className="w-full !whitespace-normal"
              onClick={() => {
                const summary = `I have a meeting prep for "${selectedMeeting.title}". My goals: ${selectedMeeting.goals || 'not set'}. Talking points: ${selectedMeeting.talking_points?.join('; ')}. Can you help me feel confident going in?`;
                localStorage.setItem('pendingCoachMessage', summary);
                navigate('/Coach');
              }}>
              <MessageSquare className="h-4 w-4" /> Discuss this meeting with my AI Coach
            </Button>
          </TabsContent>

          {/* PRACTICE TAB */}
          <TabsContent value="practice" className="mt-4">
            <ConversationSimulator meeting={selectedMeeting} />
          </TabsContent>

          {/* RESPONSES TAB */}
          <TabsContent value="responses" className="mt-4">
            <EmployerResponseLog meeting={selectedMeeting} onUpdate={refreshSelected} />
          </TabsContent>

          {/* TEMPLATES TAB */}
          <TabsContent value="templates" className="mt-4">
            <TemplateLibrary />
          </TabsContent>

          {/* EDIT TAB */}
          <TabsContent value="edit" className="mt-4">
            <MeetingPrepForm
              existing={selectedMeeting}
              onSave={() => { refreshSelected(); setActiveTab('prep'); }}
              onCancel={() => setActiveTab('prep')}
            />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // TEMPLATES VIEW
  if (view === 'templates') {
    return (
      <div className="mx-auto max-w-3xl space-y-4 [overflow-wrap:anywhere]">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => setView('list')}>← Back</Button>
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Template Library</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">Customizable email and agenda templates for common workplace scenarios.</p>
          </div>
        </div>
        <TemplateLibrary />
      </div>
    );
  }

  return null;
}