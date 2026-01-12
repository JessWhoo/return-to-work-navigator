import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, Search, FileText, Stethoscope, Briefcase, 
  BookOpen, Activity, Calendar, Tag, Filter,
  ChevronDown, Edit, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import AddRecordDialog from '../components/records/AddRecordDialog';
import RecordDetailView from '../components/records/RecordDetailView';

export default function RecordKeeping() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [expandedRecord, setExpandedRecord] = useState(null);

  const { data: records = [], isLoading } = useQuery({
    queryKey: ['records'],
    queryFn: () => base44.entities.Record.list('-date')
  });

  const deleteRecordMutation = useMutation({
    mutationFn: (id) => base44.entities.Record.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['records']);
    }
  });

  const recordTypes = [
    { value: 'all', label: 'All Records', icon: FileText, color: 'from-gray-500 to-slate-500' },
    { value: 'medical', label: 'Medical', icon: Stethoscope, color: 'from-rose-500 to-pink-500' },
    { value: 'workplace', label: 'Workplace', icon: Briefcase, color: 'from-blue-500 to-cyan-500' },
    { value: 'journal', label: 'Journal', icon: BookOpen, color: 'from-purple-500 to-violet-500' },
    { value: 'symptom', label: 'Symptoms', icon: Activity, color: 'from-amber-500 to-orange-500' }
  ];

  const filteredRecords = records.filter(record => {
    const matchesSearch = searchQuery === '' || 
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || record.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getRecordIcon = (type) => {
    const config = recordTypes.find(t => t.value === type);
    return config?.icon || FileText;
  };

  const getRecordColor = (type) => {
    const config = recordTypes.find(t => t.value === type);
    return config?.color || 'from-gray-500 to-slate-500';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-200">Record Keeping</h1>
          <p className="text-slate-400 mt-1">
            Document your journey, track progress, and maintain important records
          </p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Record
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {recordTypes.slice(1).map((type) => {
          const Icon = type.icon;
          const count = records.filter(r => r.type === type.value).length;
          return (
            <Card key={type.value} className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-slate-200">{count}</p>
                    <p className="text-xs text-slate-400">{type.label}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${type.color}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search records..."
                className="pl-10 bg-slate-900/50 border-slate-600 text-slate-200"
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
                    className={typeFilter === type.value ? `bg-gradient-to-r ${type.color}` : 'border-slate-600 text-slate-300'}
                  >
                    <Icon className="h-4 w-4 mr-2" />
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
            const color = getRecordColor(record.type);
            const isExpanded = expandedRecord === record.id;

            return (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${color} flex-shrink-0`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <CardTitle className="text-lg text-slate-200">{record.title}</CardTitle>
                            <Badge variant="outline" className="border-slate-600 text-slate-400 capitalize">
                              {record.type}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-slate-400">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {format(new Date(record.date), 'MMM d, yyyy')}
                            </span>
                            {record.tags?.length > 0 && (
                              <span className="flex items-center">
                                <Tag className="h-3 w-3 mr-1" />
                                {record.tags.length} tags
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-300 mt-2 line-clamp-2">
                            {record.content}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setExpandedRecord(isExpanded ? null : record.id)}
                          className="text-slate-400 hover:text-slate-200"
                        >
                          <ChevronDown className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedRecord(record)}
                          className="text-slate-400 hover:text-slate-200"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteRecordMutation.mutate(record.id)}
                          className="text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="border-t border-slate-700 pt-4">
                      <RecordDetailView record={record} />
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredRecords.length === 0 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No records found</p>
              <p className="text-sm text-slate-500 mt-1">
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
  );
}