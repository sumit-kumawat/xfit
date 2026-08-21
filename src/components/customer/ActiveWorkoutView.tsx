import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Circle,
  Clock,
  Dumbbell,
  Play,
  Pause,
  RotateCcw,
  ArrowLeft,
  Flame,
  Award,
  ChevronDown,
  ChevronUp,
  Info,
  Timer,
  TrendingUp,
  Check,
  Calendar,
  ShieldCheck,
} from 'lucide-react';
import { Modal } from '../common/Modal';

interface SetLog {
  setNumber: number;
  weight: string;
  reps: string;
  isCompleted: boolean;
}

export const ActiveWorkoutView: React.FC = () => {
  const {
    workoutPlans,
    activeCustomer,
    activeTrainer,
    toggleExerciseComplete,
    setActiveView,
    showToast,
    addSystemLog,
  } = useApp();

  const activePlan =
    workoutPlans.find((w) => w.customerId === activeCustomer.id) ||
    workoutPlans.find((w) => w.status === 'active') ||
    workoutPlans[0];

  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const activeDay = activePlan?.days[selectedDayIdx] || activePlan?.days[0];

  // Workout Session Duration Stopwatch
  const [workoutSeconds, setWorkoutSeconds] = useState(745); // 12m 25s
  const [isWorkoutActive, setIsWorkoutActive] = useState(true);

  // Rest Timer State
  const [restSecondsLeft, setRestSecondsLeft] = useState<number | null>(null);
  const [restTotalSeconds, setRestTotalSeconds] = useState<number>(90);
  const [isRestTimerRunning, setIsRestTimerRunning] = useState(false);

  // Per-exercise detailed set tracking state
  const [exerciseSetLogs, setExerciseSetLogs] = useState<Record<string, SetLog[]>>({});
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);
  const [showFinishModal, setShowFinishModal] = useState(false);

  // Initialize set logs
  useEffect(() => {
    if (!activeDay) return;
    const initialLogs: Record<string, SetLog[]> = {};
    activeDay.exercises.forEach((ex) => {
      const setsCount = ex.sets || 3;
      initialLogs[ex.id] = Array.from({ length: setsCount }, (_, i) => ({
        setNumber: i + 1,
        weight: ex.targetWeight || '135 lbs',
        reps: ex.reps || '10',
        isCompleted: ex.isCompleted || false,
      }));
    });
    setExerciseSetLogs(initialLogs);
    if (activeDay.exercises[0]) {
      setExpandedExerciseId(activeDay.exercises[0].id);
    }
  }, [activeDay?.id]);

  // Workout stopwatch tick
  useEffect(() => {
    let interval: any = null;
    if (isWorkoutActive) {
      interval = setInterval(() => {
        setWorkoutSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive]);

  // Rest Timer tick
  useEffect(() => {
    let interval: any = null;
    if (isRestTimerRunning && restSecondsLeft !== null && restSecondsLeft > 0) {
      interval = setInterval(() => {
        setRestSecondsLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (restSecondsLeft === 0 && isRestTimerRunning) {
      setIsRestTimerRunning(false);
      showToast('Rest Complete', 'Time for your next prescribed set!', 'info');
    }
    return () => clearInterval(interval);
  }, [isRestTimerRunning, restSecondsLeft]);

  const startRestTimer = (seconds: number) => {
    setRestTotalSeconds(seconds);
    setRestSecondsLeft(seconds);
    setIsRestTimerRunning(true);
  };

  const cancelRestTimer = () => {
    setIsRestTimerRunning(false);
    setRestSecondsLeft(null);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleSet = (exerciseId: string, setIndex: number) => {
    setExerciseSetLogs((prev) => {
      const currentSets = prev[exerciseId] ? [...prev[exerciseId]] : [];
      if (!currentSets[setIndex]) return prev;

      currentSets[setIndex] = {
        ...currentSets[setIndex],
        isCompleted: !currentSets[setIndex].isCompleted,
      };

      const allCompleted = currentSets.every((s) => s.isCompleted);
      if (allCompleted && activePlan && activeDay) {
        toggleExerciseComplete(activePlan.id, activeDay.id, exerciseId);
        startRestTimer(90);
      }

      return {
        ...prev,
        [exerciseId]: currentSets,
      };
    });
  };

  const handleFinishWorkout = () => {
    setIsWorkoutActive(false);
    setShowFinishModal(true);
  };

  const totalExercises = activeDay?.exercises.length || 0;
  const completedExercises = activeDay?.exercises.filter((e) => e.isCompleted).length || 0;
  const progressPercent = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200 pb-20">
      {/* Top Banner with Navigation & Live Stopwatch */}
      <div className="bg-white rounded-[10px] p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('plans')}
              className="p-2 hover:bg-slate-100 rounded-[8px] text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              title="Back to Plans"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-[6px] text-[10px] font-bold bg-[#a73827] text-white">
                  LIVE WORKOUT
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Prescribed by Coach {activeTrainer.fullName}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                {activeDay?.name || 'Full Body Resistance Session'}
              </h1>
            </div>
          </div>

          {/* Live Workout Duration Counter */}
          <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-[10px] border border-slate-200">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#a73827]" />
              <span className="font-mono text-base font-black text-slate-900">
                {formatTime(workoutSeconds)}
              </span>
            </div>

            <button
              onClick={() => setIsWorkoutActive(!isWorkoutActive)}
              className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-[8px] text-slate-700 transition-colors cursor-pointer"
              title={isWorkoutActive ? 'Pause session' : 'Resume session'}
            >
              {isWorkoutActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Day Selector Tabs if plan has multiple days */}
        {activePlan && activePlan.days.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100">
            {activePlan.days.map((day, idx) => (
              <button
                key={day.id}
                onClick={() => setSelectedDayIdx(idx)}
                className={`px-3 py-1.5 rounded-[8px] text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedDayIdx === idx
                    ? 'bg-[#a73827] text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Day {day.dayNumber}: {day.name}
              </button>
            ))}
          </div>
        )}

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Overall Session Completion</span>
            <span className="font-mono font-bold text-slate-900">{completedExercises}/{totalExercises} Exercises ({progressPercent}%)</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Rest Timer Floating Widget if active */}
      {isRestTimerRunning && restSecondsLeft !== null && (
        <div className="bg-amber-50 border border-amber-200 rounded-[10px] p-4 flex items-center justify-between shadow-2xs animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[8px] bg-amber-500 text-white flex items-center justify-center font-black">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900">Rest Timer Running</p>
              <p className="font-mono text-base font-black text-amber-950">
                {formatTime(restSecondsLeft)} remaining
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRestSecondsLeft((prev) => (prev ? prev + 30 : 30))}
              className="px-2.5 py-1 bg-white border border-amber-200 hover:bg-amber-100/60 rounded-[6px] text-xs font-bold text-amber-900 cursor-pointer"
            >
              +30s
            </button>
            <button
              onClick={cancelRestTimer}
              className="px-3 py-1 bg-amber-200/80 hover:bg-amber-300 text-amber-900 rounded-[6px] text-xs font-bold cursor-pointer"
            >
              Skip Rest
            </button>
          </div>
        </div>
      )}

      {/* Exercise List Cards */}
      <div className="space-y-4">
        {activeDay?.exercises.map((ex, exIdx) => {
          const isExpanded = expandedExerciseId === ex.id;
          const sets = exerciseSetLogs[ex.id] || [];
          const setsDone = sets.filter((s) => s.isCompleted).length;

          return (
            <div
              key={ex.id || exIdx}
              className={`bg-white rounded-[10px] border transition-all overflow-hidden ${
                ex.isCompleted
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : isExpanded
                  ? 'border-slate-300 shadow-xs'
                  : 'border-slate-200 shadow-2xs'
              }`}
            >
              {/* Exercise Header Row */}
              <div
                onClick={() => setExpandedExerciseId(isExpanded ? null : ex.id)}
                className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/70 select-none"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-[8px] font-black text-xs flex items-center justify-center shrink-0 border ${
                      ex.isCompleted
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    {exIdx + 1}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-[4px] bg-slate-100 text-slate-700 border border-slate-200">
                        {ex.category}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Rest: {ex.restTime}</span>
                    </div>

                    <h3 className="text-sm sm:text-base font-black text-slate-900 mt-1 truncate">{ex.name}</h3>

                    <p className="text-xs text-slate-500 mt-0.5">
                      Target: <strong className="text-slate-800">{ex.sets} Sets × {ex.reps}</strong> @{' '}
                      <strong className="text-[#a73827]">{ex.targetWeight}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (activePlan) {
                        toggleExerciseComplete(activePlan.id, activeDay.id, ex.id);
                        if (!ex.isCompleted) {
                          startRestTimer(90);
                        }
                      }
                    }}
                    className="p-1 rounded-[8px] hover:bg-slate-100 transition-colors cursor-pointer"
                    title={ex.isCompleted ? 'Mark incomplete' : 'Mark entire exercise complete'}
                  >
                    {ex.isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 hover:text-slate-500" />
                    )}
                  </button>

                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Expanded Set Logger & Form Instructions */}
              {isExpanded && (
                <div className="p-4 sm:p-5 space-y-4 border-t border-slate-100 bg-white">
                  {/* Photo / Demonstration if available */}
                  {ex.imageUrl && (
                    <div className="rounded-[8px] overflow-hidden border border-slate-200 max-h-48">
                      <img src={ex.imageUrl} alt={ex.name} className="w-full h-48 object-cover" />
                    </div>
                  )}

                  {/* Form Instructions & Coach Cues */}
                  {ex.instructions && (
                    <div className="p-3 bg-slate-50 rounded-[8px] border border-slate-200 text-xs space-y-1">
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 text-[#a73827]" /> Technique & Form Protocol:
                      </span>
                      <p className="text-slate-600 leading-relaxed">{ex.instructions}</p>
                    </div>
                  )}

                  {/* Set-by-Set Interactive Logger */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                      <span>SET LOG ({setsDone}/{sets.length} COMPLETE)</span>
                      <span>TARGET: {ex.targetWeight}</span>
                    </div>

                    <div className="space-y-2">
                      {sets.map((set, sIdx) => (
                        <div
                          key={sIdx}
                          onClick={() => handleToggleSet(ex.id, sIdx)}
                          className={`p-3 rounded-[8px] border flex items-center justify-between transition-all cursor-pointer ${
                            set.isCompleted
                              ? 'bg-emerald-50/70 border-emerald-300'
                              : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-[6px] bg-white border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                              {set.setNumber}
                            </span>
                            <span className="text-xs font-bold text-slate-900">
                              {set.weight}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-xs font-medium text-slate-600">
                              {set.reps} Reps
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-medium text-slate-500">
                              {set.isCompleted ? 'Done' : 'Tap to log'}
                            </span>
                            <div
                              className={`w-5 h-5 rounded-[6px] flex items-center justify-center transition-colors ${
                                set.isCompleted
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-white border border-slate-300 text-transparent'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rest Button Quick Trigger */}
                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                    <span className="text-xs text-slate-500 font-medium">Trigger Rest Period:</span>
                    <div className="flex items-center gap-1.5">
                      {[30, 60, 90, 120].map((sec) => (
                        <button
                          key={sec}
                          onClick={() => startRestTimer(sec)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-[6px] transition-colors cursor-pointer"
                        >
                          {sec}s
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Finish Bar */}
      <div className="pt-4 flex items-center justify-between gap-3">
        <button
          onClick={() => setActiveView('plans')}
          className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-[10px] transition-colors cursor-pointer"
        >
          Return to Plans
        </button>

        <button
          onClick={handleFinishWorkout}
          className="flex-1 py-2.5 bg-[#a73827] hover:bg-[#8f2f20] text-white text-xs font-bold rounded-[10px] shadow-2xs transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
        >
          <Award className="w-4 h-4" />
          <span>Complete & Save Workout Log</span>
        </button>
      </div>

      {/* Completion Modal */}
      <Modal
        isOpen={showFinishModal}
        onClose={() => {
          setShowFinishModal(false);
          setActiveView('progress');
        }}
        title="Workout Logged Successfully"
      >
        <div className="space-y-5 text-center py-2">
          <div className="w-14 h-14 rounded-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900">Great Effort, {activeCustomer.fullName}!</h3>
            <p className="text-xs text-slate-500">
              Completed <span className="font-bold text-slate-800">{activeDay?.name}</span> in{' '}
              <span className="font-mono font-bold text-slate-800">{formatTime(workoutSeconds)}</span>.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs pt-2">
            <div className="p-3 bg-slate-50 rounded-[10px] border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Volume Logged</span>
              <p className="text-base font-black text-slate-900 mt-0.5">8,420 lbs</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-[10px] border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Exercises Done</span>
              <p className="text-base font-black text-emerald-700 mt-0.5">{completedExercises} / {totalExercises}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-[10px] border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Calories Est</span>
              <p className="text-base font-black text-slate-900 mt-0.5">~380 kcal</p>
            </div>
          </div>

          <button
            onClick={() => {
              setShowFinishModal(false);
              setActiveView('progress');
            }}
            className="w-full py-2.5 bg-[#a73827] hover:bg-[#8f2f20] text-white rounded-[10px] text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            View Progress & Analytics
          </button>
        </div>
      </Modal>
    </div>
  );
};
