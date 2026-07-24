import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { GrievanceIssue, AssignedStaff } from '../../types/grievance';
import { X, UserPlus, Check, Shield } from 'lucide-react';

interface AssignStaffModalProps {
  issue: GrievanceIssue | null;
  onClose: () => void;
}

export const AssignStaffModal: React.FC<AssignStaffModalProps> = ({ issue, onClose }) => {
  const { assignStaffToIssue } = useApp();

  if (!issue) return null;

  const isAcademic = issue.type === 'academic';

  const academicOptions = [
    { id: 'stf-101', name: 'Dr. K. S. Sundaram', role: 'Faculty Evaluator', dept: issue.student.department },
    { id: 'stf-102', name: 'Dr. Aris Thorne', role: 'Department Coordinator', dept: issue.student.department },
    { id: 'stf-103', name: 'Prof. Ananya Roy', role: 'Committee Member', dept: 'Academic Standing Board' },
    { id: 'stf-104', name: 'Dr. Ramesh Kumar', role: 'Associate Dean Academic', dept: 'Academic Affairs' }
  ];

  const maintenanceOptions = [
    { id: 'stf-201', name: 'Rapid Electrician Response', role: 'Senior Electrician', trade: 'Electrical' },
    { id: 'stf-202', name: 'Master Plumber Mohan', role: 'Lead Plumber', trade: 'Plumbing' },
    { id: 'stf-203', name: 'Estate Carpenter Unit', role: 'Carpenter Specialist', trade: 'Carpentry & Furniture' },
    { id: 'stf-204', name: 'HVAC Rapid Response Unit', role: 'Lead Technician', trade: 'HVAC & Air Conditioning' },
    { id: 'stf-205', name: 'NetOps Team - Tech Alok', role: 'Network Engineer', trade: 'Network & Wi-Fi' },
    { id: 'stf-206', name: 'Civil Infrastructure Squad', role: 'Masonry Supervisor', trade: 'Civil & Infrastructure' }
  ];

  const options = isAcademic ? academicOptions : maintenanceOptions;

  const [selectedStaffId, setSelectedStaffId] = useState(options[0].id);
  const [customNotes, setCustomNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chosen = options.find(o => o.id === selectedStaffId) || options[0];
    const nowStr = new Date().toLocaleString();

    const staffData: AssignedStaff = {
      id: chosen.id,
      name: chosen.name,
      role: chosen.role,
      department: (chosen as any).dept,
      trade: (chosen as any).trade,
      assignedAt: nowStr
    };

    assignStaffToIssue(issue.id, staffData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-3 sm:p-6 flex min-h-full items-end sm:items-center justify-center">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl my-auto flex flex-col animate-in fade-in zoom-in-95 max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-500 text-white shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                Assign Staff / Authority
              </h3>
              <p className="text-xs text-slate-500">Ticket: {issue.id}</p>
            </div>
          </div>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Select {isAcademic ? 'Faculty / Committee Member' : 'Trade Technician Team'}
            </label>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {options.map(opt => (
                <label
                  key={opt.id}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedStaffId === opt.id
                      ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-brand-500 shrink-0" />
                    <div>
                      <div className="text-xs font-bold">{opt.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                        {opt.role} • {(opt as any).dept || (opt as any).trade}
                      </div>
                    </div>
                  </div>
                  {selectedStaffId === opt.id && <Check className="w-4 h-4 text-brand-500 shrink-0" />}
                  <input
                    type="radio"
                    name="staff"
                    value={opt.id}
                    checked={selectedStaffId === opt.id}
                    onChange={() => setSelectedStaffId(opt.id)}
                    className="sr-only"
                  />
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Special Instructions / Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Inspect compressor on roof unit or review physical evaluated paper..."
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 shadow-md shadow-brand-500/20"
            >
              <Check className="w-4 h-4" />
              Confirm Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
