import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { DepartmentInfo } from '../types/grievance';
import { Building2, Plus, Search, CheckCircle2 } from 'lucide-react';

export const DepartmentsDirectoryPage: React.FC = () => {
  const { departments, issues } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDepts = departments.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.headName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-500" />
            University Departments & Academic Schools Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Overarching directory of SIMATS University departments, department heads, faculty rosters, and active grievance loads.
          </p>
        </div>

        <button 
          onClick={() => alert('New Department Creation dialog triggered.')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Department / School
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Filter departments by school name, code, or department head..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-xs bg-transparent outline-none text-slate-800 dark:text-slate-100"
        />
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDepts.map((dept: DepartmentInfo) => {
          const deptIssues = issues.filter(i => i.student.department.includes(dept.name) || dept.name.includes(i.student.department));
          const academicCount = deptIssues.filter(i => i.type === 'academic').length;
          const maintenanceCount = deptIssues.filter(i => i.type === 'maintenance').length;

          return (
            <div 
              key={dept.id} 
              className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300">
                    {dept.code}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Active School
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Department Head: <b className="text-slate-700 dark:text-slate-200">{dept.headName}</b>
                  </p>
                </div>
              </div>

              {/* Stats Box */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Total</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{deptIssues.length}</span>
                </div>
                <div>
                  <span className="text-[10px] text-brand-500 block">Academic</span>
                  <span className="font-bold text-brand-600 dark:text-brand-400 text-sm">{academicCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-amber-500 block">Estate</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">{maintenanceCount}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
