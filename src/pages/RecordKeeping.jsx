import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useOfflineEntity } from '@/lib/useOfflineEntity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, Search, FileText, Stethoscope, Briefcase, 
  BookOpen, Calendar, Tag,
  ChevronDown, Edit, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import AddRecordDialog from '../components/records/AddRecordDialog';
import RecordDetailView from '../components/records/RecordDetailView';
import PullToRefresh from '../components/PullToRefresh';
import { useAuth } from '@/lib/AuthContext';
import useSEO from '@/hooks/useSEO';

export default function RecordKeeping() {
  useSEO({
    title: 'Private Medical, Workplace & HR Meeting Record Log',
    description:
      'Keep organized, dated records of doctor recommendations, work restrictions, HR accommodation meetings, and workplace journal notes in one private log.',
    path: '/RecordKeeping',
  });
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoadingAuth } = useAuth();

  const handleRefresh = async () => {
    await queryClient.invalidateQueries();
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [expandedRecord, setExpandedRecord] = useState(null);

  const recordAPI = useOfflineEntity('Record');

  const { data: records = [] } = useQuery({
    queryKey: ['records'],
    queryFn: () => recordAPI.list('-date'),
    enabled: !isLoadingAuth && !!isAuthenticated,
  });

  const deleteRecordMutation = useMutation({
    mutationFn: (id) => recordAPI.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
    }
  });

  const recordTypes = [
    { value: 'all', label: 'All Records', icon: FileText },
    { value: 'medical', label: 'Medical', icon: Stethoscope },
    { value: 'workplace', label: 'Workplace', icon: Briefcase },
    { value: 'journal', label: 'Journal', icon: BookOpen }
  ];

  const activeRecords = records.filter(r => r.type !== 'symptom');

  const filteredRecords = activeRecords.filter(record => {
    const matchesSearch = searchQuery === '' || 
      (record.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (record.content || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || record.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getRecordIcon = (type) => {
    const config = recordTypes.find(t => t.value === type);
    return config?.icon || FileText;
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Medical, Workplace &amp; Journal Record Keeping</h1>
          <p className="mt-1 text-muted-foreground">
            Document doctor recommendations, HR meetings, and personal workplace notes in one organized log
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-5 w-5" />
          New Record
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {recordTypes.slice(1).map((type) => {
          const Icon = type.icon;
          const count = activeRecords.filter(r => r.type === type.value).length;
          return (
            <Card key={type.value}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{count}</p>
                    <p className="text-xs text-muted-foreground">{type.label}</p>
                  </div>
                  <div className="rounded-brand bg-muted p-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search records..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {recordTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Button
                    key={type.value}
                    variant={typeFilter === type.value ? 'default' : 'outline'}
                    onClick={() => setTypeFilter(type.value)}
                  >
                    <Icon className="h-4 w-4" />
                    {type.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records Timeline */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredRecords.map((record, idx) => {
            const Icon = getRecordIcon(record.type);
            const isExpanded = expandedRecord === record.id;

            return (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex flex-1 items-start space-x-4">
                        <div className="flex-shrink-0 rounded-brand bg-muted p-3">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex items-center space-x-2">
                            <CardTitle className="text-lg text-foreground">{record.title}</CardTitle>
                            <Badge variant="outline" className="capitalize">
                              {record.type}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3" />
                              {format(parseISO(record.date), 'MMM d, yyyy')}
                            </span>
                            {record.tags?.length > 0 && (
                              <span className="flex items-center">
                                <Tag className="h-3 w-3" />
                                {record.tags.length} tags
                              </span>
                            )}
                          </div>
                          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                            {record.content}
                          </p>
                        </div>
                      </div>
                      <div className="ml-4 flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setExpandedRecord(isExpanded ? null : record.id)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <ChevronDown className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedRecord(record)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteRecordMutation.mutate(record.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="border-t border-border pt-4">
                      <RecordDetailView record={record} />
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredRecords.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No records found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery || typeFilter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'Start by creating your first record'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialogs */}
      <AddRecordDialog
        open={showAddDialog || selectedRecord !== null}
        onClose={() => {
          setShowAddDialog(false);
          setSelectedRecord(null);
        }}
        editRecord={selectedRecord}
      />
    </div>
    </PullToRefresh>
  );
}