import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, Plus, Calendar, TrendingUp, AlertCircle,
  Thermometer, Clock, Zap
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import AddRecordDialog from '../components/records/AddRecordDialog';
import AISymptomInsights from '../components/symptoms/AISymptomInsights';

export default function SymptomAnalysis() {
  const queryClient = useQueryClient();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const { data: symptomRecords, isLoading } = useQuery({
    queryKey: ['symptomRecords'],
    queryFn: async () => {
      return await base44.entities.Record.filter({ type: 'symptom' }, '-date', 50);
    }
  });

  const { data: progress } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const progressList = await base44.entities.UserProgress.list();
      return progressList[0] || null;
    }
  });

  const deleteRecordMutation = useMutation({
    mutationFn: async (id) => await base44.entities.Record.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['symptomRecords']);
    }
  });

  const getSeverityColor = (severity) => {
    if (severity >= 8) return 'bg-red-500';
    if (severity >= 6) return 'bg-orange-500';
    if (severity >= 4) return 'bg-yellow-500';
    return 'bg-green-500';
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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">
            Symptom Analysis
          </h1>
          <p className="text-slate-300 mt-2">Track patterns and manage symptoms effectively</p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Log Symptom
        </Button>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-rose-900/40 to-pink-900/40 border-2 border-rose-600">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Activity className="h-8 w-8 text-rose-400" />
                <TrendingUp className="h-5 w-5 text-rose-400" />
              </div>
              <div className="text-3xl font-bold text-rose-400">{stats.totalLogs}</div>
              <p className="text-sm text-slate-300 mt-1">Total Symptom Logs</p>
              <p className="text-xs text-slate-500 mt-1">{stats.uniqueSymptoms} unique types</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900/40 to-amber-900/40 border-2 border-orange-600">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Thermometer className="h-8 w-8 text-orange-400" />
                <div className={`h-3 w-3 rounded-full ${getSeverityColor(parseFloat(stats.recentAvgSeverity))}`} />
              </div>
              <div className="text-3xl font-bold text-orange-400">{stats.recentAvgSeverity}/10</div>
              <p className="text-sm text-slate-300 mt-1">Avg Severity (7 days)</p>
              <p className="text-xs text-slate-500 mt-1">Recent trend</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/40 to-violet-900/40 border-2 border-purple-600">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="h-8 w-8 text-purple-400" />
                <Clock className="h-5 w-5 text-purple-400" />
              </div>
              <div className="text-lg font-bold text-purple-400">
                {stats.mostRecent ? format(parseISO(stats.mostRecent.date), 'MMM d') : 'N/A'}
              </div>
              <p className="text-sm text-slate-300 mt-1">Last Logged</p>
              {stats.mostRecent?.symptom_details?.symptom_type && (
                <p className="text-xs text-slate-500 mt-1 truncate">
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
      <Card className="bg-slate-800/90 backdrop-blur-sm border-2 border-rose-600">
        <CardHeader>
          <CardTitle className="text-slate-200 flex items-center space-x-2">
            <Activity className="h-5 w-5 text-rose-400" />
            <span>Recent Symptom Logs</span>
            <Badge className="bg-rose-600">{symptomRecords?.length || 0}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-slate-400">Loading...</div>
          ) : !symptomRecords || symptomRecords.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <AlertCircle className="h-16 w-16 text-slate-600 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-slate-300 mb-2">No Symptoms Logged Yet</h3>
                <p className="text-slate-400 mb-4">Start tracking your symptoms to receive AI-powered insights</p>
                <Button
                  onClick={() => setShowAddDialog(true)}
                  className="bg-gradient-to-r from-rose-600 to-orange-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Log Your First Symptom
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {symptomRecords.slice(0, 10).map((record) => (
                <div
                  key={record.id}
                  className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 hover:border-rose-500 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-slate-200">{record.title}</h4>
                        <Badge className={`${getSeverityColor(record.symptom_details?.severity)} text-white`}>
                          Severity: {record.symptom_details?.severity}/10
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400">
                        {format(parseISO(record.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteRecordMutation.mutate(record.id)}
                      className="text-slate-500 hover:text-red-400"
                    >
                      Delete
                    </Button>
                  </div>

                  {record.symptom_details?.symptom_type && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {record.symptom_details.symptom_type.map((type, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-rose-600 text-rose-400">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {record.symptom_details?.triggers && (
                    <div className="text-sm text-slate-400 mb-1">
                      <span className="text-orange-400">Triggers:</span> {record.symptom_details.triggers}
                    </div>
                  )}

                  {record.symptom_details?.duration && (
                    <div className="text-sm text-slate-400 mb-1">
                      <span className="text-cyan-400">Duration:</span> {record.symptom_details.duration}
                    </div>
                  )}

                  {record.symptom_details?.relief_measures && (
                    <div className="text-sm text-slate-400">
                      <span className="text-green-400">Relief:</span> {record.symptom_details.relief_measures}
                    </div>
                  )}

                  {record.content && (
                    <p className="text-sm text-slate-300 mt-2 pt-2 border-t border-slate-700">
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