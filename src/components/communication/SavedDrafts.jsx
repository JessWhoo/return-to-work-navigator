import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useOfflineEntity } from '@/lib/useOfflineEntity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, Edit, Trash2, Copy, Calendar, 
  ChevronDown, ChevronUp, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function SavedDrafts({ onEdit }) {
  const queryClient = useQueryClient();
  const [expandedDraft, setExpandedDraft] = useState(null);
  const draftAPI = useOfflineEntity('CommunicationDraft');

  const { data: drafts, isLoading } = useQuery({
    queryKey: ['communication-drafts'],
    queryFn: () => draftAPI.list('-updated_date')
  });

  const deleteDraftMutation = useMutation({
    mutationFn: (draftId) => draftAPI.remove(draftId),
    onSuccess: () => {
      queryClient.invalidateQueries(['communication-drafts']);
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
      <Card className="bg-white">
        <CardContent className="py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600" />
        </CardContent>
      </Card>
    );
  }

  if (!drafts || drafts.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="py-12 text-center">
          <FileText className="h-12 w-12 text-purple-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No saved drafts yet</h3>
          <p className="text-sm text-gray-600">
            Start creating and saving your workplace communications
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Your Saved Drafts</h3>
        <Badge className="bg-purple-100 text-purple-700">
          {drafts.length} {drafts.length === 1 ? 'draft' : 'drafts'}
        </Badge>
      </div>

      {drafts.map((draft) => {
        const isExpanded = expandedDraft === draft.id;
        return (
          <Card key={draft.id} className="bg-white hover:shadow-lg transition-shadow">
            <CardHeader className="cursor-pointer" onClick={() => setExpandedDraft(isExpanded ? null : draft.id)}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-gray-800 mb-2">{draft.title}</CardTitle>
                  <div className="flex items-center space-x-2 flex-wrap gap-2">
                    <Badge className="bg-blue-100 text-blue-800">
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
                    <span className="text-xs text-gray-500 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {format(new Date(draft.updated_date), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>

            {isExpanded && (
              <CardContent className="space-y-4 border-t pt-4">
                {draft.subject && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">Subject:</p>
                    <p className="text-sm text-gray-700">{draft.subject}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2">Content:</p>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
                      {draft.content}
                    </pre>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => onEdit(draft)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(draft)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteDraftMutation.mutate(draft.id)}
                    className="ml-auto text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
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