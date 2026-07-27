import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { GrievanceIssue } from '../types/grievance';
import { PriorityBadge, StatusBadge } from '../components/common/StatusBadge';
import { IssueCategoryPie } from '../components/charts/IssueCategoryPie';
import { ResolutionTrendLine } from '../components/charts/ResolutionTrendLine';
import { 
  Users, 
  CheckSquare, 
  FileText, 
  CheckCircle2
} from 'lucide-react';

interface ADStudentsDashboardProps {
  onOpenResolutionModal: (issue: GrievanceIssue) => void;
}

export const ADStudentsDashboard: React.FC<ADStudentsDashboardProps> = ({ onOpenResolutionModal }) => {
  const { issues, setSelectedIssueId } = useApp();

  const total = issues.length;
  const academicCount = issues.filter((i: GrievanceIssue) => i.type === 'academic').length;
  const maintenanceCount = issues.filter((i: GrievanceIssue) => i.type === 'maintenance').length;
  const resolvedCount = issues.filter((i: GrievanceIssue) => i.status === 'resolved').length;
  const escalatedCount = issues.filter((i: GrievanceIssue) => i.priority === 'critical' || i.status === 'reopened').length;

  const verificationQueue = issues.filter((i: GrievanceIssue) => 
    i.status === 'work_completed' || 
    i.status === 'verification_pending' || 
    i.status === 'investigating'
  );

  const closedHistory = issues.filter((i: GrievanceIssue) => i.status === 'resolved' || i.status === 'rejected');

  const [activeTab, setActiveTab] = useState<'verification' | 'charts' | 'history'>('verification');

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-purple-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-2 border border-purple-500/30">
              <Users className="w-3.5 h-3.5" />
              Associate Dean Student Affairs & Welfare
            </div>
            <h1 className="text-xl font-extrabold tracking-tight">
              Student Grievance Oversight & Resolution Verification
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Conduct student satisfaction surveys, confirm completion quality, add final closure remarks, or reopen unresolved issues.
            </p>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Monitored</span>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{total}</h3>
          <span className="text-[10px] text-slate-400 block mt-0.5">All student grievances</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-500">Academic</span>
          <h3 className="text-2xl font-extrabold text-brand-600 dark:text-brand-400 mt-1">{academicCount}</h3>
          <span className="text-[10px] text-slate-400 block mt-0.5">Grade / Exam / Faculty</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">Maintenance</span>
          <h3 className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{maintenanceCount}</h3>
          <span className="text-[10px] text-slate-400 block mt-0.5">Campus repairs</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Verified & Closed</span>
          <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{resolvedCount}</h3>
          <span className="text-[10px] text-slate-400 block mt-0.5">100% Student Approved</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">Escalated / Reopened</span>
          <h3 className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">{escalatedCount}</h3>
          <span className="text-[10px] text-slate-400 block mt-0.5">High priority action required</span>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('verification')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'verification'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Verification Screen ({verificationQueue.length})
          </button>

          <button
            onClick={() => setActiveTab('charts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'charts'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            Analytics & Charts
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Closed History ({closedHistory.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Issue Verification Screen */}
      {activeTab === 'verification' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Pending Student Verification & Feedback Audit Queue
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {verificationQueue.length === 0 ? (
              <div className="glass-panel p-8 rounded-2xl text-center text-slate-400 text-xs">
                No completed work currently waiting for AD Students verification.
              </div>
            ) : (
              verificationQueue.map((issue: GrievanceIssue) => (
                <div
                  key={issue.id}
                  className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded">
                        {issue.id}
                      </span>
                      <PriorityBadge priority={issue.priority} />
                      <StatusBadge status={issue.status} />
                    </div>
                    <div className="text-xs text-slate-400">
                      Student: <span className="font-semibold text-slate-800 dark:text-slate-200">{issue.student.name}</span> ({issue.student.mobile})
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {issue.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {issue.description}
                      </p>
                      <div className="text-xs text-slate-500 pt-1">
                        <b>Assigned Trade / Evaluator:</b> {issue.assignedTo ? issue.assignedTo.name : 'N/A'}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 block">
                          Verification Action
                        </span>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                          Contact student to verify resolution quality before finalizing ticket.
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedIssueId(issue.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-300"
                        >
                          View
                        </button>
                        <button
                          onClick={() => onOpenResolutionModal(issue)}
                          className="flex-1 py-1.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
                        >
                          Verify & Record Feedback
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Analytics & Charts */}
      {activeTab === 'charts' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <IssueCategoryPie issues={issues} />
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <ResolutionTrendLine />
          </div>
        </div>
      )}

      {/* Tab 3: Closed History */}
      {activeTab === 'history' && (
        <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Ticket ID</th>
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Closed Date</th>
                  <th className="py-3 px-3">Rating</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {closedHistory.map((issue: GrievanceIssue) => (
                  <tr 
                    key={issue.id} 
                    onClick={() => setSelectedIssueId(issue.id)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 font-mono font-bold text-purple-600 dark:text-purple-400">{issue.id}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">{issue.student.name}</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{issue.academicCategory || issue.maintenanceCategory}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-400">{issue.closedAt || issue.submittedAt}</td>
                    <td className="py-3 px-3 text-amber-500 font-bold">
                      {issue.feedback ? '★'.repeat(issue.feedback.rating) : '5 Stars'}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={issue.status} />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedIssueId(issue.id);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm inline-flex items-center gap-1"
                      >
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
