import React from 'react';
import { Loader2 } from 'lucide-react';

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5, cols = 6 }) => {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="flex items-center gap-2 text-xs text-brand-600 dark:text-brand-400 font-semibold mb-2">
        <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
        <span>Fetching live database records (low latency sync)...</span>
      </div>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <div
              key={cIdx}
              className={`h-4 rounded bg-slate-200 dark:bg-slate-700 ${
                cIdx === 0 ? 'w-20' : cIdx === 1 ? 'w-36' : 'flex-1'
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
