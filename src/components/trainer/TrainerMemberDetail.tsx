import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Calendar,
  Weight,
  Ruler,
  FileText,
  Activity,
  CheckCircle,
  Plus,
  TrendingDown,
  TrendingUp,
  Dumbbell,
  Apple,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const TrainerMemberDetail: React.FC = () => {
  const {
    customers,
    selectedMemberId,
    setActiveView,
    recordMeasurement,
    recordBmi,
    addTrainerNote,
    bodyMeasurements,
    bmiRecords,
    workoutPlans,
    dietPlans,
    switchRole,
    showToast,
  } = useApp();

  const member = customers.find((c) => c.id === selectedMemberId) || customers[0];

  const [activeTab, setActiveTab] = useState<'measurements' | 'notes' | 'workouts' | 'diet'>('measurements');

  // Modals
  const [showLogMeasurementModal, setShowLogMeasurementModal] = useState(false);
  const [showRecordBmiModal, setShowRecordBmiModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);

  // Forms
  const [measurementForm, setMeasurementForm] = useState({
    waistInches: 28.5,
    hipsInches: 38.0,
    chestInches: 34.0,
    armsInches: 14.5,
    thighsInches: 22.0,
  });

  const [bmiForm, setBmiForm] = useState({
    weightLbs: member.currentWeightLbs || 162.4,
    heightCm: member.heightCm || 180,
  });

  const [noteForm, setNoteForm] = useState({
    title: 'Upper Body Strength & Progression',
    note: '',
  });

  const memberMeasurements = bodyMeasurements.filter((m) => m.customerId === member.id);
  const memberBmiList = bmiRecords.filter((b) => b.customerId === member.id);
  const activeWorkout = workoutPlans.find((w) => w.customerId === member.id) || workoutPlans[0];
  const activeDiet = dietPlans.find((d) => d.customerId === member.id) || dietPlans[0];

  const handleSaveMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    recordMeasurement(member.id, measurementForm);
    setShowLogMeasurementModal(false);
  };

  const handleSaveBmi = (e: React.FormEvent) => {
    e.preventDefault();
    recordBmi(member.id, Number(bmiForm.weightLbs), Number(bmiForm.heightCm));
    setShowRecordBmiModal(false);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteForm.note) return;
    addTrainerNote(member.id, noteForm.title, noteForm.note);
    setShowAddNoteModal(false);
    setNoteForm({ title: 'Biometric Assessment & Progress', note: '' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveView('members')}
          className="flex items-center gap-1.5 text-xs font-bold text-[#545c86] hover:text-[#a73827] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Member Directory</span>
        </button>

        <button
          onClick={() => switchRole('customer', member.userId)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0f183e] rounded-xl text-xs font-bold transition-all border border-[#e2e8f0]"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>View as Customer</span>
        </button>
      </div>

      {/* Customer Profile Card (Matches Screenshot 5 & 16) */}
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={member.avatarUrl}
              alt={member.fullName}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#e2e8f0] shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-[#0b1c30]">{member.fullName}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#10b981]/15 text-[#065f46]">
                  {member.status.toUpperCase()}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#c7cfff]/40 text-[#0f183e]">
                  BMI {member.currentBmi} ({member.bmiCategory})
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {member.email} • {member.phone} • Member since {member.membershipStartDate}
              </p>
            </div>
          </div>

          {/* Action Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowLogMeasurementModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#a73827] hover:bg-[#872112] text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all"
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Log Measurements</span>
            </button>

            <button
              onClick={() => setShowRecordBmiModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#e2e8f0] text-gray-800 hover:bg-gray-50 rounded-xl text-xs font-semibold shadow-sm active:scale-95 transition-all"
            >
              <Weight className="w-3.5 h-3.5 text-[#006b5d]" />
              <span>Record BMI</span>
            </button>

            <button
              onClick={() => setShowAddNoteModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#e2e8f0] text-gray-800 hover:bg-gray-50 rounded-xl text-xs font-semibold shadow-sm active:scale-95 transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-[#545c86]" />
              <span>Add Note</span>
            </button>
          </div>
        </div>

        {/* Quick Vitals Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-gray-100">
          <div className="p-3 bg-[#f8f9ff] rounded-xl">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Current Weight</span>
            <p className="text-sm font-extrabold text-gray-900 mt-0.5">
              {member.currentWeightLbs} lbs <span className="text-xs text-gray-500 font-normal">({member.currentWeightKg} kg)</span>
            </p>
          </div>

          <div className="p-3 bg-[#f8f9ff] rounded-xl">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Weight Goal</span>
            <p className="text-sm font-extrabold text-[#006b5d] mt-0.5">{member.goalWeightLbs} lbs</p>
          </div>

          <div className="p-3 bg-[#f8f9ff] rounded-xl">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Height</span>
            <p className="text-sm font-extrabold text-gray-900 mt-0.5">{member.heightCm} cm</p>
          </div>

          <div className="p-3 bg-[#f8f9ff] rounded-xl">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Daily Calories</span>
            <p className="text-sm font-extrabold text-[#a73827] mt-0.5">{member.targetCalories} kcal</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#e2e8f0] pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('measurements')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'measurements' ? 'bg-[#a73827] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Ruler className="w-4 h-4" />
          <span>Body Measurements</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'notes' ? 'bg-[#a73827] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Trainer Clinical Notes</span>
        </button>

        <button
          onClick={() => setActiveTab('workouts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'workouts' ? 'bg-[#a73827] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          <span>Assigned Workouts</span>
        </button>

        <button
          onClick={() => setActiveTab('diet')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'diet' ? 'bg-[#a73827] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Apple className="w-4 h-4" />
          <span>Nutrition & Macros</span>
        </button>
      </div>

      {/* Tab 1: Body Measurements Table (Matches Screenshot 16) */}
      {activeTab === 'measurements' && (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#f8f9ff]">
            <h3 className="text-sm font-bold text-[#0b1c30]">Historical Circumference Measurements</h3>
            <span className="text-xs text-gray-500">All metrics in inches (in)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-[#f8f9ff] text-[11px] font-bold text-[#545c86] uppercase tracking-wider">
                  <th className="py-3.5 px-5">Date</th>
                  <th className="py-3.5 px-5">Waist</th>
                  <th className="py-3.5 px-5">Hips</th>
                  <th className="py-3.5 px-5">Chest</th>
                  <th className="py-3.5 px-5">Arms</th>
                  <th className="py-3.5 px-5">Thighs</th>
                  <th className="py-3.5 px-5">Recorded By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {memberMeasurements.map((rec) => (
                  <tr key={rec.id} className="hover:bg-gray-50 transition-colors font-medium">
                    <td className="py-3.5 px-5 font-bold text-[#0b1c30]">{rec.date}</td>
                    <td className="py-3.5 px-5 text-gray-700">{rec.waistInches}"</td>
                    <td className="py-3.5 px-5 text-gray-700">{rec.hipsInches}"</td>
                    <td className="py-3.5 px-5 text-gray-700">{rec.chestInches}"</td>
                    <td className="py-3.5 px-5 text-gray-700">{rec.armsInches}"</td>
                    <td className="py-3.5 px-5 text-gray-700">{rec.thighsInches}"</td>
                    <td className="py-3.5 px-5 text-gray-400 text-[11px]">{rec.recordedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Trainer Clinical Notes (Matches Screenshot 16) */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-[#0b1c30]">Coaching Observations & Assessments</h3>
            <button
              onClick={() => setShowAddNoteModal(true)}
              className="text-xs font-bold text-[#a73827] hover:underline"
            >
              + Add Observation
            </button>
          </div>

          <div className="space-y-3">
            {member.trainerNotes.length === 0 ? (
              <div className="bg-white p-8 text-center text-xs text-gray-500 rounded-2xl border border-gray-200">
                No observations logged yet for this member.
              </div>
            ) : (
              member.trainerNotes.map((note) => (
                <div key={note.id} className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-bold text-[#0b1c30]">{note.title}</h4>
                    <span className="text-[11px] text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full font-medium">
                      {note.date}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">{note.note}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Assigned Workouts */}
      {activeTab === 'workouts' && (
        <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-[#0b1c30]">{activeWorkout.title}</h3>
              <p className="text-xs text-gray-400">{activeWorkout.description}</p>
            </div>
            <button
              onClick={() => setActiveView('workout_plans')}
              className="px-3 py-1.5 bg-[#a73827] text-white rounded-xl text-xs font-bold"
            >
              Open Plan Editor
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {activeWorkout.days.map((day) => (
              <div key={day.id} className="p-4 bg-[#f8f9ff] border border-[#e2e8f0] rounded-xl text-xs">
                <div className="flex justify-between items-center font-bold text-[#0b1c30] mb-2">
                  <span>{day.dayName}</span>
                  <span className="text-[11px] text-[#006b5d] font-semibold">{day.exercises.length} Exercises</span>
                </div>
                <ul className="space-y-1 text-gray-600">
                  {day.exercises.map((e) => (
                    <li key={e.id} className="flex justify-between text-[11px]">
                      <span>• {e.name}</span>
                      <span className="font-mono text-gray-400">{e.sets}x{e.reps}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Diet & Nutrition */}
      {activeTab === 'diet' && (
        <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-[#0b1c30]">{activeDiet.title}</h3>
              <p className="text-xs text-gray-400">Target: {activeDiet.dailyCalories} kcal daily</p>
            </div>
            <button
              onClick={() => setActiveView('diet_plans')}
              className="px-3 py-1.5 bg-[#006b5d] text-white rounded-xl text-xs font-bold"
            >
              Open Diet Editor
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="p-3 bg-red-50 rounded-xl text-center">
              <span className="text-[10px] text-gray-500 font-bold uppercase">Calories</span>
              <p className="text-base font-extrabold text-[#a73827] mt-0.5">{activeDiet.dailyCalories}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl text-center">
              <span className="text-[10px] text-gray-500 font-bold uppercase">Protein</span>
              <p className="text-base font-extrabold text-[#0f183e] mt-0.5">{activeDiet.targetProteinG}g</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-center">
              <span className="text-[10px] text-gray-500 font-bold uppercase">Carbs</span>
              <p className="text-base font-extrabold text-[#006b5d] mt-0.5">{activeDiet.targetCarbsG}g</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl text-center">
              <span className="text-[10px] text-gray-500 font-bold uppercase">Fats</span>
              <p className="text-base font-extrabold text-amber-900 mt-0.5">{activeDiet.targetFatsG}g</p>
            </div>
          </div>
        </div>
      )}

      {/* Log Measurement Modal */}
      <Modal
        isOpen={showLogMeasurementModal}
        onClose={() => setShowLogMeasurementModal(false)}
        title="Log Body Circumferences"
        subtitle={`Record tape measurements for ${member.fullName}`}
        maxWidth="md"
      >
        <form onSubmit={handleSaveMeasurement} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Waist (inches)</label>
              <input
                type="number"
                step="0.1"
                required
                value={measurementForm.waistInches}
                onChange={(e) => setMeasurementForm({ ...measurementForm, waistInches: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-[#e2e8f0] rounded-xl focus:ring-2 focus:ring-[#a73827]/20 focus:outline-none h-[42px]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Hips (inches)</label>
              <input
                type="number"
                step="0.1"
                required
                value={measurementForm.hipsInches}
                onChange={(e) => setMeasurementForm({ ...measurementForm, hipsInches: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-[#e2e8f0] rounded-xl focus:ring-2 focus:ring-[#a73827]/20 focus:outline-none h-[42px]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Chest (inches)</label>
              <input
                type="number"
                step="0.1"
                required
                value={measurementForm.chestInches}
                onChange={(e) => setMeasurementForm({ ...measurementForm, chestInches: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-[#e2e8f0] rounded-xl focus:ring-2 focus:ring-[#a73827]/20 focus:outline-none h-[42px]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Arms (inches)</label>
              <input
                type="number"
                step="0.1"
                required
                value={measurementForm.armsInches}
                onChange={(e) => setMeasurementForm({ ...measurementForm, armsInches: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-[#e2e8f0] rounded-xl focus:ring-2 focus:ring-[#a73827]/20 focus:outline-none h-[42px]"
              />
            </div>

            <div className="col-span-2">
              <label className="block font-bold text-gray-700 mb-1">Thighs (inches)</label>
              <input
                type="number"
                step="0.1"
                required
                value={measurementForm.thighsInches}
                onChange={(e) => setMeasurementForm({ ...measurementForm, thighsInches: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-[#e2e8f0] rounded-xl focus:ring-2 focus:ring-[#a73827]/20 focus:outline-none h-[42px]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowLogMeasurementModal(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#a73827] hover:bg-[#872112] text-white rounded-xl font-bold shadow-sm"
            >
              Save Measurement
            </button>
          </div>
        </form>
      </Modal>

      {/* Record BMI Modal */}
      <Modal
        isOpen={showRecordBmiModal}
        onClose={() => setShowRecordBmiModal(false)}
        title="Record Weight & Calculate BMI"
        subtitle={`Update official scale weight for ${member.fullName}`}
        maxWidth="sm"
      >
        <form onSubmit={handleSaveBmi} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Body Weight (lbs)</label>
            <input
              type="number"
              step="0.1"
              required
              value={bmiForm.weightLbs}
              onChange={(e) => setBmiForm({ ...bmiForm, weightLbs: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-[#e2e8f0] rounded-xl focus:ring-2 focus:ring-[#a73827]/20 focus:outline-none h-[42px]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Height (cm)</label>
            <input
              type="number"
              required
              value={bmiForm.heightCm}
              onChange={(e) => setBmiForm({ ...bmiForm, heightCm: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-[#e2e8f0] rounded-xl focus:ring-2 focus:ring-[#a73827]/20 focus:outline-none h-[42px]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowRecordBmiModal(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#006b5d] hover:bg-[#005045] text-white rounded-xl font-bold shadow-sm"
            >
              Calculate & Save
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Observation Note Modal */}
      <Modal
        isOpen={showAddNoteModal}
        onClose={() => setShowAddNoteModal(false)}
        title="Add Coaching Observation"
        subtitle={`Save assessment notes visible only to coaches`}
        maxWidth="md"
      >
        <form onSubmit={handleSaveNote} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Note Title</label>
            <input
              type="text"
              required
              value={noteForm.title}
              onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
              className="w-full px-3 py-2 border border-[#e2e8f0] rounded-xl focus:ring-2 focus:ring-[#a73827]/20 focus:outline-none h-[42px]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Observation & Recommendations</label>
            <textarea
              rows={4}
              required
              placeholder="e.g. Form check looks great on front squats. Recommend increasing protein to 170g on heavy training days."
              value={noteForm.note}
              onChange={(e) => setNoteForm({ ...noteForm, note: e.target.value })}
              className="w-full px-3 py-2 border border-[#e2e8f0] rounded-xl focus:ring-2 focus:ring-[#a73827]/20 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowAddNoteModal(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#a73827] hover:bg-[#872112] text-white rounded-xl font-bold shadow-sm"
            >
              Save Note
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
