import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { GrievanceIssue } from '../types/grievance';
import { StatusBadge } from '../components/common/StatusBadge';
import { Wrench, Search, MapPin, UserCheck, ShieldAlert, ArrowUpRight } from 'lucide-react';

interface MaintenanceQueuePageProps {
  onOpenAssignModal: (issue: GrievanceIssue) => void;
}

export const MaintenanceQueuePage: React.FC<MaintenanceQueuePageProps> = ({ onOpenAssignModal }) => {
  const { issues, setSelectedIssueId } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const maintenanceIssues = issues.filter(i => i.type === 'maintenance');

  const filteredIssues = maintenanceIssues.filter(i => {
    return searchTerm === '' ||
      i.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (i.building && i.building.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (i.roomNumber && i.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      i.student.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-500" />
            AD Maintenance & Estate Repairs Queue
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Dispatch electric, plumbing, HVAC, carpentry, and Wi-Fi rapid response squads to campus buildings.
          </p>
        </div>
        <div className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold font-mono">
          {filteredIssues.length} Active Estate Tickets
        </div>
      </div>

      {/* Filter Control */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by building block, room number, maintenance category, or student..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Maintenance Table */}
      <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">Ticket ID</th>
                <th className="py-3 px-3">Building & Room Location</th>
                <th className="py-3 px-3">Trade Category</th>
                <th className="py-3 px-3">Reporter Student</th>
                <th className="py-3 px-3">Trade Squad Assigned</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No estate maintenance tickets found.
                  </td>
                </tr>
              ) : (
                filteredIssues.map((issue: GrievanceIssue) => (
                  <tr key={issue.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-amber-600 dark:text-amber-400">
                      {issue.id}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{issue.building || 'Main Campus'}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 pl-4.5">{issue.floor} • {issue.roomNumber}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                        {issue.maintenanceCategory || 'General'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{issue.student.name}</div>
                      <div className="text-[10px] text-slate-400">{issue.student.mobile}</div>
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
                          Squad Unassigned
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
                          className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[11px] font-semibold"
                        >
                          Dispatch
                        </button>
                        <button
                          onClick={() => setSelectedIssueId(issue.id)}
                          className="px-2.5 py-1 rounded-lg bg-amber-600 text-white text-[11px] font-semibold shadow-sm inline-flex items-center gap-1"
                        >
                          <span>Inspect</span>
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
      </div>

    </div>
  );
};
