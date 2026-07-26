import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { GrievanceIssue, AssignedStaff } from '../../types/grievance';
import { X, UserPlus, Check, User, Phone, FileText } from 'lucide-react';

interface AssignStaffModalProps {
  issue: GrievanceIssue | null;
  onClose: () => void;
}

export const AssignStaffModal: React.FC<AssignStaffModalProps> = ({ issue, onClose }) => {
  const { assignStaffToIssue } = useApp();

  const [staffName, setStaffName] = useState(issue?.assignedTo?.name || '');
  const [staffMobile, setStaffMobile] = useState(issue?.assignedTo?.mobile || '');
  const [specialNotes, setSpecialNotes] = useState(issue?.assignedTo?.specialInstructions || '');

  if (!issue) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim()) {
      alert('Please enter the Staff Name.');
      return;
    }
    if (!staffMobile.trim()) {
      alert('Please enter the Staff Contact Number.');
      return;
    }

    const nowStr = new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

    const staffData: AssignedStaff = {
      name: staffName.trim(),
      mobile: staffMobile.trim(),
      specialInstructions: specialNotes.trim(),
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
              <p className="text-xs text-slate-500">Ticket: {issue.id} • {issue.title}</p>
            </div>
          </div>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          
          {/* Staff Name Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-brand-500" />
              <span>Staff Name <span className="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              required
              placeholder="Enter Staff Name (e.g. Dr. K. S. Sundaram or Er. Rajesh V.)"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/50"
            />
          </div>

          {/* Contact Number Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-brand-500" />
              <span>Contact Number of Staff <span className="text-red-500">*</span></span>
            </label>
            <input
              type="tel"
              required
              placeholder="Enter Contact Mobile Number (e.g. +91 98765 43210)"
              value={staffMobile}
              onChange={(e) => setStaffMobile(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/50"
            />
          </div>

          {/* Special Instructions / Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-brand-500" />
              <span>Special Instructions / Notes</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Inspect compressor on roof unit or review physical evaluated paper..."
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/50"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
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

