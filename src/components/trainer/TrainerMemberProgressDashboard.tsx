import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  User,
  Scale,
  Activity,
  Ruler,
  Calendar,
  PlusCircle,
  Dumbbell,
  Apple,
  MessageSquare,
  ChevronRight,
  FileText,
  Camera,
  Heart,
  CheckCircle2,
  Clock,
  Trash2,
  Printer,
  Award,
  Droplet,
  Flame,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { DangerConfirmModal } from '../common/DangerConfirmModal';
import { PrintDocumentModal } from '../common/PrintDocumentModal';
import { TrackerPlan } from '../../types';

export const TrainerMemberProgressDashboard: React.FC = () => {
  const {
    activeTrainer,
    customers,
    selectedMemberId,
    setSelectedMemberId,
    bodyMeasurements,
    bmiRecords,
    progressPhotos,
    trackerPlans,
    createTrackerPlan,
    updateTrackerPlan,
    recordMeasurement,
    recordBmi,
    addProgressPhoto,
    addTrainerNote,
    setActiveView,
    showToast,
  } = useApp();

  const trainerCustomers = customers.filter(
    (c) => c.assignedTrainerId === activeTrainer.id || c.tenantId === activeTrainer.tenantId
  );

  const currentMember =
    trainerCustomers.find((c) => c.id === selectedMemberId) ||
    trainerCustomers[0] ||
    customers[0];

  const memberMeasurements = bodyMeasurements.filter((m) => m.customerId === currentMember?.id);
  const memberBmiHistory = bmiRecords.filter((b) => b.customerId === currentMember?.id);
  const memberPhotos = progressPhotos.filter((p) => p.customerId === currentMember?.id);
  const memberTrackers = trackerPlans.filter((t) => t.customerId === currentMember?.id);

  // Modals state
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showCreateTrackerModal, setShowCreateTrackerModal] = useState(false);
  const [selectedTrackerToPrint, setSelectedTrackerToPrint] = useState<TrackerPlan | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Danger Confirm Modal state
  const [dangerModalState, setDangerModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Form states
  const [weightInput, setWeightInput] = useState(currentMember?.currentWeightLbs || 160);
  const [heightInput, setHeightInput] = useState(currentMember?.heightCm || 175);

  const [measForm, setMeasForm] = useState({
    waistInches: 29.0,
    hipsInches: 38.0,
    chestInches: 35.0,
    armsInches: 14.0,
    thighsInches: 22.5,
  });

  const [photoForm, setPhotoForm] = useState({
    photoUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&auto=format&fit=crop&q=80',
    tag: 'Front View' as 'Front View' | 'Side View' | 'Back View' | 'Milestone',
    notes: 'Core definition and shoulder symmetry improving.',
  });

  const [noteForm, setNoteForm] = useState({
    title: 'Weekly Biometric Review',
    note: 'Client is hitting 95% workout adherence. Increased training volume by 5% on compound lifts.',
  });

  // Tracker Plan Form
  const [trackerForm, setTrackerForm] = useState({
    title: 'Weekly Performance & Adherence Tracker',
    type: 'weekly' as 'weekly' | 'monthly',
    periodLabel: 'Week 4 Protocol (Aug 2026)',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2026-08-31',
    targetWorkoutsPerWeek: 5,
    completedWorkouts: 4,
    dailyWaterTargetLiters: 3.5,
    dailyStepsTarget: 10000,
    currentWeightLbs: currentMember?.currentWeightLbs || 165,
    goalWeightLbs: currentMember?.goalWeightLbs || 155,
    currentBodyFatPct: 15.5,
    bodyFatTargetPct: 13.0,
    adherenceRate: 92,
    trainerFeedback: 'Exceptional consistency. Caloric deficit is stable.',
  });

  if (!currentMember) {
    return (
      <div className="bg-white p-12 rounded-[10px] border border-slate-200 text-center max-w-5xl mx-auto">
        <p className="text-slate-500 text-xs">No clients found in your assigned roster.</p>
      </div>
    );
  }

  // Weight calculations
  const totalWeightToLose = currentMember.startWeightLbs - currentMember.goalWeightLbs;
  const currentWeightLost = currentMember.startWeightLbs - currentMember.currentWeightLbs;
  const goalProgressPct = Math.min(
    Math.max(Math.round((currentWeightLost / (totalWeightToLose || 1)) * 100), 0),
    100
  );

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    recordBmi(currentMember.id, Number(weightInput), Number(heightInput));
    setShowWeightModal(false);
    showToast('Biometrics Recorded', `Logged ${weightInput} lbs and recalculated BMI.`, 'success');
  };

  const handleSaveMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    recordMeasurement(currentMember.id, {
      ...measForm,
      recordedBy: `Coach ${activeTrainer.fullName}`,
    });
    setShowMeasurementModal(false);
    showToast('Measurements Saved', 'Circumference records updated in database.', 'success');
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    addProgressPhoto({
      customerId: currentMember.id,
      tenantId: currentMember.tenantId,
      date: new Date().toISOString().split('T')[0],
      weightLbs: currentMember.currentWeightLbs,
      photoUrl: photoForm.photoUrl,
      tag: photoForm.tag,
      notes: photoForm.notes,
    });
    setShowPhotoModal(false);
    showToast('Photo Saved', 'Added milestone photo to client record.', 'success');
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    addTrainerNote(currentMember.id, {
      authorTrainerId: activeTrainer.id,
      trainerName: activeTrainer.fullName,
      title: noteForm.title,
      note: noteForm.note,
      date: new Date().toISOString().split('T')[0],
    });
    setShowNoteModal(false);
    showToast('Clinical Note Added', 'Saved note to client dossier.', 'success');
  };

  const handleCreateTrackerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTrackerPlan({
      customerId: currentMember.id,
      trainerId: activeTrainer.id,
      tenantId: currentMember.tenantId,
      title: trackerForm.title,
      type: trackerForm.type,
      periodLabel: trackerForm.periodLabel,
      startDate: trackerForm.startDate,
      endDate: trackerForm.endDate,
      targetWorkoutsPerWeek: Number(trackerForm.targetWorkoutsPerWeek),
      completedWorkouts: Number(trackerForm.completedWorkouts),
      dailyWaterTargetLiters: Number(trackerForm.dailyWaterTargetLiters),
      dailyStepsTarget: Number(trackerForm.dailyStepsTarget),
      currentWeightLbs: Number(trackerForm.currentWeightLbs),
      goalWeightLbs: Number(trackerForm.goalWeightLbs),
      currentBodyFatPct: Number(trackerForm.currentBodyFatPct),
      bodyFatTargetPct: Number(trackerForm.bodyFatTargetPct),
      adherenceRate: Number(trackerForm.adherenceRate),
      trainerFeedback: trackerForm.trainerFeedback,
      circumferenceGoals: {
        waistInches: 28.5,
        chestInches: 38.0,
        armsInches: 13.5,
        hipsInches: 37.0,
      },
    });

    setShowCreateTrackerModal(false);
    showToast('Tracker Plan Created', `Created ${trackerForm.type} tracker for ${currentMember.fullName}.`, 'success');
  };

  const handleOpenTrackerPrint = (tracker: TrackerPlan) => {
    setSelectedTrackerToPrint(tracker);
    setIsPrintModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200 pb-16">
      {/* Top Header & Client Selector */}
      <div className="bg-white rounded-[10px] p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={currentMember.avatarUrl}
            alt={currentMember.fullName}
            className="w-12 h-12 rounded-[8px] object-cover border border-slate-200"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900">{currentMember.fullName}</h1>
              <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                {currentMember.status}
              </span>
              <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {currentMember.tier}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{currentMember.email} • Join Date: {currentMember.joinDate}</p>
          </div>
        </div>

        {/* Member Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-600">Switch Client:</label>
          <select
            value={currentMember.id}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-[10px] text-xs font-semibold text-slate-900"
          >
            {trainerCustomers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Biometric Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white p-4 rounded-[10px] border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold">Weight Progress</span>
            <Scale className="w-3.5 h-3.5 text-[#a73827]" />
          </div>
          <p className="text-lg font-black text-slate-900 font-mono">{currentMember.currentWeightLbs} lbs</p>
          <span className="text-[10px] text-emerald-700 font-bold block">-{currentWeightLost.toFixed(1)} lbs lost</span>
        </div>

        <div className="bg-white p-4 rounded-[10px] border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold">Current BMI</span>
            <Activity className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <p className="text-lg font-black text-slate-900 font-mono">{currentMember.currentBmi}</p>
          <span className="text-[10px] text-slate-500 block">{currentMember.bmiCategory}</span>
        </div>

        <div className="bg-white p-4 rounded-[10px] border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold">Goal Target</span>
            <Award className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <p className="text-lg font-black text-slate-900 font-mono">{currentMember.goalWeightLbs} lbs</p>
          <span className="text-[10px] text-slate-500 block">{goalProgressPct}% achieved</span>
        </div>

        <div className="bg-white p-4 rounded-[10px] border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold">Height Baseline</span>
            <Ruler className="w-3.5 h-3.5 text-slate-600" />
          </div>
          <p className="text-lg font-black text-slate-900 font-mono">{currentMember.heightCm} cm</p>
          <span className="text-[10px] text-slate-500 block">{(currentMember.heightCm / 30.48).toFixed(1)} ft</span>
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="flex items-center gap-2 flex-wrap bg-white p-3 rounded-[10px] border border-slate-200 shadow-2xs">
        <button
          onClick={() => setShowCreateTrackerModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#a73827] hover:bg-[#8f2f20] text-white rounded-[8px] text-xs font-bold shadow-2xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Tracker Plan</span>
        </button>
        <button
          onClick={() => setShowWeightModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-[8px] text-xs font-bold cursor-pointer"
        >
          <Scale className="w-3.5 h-3.5 text-[#a73827]" />
          <span>Log Weight & BMI</span>
        </button>
        <button
          onClick={() => setShowMeasurementModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-[8px] text-xs font-bold cursor-pointer"
        >
          <Ruler className="w-3.5 h-3.5 text-blue-600" />
          <span>Log Circumferences</span>
        </button>
        <button
          onClick={() => setShowNoteModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-[8px] text-xs font-bold cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-amber-600" />
          <span>Add Clinical Note</span>
        </button>
      </div>

      {/* Weekly & Monthly Tracker Plans Section */}
      <div className="bg-white rounded-[10px] border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Weekly & Monthly Client Tracker Plans</h3>
            <p className="text-[11px] text-slate-500">Prescribed compliance targets and periodic reviews.</p>
          </div>
          <span className="text-xs font-bold font-mono text-slate-500">{memberTrackers.length} Assigned</span>
        </div>

        <div className="space-y-3">
          {memberTrackers.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              No tracker plans created yet. Tap "New Tracker Plan" to configure a weekly/monthly target plan.
            </div>
          ) : (
            memberTrackers.map((tracker) => (
              <div
                key={tracker.id}
                className="p-4 bg-slate-50 rounded-[8px] border border-slate-200 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase ${
                      tracker.type === 'weekly' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {tracker.type}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{tracker.title}</h4>
                    <span className="text-[11px] text-slate-500 font-mono">({tracker.periodLabel})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-[4px] text-xs font-bold font-mono bg-emerald-100 text-emerald-800">
                      {tracker.adherenceRate}% Adherence
                    </span>
                    <button
                      onClick={() => handleOpenTrackerPrint(tracker)}
                      className="px-2.5 py-1 bg-white border border-slate-200 hover:border-[#a73827] text-slate-700 hover:text-[#a73827] rounded-[6px] text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase">Workouts</span>
                    <p className="font-bold text-slate-900 font-mono mt-0.5">{tracker.completedWorkouts} / {tracker.targetWorkoutsPerWeek}</p>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase">Water Target</span>
                    <p className="font-bold text-blue-700 font-mono mt-0.5">{tracker.dailyWaterTargetLiters} L / day</p>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase">Daily Steps</span>
                    <p className="font-bold text-slate-900 font-mono mt-0.5">{tracker.dailyStepsTarget.toLocaleString()}</p>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase">Body Fat %</span>
                    <p className="font-bold text-rose-700 font-mono mt-0.5">{tracker.currentBodyFatPct || 15}%</p>
                  </div>
                </div>

                {tracker.trainerFeedback && (
                  <p className="text-xs text-amber-900 bg-amber-50 p-2.5 rounded border border-amber-200">
                    <strong>Coach Note:</strong> {tracker.trainerFeedback}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Circumference Log Table */}
      <div className="bg-white rounded-[10px] border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Historical Body Measurements</h3>
            <p className="text-[11px] text-slate-500">Inches recorded by coach during periodic check-ins.</p>
          </div>
          <button
            onClick={() => setShowMeasurementModal(true)}
            className="px-3 py-1.5 bg-[#a73827] text-white rounded-[6px] text-xs font-bold cursor-pointer"
          >
            + Log Circumference
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-3">Waist</th>
                <th className="py-2.5 px-3">Chest</th>
                <th className="py-2.5 px-3">Arms</th>
                <th className="py-2.5 px-3">Hips</th>
                <th className="py-2.5 px-3">Thighs</th>
                <th className="py-2.5 px-4">Recorded By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {memberMeasurements.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{m.date}</td>
                  <td className="py-2.5 px-3 font-mono">{m.waistInches || '-'}"</td>
                  <td className="py-2.5 px-3 font-mono">{m.chestInches || '-'}"</td>
                  <td className="py-2.5 px-3 font-mono">{m.armsInches || '-'}"</td>
                  <td className="py-2.5 px-3 font-mono">{m.hipsInches || '-'}"</td>
                  <td className="py-2.5 px-3 font-mono">{m.thighsInches || '-'}"</td>
                  <td className="py-2.5 px-4 text-slate-500">{m.recordedBy || 'Coach'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Tracker Plan */}
      <Modal
        isOpen={showCreateTrackerModal}
        onClose={() => setShowCreateTrackerModal(false)}
        title="Create Weekly / Monthly Tracker Plan"
      >
        <form onSubmit={handleCreateTrackerSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tracker Title</label>
            <input
              type="text"
              required
              value={trackerForm.title}
              onChange={(e) => setTrackerForm({ ...trackerForm, title: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tracker Type</label>
              <select
                value={trackerForm.type}
                onChange={(e) => setTrackerForm({ ...trackerForm, type: e.target.value as any })}
                className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900"
              >
                <option value="weekly">Weekly Tracker</option>
                <option value="monthly">Monthly Tracker</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Period Label</label>
              <input
                type="text"
                required
                value={trackerForm.periodLabel}
                onChange={(e) => setTrackerForm({ ...trackerForm, periodLabel: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Workouts / Wk</label>
              <input
                type="number"
                value={trackerForm.targetWorkoutsPerWeek}
                onChange={(e) => setTrackerForm({ ...trackerForm, targetWorkoutsPerWeek: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Daily Water (L)</label>
              <input
                type="number"
                step="0.5"
                value={trackerForm.dailyWaterTargetLiters}
                onChange={(e) => setTrackerForm({ ...trackerForm, dailyWaterTargetLiters: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Daily Steps Target</label>
              <input
                type="number"
                value={trackerForm.dailyStepsTarget}
                onChange={(e) => setTrackerForm({ ...trackerForm, dailyStepsTarget: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Coach Evaluation & Targets</label>
            <textarea
              value={trackerForm.trainerFeedback}
              onChange={(e) => setTrackerForm({ ...trackerForm, trainerFeedback: e.target.value })}
              rows={2}
              className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowCreateTrackerModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-[10px] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-[#a73827] text-white rounded-[10px] shadow-2xs hover:bg-[#8f2f20] cursor-pointer"
            >
              Save Tracker Plan
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Log Weight */}
      <Modal
        isOpen={showWeightModal}
        onClose={() => setShowWeightModal(false)}
        title={`Log Weight for ${currentMember.fullName}`}
      >
        <form onSubmit={handleSaveWeight} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Weight (lbs)</label>
              <input
                type="number"
                step="0.1"
                required
                value={weightInput}
                onChange={(e) => setWeightInput(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Height (cm)</label>
              <input
                type="number"
                required
                value={heightInput}
                onChange={(e) => setHeightInput(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900 font-mono"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowWeightModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-[10px] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-[#a73827] text-white rounded-[10px] shadow-2xs hover:bg-[#8f2f20] cursor-pointer"
            >
              Save Weight
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Log Measurements */}
      <Modal
        isOpen={showMeasurementModal}
        onClose={() => setShowMeasurementModal(false)}
        title="Record Body Circumferences (Inches)"
      >
        <form onSubmit={handleSaveMeasurement} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Waist (Inches)</label>
              <input
                type="number"
                step="0.1"
                value={measForm.waistInches}
                onChange={(e) => setMeasForm({ ...measForm, waistInches: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Chest (Inches)</label>
              <input
                type="number"
                step="0.1"
                value={measForm.chestInches}
                onChange={(e) => setMeasForm({ ...measForm, chestInches: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Arms (Inches)</label>
              <input
                type="number"
                step="0.1"
                value={measForm.armsInches}
                onChange={(e) => setMeasForm({ ...measForm, armsInches: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hips (Inches)</label>
              <input
                type="number"
                step="0.1"
                value={measForm.hipsInches}
                onChange={(e) => setMeasForm({ ...measForm, hipsInches: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900 font-mono"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowMeasurementModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-[10px] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-[#a73827] text-white rounded-[10px] shadow-2xs hover:bg-[#8f2f20] cursor-pointer"
            >
              Save Measurements
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Note */}
      <Modal
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        title="Add Clinical Note"
      >
        <form onSubmit={handleSaveNote} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Note Title</label>
            <input
              type="text"
              required
              value={noteForm.title}
              onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Note Content</label>
            <textarea
              rows={3}
              required
              value={noteForm.note}
              onChange={(e) => setNoteForm({ ...noteForm, note: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowNoteModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-[10px] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-[#a73827] text-white rounded-[10px] shadow-2xs hover:bg-[#8f2f20] cursor-pointer"
            >
              Save Note
            </button>
          </div>
        </form>
      </Modal>

      {/* Danger Confirm Modal */}
      <DangerConfirmModal
        isOpen={dangerModalState.isOpen}
        onClose={() => setDangerModalState({ ...dangerModalState, isOpen: false })}
        onConfirm={dangerModalState.onConfirm}
        title={dangerModalState.title}
        message={dangerModalState.message}
        confirmText="Confirm Action"
      />

      {/* Print Document Modal */}
      {selectedTrackerToPrint && (
        <PrintDocumentModal
          isOpen={isPrintModalOpen}
          onClose={() => {
            setIsPrintModalOpen(false);
            setSelectedTrackerToPrint(null);
          }}
          documentType={selectedTrackerToPrint.type === 'weekly' ? 'weekly_tracker' : 'monthly_tracker'}
          data={{
            customer: currentMember,
            trainer: activeTrainer,
            tracker: {
              type: selectedTrackerToPrint.type,
              periodLabel: selectedTrackerToPrint.periodLabel,
              startDate: selectedTrackerToPrint.startDate,
              endDate: selectedTrackerToPrint.endDate,
              startWeightLbs: currentMember.startWeightLbs,
              currentWeightLbs: selectedTrackerToPrint.currentWeightLbs,
              goalWeightLbs: selectedTrackerToPrint.goalWeightLbs,
              targetWorkouts: selectedTrackerToPrint.targetWorkoutsPerWeek,
              completedWorkouts: selectedTrackerToPrint.completedWorkouts,
              dailyWaterLiters: selectedTrackerToPrint.dailyWaterTargetLiters,
              dailySteps: selectedTrackerToPrint.dailyStepsTarget,
              adherenceRate: selectedTrackerToPrint.adherenceRate,
              bodyFatPct: selectedTrackerToPrint.currentBodyFatPct,
              measurements: selectedTrackerToPrint.circumferenceGoals,
              trainerFeedback: selectedTrackerToPrint.trainerFeedback,
            },
          }}
        />
      )}
    </div>
  );
};
