import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { GrievanceIssue } from '../types/grievance';
import { StatusBadge } from '../components/common/StatusBadge';
import { TablePagination } from '../components/common/TablePagination';
import { TableSkeleton } from '../components/common/TableSkeleton';
import { CheckSquare, PhoneCall, Star } from 'lucide-react';

interface StudentVerificationPageProps {
  onOpenResolutionModal: (issue: GrievanceIssue) => void;
}

export const StudentVerificationPage: React.FC<StudentVerificationPageProps> = ({ onOpenResolutionModal }) => {
  const { issues, isLoading, setSelectedIssueId } = useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const pendingVerificationIssues = issues.filter(i => 
    i.status === 'verification_pending' || i.status === 'work_completed'
  );

  const totalPages = Math.ceil(pendingVerificationIssues.length / pageSize) || 1;
  const paginatedIssues = pendingVerificationIssues.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-purple-500" />
            AD Students - Verification & Resolution Audit Queue
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Contact students upon work completion to verify fix satisfaction, record 1-5 star ratings, and finalize ticket closure or reopening.
          </p>
        </div>
        <div className="px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold font-mono">
          {pendingVerificationIssues.length} Tickets Awaiting Student Audit
        </div>
      </div>

      {/* Loading or Grid Cards */}
      {isLoading ? (
        <TableSkeleton rows={4} cols={4} />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedIssues.length === 0 ? (
              <div className="col-span-2 glass-panel p-8 text-center rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                🎉 All completed grievances have been verified and closed by AD Students.
              </div>
            ) : (
              paginatedIssues.map((issue: GrievanceIssue) => (
                <div 
                  key={issue.id} 
                  className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-brand-600 dark:text-brand-400">
                        {issue.id}
                      </span>
                      <StatusBadge status={issue.status} />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {issue.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Student: <b className="text-slate-700 dark:text-slate-200">{issue.student.name}</b> ({issue.student.department})
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                        <PhoneCall className="w-3.5 h-3.5 text-purple-500" />
                        <span>{issue.student.mobile}</span>
                      </div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 font-bold">
                        {issue.type}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedIssueId(issue.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
                    >
                      View File Details
                    </button>

                    <button
                      onClick={() => onOpenResolutionModal(issue)}
                      className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 inline-flex items-center gap-1.5"
                    >
                      <Star className="w-3.5 h-3.5" />
                      <span>Verify & Record Rating</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={pendingVerificationIssues.length}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
            isLoading={isLoading}
          />
        </div>
      )}

    </div>
  );
};
