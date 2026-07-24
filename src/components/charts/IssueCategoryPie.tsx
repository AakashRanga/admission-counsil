import React from 'react';
import type { GrievanceIssue } from '../../types/grievance';

interface IssueCategoryPieProps {
  issues: GrievanceIssue[];
}

export const IssueCategoryPie: React.FC<IssueCategoryPieProps> = ({ issues }) => {
  const categoryCounts: Record<string, number> = {};

  issues.forEach(i => {
    const cat = i.type === 'academic' 
      ? (i.academicCategory || 'Academic') 
      : (i.maintenanceCategory || 'Maintenance');
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const total = issues.length || 1;
  const categories = Object.keys(categoryCounts);
  
  const colors = [
    '#2563eb', // Royal Blue
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#8b5cf6', // Purple
    '#06b6d4', // Cyan
    '#ec4899'  // Pink
  ];

  let cumulativePercent = 0;

  const slices = categories.map((cat, index) => {
    const value = categoryCounts[cat];
    const percent = value / total;
    const startAngle = cumulativePercent * 360;
    cumulativePercent += percent;
    const endAngle = cumulativePercent * 360;

    const x1 = Math.cos((Math.PI * startAngle) / 180);
    const y1 = Math.sin((Math.PI * startAngle) / 180);
    const x2 = Math.cos((Math.PI * endAngle) / 180);
    const y2 = Math.sin((Math.PI * endAngle) / 180);

    const largeArcFlag = percent > 0.5 ? 1 : 0;
    const pathData = `M 0 0 L ${x1} ${y1} A 1 1 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    return {
      category: cat,
      count: value,
      percentage: Math.round(percent * 100),
      pathData,
      color: colors[index % colors.length]
    };
  });

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4">
      {/* SVG Pie */}
      <div className="relative w-40 h-40 shrink-0">
        <svg viewBox="-1.2 -1.2 2.4 2.4" className="w-full h-full transform -rotate-90">
          {slices.map((slice, i) => (
            <path
              key={i}
              d={slice.pathData}
              fill={slice.color}
              className="transition-all hover:opacity-85 hover:scale-105 cursor-pointer"
            >
              <title>{`${slice.category}: ${slice.count} (${slice.percentage}%)`}</title>
            </path>
          ))}
          {/* Inner cutout for Donut */}
          <circle cx="0" cy="0" r="0.65" className="fill-white dark:fill-slate-800" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{issues.length}</span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Issues</span>
        </div>
      </div>

      {/* Legend Grid */}
      <div className="flex-1 space-y-2 w-full">
        {slices.map((slice, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
              <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[150px]">
                {slice.category}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-slate-100">{slice.count}</span>
              <span className="text-slate-400 text-[11px]">({slice.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
