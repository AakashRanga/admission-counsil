import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { GrievanceIssue } from '../types/grievance';
import { TablePagination } from '../components/common/TablePagination';
import { TableSkeleton } from '../components/common/TableSkeleton';
import { History, Star, CheckCircle2, ArrowUpRight } from 'lucide-react';

export const ClosedHistoryPage: React.FC = () => {
  const { issues, isLoading, setSelectedIssueId } = useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const closedIssues = issues.filter(i => i.status === 'resolved' || i.status === 'rejected');
  const totalPages = Math.ceil(closedIssues.length / pageSize) || 1;
  const paginatedIssues = closedIssues.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-500" />
            Verified & Closed Grievances History Log
          </h1>
          {/* <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Historical audit log of all grievances verified by AD Students, with satisfaction ratings and final resolution notes.
          </p> */}
        </div>
        <div className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold font-mono">
          {closedIssues.length} Resolved Tickets
        </div>
      </div>

      {/* Closed History Table */}
      <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-4">
        {isLoading ? (
          <TableSkeleton rows={5} cols={7} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[750px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Ticket ID</th>
                  <th className="py-3 px-3">Student & Department</th>
                  <th className="py-3 px-3">Issue Title</th>
                  <th className="py-3 px-3">Closed Date</th>
                  <th className="py-3 px-3">Student Rating</th>
                  <th className="py-3 px-3">Student Feedback</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedIssues.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                      No closed grievances found in history log.
                    </td>
                  </tr>
                ) : (
                  paginatedIssues.map((issue: GrievanceIssue) => (
                    <tr key={issue.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {issue.id}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{issue.student.name}</div>
                        <div className="text-[10px] text-slate-400">{issue.student.department}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-xs">{issue.title}</div>
                        <div className="text-[10px] text-slate-400 uppercase">{issue.type}</div>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                        {issue.closedAt || issue.submittedAt}
                      </td>
                      <td className="py-3 px-3">
                        {issue.feedback ? (
                          <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{issue.feedback.rating} / 5</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            Closed
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 max-w-xs text-slate-600 dark:text-slate-300 italic text-[11px] truncate">
                        "{issue.feedback?.comments || issue.finalRemarks || 'Resolved to student satisfaction.'}"
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setSelectedIssueId(issue.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-semibold shadow-sm inline-flex items-center gap-1"
                        >
                          <span>Audit Record</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={closedIssues.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
          isLoading={isLoading}
        />
      </div>

    </div>
  );
};
