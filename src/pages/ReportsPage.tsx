import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { GrievanceIssue } from '../types/grievance';
import { TablePagination } from '../components/common/TablePagination';
import { TableSkeleton } from '../components/common/TableSkeleton';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Filter, 
  BookOpen, 
  Wrench, 
  ShieldCheck, 
  Search, 
  RotateCcw, 
  ArrowUpRight,
  Eye
} from 'lucide-react';
import { PriorityBadge, StatusBadge } from '../components/common/StatusBadge';

export const ReportsPage: React.FC = () => {
  const { issues, currentRole, isLoading, setSelectedIssueId, addToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Extract unique departments for dropdown
  const uniqueDepartments = Array.from(
    new Set(issues.map(i => i.student.department).filter(Boolean))
  );

  // Strict role-based & multi-filter report issues search
  const reportIssues = issues.filter((issue: GrievanceIssue) => {
    // Role scope filter
    if (currentRole === 'ad_academic' && issue.type !== 'academic') return false;
    if (currentRole === 'ad_maintenance' && issue.type !== 'maintenance') return false;

    // Search query filter
    const query = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' ||
      issue.id.toLowerCase().includes(query) ||
      issue.student.name.toLowerCase().includes(query) ||
      issue.student.id.toLowerCase().includes(query) ||
      issue.student.department.toLowerCase().includes(query) ||
      issue.title.toLowerCase().includes(query) ||
      (issue.subject && issue.subject.toLowerCase().includes(query)) ||
      (issue.building && issue.building.toLowerCase().includes(query));

    // Type filter
    const matchesType = typeFilter === 'all' || issue.type === typeFilter;

    // Status filter
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;

    // Department filter
    const matchesDepartment = departmentFilter === 'all' || issue.student.department === departmentFilter;

    return matchesSearch && matchesType && matchesStatus && matchesDepartment;
  });

  const totalPages = Math.ceil(reportIssues.length / pageSize) || 1;
  const paginatedIssues = reportIssues.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const resetFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setStatusFilter('all');
    setDepartmentFilter('all');
    setCurrentPage(1);
  };

  const isFiltered = searchQuery !== '' || typeFilter !== 'all' || statusFilter !== 'all' || departmentFilter !== 'all';

  const handleExportCSV = () => {
    const headers = ['Ticket ID', 'Student ID', 'Student Name', 'Department', 'Type', 'Category', 'Priority', 'Status', 'Submitted Date'];
    const rows = reportIssues.map((i: GrievanceIssue) => [
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

    const prefix = currentRole === 'ad_academic' ? 'Academic_Grievances' : currentRole === 'ad_maintenance' ? 'Maintenance_Issues' : 'University_Grievances';
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${prefix}_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', 'Excel/CSV Report Downloaded', `Generated report with ${reportIssues.length} records.`);
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
          <div className="flex items-center gap-2 mb-1">
            <FileSpreadsheet className="w-5 h-5 text-brand-500" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Grievance Reporting & Export Suite
            </h1>
          </div>
          

          {/* Active Role Scope Badge */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
            {currentRole === 'ad_academic' && (
              <>
                <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                <span>AD Academic Scope: Academic Grievances Only ({reportIssues.length} Records)</span>
              </>
            )}
            {currentRole === 'ad_maintenance' && (
              <>
                <Wrench className="w-3.5 h-3.5 text-amber-500" />
                <span>AD Maintenance Scope: Estate & Repairs Only ({reportIssues.length} Records)</span>
              </>
            )}
            {currentRole !== 'ad_academic' && currentRole !== 'ad_maintenance' && (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Executive Scope: All Campus Categories ({reportIssues.length} Records)</span>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-3 shrink-0">
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

      {/* Dataset & Filter Toolbar */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        
        {/* Table Header & Reset Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Export Preview Dataset ({reportIssues.length} Records)</span>
          </h3>

          {isFiltered && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-rose-600 dark:text-rose-400 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Integrated Candidate Search & Multi-Filter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          
          {/* Search Candidate Input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Candidate ID, name, dept..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Issue Type Filter (Only for Executive / General Roles) */}
          {currentRole !== 'ad_academic' && currentRole !== 'ad_maintenance' ? (
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-100"
            >
              <option value="all">All Issue Categories</option>
              <option value="academic">Academic Grievances Only</option>
              <option value="maintenance">Estate & Maintenance Only</option>
            </select>
          ) : (
            <div className="px-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 flex items-center gap-1.5 font-medium">
              <Filter className="w-3.5 h-3.5 text-brand-500" />
              <span>{currentRole === 'ad_academic' ? 'Academic Only' : 'Maintenance Only'}</span>
            </div>
          )}

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-100"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Intake</option>
            <option value="assigned">Staff Assigned</option>
            <option value="investigating">Under Investigation</option>
            <option value="work_started">Work Started</option>
            <option value="work_completed">Work Completed</option>
            <option value="verification_pending">Verification Pending</option>
            <option value="resolved">Resolved & Closed</option>
            <option value="reopened">Reopened</option>
          </select>

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => { setDepartmentFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-100"
          >
            <option value="all">All Departments</option>
            {uniqueDepartments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

        </div>

        {/* Dataset Table */}
        {isLoading ? (
          <TableSkeleton rows={5} cols={8} />
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                    <th className="py-2.5 px-3">Ticket ID</th>
                    <th className="py-2.5 px-3">Student / Candidate</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Type & Category</th>
                    <th className="py-2.5 px-3">Priority</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Submitted</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginatedIssues.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                        No candidate issues match the current search & filter scope.
                      </td>
                    </tr>
                  ) : (
                    paginatedIssues.map((issue: GrievanceIssue) => (
                      <tr 
                        key={issue.id} 
                        onClick={() => setSelectedIssueId(issue.id)}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                      >
                        <td className="py-2.5 px-3 font-mono font-bold text-brand-600 dark:text-brand-400">{issue.id}</td>
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{issue.student.name}</div>
                          <div className="text-[10px] font-mono text-slate-400">{issue.student.id}</div>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{issue.student.department}</td>
                        <td className="py-2.5 px-3">
                          <span className="font-medium text-slate-800 dark:text-slate-200 uppercase">{issue.type}</span> - {issue.academicCategory || issue.maintenanceCategory}
                        </td>
                        <td className="py-2.5 px-3"><PriorityBadge priority={issue.priority} /></td>
                        <td className="py-2.5 px-3"><StatusBadge status={issue.status} /></td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">{issue.submittedAt}</td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedIssueId(issue.id);
                            }}
                            className="px-3 py-1 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-sm inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Details</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={reportIssues.length}
              pageSize={pageSize}
              onPageChange={(page) => setCurrentPage(page)}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>

    </div>
  );
};
