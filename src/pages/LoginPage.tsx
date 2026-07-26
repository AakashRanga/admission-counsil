import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { UserRole } from '../types/grievance';
import { apiService } from '../services/api';
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  KeyRound
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { setCurrentRole, isDarkMode, toggleDarkMode, addToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const DEMO_ACCOUNTS = [
    { role: 'Student Council', email: 'council@simats.edu', pass: 'council123' },
    { role: 'AD Academic', email: 'academic@simats.edu', pass: 'academic123' },
    { role: 'AD Maintenance', email: 'estate@simats.edu', pass: 'estate123' },
    { role: 'AD Welfare', email: 'welfare@simats.edu', pass: 'welfare123' },
    { role: 'Admin', email: 'admin@simats.edu', pass: 'admin123' },
  ];

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setErrorMessage('Please enter both Email Address and Password.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await apiService.login({ email: trimmedEmail, password: trimmedPassword });
      if (result && result.user && result.user.role) {
        addToast('success', 'Authentication Successful', `Welcome ${result.user.name}`);
        setCurrentRole(result.user.role as UserRole);
        onLoginSuccess();
      } else {
        throw new Error('Authentication failed. User profile could not be loaded.');
      }
    } catch (err: any) {
      const msg = err?.message || 'Invalid email or password. Please try again.';
      setErrorMessage(msg);
      addToast('error', 'Login Failed', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 flex flex-col justify-between p-4 sm:p-8 font-sans transition-colors duration-200">

      {/* Top Header Row */}
      <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-lg shadow-brand-500/10 p-1 border border-slate-200 dark:border-slate-700">
            <img src="/simats_logo.png" alt="Saveetha SIMATS Logo" className="w-full h-full object-contain" />
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

      {/* Main Minimalist Login Container */}
      <div className="max-w-md mx-auto w-full my-auto glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8">

        <div className="text-center mb-6 space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Sign In to Portal
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter your official university email and password to access your dashboard.
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-4 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-medium flex items-start gap-2.5 shadow-sm animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <div className="leading-snug">{errorMessage}</div>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-brand-500" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              required
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage(null);
              }}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-brand-500" />
              <span>Password</span>
            </label>
            <input
              type="password"
              required
              placeholder="Enter Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage(null);
              }}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/50 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white shadow-lg shadow-brand-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer"
          >
            <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* System Credentials Reference */}
        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-2.5">
            <KeyRound className="w-3.5 h-3.5 text-brand-500" />
            <span>Test Role Accounts (Click to Auto-fill):</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.role}
                type="button"
                onClick={() => handleQuickFill(acc.email, acc.pass)}
                className="px-2.5 py-1 text-[10px] font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/40 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 border border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-800 transition-colors"
                title={`${acc.email} / ${acc.pass}`}
              >
                {acc.role}
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

