import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { UserRole } from '../types/grievance';
import { 
  GraduationCap, 
  ShieldCheck, 
  BookOpen, 
  Wrench, 
  Users, 
  Shield, 
  ArrowRight, 
  Lock, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { setCurrentRole, isDarkMode, toggleDarkMode } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student_council');
  const [email, setEmail] = useState('siddharth.council@univ.edu');
  const [password, setPassword] = useState('••••••••••••');

  const roleCards: { id: UserRole; title: string; subtitle: string; desc: string; icon: React.ReactNode; defaultEmail: string; color: string }[] = [
    {
      id: 'student_council',
      title: 'Student Council',
      subtitle: 'Intake Desk',
      desc: 'Register student complaints, meet students, and triage issues.',
      icon: <ShieldCheck className="w-6 h-6 text-brand-500" />,
      defaultEmail: 'siddharth.council@univ.edu',
      color: 'border-brand-500 bg-brand-50/40 dark:bg-brand-950/30'
    },
    {
      id: 'ad_academic',
      title: 'AD Academic',
      subtitle: 'Academic Affairs',
      desc: 'Manage grade disputes, attendance appeals, and faculty assignments.',
      icon: <BookOpen className="w-6 h-6 text-blue-500" />,
      defaultEmail: 'ramesh.academic@univ.edu',
      color: 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/30'
    },
    {
      id: 'ad_maintenance',
      title: 'AD Maintenance',
      subtitle: 'Estate & Infrastructure',
      desc: 'Dispatch electrical, plumbing, HVAC, and network repair teams.',
      icon: <Wrench className="w-6 h-6 text-amber-500" />,
      defaultEmail: 'rajesh.maint@univ.edu',
      color: 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/30'
    },
    {
      id: 'ad_students',
      title: 'AD Students',
      subtitle: 'Welfare & Verification',
      desc: 'Audit student satisfaction, verify resolution quality, and close tickets.',
      icon: <Users className="w-6 h-6 text-purple-500" />,
      defaultEmail: 'ananya.students@univ.edu',
      color: 'border-purple-500 bg-purple-50/40 dark:bg-purple-950/30'
    },
    {
      id: 'admin',
      title: 'Admin Operations',
      subtitle: 'Executive Governance',
      desc: 'Cross-campus analytics, department heatmap, users, and audit trail.',
      icon: <Shield className="w-6 h-6 text-slate-800 dark:text-slate-100" />,
      defaultEmail: 'admin.portal@univ.edu',
      color: 'border-slate-800 dark:border-slate-400 bg-slate-100 dark:bg-slate-800/60'
    }
  ];

  const handleSelectRoleCard = (card: typeof roleCards[0]) => {
    setSelectedRole(card.id);
    setEmail(card.defaultEmail);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentRole(selectedRole);
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 flex flex-col justify-between p-4 sm:p-8 font-sans transition-colors duration-200">
      
      {/* Top Header Row */}
      <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/20 text-white">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 tracking-wider uppercase block">SIMATS University</span>
            <h1 className="text-base font-extrabold text-slate-900 dark:text-slate-100 leading-none">
              Academic Council Portal
            </h1>
          </div>
        </div>

        <button
          onClick={toggleDarkMode}
          className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm"
        >
          {isDarkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </div>

      {/* Main Login Card Container */}
      <div className="max-w-5xl mx-auto w-full my-8 glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-10">
        
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 text-xs font-semibold border border-brand-200 dark:border-brand-800">
            <Sparkles className="w-3.5 h-3.5" />
            Enterprise Grievance & Issue Automation System
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Select Your Role to Access Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Choose your university role persona below to open your dedicated management dashboard.
          </p>
        </div>

        {/* 5 Persona Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {roleCards.map(card => {
            const isSelected = selectedRole === card.id;

            return (
              <div
                key={card.id}
                onClick={() => handleSelectRoleCard(card)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? `${card.color} ring-2 ring-brand-500/30 scale-[1.03] shadow-lg`
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
                      {card.icon}
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-brand-500" />}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {card.title}
                  </h3>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 block mt-0.5">
                    {card.subtitle}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] font-semibold text-brand-600 dark:text-brand-400">
                  <span>Select Persona</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Credentials Form Box */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
            <Lock className="w-4 h-4 text-brand-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Sign In Credentials ({roleCards.find(r => r.id === selectedRole)?.title})
            </h4>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Official University Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/50"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white shadow-lg shadow-brand-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>Launch Dashboard as {roleCards.find(r => r.id === selectedRole)?.title}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-400 max-w-7xl mx-auto w-full py-2">
        SIMATS Academic Council Grievance ERP System • Version 2.4 Production Build
      </div>

    </div>
  );
};
