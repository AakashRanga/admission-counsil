import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { UserRole } from '../../types/grievance';
import { 
  Bell, 
  Sun, 
  Moon, 
  ShieldCheck, 
  ChevronDown, 
  GraduationCap,
  X,
  Check,
  Menu
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const { 
    currentRole, 
    setCurrentRole, 
    isDarkMode, 
    toggleDarkMode, 
    notifications,
    markNotificationRead,
    clearAllNotifications,
    setActiveTab
  } = useApp();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);

  const rolesList: { id: UserRole; title: string; badge: string; desc: string }[] = [
    { id: 'student_council', title: 'Student Council', badge: 'Intake Desk', desc: 'Register complaints, meet students, assign authority' },
    { id: 'ad_academic', title: 'AD Academic', badge: 'Academic Desk', desc: 'Academic grievances, faculty assignments & grade issues' },
    { id: 'ad_maintenance', title: 'AD Maintenance', badge: 'Estate Desk', desc: 'Infrastructure, plumbing, electrical & HVAC repairs' },
    { id: 'ad_students', title: 'AD Students', badge: 'Verification Desk', desc: 'Resolution verification, student rating & closure' },
    { id: 'admin', title: 'Admin Operations', badge: 'Executive Desk', desc: 'Global analytics, audit logs & system setup' }
  ];

  const currentRoleInfo = rolesList.find(r => r.id === currentRole) || rolesList[0];
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 px-3 sm:px-6 py-2.5 sm:py-3 transition-colors duration-200">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Mobile Menu Toggle & Branding */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onToggleMobileSidebar}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 md:hidden hover:bg-slate-200 dark:hover:bg-slate-700"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 sm:gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center shadow-md shadow-brand-500/20 text-white shrink-0">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 tracking-wider uppercase block">Simats University</span>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-none">
                Academic Council
              </h1>
            </div>
          </div>

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-brand-500 shrink-0" />
              <span className="font-semibold text-[11px] sm:text-xs truncate max-w-[110px] sm:max-w-none">{currentRoleInfo.title}</span>
              <span className="hidden xl:inline-block px-1.5 py-0.5 text-[10px] uppercase font-bold rounded bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                {currentRoleInfo.badge}
              </span>
              <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
            </button>

            {/* Role Dropdown */}
            {showRoleDropdown && (
              <div 
                className="absolute left-0 mt-2 w-72 sm:w-80 rounded-xl glass-panel shadow-2xl border border-slate-200 dark:border-slate-700 p-2 z-50 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setShowRoleDropdown(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Switch Persona / View</p>
                  <button onClick={() => setShowRoleDropdown(false)} className="sm:hidden text-slate-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="py-1 space-y-1 max-h-72 overflow-y-auto">
                  {rolesList.map(r => (
                    <button
                      key={r.id}
                      onClick={() => {
                        setCurrentRole(r.id);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-start justify-between gap-2 text-xs transition-colors ${
                        currentRole === r.id 
                          ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-semibold' 
                          : 'hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span>{r.title}</span>
                          {currentRole === r.id && <Check className="w-3.5 h-3.5 text-brand-500" />}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5 leading-snug">
                          {r.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Notification Drawer Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDrawer(!showNotifDrawer)}
              className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifDrawer && (
              <div className="absolute right-0 mt-2 w-72 sm:w-96 rounded-2xl glass-panel shadow-2xl border border-slate-200 dark:border-slate-700 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                      Notifications
                    </h3>
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-brand-100 dark:bg-brand-950 text-brand-600">
                      {unreadCount} unread
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={clearAllNotifications}
                      className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      Clear all
                    </button>
                    <button onClick={() => setShowNotifDrawer(false)}>
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">No active notifications</p>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          n.read
                            ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 opacity-60'
                            : 'bg-white dark:bg-slate-800 border-brand-100 dark:border-brand-900 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-semibold ${n.type === 'urgent' ? 'text-rose-500' : 'text-slate-800 dark:text-slate-200'}`}>
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Toggle Light/Dark Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>

      </div>
    </header>
  );
};
