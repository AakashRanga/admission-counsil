import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { GrievanceIssue } from '../../types/grievance';
import { X, CheckCircle2, RotateCcw, Star, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

interface ResolutionModalProps {
  issue: GrievanceIssue | null;
  onClose: () => void;
}

export const ResolutionModal: React.FC<ResolutionModalProps> = ({ issue, onClose }) => {
  const { addStudentFeedback } = useApp();

  const [satisfied, setSatisfied] = useState<boolean>(true);
  const [rating, setRating] = useState<number>(5);
  const [comments, setComments] = useState('');
  const [finalRemarks, setFinalRemarks] = useState('');
  const [actionType, setActionType] = useState<'close' | 'reopen'>('close');

  if (!issue) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const feedback = {
      satisfied,
      rating,
      comments: comments || (satisfied ? 'Issue resolved to student satisfaction.' : 'Student reported unresolved work.'),
      submittedAt: new Date().toLocaleString()
    };

    addStudentFeedback(issue.id, feedback, actionType, finalRemarks);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-3 sm:p-6 flex min-h-full items-end sm:items-center justify-center">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl my-auto flex flex-col animate-in fade-in zoom-in-95 max-h-[90vh]">
        
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                AD Students - Issue Verification & Closure
              </h3>
              <p className="text-xs text-slate-500">Ticket: {issue.id} • {issue.student.name}</p>
            </div>
          </div>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          
          {/* Action Choice: Close vs Reopen */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Verification Outcome Action
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActionType('close')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-bold text-xs transition-all ${
                  actionType === 'close'
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Close Issue (Satisfied)
              </button>

              <button
                type="button"
                onClick={() => setActionType('reopen')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-bold text-xs transition-all ${
                  actionType === 'reopen'
                    ? 'bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                Reopen Issue (Unsatisfied)
              </button>
            </div>
          </div>

          {/* Student Satisfaction Rating */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Student Feedback Assessment
            </label>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSatisfied(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                  satisfied
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300'
                    : 'bg-white dark:bg-slate-800 text-slate-600 border-slate-200 dark:border-slate-700'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                Satisfied
              </button>

              <button
                type="button"
                onClick={() => setSatisfied(false)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                  !satisfied
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-300'
                    : 'bg-white dark:bg-slate-800 text-slate-600 border-slate-200 dark:border-slate-700'
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                Not Satisfied
              </button>
            </div>

            {/* Star Rating */}
            <div>
              <span className="text-[11px] text-slate-500 block mb-1">Satisfaction Score (1 - 5 Stars):</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-5 h-5 ${s <= rating ? 'fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Student Comments</label>
              <input
                type="text"
                placeholder="Direct feedback quote from student call/survey..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          {/* AD Students Final Remarks */}
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              AD Students Final Verification Remarks
            </label>
            <textarea
              rows={2}
              placeholder="Verified by phone call with student. Closure approved."
              value={finalRemarks}
              onChange={(e) => setFinalRemarks(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-100"
            />
          </div>

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
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all ${
                actionType === 'close'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                  : 'bg-orange-600 hover:bg-orange-700 shadow-orange-500/20'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              {actionType === 'close' ? 'Finalize Closure' : 'Reopen Grievance'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
