import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { IssueStatus, GrievanceIssue } from '../../types/grievance';
import { 
  User, 
  ShieldCheck, 
  BookOpen, 
  Wrench, 
  Play, 
  CheckCircle2, 
  Sparkles, 
  MessageSquare, 
  Lock, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { PriorityBadge, StatusBadge } from '../common/StatusBadge';

interface WorkflowNode {
  id: string;
  stageName: string;
  roleTitle: string;
  description: string;
  statusFilter?: IssueStatus | 'intake' | 'branch';
  icon: React.ReactNode;
  stepNumber: number;
}

export const VisualWorkflow: React.FC = () => {
  const { issues, setSelectedIssueId } = useApp();
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const workflowSteps: WorkflowNode[] = [
    {
      id: 'step-1',
      stageName: 'Student Issue Initiation',
      roleTitle: 'Student',
      description: 'Student encounters academic grievance or campus infrastructure issue.',
      statusFilter: 'pending',
      icon: <User className="w-5 h-5 text-brand-500" />,
      stepNumber: 1
    },
    {
      id: 'step-2',
      stageName: 'Council Intake & Triage',
      roleTitle: 'Student Council',
      description: 'Council rep meets student, verifies credentials, and registers complaint.',
      statusFilter: 'intake',
      icon: <ShieldCheck className="w-5 h-5 text-indigo-500" />,
      stepNumber: 2
    },
    {
      id: 'step-3',
      stageName: 'Branching by Issue Type',
      roleTitle: 'Auto Router',
      description: 'System routes issue to AD Academic or AD Maintenance based on category.',
      statusFilter: 'branch',
      icon: <Sparkles className="w-5 h-5 text-purple-500" />,
      stepNumber: 3
    },
    {
      id: 'step-4a',
      stageName: 'Academic AD Processing',
      roleTitle: 'AD Academic',
      description: 'Reviews grade/exam dispute, assigns faculty or department coordinator.',
      statusFilter: 'assigned',
      icon: <BookOpen className="w-5 h-5 text-blue-500" />,
      stepNumber: 4
    },
    {
      id: 'step-4b',
      stageName: 'Maintenance AD Dispatch',
      roleTitle: 'AD Maintenance',
      description: 'Inspects location, dispatches Electrician, Plumber, HVAC, or IT trade team.',
      statusFilter: 'assigned',
      icon: <Wrench className="w-5 h-5 text-amber-500" />,
      stepNumber: 4
    },
    {
      id: 'step-5',
      stageName: 'Investigation & Repair Work',
      roleTitle: 'Assigned Staff / Tech',
      description: 'Staff inspects script or starts repair work; progress updated in real time.',
      statusFilter: 'work_started',
      icon: <Play className="w-5 h-5 text-teal-500" />,
      stepNumber: 5
    },
    {
      id: 'step-6',
      stageName: 'Work Completion Notice',
      roleTitle: 'Trade / Evaluator',
      description: 'Task marked completed. System notifies AD Students for verification.',
      statusFilter: 'work_completed',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      stepNumber: 6
    },
    {
      id: 'step-7',
      stageName: 'AD Students Verification',
      roleTitle: 'AD Students Desk',
      description: 'Verifies work with student, collects satisfaction rating & feedback.',
      statusFilter: 'verification_pending',
      icon: <MessageSquare className="w-5 h-5 text-purple-500" />,
      stepNumber: 7
    },
    {
      id: 'step-8',
      stageName: 'Final Closure / Reopen',
      roleTitle: 'System & Welfare',
      description: 'Satisfied issues are closed; unsatisfied grievances are reopened for review.',
      statusFilter: 'resolved',
      icon: <Lock className="w-5 h-5 text-emerald-600" />,
      stepNumber: 8
    }
  ];

  // Filter issues corresponding to selected step
  const filteredIssues = selectedStage 
    ? issues.filter((i: GrievanceIssue) => {
        if (selectedStage === 'step-1' || selectedStage === 'step-2') return i.status === 'pending';
        if (selectedStage === 'step-4a') return i.type === 'academic' && (i.status === 'assigned' || i.status === 'investigating');
        if (selectedStage === 'step-4b') return i.type === 'maintenance' && (i.status === 'assigned' || i.status === 'work_started');
        if (selectedStage === 'step-5') return i.status === 'work_started' || i.status === 'investigating';
        if (selectedStage === 'step-6') return i.status === 'work_completed';
        if (selectedStage === 'step-7') return i.status === 'verification_pending' || i.status === 'work_completed';
        if (selectedStage === 'step-8') return i.status === 'resolved' || i.status === 'reopened';
        return true;
      })
    : issues;

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Header banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-brand-950 to-indigo-950 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold mb-2 border border-brand-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Interactive Grievance Lifecycle Diagram
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">
              Academic Council End-to-End Resolution Workflow
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Click any stage node below to filter and inspect active grievances currently navigating that phase of the university resolution pipeline.
            </p>
          </div>
          {selectedStage && (
            <button
              onClick={() => setSelectedStage(null)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
            >
              Reset Workflow Filter
            </button>
          )}
        </div>
      </div>

      {/* Visual Flow Diagram Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {workflowSteps.map((step) => {
          const isSelected = selectedStage === step.id;

          return (
            <div
              key={step.id}
              onClick={() => setSelectedStage(isSelected ? null : step.id)}
              className={`relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'glass-panel border-brand-500 ring-2 ring-brand-500/40 shadow-xl scale-[1.02]'
                  : 'glass-card border-slate-200 dark:border-slate-800 hover:border-brand-400/60'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-300 text-xs font-bold flex items-center justify-center">
                  {step.stepNumber}
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  {step.roleTitle}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                  {step.icon}
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {step.stageName}
                </h3>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                {step.description}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] font-semibold text-brand-600 dark:text-brand-400">
                <span>Filter Active Tickets</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Issues Table Filtered by Workflow Node */}
      <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-brand-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {selectedStage 
                ? `Tickets in Stage: ${workflowSteps.find(s => s.id === selectedStage)?.stageName}` 
                : 'All Active Grievances in Resolution Pipeline'}
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-brand-100 dark:bg-brand-950 text-brand-600">
              {filteredIssues.length}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">Ticket ID</th>
                <th className="py-3 px-3">Student & Department</th>
                <th className="py-3 px-3">Category / Issue</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Current Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    No active grievances matching this workflow node.
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
                      <div className="text-[10px] text-slate-400">{issue.student.department}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-xs">{issue.title}</div>
                      <div className="text-[10px] text-slate-400 uppercase">{issue.type}</div>
                    </td>
                    <td className="py-3 px-3">
                      <PriorityBadge priority={issue.priority} />
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={issue.status} />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedIssueId(issue.id)}
                        className="px-3 py-1 rounded-lg bg-brand-500 text-white hover:bg-brand-600 text-xs font-semibold shadow-sm"
                      >
                        View Issue
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
