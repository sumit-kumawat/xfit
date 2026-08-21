import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Dumbbell,
  CreditCard,
  CheckCircle,
  TrendingUp,
  UserPlus,
  PlusCircle,
  Calendar,
  ChevronRight,
  Clock,
  MessageSquare,
  Activity,
  Award,
  AlertCircle,
  Search,
  Apple,
  Scale,
  ArrowRight,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const TrainerDashboard: React.FC = () => {
  const {
    activeTrainer,
    customers,
    createCustomer,
    setActiveView,
    setSelectedMemberId,
    workoutPlans,
    dietPlans,
    chatMessages,
    payments,
    showToast,
  } = useApp();

  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberData, setNewMemberData] = useState({
    fullName: '',
    email: '',
    phone: '',
    tier: 'Pro',
    currentWeightLbs: 165,
    goalWeightLbs: 155,
    heightCm: 175,
  });

  const trainerCustomers = customers.filter(
    (c) => c.assignedTrainerId === activeTrainer.id || c.tenantId === activeTrainer.tenantId
  );

  const activeMembers = trainerCustomers.filter((c) => c.status === 'active');
  const expiringMembers = trainerCustomers.filter((c) => {
    if (!c.membershipEndDate) return false;
    const diffDays = Math.ceil((new Date(c.membershipEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  });

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberData.fullName.trim() || !newMemberData.email.trim()) {
      showToast('Validation Error', 'Please enter client name and email.', 'error');
      return;
    }

    createCustomer({
      fullName: newMemberData.fullName.trim(),
      email: newMemberData.email.trim(),
      phone: newMemberData.phone.trim(),
      tier: newMemberData.tier as any,
      status: 'active',
      assignedTrainerId: activeTrainer.id,
      tenantId: activeTrainer.tenantId,
      currentWeightLbs: Number(newMemberData.currentWeightLbs),
      startWeightLbs: Number(newMemberData.currentWeightLbs),
      goalWeightLbs: Number(newMemberData.goalWeightLbs),
      heightCm: Number(newMemberData.heightCm),
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      joinDate: new Date().toISOString().split('T')[0],
      membershipEndDate: '2027-08-31',
    });

    setShowAddMemberModal(false);
    showToast('Client Onboarded', `${newMemberData.fullName} added to your active coaching roster.`, 'success');
  };

  const handleOpenClient = (customerId: string) => {
    setSelectedMemberId(customerId);
    setActiveView('member_progress');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200 pb-16">
      {/* Top Banner */}
      <div className="bg-white rounded-[10px] p-6 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Trainer Coaching Dashboard
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-[6px] bg-[#a73827]/10 text-[#a73827] border border-[#a73827]/20">
              {activeTrainer.specialty}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Welcome back, <strong className="text-slate-800">{activeTrainer.fullName}</strong>. Review your assigned roster and weekly compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('trainer_members')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-[10px] text-xs font-bold transition-colors cursor-pointer"
          >
            Client Directory
          </button>
          <button
            onClick={() => setShowAddMemberModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#a73827] hover:bg-[#8f2f20] text-white rounded-[10px] text-xs font-bold shadow-2xs cursor-pointer transition-all active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Onboard Client</span>
          </button>
        </div>
      </div>

      {/* 4 Core Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div
          onClick={() => setActiveView('trainer_members')}
          className="bg-white p-4 rounded-[10px] border border-slate-200 shadow-2xs cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold">Active Roster</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-black text-slate-900 mt-1 font-mono">{activeMembers.length}</p>
          <span className="text-[10px] text-emerald-700 font-semibold">{trainerCustomers.length} Total Clients</span>
        </div>

        <div
          onClick={() => setActiveView('workout_plans')}
          className="bg-white p-4 rounded-[10px] border border-slate-200 shadow-2xs cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold">Workout Splits</span>
            <Dumbbell className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-xl font-black text-slate-900 mt-1 font-mono">{workoutPlans.length}</p>
          <span className="text-[10px] text-slate-500 font-semibold">Assigned Protocols</span>
        </div>

        <div
          onClick={() => setActiveView('diet_plans')}
          className="bg-white p-4 rounded-[10px] border border-slate-200 shadow-2xs cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold">Diet Protocols</span>
            <Apple className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-black text-slate-900 mt-1 font-mono">{dietPlans.length}</p>
          <span className="text-[10px] text-slate-500 font-semibold">Veg & Non-Veg Plans</span>
        </div>

        <div
          onClick={() => setActiveView('trainer_members')}
          className="bg-white p-4 rounded-[10px] border border-slate-200 shadow-2xs cursor-pointer hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold">Expiring Soon</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl font-black text-amber-700 mt-1 font-mono">{expiringMembers.length}</p>
          <span className="text-[10px] text-slate-500">Next 30 Days</span>
        </div>
      </div>

      {/* Two Column Layout: Assigned Clients & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Client Roster Overview */}
        <div className="lg:col-span-2 bg-white rounded-[10px] border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Active Client Roster</h3>
              <p className="text-[11px] text-slate-500">Quick access to biometric files and periodization.</p>
            </div>
            <button
              onClick={() => setActiveView('trainer_members')}
              className="text-xs font-bold text-[#a73827] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {trainerCustomers.slice(0, 4).map((member) => (
              <div
                key={member.id}
                onClick={() => handleOpenClient(member.id)}
                className="py-3 flex items-center justify-between hover:bg-slate-50 rounded-[6px] px-2 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatarUrl}
                    alt={member.fullName}
                    className="w-10 h-10 rounded-[8px] object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{member.fullName}</h4>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {member.currentWeightLbs} lbs • BMI {member.currentBmi} ({member.bmiCategory})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-[4px] bg-slate-100 text-slate-700">
                    {member.tier}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Quick Navigation Hub */}
        <div className="bg-white rounded-[10px] border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Coaching Protocols Hub</h3>
            <p className="text-[11px] text-slate-500">Fast access to tools & editors.</p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setActiveView('workout_plans')}
              className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-[8px] flex items-center justify-between text-xs font-bold text-slate-800 transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-indigo-700" />
                <span>Workout Split Builder</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => setActiveView('diet_plans')}
              className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-[8px] flex items-center justify-between text-xs font-bold text-slate-800 transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <Apple className="w-4 h-4 text-emerald-700" />
                <span>Nutrition & Meal Planner</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => setActiveView('member_messages')}
              className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-[8px] flex items-center justify-between text-xs font-bold text-slate-800 transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-blue-700" />
                <span>Client Messages & Files</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Onboard Client */}
      <Modal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        title="Onboard New Client"
      >
        <form onSubmit={handleAddMemberSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={newMemberData.fullName}
              onChange={(e) => setNewMemberData({ ...newMemberData, fullName: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={newMemberData.email}
                onChange={(e) => setNewMemberData({ ...newMemberData, email: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
              <input
                type="text"
                value={newMemberData.phone}
                onChange={(e) => setNewMemberData({ ...newMemberData, phone: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Weight (lbs)</label>
              <input
                type="number"
                value={newMemberData.currentWeightLbs}
                onChange={(e) => setNewMemberData({ ...newMemberData, currentWeightLbs: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Goal (lbs)</label>
              <input
                type="number"
                value={newMemberData.goalWeightLbs}
                onChange={(e) => setNewMemberData({ ...newMemberData, goalWeightLbs: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Height (cm)</label>
              <input
                type="number"
                value={newMemberData.heightCm}
                onChange={(e) => setNewMemberData({ ...newMemberData, heightCm: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddMemberModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-[10px] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-[#a73827] text-white rounded-[10px] shadow-2xs hover:bg-[#8f2f20] cursor-pointer"
            >
              Onboard Client
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
