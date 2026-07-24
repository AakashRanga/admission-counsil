import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { GrievanceIssue } from '../types/grievance';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  Search, 
  Plus, 
  Building2, 
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';

interface DashboardProps {
  onOpenRegisterModal: () => void;
}

export const StudentCouncilDashboard: React.FC<DashboardProps> = ({ onOpenRegisterModal }) => {
  const { issues, setSelectedIssueId, searchQuery, setSearchQuery } = useApp();

  const [filterType, setFilterType] = useState<string>('all');

  const pendingCount = issues.filter(i => i.status === 'pending').length;
  const inProgressCount = issues.filter(i => i.status === 'assigned' || i.status === 'investigating' || i.status === 'work_started').length;
  const completedCount = issues.filter(i => i.status === 'resolved' || i.status === 'work_completed').length;

  const filteredIssues = issues.filter((issue: GrievanceIssue) => {
    const matchesSearch = searchQuery === '' || 
      issue.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'all' || issue.type === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-2">
            <Building2 className="w-3.5 h-3.5" />
            Student Representative Triage Command Center
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Student Council Grievance Portal
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Meet students, record academic & maintenance complaints, and route issues directly to university authorities.
          </p>
        </div>

        <button
          onClick={onOpenRegisterModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white shadow-lg shadow-brand-500/25 transition-all transform hover:-translate-y-0.5 shrink-0"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Register New Complaint</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Registered</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{issues.length}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Academic & Estate</span>
          </div>
          <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider block">Pending Triage</span>
            <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{pendingCount}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Awaiting Assignment</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-blue-500 uppercase tracking-wider block">In Resolution</span>
            <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">{inProgressCount}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Staff Dispatched</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider block">Resolved & Closed</span>
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{completedCount}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Verified by Students</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Recent Complaints Stream */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Recent Complaints Queue
          </h3>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filter search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-100"
            >
              <option value="all">All Types</option>
              <option value="academic">Academic</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Ticket ID</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Category & Title</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredIssues.slice(0, 8).map((issue: GrievanceIssue) => (
                <tr key={issue.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-brand-600 dark:text-brand-400">
                    {issue.id}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                    {issue.student.name}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                    {issue.student.department}
                  </td>
                  <td className="py-2.5 px-3 max-w-xs">
                    <div className="font-medium text-slate-800 dark:text-slate-200 truncate">{issue.title}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <StatusBadge status={issue.status} />
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => setSelectedIssueId(issue.id)}
                      className="px-2.5 py-1 rounded-lg bg-brand-500 text-white hover:bg-brand-600 text-xs font-semibold shadow-sm inline-flex items-center gap-1"
                    >
                      <span>View</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
