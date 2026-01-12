import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Tag, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function RecordDetailView({ record }) {
  return (
    <div className="space-y-4">
      {/* Full Content */}
      <div>
        <h4 className="font-semibold text-slate-200 mb-2">Notes</h4>
        <p className="text-sm text-slate-300 whitespace-pre-wrap">{record.content}</p>
      </div>

      {/* Medical Details */}
      {record.type === 'medical' && record.medical_details && (
        <div className="bg-rose-900/20 rounded-lg p-4 border border-rose-800">
          <h4 className="font-semibold text-slate-200 mb-3">Medical Details</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {record.medical_details.doctor_name && (
              <div>
                <span className="text-slate-400">Doctor:</span>
                <span className="text-slate-200 ml-2">{record.medical_details.doctor_name}</span>
              </div>
            )}
            {record.medical_details.work_restrictions && (
              <div className="col-span-2">
                <span className="text-slate-400">Work Restrictions:</span>
                <p className="text-slate-200 mt-1">{record.medical_details.work_restrictions}</p>
              </div>
            )}
            {record.medical_details.next_appointment && (
              <div>
                <span className="text-slate-400">Next Appointment:</span>
                <span className="text-slate-200 ml-2">
                  {format(new Date(record.medical_details.next_appointment), 'MMM d, yyyy')}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Workplace Details */}
      {record.type === 'workplace' && record.workplace_details && (
        <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-800">
          <h4 className="font-semibold text-slate-200 mb-3">Workplace Details</h4>
          <div className="space-y-2 text-sm">
            {record.workplace_details.meeting_type && (
              <div>
                <span className="text-slate-400">Meeting Type:</span>
                <Badge variant="outline" className="ml-2 border-slate-600 text-slate-300 capitalize">
                  {record.workplace_details.meeting_type.replace('_', ' ')}
                </Badge>
              </div>
            )}
            {record.workplace_details.outcomes && (
              <div>
                <span className="text-slate-400">Outcomes:</span>
                <p className="text-slate-200 mt-1">{record.workplace_details.outcomes}</p>
              </div>
            )}
            {record.workplace_details.follow_up_needed && (
              <div className="flex items-center text-amber-400">
                <AlertCircle className="h-4 w-4 mr-2" />
                Follow-up needed
                {record.workplace_details.follow_up_date && (
                  <span className="ml-2">
                    by {format(new Date(record.workplace_details.follow_up_date), 'MMM d, yyyy')}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Symptom Details */}
      {record.type === 'symptom' && record.symptom_details && (
        <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-800">
          <h4 className="font-semibold text-slate-200 mb-3">Symptom Details</h4>
          <div className="space-y-2 text-sm">
            {record.symptom_details.severity && (
              <div>
                <span className="text-slate-400">Severity:</span>
                <span className="text-slate-200 ml-2 font-semibold">
                  {record.symptom_details.severity}/10
                </span>
              </div>
            )}
            {record.symptom_details.duration && (
              <div>
                <span className="text-slate-400">Duration:</span>
                <span className="text-slate-200 ml-2">{record.symptom_details.duration}</span>
              </div>
            )}
            {record.symptom_details.relief_measures && (
              <div>
                <span className="text-slate-400">Relief Measures:</span>
                <p className="text-slate-200 mt-1">{record.symptom_details.relief_measures}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tags */}
      {record.tags && record.tags.length > 0 && (
        <div>
          <h4 className="font-semibold text-slate-200 mb-2 flex items-center">
            <Tag className="h-4 w-4 mr-2" />
            Tags
          </h4>
          <div className="flex flex-wrap gap-2">
            {record.tags.map((tag, idx) => (
              <Badge key={idx} variant="outline" className="border-slate-600 text-slate-300">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}