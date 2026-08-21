import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  Server,
  ArrowLeft,
} from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, installation, navigateToRoute, showToast } = useApp();

  const [identifier, setIdentifier] = useState(installation.superAdmin.username || 'superadmin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      showToast('Missing Credentials', 'Please enter your Super Admin username/email and password.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      loginAdmin(identifier.trim(), password);
    }, 600);
  };

  const handleQuickFill = () => {
    setIdentifier(installation.superAdmin.username || 'superadmin');
    setPassword(installation.superAdmin.password || 'SuperAdmin2026!');
    showToast('Credentials Filled', 'Loaded master administrator credentials from configuration.', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 font-sans antialiased text-slate-900">
      <div className="w-full max-w-md">
        {/* Top Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-slate-700 text-xs font-semibold shadow-2xs mb-3 border border-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-[#a73827]" />
            <span>Master Enterprise Authentication</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-[10px] bg-[#a73827] flex items-center justify-center font-black text-white text-xl shadow-2xs">
              X
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              xfit <span className="text-[#a73827]">Admin</span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">
            Super Administrator Control Portal • Route: <span className="font-mono text-slate-700">/admin</span>
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[10px] p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">Super Admin Authentication</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your master administrator credentials to access platform rosters and system configurations.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Username or Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@xfit.com or superadmin"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#a73827]/20 focus:border-[#a73827] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Master Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#a73827]/20 focus:border-[#a73827] focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-[#a73827] hover:bg-[#8f2f20] text-white rounded-[10px] text-xs font-bold flex items-center justify-center gap-2 shadow-2xs active:scale-95 transition-all mt-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <span>Authenticate & Enter Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Helper for Test / Installed Credentials */}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleQuickFill}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-[10px] text-[11px] font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#a73827]" />
              <span>Fill Master Credentials from Setup</span>
            </button>

            <button
              type="button"
              onClick={() => navigateToRoute('customer')}
              className="w-full py-1.5 text-slate-500 hover:text-slate-900 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Portal</span>
            </button>
          </div>
        </div>

        {/* Security Stamp */}
        <div className="mt-6 text-center text-[11px] text-slate-400">
          <p>Protected by 256-bit AES Token Auth & Rate Limiting</p>
          <p className="mt-0.5 text-slate-400 font-mono">xfit Enterprise Architecture</p>
        </div>
      </div>
    </div>
  );
};
