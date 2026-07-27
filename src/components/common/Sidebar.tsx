import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  BookOpen,
  Wrench,
  CheckSquare,
  BarChart3,
  Users,
  Building2,
  Shield,
  FileSpreadsheet,
  History,
  LogOut,
  X,
  PlusCircle,
  Download
} from 'lucide-react';

interface SidebarProps {
  onOpenRegisterModal: () => void;
  onLogout: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  action?: () => void;
  badge?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenRegisterModal,
  onLogout,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const {
    currentRole,
    activeTab,
    setActiveTab,
    issues
  } = useApp();

  const academicCount = issues.filter(i => i.type === 'academic' && i.status !== 'resolved').length;
  const maintenanceCount = issues.filter(i => i.type === 'maintenance' && i.status !== 'resolved').length;
  const verificationCount = issues.filter(i => i.status === 'verification_pending' || i.status === 'work_completed').length;

  const roleTitles: Record<string, string> = {
    student_council: 'Student Council Desk',
    ad_academic: 'AD Academic Desk',
    ad_maintenance: 'AD Maintenance Desk',
    ad_students: 'AD Students Desk',
    admin: 'Admin Operations'
  };

  const roleMenuSections: Record<string, NavItem[]> = {
    student_council: [
      { id: 'dashboard', label: 'Council Overview', icon: LayoutDashboard },
      { id: 'register', label: 'Register Complaint', icon: PlusCircle, action: onOpenRegisterModal },
      { id: 'bulk_export', label: 'Bulk Issue Export & Import', icon: Download },
      { id: 'reports', label: 'Reports & Export', icon: FileSpreadsheet }
    ],
    ad_academic: [
      { id: 'dashboard', label: 'Academic Overview', icon: LayoutDashboard },
      { id: 'academic_queue', label: 'Academic Issues Queue', icon: BookOpen, badge: academicCount },
      { id: 'reports', label: 'Academic Reports', icon: FileSpreadsheet }
    ],
    ad_maintenance: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'maintenance_queue', label: ' Repairs Queue', icon: Wrench, badge: maintenanceCount },
      { id: 'reports', label: 'Maintenance Logs', icon: FileSpreadsheet }
    ],
    ad_students: [
      { id: 'dashboard', label: 'Welfare Overview', icon: LayoutDashboard },
      { id: 'verification', label: 'Verification & Closure', icon: CheckSquare, badge: verificationCount },
      { id: 'closed', label: 'Verified Closed History', icon: History },
      { id: 'bulk_export', label: 'Bulk Issue Export & Import', icon: Download },
      { id: 'reports', label: 'Generate Reports', icon: FileSpreadsheet }
    ],
    admin: [
      { id: 'dashboard', label: 'Executive Analytics', icon: BarChart3 },
      { id: 'users', label: 'Users & Authorities', icon: Users },
      { id: 'departments', label: 'Departments Directory', icon: Building2 },
      { id: 'audit_logs', label: 'System Audit Logs', icon: Shield },
      { id: 'bulk_export', label: 'Bulk Issue Export & Import', icon: Download },
      { id: 'reports', label: 'University Reports', icon: FileSpreadsheet }
    ]
  };

  const navItems = roleMenuSections[currentRole] || roleMenuSections.student_council;

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between overflow-y-auto">
      <div className="space-y-6">

        {/* Top Branding Section */}
        <div className="pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="w-11 h-11 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-md shadow-brand-500/10 shrink-0 p-1 border border-slate-200 dark:border-slate-700">
                <img src="/simats_logo.png" alt="Saveetha SIMATS Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 tracking-wider uppercase block">SIMATS University</span>
                <h1 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 leading-none">
                  Academic Council
                </h1>
              </div>
            </div>

            {onCloseMobile && (
              <button onClick={onCloseMobile} className="p-1 text-slate-400 hover:text-slate-600 md:hidden">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-200">
            <span className="truncate">{roleTitles[currentRole] || 'Portal User'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
          </div>
        </div>

        {/* Main Role Navigation Section */}
        <div>
          <div className="px-3 mb-2">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Navigation Menu
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else {
                      setActiveTab(item.id);
                    }
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${isActive
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-300'
                      }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

      </div>

      {/* Bottom Section: Logout / Persona Switcher Trigger */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 mt-6 space-y-3">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>

        <div className="text-[10px] text-slate-400 text-center">
          SIMATS Academic Council ERP • v2.4
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="w-64 shrink-0 hidden md:block h-screen overflow-y-auto sticky top-0 glass-panel border-r border-slate-200/80 dark:border-slate-800/80 p-4">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="fixed inset-y-0 left-0 w-72 glass-panel border-r border-slate-200 dark:border-slate-800 p-4 shadow-2xl z-50 animate-in slide-in-from-left">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
