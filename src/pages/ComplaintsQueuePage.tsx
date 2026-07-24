import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { GrievanceIssue } from '../types/grievance';
import { StatusBadge } from '../components/common/StatusBadge';
import { Clock, Search, Filter, ArrowUpRight, FileText } from 'lucide-react';

export const ComplaintsQueuePage: React.FC = () => {
  const { issues, setSelectedIssueId, searchQuery, setSearchQuery } = useApp();

  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredIssues = issues.filter((issue: GrievanceIssue) => {
    const matchesSearch = searchQuery === '' || 
      issue.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.student.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'all' || issue.type === filterType;
    const matchesStatus = filterStatus === 'all' || issue.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-500" />
            Student Complaints Intake Queue
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Comprehensive filterable queue of all registered academic and campus maintenance grievances.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-800 shrink-0">
          <FileText className="w-4 h-4" />
          <span>{filteredIssues.length} Complaints Listed</span>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Advanced Queue Filters
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative col-span-1 sm:col-span-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ticket ID, student name, department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-100"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-100"
          >
            <option value="all">All Types (Academic & Maint)</option>
            <option value="academic">Academic Only</option>
            <option value="maintenance">Maintenance Only</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-100"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Intake</option>
            <option value="assigned">Staff Assigned</option>
            <option value="investigating">Investigating</option>
            <option value="work_started">Work Started</option>
            <option value="resolved">Resolved & Closed</option>
          </select>
        </div>
      </div>

      {/* Responsive Data Table */}
      <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">Ticket ID</th>
                <th className="py-3 px-3">Student & Department</th>
                <th className="py-3 px-3">Category & Title</th>
                <th className="py-3 px-3">Submitted Date</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    No complaints match the selected filter parameters.
                  </td>
                </tr>
              ) : (
                filteredIssues.map((issue: GrievanceIssue) => (
                  <tr key={issue.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-brand-600 dark:text-brand-400">
                      {issue.id}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{issue.student.name}</div>
                      <div className="text-[10px] text-slate-400">{issue.student.id} • {issue.student.department}</div>
                    </td>
                    <td className="py-3 px-3 max-w-xs">
                      <div className="font-medium text-slate-800 dark:text-slate-200 truncate">{issue.title}</div>
                      <div className="text-[10px] text-slate-400 uppercase">{issue.type} ({issue.academicCategory || issue.maintenanceCategory})</div>
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                      {issue.submittedAt}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={issue.status} />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedIssueId(issue.id)}
                        className="px-3 py-1.5 rounded-lg bg-brand-500 text-white hover:bg-brand-600 text-xs font-semibold shadow-sm inline-flex items-center gap-1"
                      >
                        <span>View Details</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
