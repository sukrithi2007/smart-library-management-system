import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { UserRole } from '../types';
import {
  BookOpen,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Sparkles,
  Check,
  HelpCircle,
  X,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, switchDemoRole, setCurrentView, addToast } = useLibrary();

  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!emailOrId.trim()) {
      setErrorMessage('Please enter your campus email or Student/Staff ID.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      login(emailOrId, selectedRole);
    }, 700);
  };

  const fillDemoCredentials = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'student') {
      setEmailOrId('sarah.chen@campus.edu');
      setPassword('student123');
    } else if (role === 'librarian') {
      setEmailOrId('elena.rostova@campus.edu');
      setPassword('librarian123');
    } else if (role === 'admin') {
      setEmailOrId('marcus.vance@campus.edu');
      setPassword('admin123');
    }
    setErrorMessage(null);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSuccess(true);
    setTimeout(() => {
      addToast(
        'info',
        'Password Reset Dispatched',
        `A secure verification link has been sent to ${forgotEmail}.`
      );
      setShowForgotModal(false);
      setForgotSuccess(false);
      setForgotEmail('');
    }, 1200);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white relative">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-950 to-slate-950 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 items-center justify-center text-white shadow-xl shadow-indigo-500/25 mb-1">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Access <span className="text-cyan-400">LibraVerse</span>
          </h2>
          <p className="text-xs text-slate-400">
            Sign in to access student loans, reservations, and research tools
          </p>
        </div>

        {/* Demo Accounts Quick-Select Card */}
        <div className="p-3.5 rounded-2xl border border-indigo-500/20 bg-indigo-950/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-300 mb-2 px-1">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              1-Click Demo Accounts:
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemoCredentials('student')}
              className={`p-2 rounded-xl text-left border transition-all ${
                selectedRole === 'student'
                  ? 'border-cyan-500/60 bg-cyan-950/40 text-cyan-300'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
              }`}
            >
              <p className="text-xs font-bold leading-none">Student</p>
              <p className="text-[10px] text-slate-500 mt-1 truncate">Sarah Chen</p>
            </button>

            <button
              type="button"
              onClick={() => fillDemoCredentials('librarian')}
              className={`p-2 rounded-xl text-left border transition-all ${
                selectedRole === 'librarian'
                  ? 'border-indigo-500/60 bg-indigo-950/40 text-indigo-300'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
              }`}
            >
              <p className="text-xs font-bold leading-none">Librarian</p>
              <p className="text-[10px] text-slate-500 mt-1 truncate">Dr. Rostova</p>
            </button>

            <button
              type="button"
              onClick={() => fillDemoCredentials('admin')}
              className={`p-2 rounded-xl text-left border transition-all ${
                selectedRole === 'admin'
                  ? 'border-amber-500/60 bg-amber-950/40 text-amber-300'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
              }`}
            >
              <p className="text-xs font-bold leading-none">Admin</p>
              <p className="text-[10px] text-slate-500 mt-1 truncate">M. Vance</p>
            </button>
          </div>
        </div>

        {/* Main Login Form */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-6 shadow-2xl space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <span className="font-semibold shrink-0">Error:</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Identifier input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Campus Email or Student/Staff ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={emailOrId}
                  onChange={(e) => setEmailOrId(e.target.value)}
                  placeholder="e.g. sarah.chen@campus.edu or STU-2024-8841"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-cyan-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-800 border-slate-700"
                />
                <span>Remember this terminal</span>
              </label>

              <span className="text-[11px] text-slate-500 font-mono">Role: {selectedRole}</span>
            </div>

            {/* Submit Button with Animated Loading State */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 hover:opacity-95 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to LibraVerse</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={() => setCurrentView('landing')}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              ← Return to Library Home
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Reset Account Access</h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Enter your student or university staff email to receive a password reset link.
            </p>
            <form onSubmit={handleForgotSubmit} className="space-y-3">
              <input
                type="email"
                required
                placeholder="e.g. sarah.chen@campus.edu"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button
                type="submit"
                className="w-full py-2 px-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors"
              >
                {forgotSuccess ? 'Sending Link...' : 'Send Reset Link'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
