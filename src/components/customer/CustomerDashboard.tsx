import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Dumbbell,
  Apple,
  TrendingUp,
  TrendingDown,
  Flame,
  CheckCircle2,
  Play,
  Calendar,
  MessageSquare,
  ChevronRight,
  Clock,
  Droplets,
  Plus,
  ShieldCheck,
  Scale,
  Award,
  Activity,
  UserCheck,
  HeartPulse,
  Utensils,
  ArrowRight,
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const CustomerDashboard: React.FC = () => {
  const {
    activeCustomer,
    activeTrainer,
    workoutPlans,
    dietPlans,
    chatMessages,
    bodyMeasurements,
    bmiRecords,
    recordBmi,
    setActiveView,
    showToast,
  } = useApp();

  const [waterGlasses, setWaterGlasses] = useState(6);
  const [showLogWeightModal, setShowLogWeightModal] = useState(false);
  const [newWeight, setNewWeight] = useState(activeCustomer.currentWeightLbs);
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
    dayName: 'Day 1: Upper Body Hypertrophy & Power',
    focus: 'Chest, Delts, Triceps & Upper Back',
    estimatedMinutes: 55,
    exercises: [],
  };

  const totalExercises = todayDay.exercises.length || 4;
  const completedExercises = todayDay.exercises.filter((e) => e.isCompleted).length;
  const workoutProgress = Math.round((completedExercises / (totalExercises || 1)) * 100);

  // Macro Calculations
  const targetCalories = currentDiet?.dailyCalories || activeCustomer.targetCalories || 2200;
  const targetProtein = currentDiet?.targetProteinG || activeCustomer.targetProteinG || 160;
  const targetCarbs = currentDiet?.targetCarbsG || activeCustomer.targetCarbsG || 210;
  const targetFats = currentDiet?.targetFatsG || activeCustomer.targetFatsG || 65;

  const consumedCalories = currentDiet?.meals
    ?.filter((m) => m.isCompleted)
    .reduce((sum, m) => sum + m.calories, 0) || 1280;
  const consumedProtein = currentDiet?.meals
    ?.filter((m) => m.isCompleted)
    .reduce((sum, m) => sum + m.proteinG, 0) || 95;

  // Weight Progress
  const totalWeightToLose = activeCustomer.startWeightLbs - activeCustomer.goalWeightLbs;
  const currentWeightLost = activeCustomer.startWeightLbs - activeCustomer.currentWeightLbs;
  const goalProgressPct = Math.min(
    Math.max(Math.round((currentWeightLost / (totalWeightToLose || 1)) * 100), 0),
    100
  );

  const handleStartWorkout = () => {
    setActiveView('active_workout');
  };

  const handleAddWater = () => {
    setWaterGlasses((prev) => Math.min(prev + 1, 12));
    showToast('Hydration Logged', `+250ml water added (Total: ${(waterGlasses + 1) * 250}ml)`, 'success');
  };

  const handleLogWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordBmi(activeCustomer.id, Number(newWeight), activeCustomer.heightCm);
    setShowLogWeightModal(false);
    showToast('Weight Recorded', `Logged today's weigh-in: ${newWeight} lbs`, 'success');
  };

  const handleBookSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowBookSessionModal(false);
    showToast('Session Requested', `Booked ${sessionForm.type} with ${activeTrainer.fullName} on ${sessionForm.date} at ${sessionForm.time}.`, 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200 pb-16">
      {/* Welcome Hero Card in Light Theme */}
      <div className="bg-white rounded-[10px] p-6 sm:p-7 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-[6px] text-[10px] font-bold bg-[#a73827]/10 text-[#a73827] border border-[#a73827]/20">
                {activeCustomer.tier} Coaching
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Coach: <span className="font-semibold text-slate-700">{activeTrainer.fullName}</span>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Welcome back, {activeCustomer.fullName.split(' ')[0]}
            </h1>
            <p className="text-xs text-slate-500">
              Prescribed training focus: <strong className="text-slate-800">{todayDay.focus || 'Full Body Resistance'}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleStartWorkout}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#a73827] hover:bg-[#8f2f20] text-white rounded-[10px] text-xs font-bold shadow-2xs active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{workoutProgress > 0 ? `Resume (${workoutProgress}%)` : 'Start Workout'}</span>
            </button>

            <button
              onClick={() => setActiveView('plans')}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-[10px] text-xs font-bold transition-colors cursor-pointer"
            >
              My Plans
            </button>
          </div>
        </div>

        {/* 4 Biometric & Status Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div
            onClick={() => setActiveView('progress')}
            className="p-3 bg-slate-50 rounded-[8px] border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] uppercase font-bold">Weight</span>
              <Scale className="w-3.5 h-3.5" />
            </div>
            <p className="text-base font-black text-slate-900 mt-1 font-mono">{activeCustomer.currentWeightLbs} lbs</p>
            <span className="text-[10px] text-emerald-700 font-semibold">-{currentWeightLost.toFixed(1)} lbs lost</span>
          </div>

          <div
            onClick={() => setActiveView('progress')}
            className="p-3 bg-slate-50 rounded-[8px] border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] uppercase font-bold">Goal Progress</span>
              <Award className="w-3.5 h-3.5" />
            </div>
            <p className="text-base font-black text-[#a73827] mt-1 font-mono">{goalProgressPct}%</p>
            <span className="text-[10px] text-slate-400">Target: {activeCustomer.goalWeightLbs} lbs</span>
          </div>

          <div
            onClick={() => setActiveView('plans')}
            className="p-3 bg-slate-50 rounded-[8px] border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] uppercase font-bold">Protein Today</span>
              <Utensils className="w-3.5 h-3.5" />
            </div>
            <p className="text-base font-black text-slate-900 mt-1 font-mono">{consumedProtein}g / {targetProtein}g</p>
            <span className="text-[10px] text-slate-400">{Math.round((consumedProtein / targetProtein) * 100)}% met</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-[8px] border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] uppercase font-bold">Hydration</span>
              <Droplets className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-base font-black text-blue-700 font-mono">{(waterGlasses * 0.25).toFixed(1)}L</p>
              <button
                onClick={handleAddWater}
                className="p-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-slate-700 cursor-pointer"
                title="Add 250ml"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <span className="text-[10px] text-slate-400">{waterGlasses} of 10 glasses</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout for Active Protocols */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workout Plan Card */}
        <div className="bg-white rounded-[10px] p-5 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-[#a73827]" />
              <h3 className="text-sm font-bold text-slate-900">Today's Resistance Plan</h3>
            </div>
            <span className="text-xs font-semibold text-slate-500 font-mono">
              {completedExercises}/{totalExercises} Complete
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-800">{todayDay.name}</p>
            <p className="text-[11px] text-slate-500">Coach prescribed progressive overload sequence.</p>

            <div className="divide-y divide-slate-100 pt-1">
              {todayDay.exercises.slice(0, 3).map((ex, idx) => (
                <div key={ex.id || idx} className="py-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-900">{ex.name}</span>
                    <span className="text-slate-400 text-[11px] block">{ex.category} • Rest: {ex.restTime}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-700">{ex.sets} × {ex.reps}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleStartWorkout}
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-[8px] text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Open Exercise Execution</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Nutrition Protocol Card */}
        <div className="bg-white rounded-[10px] p-5 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Apple className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Today's Nutrition Protocol</h3>
            </div>
            <span className="text-xs font-semibold text-slate-500 font-mono">
              {consumedCalories} / {targetCalories} kcal
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-800">{currentDiet?.title || 'Daily Meal Plan'}</p>
              {currentDiet?.dietType && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {currentDiet.dietType}
                </span>
              )}
            </div>

            <div className="divide-y divide-slate-100 pt-1">
              {currentDiet?.meals?.slice(0, 3).map((meal) => (
                <div key={meal.id} className="py-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-900">{meal.name}</span>
                    <span className="text-slate-400 text-[11px] block">{meal.timeStr} • {meal.mealType}</span>
                  </div>
                  <span className="font-mono text-slate-600">{meal.calories} kcal</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveView('plans')}
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-[8px] text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View Full Meal Protocol</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Log Weight Modal */}
      <Modal
        isOpen={showLogWeightModal}
        onClose={() => setShowLogWeightModal(false)}
        title="Log Today's Weight"
      >
        <form onSubmit={handleLogWeightSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Body Weight (lbs)</label>
            <input
              type="number"
              step="0.1"
              value={newWeight}
              onChange={(e) => setNewWeight(Number(e.target.value))}
              required
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-[10px] text-xs font-mono text-slate-900"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowLogWeightModal(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-[10px] text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#a73827] text-white rounded-[10px] text-xs font-bold shadow-2xs cursor-pointer"
            >
              Save Weigh-in
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
