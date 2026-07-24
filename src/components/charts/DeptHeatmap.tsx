import React from 'react';
import type { DepartmentInfo, GrievanceIssue } from '../../types/grievance';
import { Building2 } from 'lucide-react';

interface DeptHeatmapProps {
  departments: DepartmentInfo[];
  issues: GrievanceIssue[];
}

export const DeptHeatmap: React.FC<DeptHeatmapProps> = ({ departments, issues }) => {
  const getDeptStats = (deptName: string) => {
    const deptIssues = issues.filter(i => i.student.department.includes(deptName) || deptName.includes(i.student.department));
    const total = deptIssues.length;
    const academic = deptIssues.filter(i => i.type === 'academic').length;
    const maintenance = deptIssues.filter(i => i.type === 'maintenance').length;
    const urgent = deptIssues.filter(i => i.priority === 'critical' || i.priority === 'high').length;
    return { total, academic, maintenance, urgent };
  };

  const getHeatColor = (count: number) => {
    if (count === 0) return 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700';
    if (count <= 2) return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
    if (count <= 4) return 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800';
    if (count <= 6) return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
    return 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-400 dark:border-rose-800 animate-pulse';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-brand-500" />
          Department Grievance Density Heatmap
        </h3>
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <span>Low</span>
          <span className="w-3 h-3 bg-emerald-200 dark:bg-emerald-900 rounded" />
          <span className="w-3 h-3 bg-blue-200 dark:bg-blue-900 rounded" />
          <span className="w-3 h-3 bg-amber-200 dark:bg-amber-900 rounded" />
          <span className="w-3 h-3 bg-rose-200 dark:bg-rose-900 rounded" />
          <span>High Density</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {departments.map((dept) => {
          const stats = getDeptStats(dept.name);
          const heatStyle = getHeatColor(stats.total);

          return (
            <div
              key={dept.id}
              className={`p-3.5 rounded-xl border transition-all hover:scale-[1.02] cursor-pointer ${heatStyle}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-white/60 dark:bg-black/30">
                    {dept.code}
                  </span>
                  <h4 className="text-xs font-bold mt-1 line-clamp-1">{dept.name}</h4>
                  <p className="text-[11px] opacity-80 mt-0.5">Head: {dept.headName}</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-extrabold">{stats.total}</span>
                  <span className="text-[10px] block opacity-75">Issues</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] opacity-90 font-medium">
                <span>Acad: <b>{stats.academic}</b></span>
                <span>Maint: <b>{stats.maintenance}</b></span>
                {stats.urgent > 0 && (
                  <span className="font-bold text-rose-600 dark:text-rose-400">
                    ⚠️ {stats.urgent} Urgent
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
