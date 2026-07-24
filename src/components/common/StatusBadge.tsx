import React from 'react';
import type { IssueStatus } from '../../types/grievance';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  UserCheck, 
  Wrench, 
  ShieldAlert,
  Search
} from 'lucide-react';

interface PriorityBadgeProps {
  priority?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority = 'medium' }) => {
  const pKey = (priority || 'medium').toLowerCase();
  
  const configs: Record<string, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
    low: {
      label: 'Low',
      bg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
      text: 'text-slate-600 dark:text-slate-400',
      icon: <Clock className="w-3 h-3" />
    },
    medium: {
      label: 'Medium',
      bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
      text: 'text-blue-600 dark:text-blue-400',
      icon: <AlertCircle className="w-3 h-3" />
    },
    high: {
      label: 'High',
      bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
      text: 'text-amber-700 dark:text-amber-400',
      icon: <AlertCircle className="w-3.5 h-3.5" />
    },
    critical: {
      label: 'Critical',
      bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 animate-pulse',
      text: 'text-rose-700 dark:text-rose-400 font-bold',
      icon: <ShieldAlert className="w-3.5 h-3.5" />
    }
  };

  const config = configs[pKey] || configs.medium;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${config.bg} ${config.text}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

interface StatusBadgeProps {
  status: IssueStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const configs: Record<IssueStatus, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
    pending: {
      label: 'Pending Intake',
      bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
      text: 'text-amber-700 dark:text-amber-400',
      icon: <Clock className="w-3 h-3" />
    },
    assigned: {
      label: 'Staff Assigned',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800',
      text: 'text-indigo-700 dark:text-indigo-300',
      icon: <UserCheck className="w-3 h-3" />
    },
    investigating: {
      label: 'Investigating',
      bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
      text: 'text-blue-700 dark:text-blue-300',
      icon: <Search className="w-3 h-3" />
    },
    work_started: {
      label: 'Work Started',
      bg: 'bg-brand-50 dark:bg-brand-950/40 border-brand-200 dark:border-brand-800',
      text: 'text-brand-700 dark:text-brand-300',
      icon: <Wrench className="w-3 h-3" />
    },
    work_completed: {
      label: 'Work Completed',
      bg: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800',
      text: 'text-teal-700 dark:text-teal-300',
      icon: <CheckCircle2 className="w-3 h-3" />
    },
    verification_pending: {
      label: 'Verification Pending',
      bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800',
      text: 'text-purple-700 dark:text-purple-300',
      icon: <Clock className="w-3 h-3" />
    },
    resolved: {
      label: 'Resolved & Closed',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
      text: 'text-emerald-700 dark:text-emerald-300 font-bold',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />
    },
    rejected: {
      label: 'Rejected',
      bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
      text: 'text-rose-700 dark:text-rose-400',
      icon: <XCircle className="w-3 h-3" />
    },
    reopened: {
      label: 'Reopened',
      bg: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800',
      text: 'text-orange-700 dark:text-orange-400 font-bold',
      icon: <RotateCcw className="w-3 h-3" />
    }
  };

  const config = configs[status] || configs.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${config.bg} ${config.text}`}>
      {config.icon}
      {config.label}
    </span>
  );
};
