import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { GrievanceIssue } from '../types/grievance';
import { PriorityBadge, StatusBadge } from '../components/common/StatusBadge';
import { 
  BookOpen, 
  UserCheck, 
  Search, 
  CheckCircle2, 
  GraduationCap
} from 'lucide-react';

interface ADAcademicDashboardProps {
  onOpenAssignModal: (issue: GrievanceIssue) => void;
}

export const ADAcademicDashboard: React.FC<ADAcademicDashboardProps> = ({ onOpenAssignModal }) => {
  const { issues, setSelectedIssueId } = useApp();

  const academicIssues = issues.filter((i: GrievanceIssue) => i.type === 'academic');

  const newCount = academicIssues.filter((i: GrievanceIssue) => i.status === 'pending').length;
  const assignedCount = academicIssues.filter((i: GrievanceIssue) => i.status === 'assigned').length;
  const investigatingCount = academicIssues.filter((i: GrievanceIssue) => i.status === 'investigating').length;
  const completedCount = academicIssues.filter((i: GrievanceIssue) => i.status === 'resolved' || i.status === 'work_completed').length;

  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredQueue = academicIssues.filter((i: GrievanceIssue) => {
    if (activeFilter === 'pending') return i.status === 'pending';
    if (activeFilter === 'assigned') return i.status === 'assigned';
    if (activeFilter === 'investigating') return i.status === 'investigating';
    if (activeFilter === 'completed') return i.status === 'resolved' || i.status === 'work_completed';
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Role Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-brand-950 to-indigo-950 text-white shadow-xl border border-blue-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2 border border-blue-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              Associate Dean Academic Desk
            </div>
            <h1 className="text-xl font-extrabold tracking-tight">
              Academic Grievance Management Queue
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Evaluate student grade disputes, attendance shortage appeals, course teacher evaluations, and assign faculty coordinators for script re-verification.
            </p>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => setActiveFilter('pending')}
          className={`p-4 rounded-2xl glass-card border transition-all cursor-pointer ${activeFilter === 'pending' ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-slate-200 dark:border-slate-800'}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">New Academic Issues</span>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{newCount}</h3>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Awaiting faculty assignment</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div 
          onClick={() => setActiveFilter('assigned')}
          className={`p-4 rounded-2xl glass-card border transition-all cursor-pointer ${activeFilter === 'assigned' ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-slate-200 dark:border-slate-800'}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-500">Faculty Assigned</span>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{assignedCount}</h3>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Dispatched to subject evaluator</span>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div 
          onClick={() => setActiveFilter('investigating')}
          className={`p-4 rounded-2xl glass-card border transition-all cursor-pointer ${activeFilter === 'investigating' ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-slate-200 dark:border-slate-800'}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-500">Under Investigation</span>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{investigatingCount}</h3>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Controller committee reviewing</span>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-500">
              <Search className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div 
          onClick={() => setActiveFilter('completed')}
          className={`p-4 rounded-2xl glass-card border transition-all cursor-pointer ${activeFilter === 'completed' ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-slate-200 dark:border-slate-800'}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">Completed & Verified</span>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{completedCount}</h3>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Grade/Attendance updated</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Academic Issues Queue List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-brand-500" />
            Academic Grievance Work Queue ({filteredQueue.length})
          </h3>
          <div className="flex gap-2">
            {['all', 'pending', 'assigned', 'investigating', 'completed'].map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize border transition-all ${
                  activeFilter === f
                    ? 'bg-brand-500 text-white border-brand-600'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredQueue.length === 0 ? (
            <div className="glass-panel p-8 rounded-2xl text-center text-slate-400 text-xs">
              No academic grievances currently in this queue stage.
            </div>
          ) : (
            filteredQueue.map((issue: GrievanceIssue) => (
              <div 
                key={issue.id} 
                className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded">
                      {issue.id}
                    </span>
                    <PriorityBadge priority={issue.priority} />
                    <StatusBadge status={issue.status} />
                  </div>
                  <div className="text-xs text-slate-400">
                    Submitted: <span className="font-mono">{issue.submittedAt}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Info */}
                  <div className="md:col-span-2 space-y-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {issue.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {issue.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-xs pt-1">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Student</span>
                        <span className="font-semibold">{issue.student.name} ({issue.student.id})</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Subject & Faculty</span>
                        <span className="font-medium text-brand-600 dark:text-brand-400">{issue.subject} • {issue.facultyName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Category</span>
                        <span className="font-medium">{issue.academicCategory}</span>
                      </div>
                    </div>
                  </div>

                  {/* Staff & Action */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Assigned Evaluator
                      </span>
                      {issue.assignedTo ? (
                        <div className="mt-1">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{issue.assignedTo.name}</span>
                          <span className="text-[10px] text-slate-500">{issue.assignedTo.role}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1 block">
                          Unassigned
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() => setSelectedIssueId(issue.id)}
                        className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-300"
                      >
                        View Detail
                      </button>

                      <button
                        onClick={() => onOpenAssignModal(issue)}
                        className="flex-1 py-1.5 rounded-lg text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-sm"
                      >
                        Assign Staff
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
