import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { SystemUser, DepartmentInfo } from '../types/grievance';
import { TablePagination } from '../components/common/TablePagination';
import { TableSkeleton } from '../components/common/TableSkeleton';
import { Users, Building2, UserPlus } from 'lucide-react';
import { AddUserModal } from '../components/forms/AddUserModal';

export const UsersManagementPage: React.FC = () => {
  const { users, departments, issues, isLoading } = useApp();
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.ceil(users.length / pageSize) || 1;
  const paginatedUsers = users.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-500" />
            University Users & Authority Roster
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage system permissions, council representatives, associate deans, trade supervisors, and department heads.
          </p>
        </div>

        <button 
          onClick={() => setIsAddUserOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20"
        >
          <UserPlus className="w-4 h-4" />
          Add Authority User
        </button>
      </div>

      {/* Users Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Registered Authority Users ({users.length})
          </h3>

          {isLoading ? (
            <TableSkeleton rows={5} cols={5} />
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[600px]">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                      <th className="py-2.5 px-3">User Name</th>
                      <th className="py-2.5 px-3">Role</th>
                      <th className="py-2.5 px-3">Department</th>
                      <th className="py-2.5 px-3">Email</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {paginatedUsers.map((u: SystemUser) => (
                      <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-3 font-bold text-slate-900 dark:text-slate-100">{u.name}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 uppercase">
                            {u.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{u.department}</td>
                        <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{u.email}</td>
                        <td className="py-3 px-3 text-right text-emerald-600 dark:text-emerald-400 font-bold">● Active</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={users.length}
                pageSize={pageSize}
                onPageChange={(page) => setCurrentPage(page)}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>

        {/* Departments Directory (1 col) */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-500" />
            University Departments ({departments.length})
          </h3>

          <div className="space-y-3">
            {departments.map((d: DepartmentInfo) => {
              const activeCount = issues.filter(i => (i.student.department.includes(d.name) || d.name.includes(i.student.department)) && i.status !== 'resolved').length;
              return (
                <div key={d.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{d.name}</span>
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700">
                      {d.code}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Head: {d.headName} • Active Grievances: <b>{activeCount}</b>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
      />

    </div>
  );
};
