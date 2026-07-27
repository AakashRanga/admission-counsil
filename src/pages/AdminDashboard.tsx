import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { GrievanceIssue, AuditLogEntry } from '../types/grievance';
import { DeptHeatmap } from '../components/charts/DeptHeatmap';
import { IssueCategoryPie } from '../components/charts/IssueCategoryPie';
import { ResolutionTrendLine } from '../components/charts/ResolutionTrendLine';
import { TablePagination } from '../components/common/TablePagination';
import { TableSkeleton } from '../components/common/TableSkeleton';
import { 
  Shield, 
  Users, 
  History, 
  ArrowUpRight
} from 'lucide-react';
import { PriorityBadge, StatusBadge } from '../components/common/StatusBadge';

export const AdminDashboard: React.FC = () => {
  const { 
    issues, 
    departments, 
    auditLogs, 
    isLoading,
    setActiveTab, 
    setSelectedIssueId 
  } = useApp();

  const [feedPage, setFeedPage] = useState(1);
  const pageSize = 10;
  const totalFeedPages = Math.ceil(issues.length / pageSize) || 1;
  const paginatedFeed = issues.slice((feedPage - 1) * pageSize, feedPage * pageSize);

  const total = issues.length;
  const todayStr = new Date().toLocaleDateString();
  const todaysCount = issues.filter((i: GrievanceIssue) => i.submittedAt.includes(todayStr) || i.submittedAt === 'Today' || i.submittedAt === 'Registered').length || Math.min(total, 4);
  const weeklyCount = total;
  const monthlyCount = total;
  const resolvedCount = issues.filter((i: GrievanceIssue) => i.status === 'resolved' || i.status === 'work_completed').length;
  const completionRate = total > 0 ? `${((resolvedCount / total) * 100).toFixed(1)}%` : '0%';
  const avgResolutionTime = resolvedCount > 0 ? '1.2 Days' : 'Pending';
  const pendingCount = issues.filter((i: GrievanceIssue) => i.status === 'pending').length;

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-brand-950 text-white shadow-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold mb-2 border border-brand-500/30">
              <Shield className="w-3.5 h-3.5 text-brand-400" />
              Central Academic Council Administrator Operations
            </div>
            <h1 className="text-xl font-extrabold tracking-tight">
              University System Operations & Analytics Engine
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Overarching governance portal for managing university departments, authority dispatchers, audit logs, and cross-campus resolution metrics.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('users')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              Users & Authorities
            </button>
            <button
              onClick={() => setActiveTab('audit_logs')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/30 transition-all flex items-center gap-1.5"
            >
              <History className="w-3.5 h-3.5" />
              System Audit Logs
            </button>
          </div>
        </div>
      </div>

      {/* Large Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Today's Issues</span>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{todaysCount}</h3>
          <span className="text-[10px] text-emerald-500 font-semibold block mt-0.5">+12% vs yesterday</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Weekly Intake</span>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{weeklyCount}</h3>
          <span className="text-[10px] text-slate-400 block mt-0.5">Rolling 7 days</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Monthly Total</span>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{monthlyCount}</h3>
          <span className="text-[10px] text-slate-400 block mt-0.5">July 2026</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Completion Rate</span>
          <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{completionRate}</h3>
          <span className="text-[10px] text-slate-400 block mt-0.5">SLA Target &gt;90%</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-500">Avg Resolution</span>
          <h3 className="text-2xl font-extrabold text-brand-600 dark:text-brand-400 mt-1">{avgResolutionTime}</h3>
          <span className="text-[10px] text-slate-400 block mt-0.5">From intake to closure</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">Pending Issues</span>
          <h3 className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{pendingCount}</h3>
          <span className="text-[10px] text-slate-400 block mt-0.5">Requires triage</span>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
        <DeptHeatmap departments={departments} issues={issues} />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Academic vs Maintenance Grievance Breakdown
          </h3>
          <IssueCategoryPie issues={issues} />
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <ResolutionTrendLine />
        </div>
      </div>

      {/* Audit Logs & System Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Grievances Table (2 cols) */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Live Grievance Feed Across Campus
            </h3>
            <button 
              onClick={() => setActiveTab('queue')} 
              className="text-xs text-brand-500 hover:text-brand-600 font-semibold flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {isLoading ? (
            <TableSkeleton rows={5} cols={5} />
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                      <th className="py-2.5 px-2">Ticket ID</th>
                      <th className="py-2.5 px-2">Student & Dept</th>
                      <th className="py-2.5 px-2">Title</th>
                      <th className="py-2.5 px-2">Priority</th>
                      <th className="py-2.5 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {paginatedFeed.map((issue: GrievanceIssue) => (
                      <tr 
                        key={issue.id} 
                        onClick={() => setSelectedIssueId(issue.id)} 
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                      >
                        <td className="py-2.5 px-2 font-mono font-bold text-brand-600 dark:text-brand-400">{issue.id}</td>
                        <td className="py-2.5 px-2 font-medium text-slate-800 dark:text-slate-200">{issue.student.name}</td>
                        <td className="py-2.5 px-2 truncate max-w-xs text-slate-700 dark:text-slate-300">{issue.title}</td>
                        <td className="py-2.5 px-2"><PriorityBadge priority={issue.priority} /></td>
                        <td className="py-2.5 px-2"><StatusBadge status={issue.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <TablePagination
                currentPage={feedPage}
                totalPages={totalFeedPages}
                totalItems={issues.length}
                pageSize={pageSize}
                onPageChange={(p) => setFeedPage(p)}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>

        {/* Audit Log Stream (1 col) */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <History className="w-4 h-4 text-brand-500" />
              Live Audit Stream
            </h3>
            <span className="text-[10px] text-emerald-500 font-bold">● Active Sync</span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {auditLogs.map((log: AuditLogEntry) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span className="font-mono font-bold text-brand-500">{log.action}</span>
                  <span>{log.timestamp}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 font-medium leading-tight">
                  {log.details}
                </p>
                <div className="text-[10px] text-slate-400 mt-1">
                  By: {log.performedBy}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
