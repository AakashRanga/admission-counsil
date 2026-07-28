import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { GrievanceIssue } from '../types/grievance';
import { StatusBadge } from '../components/common/StatusBadge';
import { TablePagination } from '../components/common/TablePagination';
import { TableSkeleton } from '../components/common/TableSkeleton';
import { BookOpen, Search, UserCheck, ShieldAlert, ArrowUpRight } from 'lucide-react';

interface AcademicQueuePageProps {
  onOpenAssignModal: (issue: GrievanceIssue) => void;
}

export const AcademicQueuePage: React.FC<AcademicQueuePageProps> = ({ onOpenAssignModal }) => {
  const { issues, isLoading, setSelectedIssueId } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const academicIssues = issues.filter(i => i.type === 'academic');

  const filteredIssues = academicIssues.filter(i => {
    return searchTerm === '' ||
      i.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (i.subject && i.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (i.facultyName && i.facultyName.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const totalPages = Math.ceil(filteredIssues.length / pageSize) || 1;
  const paginatedIssues = filteredIssues.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            AD Academic Affairs - Academic Grievance Work Queue
          </h1>
          {/* <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Dedicated queue for grade disputes, attendance shortage appeals, exam scheduling, and faculty evaluator assignments.
          </p> */}
        </div>
        <div className="px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold font-mono">
          {filteredIssues.length} Active Academic Disputes
        </div>
      </div>

      {/* Filter Control */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by subject, faculty evaluator, academic category, or student..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Academic Table */}
      <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-4">
        {isLoading ? (
          <TableSkeleton rows={5} cols={7} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Ticket ID</th>
                  <th className="py-3 px-3">Student & Department</th>
                  <th className="py-3 px-3">Subject & Faculty</th>
                  <th className="py-3 px-3">Academic Category</th>
                  <th className="py-3 px-3">Assigned Authority</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedIssues.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                      No academic grievances found.
                    </td>
                  </tr>
                ) : (
                  paginatedIssues.map((issue: GrievanceIssue) => (
                    <tr key={issue.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-brand-600 dark:text-brand-400">
                        {issue.id}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{issue.student.name}</div>
                        <div className="text-[10px] text-slate-400">{issue.student.department}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{issue.subject || 'General'}</div>
                        <div className="text-[10px] text-slate-400">Faculty: {issue.facultyName || 'Unspecified'}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                          {issue.academicCategory || 'Academic'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {issue.assignedTo ? (
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                            <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{issue.assignedTo.name}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={issue.status} />
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => onOpenAssignModal(issue)}
                            className="px-2.5 py-1 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-800 text-[11px] font-semibold"
                          >
                            Assign
                          </button>
                          <button
                            onClick={() => setSelectedIssueId(issue.id)}
                            className="px-2.5 py-1 rounded-lg bg-brand-600 text-white text-[11px] font-semibold shadow-sm inline-flex items-center gap-1"
                          >
                            <span>Review</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </div>
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
          totalItems={filteredIssues.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
          isLoading={isLoading}
        />
      </div>

    </div>
  );
};
