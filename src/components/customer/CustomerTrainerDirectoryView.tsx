import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  Sparkles,
  Bell,
  CheckCircle2,
  ShieldCheck,
  Award,
  Users,
  Dumbbell,
  Clock,
} from 'lucide-react';

export const CustomerTrainerDirectoryView: React.FC = () => {
  const { showToast, activeCustomer } = useApp();
  const [notifySubscribed, setNotifySubscribed] = useState(false);

  const handleNotifyMe = () => {
    setNotifySubscribed(true);
    showToast(
      'Priority Access Saved',
      'You will be notified as soon as the dedicated Coach Marketplace launches in your region.',
      'success'
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Find a Coach</h1>
        <p className="text-xs text-slate-500 mt-1">
          Explore certified performance specialists, nutritionists, and 1-on-1 dedicated trainers.
        </p>
      </div>

      {/* Coming Soon Hero Card */}
      <div className="bg-white rounded-[10px] border border-slate-200 p-8 sm:p-12 text-center shadow-2xs space-y-6">
        <div className="mx-auto w-16 h-16 rounded-[10px] bg-slate-50 border border-slate-200 flex items-center justify-center text-[#a73827]">
          <Compass className="w-8 h-8" />
        </div>

        <div className="max-w-md mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-[6px] text-xs font-black uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            Coaching Marketplace • Coming Soon
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight pt-1">
            Certified 1-on-1 Coach Matching
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            We are currently vetting and onboarding certified master trainers and precision sports nutritionists. Direct coach selection and live booking will unlock in the next platform update.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-2 text-left">
          <div className="p-4 rounded-[10px] bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="w-7 h-7 rounded-[6px] bg-white border border-slate-200 flex items-center justify-center text-[#a73827]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-900">Vetted Specialists</p>
            <p className="text-[11px] text-slate-500">
              Every trainer passes background and certification verifications.
            </p>
          </div>

          <div className="p-4 rounded-[10px] bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="w-7 h-7 rounded-[6px] bg-white border border-slate-200 flex items-center justify-center text-[#a73827]">
              <Dumbbell className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-900">Custom Periodization</p>
            <p className="text-[11px] text-slate-500">
              Personalized progressive overload routines and diet protocols.
            </p>
          </div>

          <div className="p-4 rounded-[10px] bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="w-7 h-7 rounded-[6px] bg-white border border-slate-200 flex items-center justify-center text-[#a73827]">
              <Award className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-900">Weekly Tracker Audits</p>
            <p className="text-[11px] text-slate-500">
              Milestone reviews, form feedback, and biometrics tracking.
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="pt-2">
          {notifySubscribed ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-[10px] text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>You are on the priority launch roster ({activeCustomer.email})</span>
            </div>
          ) : (
            <button
              onClick={handleNotifyMe}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#a73827] hover:bg-[#8f2f20] text-white rounded-[10px] text-xs font-bold shadow-2xs active:scale-95 transition-all cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span>Get Notified on Launch</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
