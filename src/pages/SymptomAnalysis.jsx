import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, Plus, Calendar, TrendingUp, AlertCircle,
  Thermometer, Clock
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import AddRecordDialog from '../components/records/AddRecordDialog';
import AISymptomInsights from '../components/symptoms/AISymptomInsights';
import { useUserProgress } from '@/hooks/useUserProgress';
import PageHeader from '@/components/brand/PageHeader';
import useSEO from '@/hooks/useSEO';

export default function SymptomAnalysis() {
  useSEO({
    title: 'Workplace Symptom Pattern Analysis & Severity Log',
    description:
      'Track and analyze post-treatment symptoms like fatigue, neuropathy, and cognitive fog to share clear reports with your oncology team and employer.',
    path: '/SymptomAnalysis',
  });
  const queryClient = useQueryClient();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const { data: symptomRecords, isLoading } = useQuery({
    queryKey: ['symptomRecords'],
    queryFn: async () => {
      return await base44.entities.Record.filter({ type: 'symptom' }, '-date', 50);
    }
  });

  const { data: progress } = useUserProgress();

  const deleteRecordMutation = useMutation({
    mutationFn: async (id) => await base44.entities.Record.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['symptomRecords']);
    }
  });

  const getSeverityColor = (severity) => {
    if (severity >= 8) return 'bg-destructive';
    if (severity >= 6) return 'bg-primary';
    return 'bg-brand-secondary';
  };

  const getRecentStats = () => {
    if (!symptomRecords || symptomRecords.length === 0) return null;

    const recent7Days = symptomRecords.slice(0, 7);
    const avgSeverity = recent7Days.reduce((sum, r) => 
      sum + (r.symptom_details?.severity || 0), 0
    ) / recent7Days.length;

    const symptomTypes = [...new Set(
      symptomRecords.flatMap(r => r.symptom_details?.symptom_type || [])
    )];

    return {
      totalLogs: symptomRecords.length,
      recentAvgSeverity: avgSeverity.toFixed(1),
      uniqueSymptoms: symptomTypes.length,
      mostRecent: symptomRecords[0]
    };
  };

  const stats = getRecentStats();

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <PageHeader title="Workplace Symptom Pattern & Severity Analysis" subtitle="Track post-treatment symptom trends and severity to share with your care team and manage your workday" actions={<Button onClick={() => setShowAddDialog(true)}><Plus className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />Log Symptom</Button>} />

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-2 flex items-center justify-between">
                <Activity className="h-8 w-8 text-primary" />
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.totalLogs}</div>
              <p className="mt-1 text-sm text-muted-foreground">Total Symptom Logs</p>
              <p className="mt-1 text-xs text-muted-foreground">{stats.uniqueSymptoms} unique types</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="mb-2 flex items-center justify-between">
                <Thermometer className="h-8 w-8 text-primary" />
                <div className={`h-3 w-3 rounded-full ${getSeverityColor(parseFloat(stats.recentAvgSeverity))}`} />
              </div>
              <div className="text-3xl font-bold text-foreground">{stats.recentAvgSeverity}/10</div>
              <p className="mt-1 text-sm text-muted-foreground">Avg Severity (7 days)</p>
              <p className="mt-1 text-xs text-muted-foreground">Recent trend</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="mb-2 flex items-center justify-between">
                <Calendar className="h-8 w-8 text-primary" />
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div className="text-lg font-bold text-foreground">
                {stats.mostRecent ? format(parseISO(stats.mostRecent.date), 'MMM d') : 'N/A'}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Last Logged</p>
              {stats.mostRecent?.symptom_details?.symptom_type && (
                <p className="mt-1 break-words text-xs text-muted-foreground">
                  {stats.mostRecent.symptom_details.symptom_type.slice(0, 2).join(', ')}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Symptom Insights */}
      {symptomRecords && symptomRecords.length > 0 && (
        <AISymptomInsights symptomRecords={symptomRecords} progress={progress} />
      )}

      {/* Recent Symptom Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2 text-lg text-foreground sm:text-xl">
            <Activity className="h-5 w-5 text-primary" />
            <span>Recent Symptom Logs</span>
            <Badge variant="secondary">{symptomRecords?.length || 0}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground">Loading...</div>
          ) : !symptomRecords || symptomRecords.length === 0 ? (
            <div className="space-y-4 py-12 text-center">
              <AlertCircle className="mx-auto h-16 w-16 text-muted-foreground" />
              <div>
                <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">No Symptoms Logged Yet</h3>
                <p className="mb-4 text-muted-foreground">Start tracking your symptoms to receive AI-powered insights</p>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="h-4 w-4" />
                  Log Your First Symptom
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {symptomRecords.slice(0, 10).map((record) => (
                <div
                  key={record.id}
                  className="nv-card nv-card--muted p-4 [overflow-wrap:anywhere]"
                >
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold text-foreground">{record.title}</h4>
                        <Badge variant="outline" className={`${getSeverityColor(record.symptom_details?.severity)} ${record.symptom_details?.severity >= 6 ? 'text-primary-foreground' : 'text-secondary-foreground'} rounded-pill`}>
                          Severity: {record.symptom_details?.severity}/10
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(record.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <Button
                      variant="destructiveOutline"
                      size="sm"
                      onClick={() => deleteRecordMutation.mutate(record.id)}
                      className="shrink-0"
                    >
                      Delete
                    </Button>
                  </div>

                  {record.symptom_details?.symptom_type && (
                    <div className="mb-2 flex flex-wrap gap-1">
                      {record.symptom_details.symptom_type.map((type, idx) => (
                        <Badge key={idx} variant="outline" className="rounded-pill text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {record.symptom_details?.triggers && (
                    <div className="mb-1 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Triggers:</span> {record.symptom_details.triggers}
                    </div>
                  )}

                  {record.symptom_details?.duration && (
                    <div className="mb-1 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Duration:</span> {record.symptom_details.duration}
                    </div>
                  )}

                  {record.symptom_details?.relief_measures && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Relief:</span> {record.symptom_details.relief_measures}
                    </div>
                  )}

                  {record.content && (
                    <p className="mt-2 border-t border-border pt-2 text-sm text-foreground">
                      {record.content}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Record Dialog */}
      <AddRecordDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        initialType="symptom"
      />
    </div>
  );
}