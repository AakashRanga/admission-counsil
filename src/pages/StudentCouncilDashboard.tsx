import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { GrievanceIssue } from '../types/grievance';
import { StatusBadge } from '../components/common/StatusBadge';
import { TablePagination } from '../components/common/TablePagination';
import { TableSkeleton } from '../components/common/TableSkeleton';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  Search, 
  Plus, 
  Building2, 
  ArrowUpRight,
  TrendingUp,
  Filter,
  RotateCcw,
  Database
} from 'lucide-react';

interface DashboardProps {
  onOpenRegisterModal: () => void;
}

export const StudentCouncilDashboard: React.FC<DashboardProps> = ({ onOpenRegisterModal }) => {
  const { issues, isLoading, setSelectedIssueId, searchQuery, setSearchQuery, refreshIssuesFromDB, addToast } = useApp();
  const [isSyncing, setIsSyncing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handleSyncDB = async () => {
    setIsSyncing(true);
    await refreshIssuesFromDB();
    setIsSyncing(false);
    addToast('info', 'Database Synced', 'Fetched latest grievance records from database.');
  };

  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');

  // Stat card counts
  const pendingCount = issues.filter(i => i.status === 'pending').length;
  const inProgressCount = issues.filter(i => i.status === 'assigned' || i.status === 'investigating' || i.status === 'work_started' || i.status === 'verification_pending').length;
  const completedCount = issues.filter(i => i.status === 'resolved' || i.status === 'work_completed').length;

  // Extract unique departments for dropdown
  const uniqueDepartments = Array.from(
    new Set(issues.map(i => i.student.department).filter(Boolean))
  );

  const filteredIssues = issues.filter((issue: GrievanceIssue) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      issue.id.toLowerCase().includes(query) ||
      issue.student.name.toLowerCase().includes(query) ||
      issue.student.id.toLowerCase().includes(query) ||
      issue.student.department.toLowerCase().includes(query) ||
      issue.title.toLowerCase().includes(query) ||
      (issue.subject && issue.subject.toLowerCase().includes(query));

    const matchesType = filterType === 'all' || issue.type === filterType;

    let matchesStatus = true;
    if (filterStatus === 'pending') {
      matchesStatus = issue.status === 'pending';
    } else if (filterStatus === 'in_resolution') {
      matchesStatus = issue.status === 'assigned' || issue.status === 'investigating' || issue.status === 'work_started' || issue.status === 'verification_pending';
    } else if (filterStatus === 'resolved') {
      matchesStatus = issue.status === 'resolved' || issue.status === 'work_completed';
    } else if (filterStatus !== 'all') {
      matchesStatus = issue.status === filterStatus;
    }

    const matchesDepartment = filterDepartment === 'all' || issue.student.department === filterDepartment;

    return matchesSearch && matchesType && matchesStatus && matchesDepartment;
  });

  const totalPages = Math.ceil(filteredIssues.length / pageSize) || 1;
  const paginatedIssues = filteredIssues.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleTypeChange = (val: string) => {
    setFilterType(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (val: string) => {
    setFilterStatus(val);
    setCurrentPage(1);
  };

  const handleDepartmentChange = (val: string) => {
    setFilterDepartment(val);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilterType('all');
    setFilterStatus('all');
    setFilterDepartment('all');
    setCurrentPage(1);
  };

  const isFiltered = searchQuery !== '' || filterType !== 'all' || filterStatus !== 'all' || filterDepartment !== 'all';

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-2">
            <Building2 className="w-3.5 h-3.5" />
               Student Council Grievance Portal
          </div>
        
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Meet students, record academic & maintenance complaints, and route issues directly to university authorities.
          </p>
        </div>

        <button
          onClick={onOpenRegisterModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white shadow-lg shadow-brand-500/25 transition-all transform hover:-translate-y-0.5 shrink-0"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Register New Complaint</span>
        </button>
      </div>

      {/* Overview Stat Cards (Interactive Filter Triggers) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => { handleStatusChange('all'); handleTypeChange('all'); handleDepartmentChange('all'); }}
          className={`glass-card p-4 rounded-2xl border cursor-pointer transition-all ${
            filterStatus === 'all' && filterType === 'all' && filterDepartment === 'all'
              ? 'border-brand-500 ring-2 ring-brand-500/20'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Registered</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{issues.length}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Academic & Estate</span>
            </div>
            <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div 
          onClick={() => handleStatusChange('pending')}
          className={`glass-card p-4 rounded-2xl border cursor-pointer transition-all ${
            filterStatus === 'pending'
              ? 'border-amber-500 ring-2 ring-amber-500/20'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider block">Pending Triage</span>
              <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{pendingCount}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Awaiting Assignment</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div 
          onClick={() => handleStatusChange('in_resolution')}
          className={`glass-card p-4 rounded-2xl border cursor-pointer transition-all ${
            filterStatus === 'in_resolution'
              ? 'border-blue-500 ring-2 ring-blue-500/20'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-blue-500 uppercase tracking-wider block">In Resolution</span>
              <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">{inProgressCount}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Staff Dispatched</span>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div 
          onClick={() => handleStatusChange('resolved')}
          className={`glass-card p-4 rounded-2xl border cursor-pointer transition-all ${
            filterStatus === 'resolved'
              ? 'border-emerald-500 ring-2 ring-emerald-500/20'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider block">Resolved & Closed</span>
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{completedCount}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Verified by Students</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Primary Complaints Stream with Integrated Multi-Filter Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        
        {/* Table Header & Controls Toolbar */}
        <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Grievance Complaints Master Directory ({filteredIssues.length})
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSyncDB}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-50 dark:bg-brand-950/80 hover:bg-brand-100 dark:hover:bg-brand-900 border border-brand-200 dark:border-brand-800 text-xs font-semibold text-brand-600 dark:text-brand-400 transition-all"
              >
                <Database className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync DB Data'}</span>
              </button>

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
          </div>

          {/* Integrated Filter Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search ID, name, dept..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Issue Type Filter */}
            <select
              value={filterType}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-100"
            >
              <option value="all">All Issue Types</option>
              <option value="academic">Academic Grievance</option>
              <option value="maintenance">Maintenance</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-100"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending Intake</option>
              <option value="in_resolution">In Resolution (Active)</option>
              <option value="assigned">Staff Assigned</option>
              <option value="investigating">Under Investigation</option>
              <option value="work_started">Work Started</option>
              <option value="verification_pending">Verification Pending</option>
              <option value="resolved">Resolved & Closed</option>
            </select>

            {/* Department Filter */}
            <select
              value={filterDepartment}
              onChange={(e) => handleDepartmentChange(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-100"
            >
              <option value="all">All Departments</option>
              {uniqueDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

          </div>
        </div>

        {/* Complaints Table */}
        {isLoading ? (
          <TableSkeleton rows={5} cols={7} />
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Ticket ID</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Category & Title</th>
                    <th className="py-2.5 px-3">Submitted Date</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginatedIssues.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-slate-400 text-xs">
                        No grievance tickets found matching the selected filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedIssues.map((issue: GrievanceIssue) => (
                      <tr key={issue.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-brand-600 dark:text-brand-400">
                          {issue.id}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{issue.student.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{issue.student.id}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                          {issue.student.department}
                        </td>
                        <td className="py-3 px-3 max-w-xs">
                          <div className="font-medium text-slate-800 dark:text-slate-200 truncate">{issue.title}</div>
                          <div className="text-[10px] text-slate-400 uppercase">{issue.type}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                          {issue.submittedAt}
                        </td>
                        <td className="py-3 px-3">
                          <StatusBadge status={issue.status} />
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => setSelectedIssueId(issue.id)}
                            className="px-3 py-1.5 rounded-lg bg-brand-500 text-white hover:bg-brand-600 text-xs font-semibold shadow-sm inline-flex items-center gap-1"
                          >
                            <span>View Details</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
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
              totalItems={filteredIssues.length}
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
