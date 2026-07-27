import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { GrievanceIssue, IssueStatus } from '../../types/grievance';
import { StatusBadge } from './StatusBadge';
import { Timeline } from './Timeline';
import { 
  X, 
  User, 
  Phone, 
  BookOpen, 
  Wrench, 
  Paperclip, 
  UserCheck, 
  FileText, 
  ArrowUpRight
} from 'lucide-react';

interface IssueDetailsModalProps {
  issueId: string | null;
  onClose: () => void;
  onOpenAssignModal?: (issue: GrievanceIssue) => void;
  onOpenResolutionModal?: (issue: GrievanceIssue) => void;
}

export const IssueDetailsModal: React.FC<IssueDetailsModalProps> = ({ 
  issueId, 
  onClose,
  onOpenAssignModal,
  onOpenResolutionModal
}) => {
  const { issues, updateIssueStatus, currentRole } = useApp();
  const [commentInput, setCommentInput] = useState('');

  if (!issueId) return null;
  const issue = issues.find(i => i.id === issueId);
  if (!issue) return null;

  const isAcademic = issue.type === 'academic';

  const handleStatusChange = (newStatus: IssueStatus) => {
    updateIssueStatus(issue.id, newStatus, commentInput || undefined);
    setCommentInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-3 sm:p-6 flex min-h-full items-end sm:items-center justify-center">
      <div className="relative w-full max-w-4xl glass-panel rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl my-auto max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
        
        {/* Top Header */}
        <div className="flex items-start justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700 gap-4 shrink-0">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded">
                {issue.id}
              </span>
              <StatusBadge status={issue.status} />
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {issue.type}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {issue.title}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              Submitted: {issue.submittedAt}
            </p>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Scrollable Layout */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1 max-h-[calc(90vh-100px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Issue Info & Description (2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Student Info Card (ID, Name, Department, Mobile) */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-500" />
                  Student Details
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Name</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{issue.student.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Student ID</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">{issue.student.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Department</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{issue.student.department}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Mobile</span>
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {issue.student.mobile}
                    </span>
                  </div>
                </div>
              </div>

              {/* Type Specific Information */}
              {isAcademic ? (
                <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/60 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-brand-500" />
                    Academic Specifications
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Subject</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{issue.subject || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Faculty Evaluator</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{issue.facultyName || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Category</span>
                      <span className="font-semibold text-brand-600 dark:text-brand-400">{issue.academicCategory || 'Academic'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-amber-500" />
                    Maintenance Location & Category
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Building / Block</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{issue.building || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Floor & Room</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{issue.floor || 'N/A'} • {issue.roomNumber || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Category</span>
                      <span className="font-semibold text-amber-600 dark:text-amber-400">{issue.maintenanceCategory || 'General Maintenance'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Detailed Description
                </h3>
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {issue.description}
                </div>
              </div>

              {/* Attachments */}
              {((issue.evidenceFiles && issue.evidenceFiles.length > 0) || (issue.attachments && issue.attachments.length > 0)) && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5" />
                    Evidence & Attachment Documents
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[...(issue.evidenceFiles || []), ...(issue.attachments || [])].map((file, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                        <FileText className="w-4 h-4 text-brand-500" />
                        <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">{file}</span>
                        <button onClick={() => alert(`Opening preview of ${file}`)} className="p-1 hover:text-brand-500">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assigned Staff (Only for Authorities) */}
              {currentRole !== 'student_council' && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Assigned Authority / Staff
                    </span>
                    {issue.assignedTo ? (
                      <div className="flex items-center gap-2 mt-1">
                        <UserCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{issue.assignedTo.name}</div>
                          <div className="text-[10px] text-slate-500">{issue.assignedTo.role} • Assigned {issue.assignedTo.assignedAt}</div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1 block">
                        Unassigned - Pending Authority Dispatch
                      </span>
                    )}
                  </div>

                  {(currentRole === 'ad_academic' || currentRole === 'ad_maintenance') && onOpenAssignModal && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenAssignModal(issue);
                      }}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-brand-500 text-white hover:bg-brand-600 shadow-sm shrink-0"
                    >
                      {issue.assignedTo ? 'Re-assign Staff' : 'Assign Staff Now'}
                    </button>
                  )}
                </div>
              )}

              {/* Action Bar based on Role (Only for Operational Decks) */}
              {currentRole !== 'student_council' && currentRole !== 'admin' && (
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Update Status & Add Log Entry
                  </h4>
                  {currentRole !== 'ad_students' && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Optional log comment for status change..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                      />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {currentRole === 'ad_students' ? (
                      onOpenResolutionModal && (
                        <button
                          onClick={() => {
                            onClose();
                            onOpenResolutionModal(issue);
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 inline-flex items-center gap-2"
                        >
                          <UserCheck className="w-4 h-4" />
                          <span>Verify & Close Ticket</span>
                        </button>
                      )
                    ) : (
                      <>
                        <button
                          onClick={() => handleStatusChange('investigating')}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-500 text-white hover:bg-blue-600"
                        >
                          Set Investigating
                        </button>

                        <button
                          onClick={() => handleStatusChange('work_started')}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700"
                        >
                          Work Started
                        </button>

                        <button
                          onClick={() => handleStatusChange('work_completed')}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700"
                        >
                          Work Completed
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: Timeline & Student Feedback (1 col) */}
            <div className="space-y-6">
              
              {/* Student Feedback Box if closed/reopened */}
              {issue.feedback && (
                <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                      Student Feedback Score
                    </span>
                    <span className="text-xs font-bold text-amber-500">
                      {'★'.repeat(issue.feedback.rating)}{'☆'.repeat(5 - issue.feedback.rating)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                    "{issue.feedback.comments}"
                  </p>
                  <div className="text-[10px] text-slate-400">
                    Logged: {issue.feedback.submittedAt}
                  </div>
                </div>
              )}

              {/* Audit Timeline */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                  Resolution Timeline Trail
                </h3>
                <Timeline timeline={issue.timeline} />
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
