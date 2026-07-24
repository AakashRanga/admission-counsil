import React from 'react';
import { TrendingUp } from 'lucide-react';

export const ResolutionTrendLine: React.FC = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const submittedData = [45, 52, 60, 48, 70, 65, 82];
  const resolvedData = [40, 48, 55, 45, 66, 62, 75];

  const maxVal = 100;
  const height = 140;
  const width = 380;
  const padding = 25;

  const pointsSubmitted = submittedData.map((val, idx) => {
    const x = padding + (idx * (width - 2 * padding)) / (months.length - 1);
    const y = height - padding - (val / maxVal) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  const pointsResolved = resolvedData.map((val, idx) => {
    const x = padding + (idx * (width - 2 * padding)) / (months.length - 1);
    const y = height - padding - (val / maxVal) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          Monthly Grievance Intake vs Resolution Trend
        </h3>
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-brand-500 rounded" />
            <span className="text-slate-600 dark:text-slate-300">Submitted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-emerald-500 rounded" />
            <span className="text-slate-600 dark:text-slate-300">Resolved</span>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((level, i) => {
            const y = height - padding - (level / maxVal) * (height - 2 * padding);
            return (
              <g key={i}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="currentColor" strokeDasharray="3 3" className="text-slate-200 dark:text-slate-800" />
                <text x={padding - 5} y={y + 3} textAnchor="end" className="text-[9px] fill-slate-400 font-mono">{level}</text>
              </g>
            );
          })}

          {/* Submitted Line */}
          <polyline
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.5"
            points={pointsSubmitted}
          />

          {/* Resolved Line */}
          <polyline
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            points={pointsResolved}
          />

          {/* X Axis Labels */}
          {months.map((m, idx) => {
            const x = padding + (idx * (width - 2 * padding)) / (months.length - 1);
            return (
              <text key={idx} x={x} y={height - 5} textAnchor="middle" className="text-[10px] fill-slate-500 dark:fill-slate-400 font-medium">
                {m}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
