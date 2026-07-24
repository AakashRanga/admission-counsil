import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { GrievanceIssue } from '../types/grievance';
import { PriorityBadge, StatusBadge } from '../components/common/StatusBadge';
import { 
  Wrench, 
  UserCheck, 
  CheckCircle2, 
  ShieldAlert, 
  Building, 
  MapPin, 
  Paperclip, 
  Clock
} from 'lucide-react';

interface ADMaintenanceDashboardProps {
  onOpenAssignModal: (issue: GrievanceIssue) => void;
}

export const ADMaintenanceDashboard: React.FC<ADMaintenanceDashboardProps> = ({ onOpenAssignModal }) => {
  const { issues, setSelectedIssueId } = useApp();

  const maintenanceIssues = issues.filter((i: GrievanceIssue) => i.type === 'maintenance');

  const pendingRepairs = maintenanceIssues.filter((i: GrievanceIssue) => i.status === 'pending').length;
  const assignedStaff = maintenanceIssues.filter((i: GrievanceIssue) => i.status === 'assigned' || i.status === 'work_started').length;
  const completedToday = maintenanceIssues.filter((i: GrievanceIssue) => i.status === 'work_completed' || i.status === 'resolved').length;
  const urgentCount = maintenanceIssues.filter((i: GrievanceIssue) => i.priority === 'critical' || i.priority === 'high').length;

  const [activeTrade, setActiveTrade] = useState<string>('all');

  const tradesList = [
    'all',
    'Electrical',
    'Plumbing',
    'HVAC & Air Conditioning',
    'Carpentry & Furniture',
    'Network & Wi-Fi',
    'Civil & Infrastructure',
    'Sanitation & Housekeeping'
  ];

  const filteredIssues = maintenanceIssues.filter((i: GrievanceIssue) => {
    if (activeTrade === 'all') return true;
    return i.maintenanceCategory === activeTrade;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-900 via-slate-900 to-amber-950 text-white shadow-xl border border-amber-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2 border border-amber-500/30">
              <Wrench className="w-3.5 h-3.5" />
              Associate Dean Estate & Maintenance Operations
            </div>
            <h1 className="text-xl font-extrabold tracking-tight">
              Campus Infrastructure & Maintenance Command Center
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Dispatch electrician squads, plumbers, HVAC technicians, carpenters, and network engineers to fix reported building issues.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">Pending Repairs</span>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{pendingRepairs}</h3>
            <span className="text-[10px] text-slate-400 block mt-0.5">Awaiting technician dispatch</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-500">Assigned Staff / Active</span>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{assignedStaff}</h3>
            <span className="text-[10px] text-slate-400 block mt-0.5">Trade teams on site</span>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">Completed Repairs</span>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{completedToday}</h3>
            <span className="text-[10px] text-slate-400 block mt-0.5">Pending student verification</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">Urgent Issues</span>
            <h3 className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">{urgentCount}</h3>
            <span className="text-[10px] text-slate-400 block mt-0.5">Critical HVAC / Electrical</span>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Tabs by Trade */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">Trade Filter:</span>
        {tradesList.map(t => (
          <button
            key={t}
            onClick={() => setActiveTrade(t)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 border transition-all ${
              activeTrade === t
                ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Grid of Maintenance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIssues.length === 0 ? (
          <div className="md:col-span-2 glass-panel p-8 rounded-2xl text-center text-slate-400 text-xs">
            No maintenance issues match the selected trade filter.
          </div>
        ) : (
          filteredIssues.map((issue: GrievanceIssue) => (
            <div
              key={issue.id}
              className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                      {issue.id}
                    </span>
                    <PriorityBadge priority={issue.priority} />
                  </div>
                  <StatusBadge status={issue.status} />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {issue.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {issue.description}
                  </p>
                </div>

                {/* Location details card */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Building & Floor</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <Building className="w-3 h-3 text-amber-500" />
                      {issue.building} ({issue.floor})
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] block">Room / Location</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-500" />
                      {issue.roomNumber} ({issue.location || 'General Area'})
                    </span>
                  </div>
                </div>

                {/* Images preview if available */}
                {issue.imageFiles && issue.imageFiles.length > 0 && (
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <Paperclip className="w-3.5 h-3.5 text-amber-500" />
                    <span>Photos attached: <b>{issue.imageFiles.join(', ')}</b></span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="text-xs">
                  <span className="text-slate-400 block text-[10px]">Trade Team:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {issue.assignedTo ? issue.assignedTo.name : 'Unassigned'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedIssueId(issue.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-100"
                  >
                    View
                  </button>

                  <button
                    onClick={() => onOpenAssignModal(issue)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
                  >
                    Dispatch Trade Team
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
