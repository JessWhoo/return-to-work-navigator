import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useOfflineEntity } from '@/lib/useOfflineEntity';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, Edit, Trash2, Copy, Calendar, 
  ChevronDown, ChevronUp, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import DraftFromResourcesButton from './DraftFromResourcesButton';

export default function SavedDrafts({ onEdit }) {
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const [expandedDraft, setExpandedDraft] = useState(null);
  const draftAPI = useOfflineEntity('CommunicationDraft');

  const { data: drafts, isLoading } = useQuery({
    queryKey: ['communication-drafts'],
    enabled: !isLoadingAuth && !!isAuthenticated,
    queryFn: () => draftAPI.list('-updated_date')
  });

  const deleteDraftMutation = useMutation({
    mutationFn: (draftId) => draftAPI.remove(draftId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communication-drafts'] });
      toast.success('Draft deleted');
    }
  });

  const handleCopy = (draft) => {
    const fullText = `Subject: ${draft.subject}\n\n${draft.content}`;
    navigator.clipboard.writeText(fullText);
    toast.success('Draft copied to clipboard!');
    
    base44.analytics.track({
      eventName: 'communication_draft_copied',
      properties: {
        scenario_type: draft.scenario_type
      }
    });
  };

  const scenarioLabels = {
    diagnosis_disclosure: 'Disclosing Diagnosis',
    accommodation_request: 'Accommodation Request',
    schedule_flexibility: 'Schedule Flexibility',
    work_from_home: 'Work From Home',
    declining_task: 'Declining Task',
    explaining_limitations: 'Explaining Limitations',
    return_to_work_plan: 'Return to Work Plan',
    follow_up_request: 'Follow-up Request',
    boundaries_setting: 'Setting Boundaries',
    other: 'Other'
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!drafts || drafts.length === 0) {
    return (
      <Card className="nv-card--muted">
        <CardContent className="py-12 text-center">
          <FileText className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">No saved drafts yet</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Start creating and saving your workplace communications
          </p>
          <div className="flex justify-center">
            <DraftFromResourcesButton />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="font-heading text-lg font-semibold text-foreground">Your Saved Drafts</h3>
          <Badge variant="secondary">
            {drafts.length} {drafts.length === 1 ? 'draft' : 'drafts'}
          </Badge>
        </div>
        <DraftFromResourcesButton />
      </div>

      {drafts.map((draft) => {
        const isExpanded = expandedDraft === draft.id;
        return (
          <Card key={draft.id}>
            <CardHeader className="cursor-pointer" onClick={() => setExpandedDraft(isExpanded ? null : draft.id)}>
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <CardTitle className="mb-2 text-lg text-foreground">{draft.title}</CardTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">
                      {scenarioLabels[draft.scenario_type]}
                    </Badge>
                    {draft.recipient && (
                      <Badge variant="outline" className="text-xs">
                        To: {draft.recipient}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs capitalize">
                      {draft.tone} tone
                    </Badge>
                    <span className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(draft.updated_date), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" aria-expanded={isExpanded} aria-label={isExpanded ? 'Collapse draft' : 'Expand draft'}>
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>

            {isExpanded && (
              <CardContent className="space-y-4 border-t border-border pt-4">
                {draft.subject && (
                  <div>
                    <p className="mb-1 text-xs font-semibold text-muted-foreground">Subject:</p>
                    <p className="text-sm text-foreground">{draft.subject}</p>
                  </div>
                )}
                <div>
                  <p className="mb-2 text-xs font-semibold text-muted-foreground">Content:</p>
                  <div className="max-h-64 overflow-y-auto rounded-brand bg-muted p-4">
                    <pre className="whitespace-pre-wrap font-body text-sm [overflow-wrap:anywhere] text-foreground">
                      {draft.content}
                    </pre>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
                  <Button
                    size="sm"
                    onClick={() => onEdit(draft)}
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(draft)}
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    variant="destructiveOutline"
                    onClick={() => deleteDraftMutation.mutate(draft.id)}
                    className="!whitespace-normal"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}