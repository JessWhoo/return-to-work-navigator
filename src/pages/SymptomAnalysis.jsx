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

export default function SymptomAnalysis() {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-4xl font-bold text-foreground">
            Symptom Analysis
          </h1>
          <p className="mt-2 text-muted-foreground">Track patterns and manage symptoms effectively</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4" />
          Log Symptom
        </Button>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-2 flex items-center justify-between">
                <Activity className="h-8 w-8 text-destructive" />
                <TrendingUp className="h-5 w-5 text-destructive" />
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
                <p className="mt-1 truncate text-xs text-muted-foreground">
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
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <Activity className="h-5 w-5 text-destructive" />
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
                  className="rounded-brand border border-border bg-muted p-4 transition-all hover:border-destructive"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center space-x-2">
                        <h4 className="font-semibold text-foreground">{record.title}</h4>
                        <Badge className={`${getSeverityColor(record.symptom_details?.severity)} text-white`}>
                          Severity: {record.symptom_details?.severity}/10
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(record.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteRecordMutation.mutate(record.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      Delete
                    </Button>
                  </div>

                  {record.symptom_details?.symptom_type && (
                    <div className="mb-2 flex flex-wrap gap-1">
                      {record.symptom_details.symptom_type.map((type, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
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