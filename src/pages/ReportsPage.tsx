import React from 'react';
import { useApp } from '../context/AppContext';
import type { GrievanceIssue } from '../types/grievance';
import { FileSpreadsheet, Download, Printer } from 'lucide-react';
import { PriorityBadge, StatusBadge } from '../components/common/StatusBadge';

export const ReportsPage: React.FC = () => {
  const { issues, addToast } = useApp();

  const handleExportCSV = () => {
    const headers = ['Ticket ID', 'Student ID', 'Student Name', 'Department', 'Type', 'Category', 'Priority', 'Status', 'Submitted Date'];
    const rows = issues.map((i: GrievanceIssue) => [
      i.id,
      i.student.id,
      `"${i.student.name}"`,
      `"${i.student.department}"`,
      i.type,
      `"${i.academicCategory || i.maintenanceCategory || ''}"`,
      i.priority,
      i.status,
      `"${i.submittedAt}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Academic_Council_Grievance_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', 'Excel/CSV Report Downloaded', 'Spreadsheet generated with current grievance dataset.');
  };

  const handlePrintPDF = () => {
    window.print();
    addToast('info', 'Print Dialog Triggered', 'Opening browser print document generator.');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-brand-500" />
            University Grievance Reporting & Export Suite
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate official PDF print summaries and export comprehensive Excel/CSV datasets for council review.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 transition-all"
          >
            <Download className="w-4 h-4" />
            Export Excel (CSV)
          </button>

          <button
            onClick={handlePrintPDF}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 transition-all"
          >
            <Printer className="w-4 h-4" />
            Export / Print PDF
          </button>
        </div>
      </div>

      {/* Summary Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Export Preview Dataset ({issues.length} Records)
          </h3>
          <span className="text-xs text-slate-400 font-mono">Format: Standard University Audit Schema</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                <th className="py-2.5 px-3">Ticket ID</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Type & Category</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {issues.map((issue: GrievanceIssue) => (
                <tr key={issue.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-mono font-bold text-brand-600 dark:text-brand-400">{issue.id}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">{issue.student.name}</td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{issue.student.department}</td>
                  <td className="py-2.5 px-3">
                    <span className="font-medium text-slate-800 dark:text-slate-200 uppercase">{issue.type}</span> - {issue.academicCategory || issue.maintenanceCategory}
                  </td>
                  <td className="py-2.5 px-3"><PriorityBadge priority={issue.priority} /></td>
                  <td className="py-2.5 px-3"><StatusBadge status={issue.status} /></td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">{issue.submittedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
