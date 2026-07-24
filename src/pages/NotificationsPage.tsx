import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCheck, Trash2, ShieldAlert, Info, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, clearAllNotifications, setSelectedIssueId } = useApp();
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'urgent') return n.type === 'urgent';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return <ShieldAlert className="w-5 h-5 text-rose-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      default:
        return <Info className="w-5 h-5 text-brand-500" />;
    }
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-300';
      case 'warning':
        return 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300';
      case 'success':
        return 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300';
      default:
        return 'bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border-brand-300';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-5xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Bell className="w-5 h-5 text-brand-500" />
              Notifications & System Broadcast Center
            </h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white animate-pulse">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Detailed view of real-time status updates, dispatch notices, urgent student escalations, and system alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => notifications.forEach(n => markNotificationRead(n.id))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-emerald-500" />
            <span>Mark All Read</span>
          </button>

          <button
            onClick={clearAllNotifications}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'all'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          All Notifications ({notifications.length})
        </button>

        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'unread'
              ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          Unread Only ({unreadCount})
        </button>

        <button
          onClick={() => setFilter('urgent')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'urgent'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          Urgent Alerts ({notifications.filter(n => n.type === 'urgent').length})
        </button>
      </div>

      {/* Detailed Notification List */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
            <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            No notifications match your current filter settings.
          </div>
        ) : (
          filteredNotifs.map(n => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                !n.read
                  ? 'glass-panel border-brand-500/50 shadow-md scale-[1.005]'
                  : 'glass-card border-slate-200 dark:border-slate-800 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                    {getIcon(n.type)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {n.title}
                      </h3>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
                      )}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getBadgeStyle(n.type)}`}>
                        {n.type}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {n.message}
                    </p>

                    <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-400 font-mono">
                      <span>{n.timestamp}</span>
                      {n.targetIssueId && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedIssueId(n.targetIssueId!);
                          }}
                          className="font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                        >
                          <span>Ticket #{n.targetIssueId}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {!n.read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markNotificationRead(n.id);
                    }}
                    className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline shrink-0"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
