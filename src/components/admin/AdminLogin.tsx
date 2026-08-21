import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  UserPlus,
} from 'lucide-react';
import { registerApi } from '../../services/api';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, navigateToRoute, showToast } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'trainer' | 'customer'>('trainer');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'login') {
      if (!identifier.trim() || !password.trim()) {
        showToast('Missing Credentials', 'Please enter your username or email and password.', 'error');
        return;
      }

      setIsSubmitting(true);
      const success = await loginAdmin(identifier.trim(), password);
      setIsSubmitting(false);

      if (!success) {
        showToast('Authentication Failed', 'Invalid username or password.', 'error');
      }
    } else {
      if (!email.trim() || !identifier.trim() || !password.trim() || !fullName.trim()) {
        showToast('Missing Fields', 'Please complete all required registration fields.', 'error');
        return;
      }

      setIsSubmitting(true);
      const res = await registerApi({
        email: email.trim(),
        username: identifier.trim(),
        password: password.trim(),
        fullName: fullName.trim(),
        role,
      });
      setIsSubmitting(false);

      if (res.success) {
        showToast('Account Created', `Welcome to xfit, ${fullName}! Account created successfully.`, 'success');
        await loginAdmin(identifier.trim(), password);
      } else {
        showToast('Registration Error', res.error || 'Failed to create account.', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 font-sans antialiased text-[#1d1d1f] tracking-tight">
      <div className="w-full max-w-md">
        {/* Apple Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-[#86868b] text-xs font-medium shadow-sm mb-4 border border-black/5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0071e3]" />
            <span>SQLite Authentication Engine</span>
          </div>
          <div className="flex items-center justify-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-[#0071e3] flex items-center justify-center font-black text-white text-2xl shadow-sm">
              X
            </div>
            <h1 className="text-3xl font-extrabold text-[#1d1d1f] tracking-tight">
              xfit <span className="text-[#0071e3]">Fitness</span>
            </h1>
          </div>
          <p className="text-xs text-[#86868b] mt-2 font-medium">
            Personal Coaching & Member Portal
          </p>
        </div>

        {/* Apple Glass Card */}
        <div className="apple-card p-6 sm:p-8 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-black/5 pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#1d1d1f]">
                {mode === 'login' ? 'Sign In to xfit' : 'Create Your Account'}
              </h2>
              <p className="text-xs text-[#86868b] mt-0.5 font-medium">
                {mode === 'login'
                  ? 'Enter your credentials to access your personal fitness portal.'
                  : 'Register as an individual trainer or member.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-[#1d1d1f] mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    required
                    className="w-full px-3.5 py-2.5 bg-[#f5f5f7] border border-black/5 rounded-xl text-xs text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1d1d1f] mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    required
                    className="w-full px-3.5 py-2.5 bg-[#f5f5f7] border border-black/5 rounded-xl text-xs text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1d1d1f] mb-1">Account Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('trainer')}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        role === 'trainer'
                          ? 'bg-[#0071e3] text-white border-transparent shadow-sm'
                          : 'bg-[#f5f5f7] text-[#86868b] border-black/5 hover:text-[#1d1d1f]'
                      }`}
                    >
                      Fitness Coach
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('customer')}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        role === 'customer'
                          ? 'bg-[#0071e3] text-white border-transparent shadow-sm'
                          : 'bg-[#f5f5f7] text-[#86868b] border-black/5 hover:text-[#1d1d1f]'
                      }`}
                    >
                      Member / Client
                    </button>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#1d1d1f] mb-1">
                {mode === 'login' ? 'Username or Email' : 'Desired Username'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={mode === 'login' ? 'Enter username or email' : 'e.g. alexmorgan'}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f5f5f7] border border-black/5 rounded-xl text-xs text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#1d1d1f]">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-[#86868b] hover:text-[#1d1d1f] flex items-center gap-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f5f5f7] border border-black/5 rounded-xl text-xs text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full text-xs font-semibold flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all mt-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In to Portal' : 'Register Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle between Login and Register */}
          <div className="pt-3 border-t border-black/5 text-center">
            {mode === 'login' ? (
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-xs font-medium text-[#0071e3] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Don't have an account? Register now</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs font-medium text-[#0071e3] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Already registered? Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Security Stamp */}
        <div className="mt-6 text-center text-[11px] text-[#86868b]">
          <p>Protected by 256-bit AES Token Auth & SQLite Engine</p>
        </div>
      </div>
    </div>
  );
};
