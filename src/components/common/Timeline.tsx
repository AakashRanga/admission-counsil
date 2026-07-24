import React from 'react';
import type { TimelineEntry } from '../../types/grievance';
import { CheckCircle2, Clock, User, Sparkles } from 'lucide-react';

interface TimelineProps {
  timeline: TimelineEntry[];
}

export const Timeline: React.FC<TimelineProps> = ({ timeline }) => {
  return (
    <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-700 space-y-6">
      {timeline.map((item, index) => (
        <div key={item.id || index} className="relative group">
          {/* Node Icon */}
          <div className="absolute -left-[31px] top-0.5 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border-2 border-brand-500 flex items-center justify-center shadow-sm">
            {index === 0 ? (
              <Sparkles className="w-3 h-3 text-brand-500" />
            ) : item.status === 'resolved' ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            ) : (
              <Clock className="w-3 h-3 text-slate-400" />
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {item.title}
              </h4>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                {item.timestamp}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              {item.description}
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400 dark:text-slate-500">
              <User className="w-3 h-3" />
              <span>{item.performedBy} ({item.role})</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
