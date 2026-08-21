import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingDown,
  TrendingUp,
  Ruler,
  Weight,
  Activity,
  Calendar,
  FileText,
  Plus,
  Award,
  CheckCircle2,
  Camera,
  Flame,
  Target,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Printer,
  FileSpreadsheet,
  Clock,
  Sparkles,
  Droplet,
  Footprints,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { PrintDocumentModal } from '../common/PrintDocumentModal';
import { TrackerPlan } from '../../types';

export const CustomerProgressView: React.FC = () => {
  const {
    activeCustomer,
    activeTrainer,
    bodyMeasurements,
    bmiRecords,
    progressPhotos,
    trackerPlans,
    recordMeasurement,
    recordBmi,
    addProgressPhoto,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'trackers' | 'biometrics' | 'photos'>('trackers');
  const [showLogWeightModal, setShowLogWeightModal] = useState(false);
  const [showLogMeasurementModal, setShowLogMeasurementModal] = useState(false);
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [selectedTrackerToPrint, setSelectedTrackerToPrint] = useState<TrackerPlan | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const [newWeight, setNewWeight] = useState(activeCustomer.currentWeightLbs);
  const [measurementForm, setMeasurementForm] = useState({
    date: new Date().toISOString().split('T')[0],
    waistInches: 28.5,
    hipsInches: 37.0,
    chestInches: 38.0,
    armsInches: 12.5,
    thighsInches: 21.0,
  });

  const [photoForm, setPhotoForm] = useState({
    photoUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    tag: 'Front View' as const,
    weightLbs: activeCustomer.currentWeightLbs,
    notes: 'Weekly progress check-in photo. Core definition improving.',
  });

  const customerMeasurements = bodyMeasurements.filter((m) => m.customerId === activeCustomer.id);
  const customerBmiList = bmiRecords.filter((b) => b.customerId === activeCustomer.id);
  const customerPhotos = progressPhotos.filter((p) => p.customerId === activeCustomer.id);
  const customerTrackers = trackerPlans.filter(
    (t) => t.customerId === activeCustomer.id || t.trainerId === activeTrainer.id
  );

  // Weight goal math
  const totalWeightToLose = activeCustomer.startWeightLbs - activeCustomer.goalWeightLbs;
  const currentWeightLost = activeCustomer.startWeightLbs - activeCustomer.currentWeightLbs;
  const goalProgressPct = Math.min(
    Math.max(Math.round((currentWeightLost / (totalWeightToLose || 1)) * 100), 0),
    100
  );

  const handleLogWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordBmi(activeCustomer.id, Number(newWeight), activeCustomer.heightCm);
    setShowLogWeightModal(false);
    showToast('Weight Logged', `Recorded ${newWeight} lbs to biometric log history.`, 'success');
  };

  const handleLogMeasurementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordMeasurement(activeCustomer.id, {
      ...measurementForm,
      recordedBy: 'Client Self-Log',
    });
    setShowLogMeasurementModal(false);
    showToast('Measurements Saved', 'Updated waist and circumference logs.', 'success');
  };

  const handleAddPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProgressPhoto({
      customerId: activeCustomer.id,
      tenantId: activeCustomer.tenantId,
      date: new Date().toISOString().split('T')[0],
      weightLbs: Number(photoForm.weightLbs),
      photoUrl: photoForm.photoUrl,
      tag: photoForm.tag,
      notes: photoForm.notes,
    });
    setShowAddPhotoModal(false);
    showToast('Progress Photo Added', 'Added new milestone photo to gallery.', 'success');
  };

  const handleOpenTrackerPrint = (tracker: TrackerPlan) => {
    setSelectedTrackerToPrint(tracker);
    setIsPrintModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200 pb-16">
      {/* Top Banner */}
      <div className="bg-white rounded-[10px] p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Progress & Milestone Analytics
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-[6px] bg-slate-100 text-slate-700 border border-slate-200">
              Coach {activeTrainer.fullName} Audited
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Weekly and monthly adherence tracking, body composition metrics, and milestone reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLogWeightModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-[10px] text-xs font-bold transition-colors cursor-pointer"
          >
            <Weight className="w-4 h-4" />
            <span>Log Weight</span>
          </button>
          <button
            onClick={() => setShowLogMeasurementModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#a73827] hover:bg-[#8f2f20] text-white rounded-[10px] text-xs font-bold shadow-2xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Log Measurements</span>
          </button>
        </div>
      </div>

      {/* Goal Transformation Card */}
      <div className="bg-white rounded-[10px] p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#a73827]">
              Transformation Trajectory
            </span>
            <h2 className="text-lg font-black text-slate-900 mt-0.5">
              Target: {activeCustomer.goalWeightLbs} lbs ({activeCustomer.goalWeightKg} kg)
            </h2>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-2xl font-black text-slate-900 font-mono">{goalProgressPct}%</span>
            <span className="text-xs text-slate-400 block">Goal Completion</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <div
            className="h-full bg-[#a73827] rounded-full transition-all duration-500"
            style={{ width: `${goalProgressPct}%` }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-3 bg-slate-50 rounded-[8px] border border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Start Weight</span>
            <p className="text-base font-black text-slate-900 mt-0.5 font-mono">{activeCustomer.startWeightLbs} lbs</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-[8px] border border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Current Weight</span>
            <p className="text-base font-black text-[#a73827] mt-0.5 font-mono">{activeCustomer.currentWeightLbs} lbs</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-[8px] border border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Weight Lost</span>
            <p className="text-base font-black text-emerald-700 mt-0.5 font-mono">
              -{Math.max(currentWeightLost, 0).toFixed(1)} lbs
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-[8px] border border-slate-200">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Current BMI</span>
            <p className="text-base font-black text-slate-900 mt-0.5 font-mono">{activeCustomer.currentBmi}</p>
          </div>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-[10px] border border-slate-200">
        <button
          onClick={() => setActiveTab('trackers')}
          className={`flex-1 py-2.5 rounded-[8px] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'trackers'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Weekly & Monthly Tracker Plans ({customerTrackers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('biometrics')}
          className={`flex-1 py-2.5 rounded-[8px] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'biometrics'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Ruler className="w-4 h-4" />
          <span>Circumference Logs ({customerMeasurements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('photos')}
          className={`flex-1 py-2.5 rounded-[8px] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'photos'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Milestone Photos ({customerPhotos.length})</span>
        </button>
      </div>

      {/* Tab: Weekly & Monthly Trackers */}
      {activeTab === 'trackers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Coach Prescribed Check-in Plans</h3>
            <span className="text-xs text-slate-500 font-mono">Real-time Adherence & Target Tracking</span>
          </div>

          <div className="space-y-3">
            {customerTrackers.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-[10px] border border-slate-200 text-slate-500 text-xs">
                No tracker plans assigned yet. Your coach will configure your weekly review plan.
              </div>
            ) : (
              customerTrackers.map((tracker) => (
                <div
                  key={tracker.id}
                  className="bg-white rounded-[10px] border border-slate-200 p-5 shadow-2xs space-y-4 hover:border-slate-300 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-[6px] text-[10px] font-black uppercase ${
                          tracker.type === 'weekly' ? 'bg-blue-50 text-blue-800 border border-blue-200' : 'bg-purple-50 text-purple-800 border border-purple-200'
                        }`}>
                          {tracker.type} Tracker
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{tracker.title}</h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 font-mono">{tracker.periodLabel}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-[6px] text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {tracker.adherenceRate}% Adherence
                      </span>

                      <button
                        onClick={() => handleOpenTrackerPrint(tracker)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-[#a73827] text-slate-700 hover:text-[#a73827] rounded-[8px] text-xs font-bold transition-all cursor-pointer shadow-2xs"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print / PDF</span>
                      </button>
                    </div>
                  </div>

                  {/* Tracker Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-[8px] border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Workouts Logged</span>
                      <p className="text-base font-black text-slate-900 mt-0.5 font-mono">
                        {tracker.completedWorkouts} / {tracker.targetWorkoutsPerWeek}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-[8px] border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Daily Water</span>
                      <p className="text-base font-black text-blue-700 mt-0.5 font-mono">
                        {tracker.dailyWaterTargetLiters} Liters
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-[8px] border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Daily Steps Target</span>
                      <p className="text-base font-black text-slate-900 mt-0.5 font-mono">
                        {tracker.dailyStepsTarget.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-[8px] border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Body Fat % Target</span>
                      <p className="text-base font-black text-rose-700 mt-0.5 font-mono">
                        {tracker.bodyFatTargetPct || 15.0}%
                      </p>
                    </div>
                  </div>

                  {/* Coach Feedback Note */}
                  {tracker.trainerFeedback && (
                    <div className="p-3.5 bg-amber-50 rounded-[8px] border border-amber-200 text-xs">
                      <p className="font-bold text-amber-900">Coach Milestone Evaluation:</p>
                      <p className="text-amber-800 mt-1 leading-relaxed">{tracker.trainerFeedback}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab: Circumference Measurements */}
      {activeTab === 'biometrics' && (
        <div className="bg-white rounded-[10px] border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Body Circumference Measurement Log</h3>
              <p className="text-[11px] text-slate-500">Inches recorded across major muscle groups.</p>
            </div>
            <button
              onClick={() => setShowLogMeasurementModal(true)}
              className="px-3 py-1.5 bg-[#a73827] text-white rounded-[8px] text-xs font-bold shadow-2xs cursor-pointer"
            >
              + New Entry
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Waist</th>
                  <th className="py-3 px-4">Chest</th>
                  <th className="py-3 px-4">Arms</th>
                  <th className="py-3 px-4">Hips</th>
                  <th className="py-3 px-4">Thighs</th>
                  <th className="py-3 px-4">Logged By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customerMeasurements.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{m.date}</td>
                    <td className="py-3 px-4 font-mono">{m.waistInches || '-'}"</td>
                    <td className="py-3 px-4 font-mono">{m.chestInches || '-'}"</td>
                    <td className="py-3 px-4 font-mono">{m.armsInches || '-'}"</td>
                    <td className="py-3 px-4 font-mono">{m.hipsInches || '-'}"</td>
                    <td className="py-3 px-4 font-mono">{m.thighsInches || '-'}"</td>
                    <td className="py-3 px-4 text-slate-500">{m.recordedBy || 'Coach'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Milestone Photos */}
      {activeTab === 'photos' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900">Transformation Photo Gallery</h3>
            <button
              onClick={() => setShowAddPhotoModal(true)}
              className="px-3 py-1.5 bg-[#a73827] text-white rounded-[8px] text-xs font-bold shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Upload Photo</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {customerPhotos.map((photo) => (
              <div key={photo.id} className="bg-white rounded-[10px] border border-slate-200 shadow-2xs overflow-hidden">
                <img src={photo.photoUrl} alt={photo.tag} className="w-full h-56 object-cover" />
                <div className="p-3.5 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">{photo.tag}</span>
                    <span className="font-mono text-slate-500">{photo.date}</span>
                  </div>
                  {photo.weightLbs && (
                    <p className="text-xs font-bold text-[#a73827] font-mono">{photo.weightLbs} lbs</p>
                  )}
                  {photo.notes && <p className="text-[11px] text-slate-500">{photo.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Log Weight Modal */}
      <Modal
        isOpen={showLogWeightModal}
        onClose={() => setShowLogWeightModal(false)}
        title="Log Current Body Weight"
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
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#a73827]/20 focus:border-[#a73827]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowLogWeightModal(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-[10px] text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#a73827] hover:bg-[#8f2f20] text-white rounded-[10px] text-xs font-bold shadow-2xs cursor-pointer"
            >
              Save Weight Entry
            </button>
          </div>
        </form>
      </Modal>

      {/* Log Measurements Modal */}
      <Modal
        isOpen={showLogMeasurementModal}
        onClose={() => setShowLogMeasurementModal(false)}
        title="Record Body Circumferences (Inches)"
      >
        <form onSubmit={handleLogMeasurementSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Waist (Inches)</label>
              <input
                type="number"
                step="0.1"
                value={measurementForm.waistInches}
                onChange={(e) => setMeasurementForm({ ...measurementForm, waistInches: Number(e.target.value) })}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[10px] text-xs font-mono text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Chest (Inches)</label>
              <input
                type="number"
                step="0.1"
                value={measurementForm.chestInches}
                onChange={(e) => setMeasurementForm({ ...measurementForm, chestInches: Number(e.target.value) })}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[10px] text-xs font-mono text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Arms (Inches)</label>
              <input
                type="number"
                step="0.1"
                value={measurementForm.armsInches}
                onChange={(e) => setMeasurementForm({ ...measurementForm, armsInches: Number(e.target.value) })}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[10px] text-xs font-mono text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hips (Inches)</label>
              <input
                type="number"
                step="0.1"
                value={measurementForm.hipsInches}
                onChange={(e) => setMeasurementForm({ ...measurementForm, hipsInches: Number(e.target.value) })}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[10px] text-xs font-mono text-slate-900"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowLogMeasurementModal(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-[10px] text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#a73827] text-white rounded-[10px] text-xs font-bold shadow-2xs cursor-pointer"
            >
              Save Measurements
            </button>
          </div>
        </form>
      </Modal>

      {/* Upload Photo Modal */}
      <Modal
        isOpen={showAddPhotoModal}
        onClose={() => setShowAddPhotoModal(false)}
        title="Add Progress Photo"
      >
        <form onSubmit={handleAddPhotoSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Image URL</label>
            <input
              type="url"
              value={photoForm.photoUrl}
              onChange={(e) => setPhotoForm({ ...photoForm, photoUrl: e.target.value })}
              required
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-[10px] text-xs text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pose / Angle</label>
              <select
                value={photoForm.tag}
                onChange={(e) => setPhotoForm({ ...photoForm, tag: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[10px] text-xs text-slate-900"
              >
                <option value="Front View">Front View</option>
                <option value="Side View">Side View</option>
                <option value="Back View">Back View</option>
                <option value="Milestone">Milestone</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Weight (lbs)</label>
              <input
                type="number"
                step="0.1"
                value={photoForm.weightLbs}
                onChange={(e) => setPhotoForm({ ...photoForm, weightLbs: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[10px] text-xs font-mono text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Notes</label>
            <textarea
              value={photoForm.notes}
              onChange={(e) => setPhotoForm({ ...photoForm, notes: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[10px] text-xs text-slate-900"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddPhotoModal(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-[10px] text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#a73827] text-white rounded-[10px] text-xs font-bold shadow-2xs cursor-pointer"
            >
              Save Milestone Photo
            </button>
          </div>
        </form>
      </Modal>

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
            customer: activeCustomer,
            trainer: activeTrainer,
            tracker: {
              type: selectedTrackerToPrint.type,
              periodLabel: selectedTrackerToPrint.periodLabel,
              startDate: selectedTrackerToPrint.startDate,
              endDate: selectedTrackerToPrint.endDate,
              startWeightLbs: activeCustomer.startWeightLbs,
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
