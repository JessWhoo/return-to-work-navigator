import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useOfflineEntity } from '@/lib/useOfflineEntity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus, Calendar, ChevronRight, Loader2, Users, FileText,
  CheckCircle2, Clock, AlertCircle, MessageSquare, Pencil, Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import MeetingPrepForm from '../components/meetingprep/MeetingPrepForm';
import EmployerResponseLog from '../components/meetingprep/EmployerResponseLog';

const STATUS_CONFIG = {
  drafting: { label: 'Drafting', color: 'bg-slate-700 text-slate-300', icon: Clock },
  ready: { label: 'Ready', color: 'bg-blue-900/40 text-blue-300 border-blue-600/40', icon: CheckCircle2 },
  completed: { label: 'Completed', color: 'bg-green-900/40 text-green-300 border-green-600/40', icon: CheckCircle2 },
  follow_up: { label: 'Follow-up Needed', color: 'bg-orange-900/40 text-orange-300 border-orange-600/40', icon: AlertCircle }
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

export default function MeetingPrep() {
  const queryClient = useQueryClient();
  const [view, setView] = useState('list'); // 'list' | 'new' | 'detail'
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [activeTab, setActiveTab] = useState('prep');

  const { data: meetings = [], isLoading } = useQuery({
    queryKey: ['meeting-preps'],
    queryFn: () => base44.entities.MeetingPrep.list('-created_date', 50)
  });

  const handleDelete = async (id) => {
    if (!confirm('Delete this meeting prep?')) return;
    await base44.entities.MeetingPrep.delete(id);
    queryClient.invalidateQueries(['meeting-preps']);
    if (selectedMeeting?.id === id) { setView('list'); setSelectedMeeting(null); }
  };

  const openDetail = (meeting) => {
    setSelectedMeeting(meeting);
    setActiveTab('prep');
    setView('detail');
  };

  const refreshSelected = async () => {
    const updated = await base44.entities.MeetingPrep.list('-created_date', 50);
    queryClient.setQueryData(['meeting-preps'], updated);
    const fresh = updated.find(m => m.id === selectedMeeting?.id);
    if (fresh) setSelectedMeeting(fresh);
  };

  // LIST VIEW
  if (view === 'list') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Meeting Prep</h1>
            <p className="text-slate-400 mt-1">Prepare talking points, track employer responses, get AI coaching.</p>
          </div>
          <Button onClick={() => setView('new')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <Plus className="h-4 w-4 mr-2" /> New Meeting Prep
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          </div>
        ) : meetings.length === 0 ? (
          <Card className="bg-slate-800/80 border-purple-600/40">
            <CardContent className="py-16 text-center space-y-4">
              <Users className="h-16 w-16 text-slate-600 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-slate-300">No meeting preps yet</h3>
                <p className="text-slate-500 text-sm mt-1">Create one to organize your talking points and track employer responses.</p>
              </div>
              <Button onClick={() => setView('new')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Plus className="h-4 w-4 mr-2" /> Create Your First Meeting Prep
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
                <Card key={meeting.id}
                  className="bg-slate-800/80 border-slate-700 hover:border-purple-500/50 transition-all cursor-pointer group"
                  onClick={() => openDetail(meeting)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold text-slate-200 truncate">{meeting.title}</h3>
                          <Badge className={`text-xs ${statusCfg.color}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusCfg.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {MEETING_TYPE_LABELS[meeting.meeting_type] || meeting.meeting_type}
                          </span>
                          {meeting.meeting_date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(meeting.meeting_date), 'MMM d, yyyy')}
                            </span>
                          )}
                          <span>{meeting.talking_points?.length || 0} talking points</span>
                          {responseCount > 0 && (
                            <span className="flex items-center gap-1 text-purple-400">
                              <MessageSquare className="h-3 w-3" />
                              {responseCount} employer response{responseCount > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button size="icon" variant="ghost"
                          onClick={e => { e.stopPropagation(); handleDelete(meeting.id); }}
                          className="text-slate-600 hover:text-red-400 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                        <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-slate-300" />
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
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => setView('list')} className="text-slate-400 hover:text-slate-200">
            ← Back
          </Button>
          <h1 className="text-2xl font-bold text-white">New Meeting Prep</h1>
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
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => setView('list')} className="text-slate-400 hover:text-slate-200">
              ← Back
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">{selectedMeeting.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`text-xs ${statusCfg.color}`}>
                  <StatusIcon className="h-3 w-3 mr-1" /> {statusCfg.label}
                </Badge>
                <span className="text-xs text-slate-400">
                  {MEETING_TYPE_LABELS[selectedMeeting.meeting_type]}
                </span>
                {selectedMeeting.meeting_date && (
                  <span className="text-xs text-slate-400">
                    · {format(new Date(selectedMeeting.meeting_date), 'MMM d, yyyy')}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button size="sm" variant="ghost"
            onClick={() => { setActiveTab('edit'); }}
            className="text-slate-400 hover:text-slate-200 flex-shrink-0">
            <Pencil className="h-4 w-4 mr-1" /> Edit
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="prep" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-400">
              Meeting Prep
            </TabsTrigger>
            <TabsTrigger value="responses" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-400">
              Employer Responses
              {(selectedMeeting.employer_responses?.length || 0) > 0 && (
                <span className="ml-1.5 bg-purple-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {selectedMeeting.employer_responses.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="edit" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-400">
              Edit
            </TabsTrigger>
          </TabsList>

          {/* PREP TAB - read-only summary */}
          <TabsContent value="prep" className="space-y-4 mt-4">
            {selectedMeeting.goals && (
              <Card className="bg-slate-800/80 border-slate-700">
                <CardContent className="pt-4">
                  <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Goals</p>
                  <p className="text-slate-300 text-sm">{selectedMeeting.goals}</p>
                </CardContent>
              </Card>
            )}

            {selectedMeeting.talking_points?.length > 0 && (
              <Card className="bg-slate-800/80 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-200 text-sm">Talking Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {selectedMeeting.talking_points.map((pt, i) => (
                      <li key={i} className="flex gap-2 text-sm text-slate-300">
                        <span className="text-purple-400 font-semibold flex-shrink-0">{i + 1}.</span> {pt}
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}

            {selectedMeeting.accommodation_requests?.length > 0 && (
              <Card className="bg-slate-800/80 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-200 text-sm">Accommodation Requests</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedMeeting.accommodation_requests.map((req, i) => (
                    <div key={i} className="bg-slate-900/60 rounded-lg p-3">
                      <p className="text-sm font-medium text-slate-200">{req.accommodation}</p>
                      {req.reason && <p className="text-xs text-slate-400 mt-1">{req.reason}</p>}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {selectedMeeting.anticipated_objections?.length > 0 && (
              <Card className="bg-slate-800/80 border-amber-600/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-200 text-sm">Anticipated Objections</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {selectedMeeting.anticipated_objections.map((obj, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <Badge className="bg-amber-900/40 text-amber-300 border-amber-600/40 mt-0.5 flex-shrink-0 text-xs">?</Badge>
                      <p className="text-sm text-slate-300">{obj}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {selectedMeeting.documents_to_bring?.length > 0 && (
              <Card className="bg-slate-800/80 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-200 text-sm">Documents to Bring</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {selectedMeeting.documents_to_bring.map((doc, i) => (
                      <li key={i} className="flex gap-2 text-sm text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" /> {doc}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <Button className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200"
              onClick={() => {
                const summary = `I have a meeting prep for "${selectedMeeting.title}". My goals: ${selectedMeeting.goals || 'not set'}. Talking points: ${selectedMeeting.talking_points?.join('; ')}. Can you help me feel confident going in?`;
                localStorage.setItem('pendingCoachMessage', summary);
                window.location.href = '/Coach';
              }}>
              <MessageSquare className="h-4 w-4 mr-2" /> Discuss this meeting with my AI Coach
            </Button>
          </TabsContent>

          {/* RESPONSES TAB */}
          <TabsContent value="responses" className="mt-4">
            <EmployerResponseLog meeting={selectedMeeting} onUpdate={refreshSelected} />
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

  return null;
}