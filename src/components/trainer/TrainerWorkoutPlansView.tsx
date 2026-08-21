import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkoutPlan, WorkoutDay, WorkoutExercise } from '../../types';
import {
  Dumbbell,
  PlusCircle,
  Copy,
  UserCheck,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  CheckCircle2,
  Printer,
  Archive,
  Layers,
  ArrowRight,
  ShieldCheck,
  Plus,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { DangerConfirmModal } from '../common/DangerConfirmModal';
import { PrintDocumentModal } from '../common/PrintDocumentModal';

export const TrainerWorkoutPlansView: React.FC = () => {
  const {
    activeTrainer,
    customers,
    workoutPlans,
    selectedMemberId,
    setSelectedMemberId,
    createWorkoutPlan,
    updateWorkoutPlan,
    duplicateWorkoutPlan,
    toggleWorkoutPlanStatus,
    assignWorkoutPlan,
    deleteWorkoutPlan,
    addExerciseToDay,
    showToast,
  } = useApp();

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [targetDayId, setTargetDayId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'templates'>('all');
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({ 'day-1': true });
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Danger Confirm Modal state
  const [dangerModalState, setDangerModalState] = useState<{
    isOpen: boolean;
    planId: string | null;
    planTitle: string;
  }>({
    isOpen: false,
    planId: null,
    planTitle: '',
  });

  // Form state for new plan
  const [planForm, setPlanForm] = useState({
    title: 'Hypertrophy & Functional Power Routine',
    description: 'Periodized progressive overload program focusing on upper push/pull and lower power mechanics.',
    level: 'Intermediate' as 'Beginner' | 'Intermediate' | 'Advanced',
    daysPerWeek: 4,
    durationWeeks: 8,
    trainerNotes: 'Maintain 2-3 RIR on compound movements. Hydrate well.',
    customerId: selectedMemberId || 'cust-alex',
  });

  // Form state for adding exercise
  const [exerciseForm, setExerciseForm] = useState({
    name: 'Barbell Roman Deadlift',
    category: 'Posterior Chain',
    sets: 4,
    reps: '8-10',
    targetWeight: '185 lbs',
    restTime: '90s',
    instructions: 'Hinge deeply at hips, keep bar glued to shins, squeeze glutes at lockout.',
  });

  const trainerCustomers = customers.filter(
    (c) => c.assignedTrainerId === activeTrainer.id || c.tenantId === activeTrainer.tenantId
  );

  // Available plans
  const trainerPlans = workoutPlans.filter(
    (p) => p.trainerId === activeTrainer.id || p.tenantId === activeTrainer.tenantId
  );

  // Filtered plans
  const displayedPlans = trainerPlans.filter((p) => {
    if (activeTab === 'active') return p.status === 'active';
    if (activeTab === 'templates') return !p.customerId;
    return true;
  });

  // Current active plan
  const activePlan =
    trainerPlans.find((p) => p.id === selectedPlanId) ||
    trainerPlans.find((p) => p.customerId === selectedMemberId) ||
    trainerPlans[0];

  const assignedCustomer = customers.find((c) => c.id === activePlan?.customerId);

  const toggleDayAccordion = (dayId: string) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayId]: !prev[dayId],
    }));
  };

  const handleCreatePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planForm.title.trim()) {
      showToast('Validation Error', 'Please specify a routine title.', 'error');
      return;
    }

    createWorkoutPlan({
      title: planForm.title.trim(),
      description: planForm.description.trim(),
      level: planForm.level,
      daysPerWeek: Number(planForm.daysPerWeek),
      durationWeeks: Number(planForm.durationWeeks),
      trainerNotes: planForm.trainerNotes.trim(),
      customerId: planForm.customerId,
      trainerId: activeTrainer.id,
      tenantId: activeTrainer.tenantId,
      status: 'active',
      days: [
        {
          id: `day-${Date.now()}-1`,
          dayNumber: 1,
          dayName: 'Day 1: Upper Body Push / Pull',
          focus: 'Chest, Back & Shoulders',
          estimatedMinutes: 50,
          exercises: [],
        },
        {
          id: `day-${Date.now()}-2`,
          dayNumber: 2,
          dayName: 'Day 2: Lower Body Strength & Core',
          focus: 'Quads, Hamstrings & Core',
          estimatedMinutes: 55,
          exercises: [],
        },
      ],
    });

    setShowCreateModal(false);
    showToast('Routine Created', 'Workout plan assigned to client.', 'success');
  };

  const handleAddExerciseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePlan || !targetDayId) return;

    addExerciseToDay(activePlan.id, targetDayId, {
      name: exerciseForm.name.trim(),
      category: exerciseForm.category.trim(),
      sets: Number(exerciseForm.sets),
      reps: exerciseForm.reps.trim(),
      targetWeight: exerciseForm.targetWeight.trim(),
      restTime: exerciseForm.restTime.trim(),
      instructions: exerciseForm.instructions.trim(),
      isCompleted: false,
    });

    setShowAddExerciseModal(false);
    showToast('Exercise Prescribed', `Added ${exerciseForm.name} to Day.`, 'success');
  };

  const confirmDeletePlan = () => {
    if (!dangerModalState.planId) return;
    deleteWorkoutPlan(dangerModalState.planId);
    setDangerModalState({ isOpen: false, planId: null, planTitle: '' });
    setSelectedPlanId(null);
    showToast('Routine Deleted', 'Workout program deleted from client schedule.', 'warning');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-[10px] border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Workout Splits Hub</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-[6px] bg-slate-100 text-slate-700 border border-slate-200">
              {displayedPlans.length} Active Splits
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Build and assign periodized resistance splits, exercise tempos, target loads, and recovery protocols.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activePlan && (
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-[10px] text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>
          )}

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#a73827] hover:bg-[#8f2f20] text-white rounded-[10px] text-xs font-bold shadow-2xs cursor-pointer transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Routine Split</span>
          </button>
        </div>
      </div>

      {/* Routine Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto bg-white p-3 rounded-[10px] border border-slate-200 shadow-2xs">
        {trainerPlans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setSelectedPlanId(plan.id)}
            className={`px-3 py-1.5 rounded-[8px] text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activePlan?.id === plan.id
                ? 'bg-[#a73827] text-white shadow-2xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <span>{plan.title}</span>
            <span className="text-[10px] opacity-75 font-mono">({plan.daysPerWeek}d/wk)</span>
          </button>
        ))}
      </div>

      {/* Active Plan Detail */}
      {activePlan ? (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-[10px] p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-900">{activePlan.title}</h2>
                  <span className="px-2 py-0.5 rounded-[6px] text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {activePlan.level}
                  </span>
                  <span className="px-2 py-0.5 rounded-[6px] text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                    {activePlan.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Assigned to: <strong className="text-slate-800">{assignedCustomer?.fullName || 'Template (Unassigned)'}</strong> • {activePlan.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => duplicateWorkoutPlan(activePlan.id)}
                  className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-[8px] border border-slate-200 cursor-pointer"
                  title="Duplicate Split"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDangerModalState({ isOpen: true, planId: activePlan.id, planTitle: activePlan.title })}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-[8px] border border-rose-200 cursor-pointer"
                  title="Delete Routine"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-[8px] border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Frequency</span>
                <p className="text-base font-black text-slate-900 mt-0.5 font-mono">{activePlan.daysPerWeek} Days / Week</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-[8px] border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Program Block</span>
                <p className="text-base font-black text-slate-900 mt-0.5 font-mono">{activePlan.durationWeeks} Weeks</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-[8px] border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Days</span>
                <p className="text-base font-black text-slate-900 mt-0.5 font-mono">{activePlan.days.length} Routines</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-[8px] border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Coach Assigned</span>
                <p className="text-base font-black text-slate-900 mt-0.5">{activeTrainer.fullName}</p>
              </div>
            </div>

            {activePlan.trainerNotes && (
              <div className="p-3.5 bg-amber-50 rounded-[8px] border border-amber-200 text-xs">
                <p className="font-bold text-amber-900">Coach Program Directive:</p>
                <p className="text-amber-800 mt-1 leading-relaxed">{activePlan.trainerNotes}</p>
              </div>
            )}
          </div>

          {/* Days Accordion */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Prescribed Training Days & Exercises</h3>
              <span className="text-xs text-slate-500 font-mono">{activePlan.days.length} Workouts Scheduled</span>
            </div>

            <div className="space-y-3">
              {activePlan.days.map((day) => {
                const isExpanded = expandedDays[day.id] !== false;
                return (
                  <div key={day.id} className="bg-white rounded-[10px] border border-slate-200 shadow-2xs overflow-hidden">
                    <div
                      onClick={() => toggleDayAccordion(day.id)}
                      className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-[6px] bg-[#a73827] text-white text-xs font-black flex items-center justify-center font-mono">
                          D{day.dayNumber}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{day.dayName}</h4>
                          <p className="text-[11px] text-slate-500">{day.focus} • {day.estimatedMinutes} mins</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setTargetDayId(day.id);
                            setShowAddExerciseModal(true);
                          }}
                          className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-[6px] text-xs font-bold cursor-pointer"
                        >
                          + Add Exercise
                        </button>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-4 space-y-2">
                        {day.exercises.length === 0 ? (
                          <p className="text-xs text-slate-400 italic py-2 text-center">No exercises added yet. Tap "+ Add Exercise".</p>
                        ) : (
                          <div className="divide-y divide-slate-100">
                            {day.exercises.map((ex, idx) => (
                              <div key={ex.id || idx} className="py-2.5 flex items-center justify-between text-xs">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-900">{ex.name}</span>
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">{ex.category}</span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 mt-0.5">{ex.instructions || 'Target RPE: 8'}</p>
                                </div>

                                <div className="text-right">
                                  <span className="font-mono font-bold text-slate-900">{ex.sets} Sets × {ex.reps}</span>
                                  <span className="text-[11px] text-slate-400 block font-mono">Rest: {ex.restTime}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-[10px] border border-slate-200 text-slate-500 text-xs">
          No workout plans available. Tap "New Routine Split" to create one.
        </div>
      )}

      {/* Modal: Create Routine */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Resistance Routine"
      >
        <form onSubmit={handleCreatePlanSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Routine Title</label>
            <input
              type="text"
              required
              value={planForm.title}
              onChange={(e) => setPlanForm({ ...planForm, title: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Client Assignee</label>
              <select
                value={planForm.customerId}
                onChange={(e) => setPlanForm({ ...planForm, customerId: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900"
              >
                {trainerCustomers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.fullName} ({c.tier})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Experience Level</label>
              <select
                value={planForm.level}
                onChange={(e) => setPlanForm({ ...planForm, level: e.target.value as any })}
                className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900"
              >
                <option value="Beginner">Beginner (Foundational)</option>
                <option value="Intermediate">Intermediate (Hypertrophy)</option>
                <option value="Advanced">Advanced (Periodized Peak)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Frequency (Days / Wk)</label>
              <input
                type="number"
                value={planForm.daysPerWeek}
                onChange={(e) => setPlanForm({ ...planForm, daysPerWeek: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Weeks)</label>
              <input
                type="number"
                value={planForm.durationWeeks}
                onChange={(e) => setPlanForm({ ...planForm, durationWeeks: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Coach Notes & Cues</label>
            <textarea
              value={planForm.trainerNotes}
              onChange={(e) => setPlanForm({ ...planForm, trainerNotes: e.target.value })}
              rows={2}
              className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-[10px] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-[#a73827] text-white rounded-[10px] shadow-2xs hover:bg-[#8f2f20] cursor-pointer"
            >
              Build Routine
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Exercise */}
      <Modal
        isOpen={showAddExerciseModal}
        onClose={() => setShowAddExerciseModal(false)}
        title="Prescribe Exercise Movement"
      >
        <form onSubmit={handleAddExerciseSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Exercise Name</label>
            <input
              type="text"
              required
              value={exerciseForm.name}
              onChange={(e) => setExerciseForm({ ...exerciseForm, name: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Muscle Group</label>
              <input
                type="text"
                value={exerciseForm.category}
                onChange={(e) => setExerciseForm({ ...exerciseForm, category: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Rest Interval</label>
              <input
                type="text"
                value={exerciseForm.restTime}
                onChange={(e) => setExerciseForm({ ...exerciseForm, restTime: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Sets</label>
              <input
                type="number"
                value={exerciseForm.sets}
                onChange={(e) => setExerciseForm({ ...exerciseForm, sets: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Reps</label>
              <input
                type="text"
                value={exerciseForm.reps}
                onChange={(e) => setExerciseForm({ ...exerciseForm, reps: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Execution Cues</label>
            <textarea
              value={exerciseForm.instructions}
              onChange={(e) => setExerciseForm({ ...exerciseForm, instructions: e.target.value })}
              rows={2}
              className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddExerciseModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-[10px] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-[#a73827] text-white rounded-[10px] shadow-2xs hover:bg-[#8f2f20] cursor-pointer"
            >
              Add Movement
            </button>
          </div>
        </form>
      </Modal>

      {/* Danger Confirm Modal */}
      <DangerConfirmModal
        isOpen={dangerModalState.isOpen}
        onClose={() => setDangerModalState({ isOpen: false, planId: null, planTitle: '' })}
        onConfirm={confirmDeletePlan}
        title={`Delete Workout Routine: ${dangerModalState.planTitle}?`}
        message={`Are you sure you want to remove this resistance routine? Assigned clients will no longer have access to these training sessions.`}
        confirmText="Delete Routine"
      />

      {/* Print Document Modal */}
      {activePlan && (
        <PrintDocumentModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          documentType="workout_plan"
          data={{
            workoutPlan: activePlan,
            customer: assignedCustomer,
            trainer: activeTrainer,
          }}
        />
      )}
    </div>
  );
};
