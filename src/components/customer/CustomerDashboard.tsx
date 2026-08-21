import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Dumbbell,
  Play,
  MessageSquare,
  ChevronRight,
  Clock,
  Droplets,
  Plus,
  ShieldCheck,
  Scale,
  Award,
  Activity,
  Utensils,
  Flame,
  Zap,
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const CustomerDashboard: React.FC = () => {
  const {
    activeCustomer,
    activeTrainer,
    workoutPlans,
    dietPlans,
    recordBmi,
    setActiveView,
    showToast,
  } = useApp();

  const [waterGlasses, setWaterGlasses] = useState(6);
  const [showLogWeightModal, setShowLogWeightModal] = useState(false);
  const [newWeight, setNewWeight] = useState(activeCustomer.currentWeightLbs || 165);
  const [showBookSessionModal, setShowBookSessionModal] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    date: '2026-08-25',
    time: '10:00 AM',
    type: '1-on-1 In-Person Form Check',
    notes: 'Focus on deadlift positioning and bar path.',
  });

  const currentWorkout =
    workoutPlans.find((w) => w.customerId === activeCustomer.id) ||
    workoutPlans.find((w) => w.status === 'active') ||
    workoutPlans[0];

  const currentDiet =
    dietPlans.find((d) => d.customerId === activeCustomer.id) ||
    dietPlans.find((d) => d.status === 'active') ||
    dietPlans[0];

  const todayDay = currentWorkout?.days[0] || {
    id: 'day-1',
    dayNumber: 1,
    dayName: 'Day 1: Upper Body Power',
    focus: 'Chest, Delts & Upper Back',
    estimatedMinutes: 55,
    exercises: [],
  };

  const totalExercises = todayDay.exercises.length || 4;
  const completedExercises = todayDay.exercises.filter((e) => e.isCompleted).length;
  const workoutProgress = Math.round((completedExercises / (totalExercises || 1)) * 100);

  // Macro Calculations
  const targetCalories = currentDiet?.dailyCalories || activeCustomer.targetCalories || 2200;
  const targetProtein = currentDiet?.targetProteinG || activeCustomer.targetProteinG || 160;

  const consumedCalories = currentDiet?.meals
    ?.filter((m) => m.isCompleted)
    .reduce((sum, m) => sum + m.calories, 0) || 1350;
  const consumedProtein = currentDiet?.meals
    ?.filter((m) => m.isCompleted)
    .reduce((sum, m) => sum + m.proteinG, 0) || 105;

  // Weight Progress
  const startWeight = activeCustomer.startWeightLbs || 180;
  const currentWeight = activeCustomer.currentWeightLbs || 165;
  const goalWeight = activeCustomer.goalWeightLbs || 155;
  const totalWeightToLose = startWeight - goalWeight;
  const currentWeightLost = startWeight - currentWeight;
  const goalProgressPct = Math.min(
    Math.max(Math.round((currentWeightLost / (totalWeightToLose || 1)) * 100), 0),
    100
  );

  const handleStartWorkout = () => {
    setActiveView('active_workout');
  };

  const handleAddWater = () => {
    setWaterGlasses((prev) => Math.min(prev + 1, 12));
    showToast('Hydration Logged', `+250ml water logged (Total: ${(waterGlasses + 1) * 250}ml)`, 'success');
  };

  const handleLogWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordBmi(activeCustomer.id, Number(newWeight), activeCustomer.heightCm || 178);
    setShowLogWeightModal(false);
    showToast('Weight Logged', `Recorded today's weight: ${newWeight} lbs`, 'success');
  };

  const handleBookSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowBookSessionModal(false);
    showToast('Session Requested', `Booked ${sessionForm.type} with ${activeTrainer.fullName || 'Coach'} on ${sessionForm.date}.`, 'success');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300 pb-20">
      {/* Apple Hero Header Banner */}
      <div className="apple-bento-card-dark p-6 sm:p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Background Radial Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#ff2d55]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#00f0ff]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-[#a3ff12] border border-white/15">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Apple Fitness+ Inspired Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Close Your Rings Today.
          </h1>
          <p className="text-sm text-[#86868b] max-w-lg font-normal">
            Prescribed training focus: <strong className="text-white font-semibold">{todayDay.focus || 'Upper Body Power'}</strong>.
            Coach: <span className="text-[#a3ff12] font-semibold">{activeTrainer.fullName || 'Personal Coach'}</span>.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <button
              onClick={handleStartWorkout}
              className="flex items-center gap-2 px-6 py-3 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full text-xs font-semibold shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{workoutProgress > 0 ? `Resume Workout (${workoutProgress}%)` : 'Start Today Workout'}</span>
            </button>

            <button
              onClick={() => setActiveView('plans')}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-semibold backdrop-blur-md border border-white/10 transition-all cursor-pointer"
            >
              View Nutrition Plan
            </button>
          </div>
        </div>

        {/* SVG Concentric Apple Activity Rings Widget */}
        <div className="relative w-44 h-44 shrink-0 flex items-center justify-center z-10">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            {/* Move Ring (Red) */}
            <circle cx="60" cy="60" r="50" stroke="rgba(255, 45, 85, 0.2)" strokeWidth="9" fill="none" />
            <circle
              cx="60"
              cy="60"
              r="50"
              className="ring-move transition-all duration-1000 ease-out"
              strokeWidth="9"
              strokeDasharray="314"
              strokeDashoffset={314 - (314 * Math.min(consumedCalories / targetCalories, 1))}
              strokeLinecap="round"
              fill="none"
            />
            {/* Exercise Ring (Green) */}
            <circle cx="60" cy="60" r="38" stroke="rgba(163, 255, 18, 0.2)" strokeWidth="9" fill="none" />
            <circle
              cx="60"
              cy="60"
              r="38"
              className="ring-exercise transition-all duration-1000 ease-out"
              strokeWidth="9"
              strokeDasharray="238"
              strokeDashoffset={238 - (238 * Math.min((workoutProgress || 20) / 100, 1))}
              strokeLinecap="round"
              fill="none"
            />
            {/* Stand Ring (Cyan) */}
            <circle cx="60" cy="60" r="26" stroke="rgba(0, 240, 255, 0.2)" strokeWidth="9" fill="none" />
            <circle
              cx="60"
              cy="60"
              r="26"
              className="ring-stand transition-all duration-1000 ease-out"
              strokeWidth="9"
              strokeDasharray="163"
              strokeDashoffset={163 - (163 * Math.min(waterGlasses / 8, 1))}
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <div className="absolute text-center">
            <Flame className="w-5 h-5 text-[#ff2d55] mx-auto mb-0.5" />
            <span className="text-xs font-extrabold text-white">{consumedCalories}</span>
            <span className="block text-[9px] text-[#86868b]">KCAL</span>
          </div>
        </div>
      </div>

      {/* 4 Apple Biometric Bento Grid Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Weight Tile */}
        <div
          onClick={() => setActiveView('progress')}
          className="apple-bento-card p-5 cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-[#86868b]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Weight</span>
            <Scale className="w-4 h-4 text-[#0071e3]" />
          </div>
          <div className="my-2">
            <p className="text-2xl font-black text-[#1d1d1f] tracking-tight">{currentWeight} lbs</p>
            <span className="text-xs font-semibold text-emerald-600">-{currentWeightLost.toFixed(1)} lbs lost</span>
          </div>
          <span className="text-[11px] text-[#86868b]">Tap for progress chart</span>
        </div>

        {/* Goal Progress Tile */}
        <div
          onClick={() => setActiveView('progress')}
          className="apple-bento-card p-5 cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-[#86868b]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Goal Progress</span>
            <Award className="w-4 h-4 text-[#ff2d55]" />
          </div>
          <div className="my-2">
            <p className="text-2xl font-black text-[#ff2d55] tracking-tight">{goalProgressPct}%</p>
            <span className="text-xs font-medium text-[#86868b]">Target: {goalWeight} lbs</span>
          </div>
          <span className="text-[11px] text-[#86868b]">On track this week</span>
        </div>

        {/* Protein Today Tile */}
        <div
          onClick={() => setActiveView('plans')}
          className="apple-bento-card p-5 cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-[#86868b]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Protein Today</span>
            <Utensils className="w-4 h-4 text-[#a3ff12]" />
          </div>
          <div className="my-2">
            <p className="text-2xl font-black text-[#1d1d1f] tracking-tight">{consumedProtein}g <span className="text-xs font-normal text-[#86868b]">/ {targetProtein}g</span></p>
            <span className="text-xs font-semibold text-[#0071e3]">{Math.round((consumedProtein / targetProtein) * 100)}% target met</span>
          </div>
          <span className="text-[11px] text-[#86868b]">Log upcoming meal</span>
        </div>

        {/* Water Log Tile */}
        <div className="apple-bento-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#86868b]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Hydration</span>
            <Droplets className="w-4 h-4 text-[#00f0ff]" />
          </div>
          <div className="flex items-center justify-between my-2">
            <div>
              <p className="text-2xl font-black text-[#1d1d1f] tracking-tight">{(waterGlasses * 0.25).toFixed(1)}L</p>
              <span className="text-xs text-[#86868b]">{waterGlasses} of 10 glasses</span>
            </div>
            <button
              onClick={handleAddWater}
              className="p-2 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full active:scale-90 transition-all cursor-pointer shadow-sm"
              title="Add 250ml"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="text-[11px] text-[#86868b]">+250ml per glass</span>
        </div>
      </div>

      {/* Two Column Layout for Active Protocols */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workout Plan Bento Card */}
        <div className="apple-bento-card p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-black/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#0071e3]/10 text-[#0071e3]">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1d1d1f]">{currentWorkout?.title || 'Active Workout Routine'}</h3>
                <p className="text-xs text-[#86868b]">{currentWorkout?.difficulty || 'Intermediate'} • {currentWorkout?.frequency || '4x per week'}</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              Active Plan
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#1d1d1f]">
              <span>{todayDay.dayName}</span>
              <span className="text-[#86868b] flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {todayDay.estimatedMinutes} min</span>
            </div>
            <p className="text-xs text-[#86868b] font-normal">{todayDay.focus}</p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleStartWorkout}
              className="w-full py-3 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full text-xs font-semibold flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Active Session</span>
            </button>
          </div>
        </div>

        {/* Coach Session & Messages Bento Card */}
        <div className="apple-bento-card p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-black/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1d1d1f]">{activeTrainer.fullName || 'Personal Coach'}</h3>
                <p className="text-xs text-[#86868b]">{activeTrainer.title || 'Certified Strength Specialist'}</p>
              </div>
            </div>
            <button
              onClick={() => setActiveView('chat')}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#0071e3] text-white flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat</span>
            </button>
          </div>

          <div className="bg-[#f5f5f7] p-4 rounded-2xl border border-black/5 space-y-2">
            <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">Next 1-on-1 Coaching</span>
            <p className="text-xs font-bold text-[#1d1d1f]">Form Check & Metric Review</p>
            <p className="text-xs text-[#86868b]">Tuesday, Aug 25 at 10:00 AM</p>
          </div>

          <button
            onClick={() => setShowBookSessionModal(true)}
            className="w-full py-3 bg-[#f5f5f7] hover:bg-black/5 text-[#1d1d1f] rounded-full text-xs font-semibold border border-black/5 active:scale-98 transition-all cursor-pointer"
          >
            Schedule 1-on-1 Session
          </button>
        </div>
      </div>

      {/* Book Session Modal */}
      {showBookSessionModal && (
        <Modal
          isOpen={showBookSessionModal}
          onClose={() => setShowBookSessionModal(false)}
          title="Schedule 1-on-1 Coaching Session"
        >
          <form onSubmit={handleBookSessionSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#1d1d1f] mb-1">Session Type</label>
              <select
                value={sessionForm.type}
                onChange={(e) => setSessionForm({ ...sessionForm, type: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#f5f5f7] border border-black/5 rounded-xl text-xs text-[#1d1d1f]"
              >
                <option value="1-on-1 In-Person Form Check">1-on-1 In-Person Form Check</option>
                <option value="Virtual Video Consultation">Virtual Video Consultation</option>
                <option value="Monthly Metric & Goal Review">Monthly Metric & Goal Review</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#1d1d1f] mb-1">Date</label>
                <input
                  type="date"
                  value={sessionForm.date}
                  onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f5f5f7] border border-black/5 rounded-xl text-xs text-[#1d1d1f]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1d1d1f] mb-1">Time</label>
                <input
                  type="text"
                  value={sessionForm.time}
                  onChange={(e) => setSessionForm({ ...sessionForm, time: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f5f5f7] border border-black/5 rounded-xl text-xs text-[#1d1d1f]"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowBookSessionModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#86868b] hover:text-[#1d1d1f]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#0071e3] text-white text-xs font-semibold rounded-full shadow-sm"
              >
                Confirm Request
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
