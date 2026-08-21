import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomerProfile } from '../../types';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  ArrowUpDown,
  TrendingUp,
  Dumbbell,
  Apple,
  MessageSquare,
  ChevronRight,
  Sparkles,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  LayoutGrid,
  List,
  Scale,
  Activity,
  Edit2,
  Trash2,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { DangerConfirmModal } from '../common/DangerConfirmModal';

export const TrainerMembersDirectory: React.FC = () => {
  const {
    activeTrainer,
    customers,
    createCustomer,
    updateCustomer,
    recordBmi,
    setSelectedMemberId,
    setActiveView,
    showToast,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expiring' | 'pending' | 'expired' | 'suspended'>('all');
  const [tierFilter, setTierFilter] = useState<'all' | 'Basic' | 'Pro' | 'Enterprise'>('all');
  const [sortBy, setSortBy] = useState<'name_asc' | 'name_desc' | 'weight_asc' | 'weight_desc' | 'bmi_asc' | 'bmi_desc' | 'progress_desc' | 'expiry_asc' | 'recent_activity'>('recent_activity');
  
  // List view by default as requested
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showQuickWeightModal, setShowQuickWeightModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMemberForAction, setSelectedMemberForAction] = useState<CustomerProfile | null>(null);

  // Danger Confirm Modal state
  const [dangerModalState, setDangerModalState] = useState<{
    isOpen: boolean;
    memberId: string | null;
    memberName: string;
    actionType: 'suspend' | 'expire';
  }>({
    isOpen: false,
    memberId: null,
    memberName: '',
    actionType: 'suspend',
  });

  // Form states
  const [newMember, setNewMember] = useState({
    fullName: '',
    email: '',
    phone: '',
    tier: 'Pro',
    currentWeightLbs: 165,
    goalWeightLbs: 155,
    heightCm: 175,
  });

  const [quickWeightLbs, setQuickWeightLbs] = useState(160);

  const [editMemberForm, setEditMemberForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    tier: 'Pro',
    status: 'active',
    goalWeightLbs: 150,
  });

  // Filter members assigned to active trainer
  const trainerCustomers = useMemo(() => {
    return customers.filter(
      (c) => c.assignedTrainerId === activeTrainer.id || c.tenantId === activeTrainer.tenantId
    );
  }, [customers, activeTrainer]);

  // Filtered & Sorted list
  const filteredMembers = useMemo(() => {
    return trainerCustomers.filter((m) => {
      const matchesSearch =
        m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.phone && m.phone.includes(searchTerm));

      let matchesStatus = true;
      if (statusFilter === 'active') matchesStatus = m.status === 'active';
      else if (statusFilter === 'pending') matchesStatus = m.status === 'pending';
      else if (statusFilter === 'expired') matchesStatus = m.status === 'expired';
      else if (statusFilter === 'suspended') matchesStatus = m.status === 'suspended';
      else if (statusFilter === 'expiring') {
        if (!m.membershipEndDate) matchesStatus = false;
        else {
          const diffDays = Math.ceil((new Date(m.membershipEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          matchesStatus = diffDays >= 0 && diffDays <= 30;
        }
      }

      const matchesTier = tierFilter === 'all' || m.tier === tierFilter;
      return matchesSearch && matchesStatus && matchesTier;
    }).sort((a, b) => {
      if (sortBy === 'name_asc') return a.fullName.localeCompare(b.fullName);
      if (sortBy === 'name_desc') return b.fullName.localeCompare(a.fullName);
      if (sortBy === 'weight_asc') return a.currentWeightLbs - b.currentWeightLbs;
      if (sortBy === 'weight_desc') return b.currentWeightLbs - a.currentWeightLbs;
      if (sortBy === 'bmi_asc') return a.currentBmi - b.currentBmi;
      if (sortBy === 'bmi_desc') return b.currentBmi - a.currentBmi;
      if (sortBy === 'progress_desc') {
        const progA = (a.startWeightLbs - a.currentWeightLbs) / (a.startWeightLbs - a.goalWeightLbs || 1);
        const progB = (b.startWeightLbs - b.currentWeightLbs) / (b.startWeightLbs - b.goalWeightLbs || 1);
        return progB - progA;
      }
      return 0;
    });
  }, [trainerCustomers, searchTerm, statusFilter, tierFilter, sortBy]);

  const handleOpenMemberArea = (memberId: string) => {
    setSelectedMemberId(memberId);
    setActiveView('member_progress');
  };

  const handleOpenDietPlan = (e: React.MouseEvent, memberId: string) => {
    e.stopPropagation();
    setSelectedMemberId(memberId);
    setActiveView('diet_plans');
  };

  const handleOpenWorkoutPlan = (e: React.MouseEvent, memberId: string) => {
    e.stopPropagation();
    setSelectedMemberId(memberId);
    setActiveView('workout_plans');
  };

  const handleOpenChat = (e: React.MouseEvent, memberId: string) => {
    e.stopPropagation();
    setSelectedMemberId(memberId);
    setActiveView('member_messages');
  };

  const handleOpenQuickWeight = (e: React.MouseEvent, member: CustomerProfile) => {
    e.stopPropagation();
    setSelectedMemberForAction(member);
    setQuickWeightLbs(member.currentWeightLbs);
    setShowQuickWeightModal(true);
  };

  const handleOpenEditMember = (e: React.MouseEvent, member: CustomerProfile) => {
    e.stopPropagation();
    setSelectedMemberForAction(member);
    setEditMemberForm({
      fullName: member.fullName,
      email: member.email,
      phone: member.phone || '',
      tier: member.tier,
      status: member.status,
      goalWeightLbs: member.goalWeightLbs,
    });
    setShowEditModal(true);
  };

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.fullName.trim() || !newMember.email.trim()) {
      showToast('Validation Error', 'Please complete client full name and email.', 'error');
      return;
    }

    createCustomer({
      fullName: newMember.fullName.trim(),
      email: newMember.email.trim(),
      phone: newMember.phone.trim(),
      tier: newMember.tier as any,
      status: 'active',
      assignedTrainerId: activeTrainer.id,
      tenantId: activeTrainer.tenantId,
      currentWeightLbs: Number(newMember.currentWeightLbs),
      startWeightLbs: Number(newMember.currentWeightLbs),
      goalWeightLbs: Number(newMember.goalWeightLbs),
      heightCm: Number(newMember.heightCm),
      avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=300&auto=format&fit=crop&q=80`,
      joinDate: new Date().toISOString().split('T')[0],
      membershipEndDate: '2027-08-31',
    });

    setShowAddModal(false);
    setNewMember({
      fullName: '',
      email: '',
      phone: '',
      tier: 'Pro',
      currentWeightLbs: 165,
      goalWeightLbs: 155,
      heightCm: 175,
    });
    showToast('Member Onboarded', 'New client profile added to your active roster.', 'success');
  };

  const handleSaveQuickWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberForAction) return;

    recordBmi(selectedMemberForAction.id, Number(quickWeightLbs), selectedMemberForAction.heightCm);
    setShowQuickWeightModal(false);
    showToast(
      'Weight & BMI Saved',
      `Logged ${quickWeightLbs} lbs for ${selectedMemberForAction.fullName}.`,
      'success'
    );
  };

  const handleSaveEditMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberForAction) return;

    updateCustomer(selectedMemberForAction.id, {
      fullName: editMemberForm.fullName.trim(),
      email: editMemberForm.email.trim(),
      phone: editMemberForm.phone.trim(),
      tier: editMemberForm.tier as any,
      status: editMemberForm.status as any,
      goalWeightLbs: Number(editMemberForm.goalWeightLbs),
    });

    setShowEditModal(false);
    showToast('Profile Updated', `Changes saved for ${selectedMemberForAction.fullName}.`, 'success');
  };

  const confirmDangerAction = () => {
    if (!dangerModalState.memberId) return;
    updateCustomer(dangerModalState.memberId, {
      status: dangerModalState.actionType === 'suspend' ? 'suspended' : 'expired',
    });
    setDangerModalState({ isOpen: false, memberId: null, memberName: '', actionType: 'suspend' });
    showToast(
      'Member Status Updated',
      `Client status marked as ${dangerModalState.actionType === 'suspend' ? 'Suspended' : 'Expired'}.`,
      'warning'
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200 pb-16">
      {/* Top Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-[10px] border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Members Directory</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-[6px] bg-slate-100 text-slate-700 border border-slate-200">
              {filteredMembers.length} Assigned Clients
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage client profiles, workout splits, clinical meal plans, body metrics, and progress logs.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#a73827] hover:bg-[#8f2f20] text-white rounded-[10px] text-xs font-bold shadow-2xs cursor-pointer transition-all active:scale-95 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Onboard Client</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-[10px] border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by client name, email, or phone..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-[10px] text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#a73827]/20 focus:border-[#a73827]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-[10px] text-xs text-slate-800 focus:outline-hidden"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="expiring">Expiring Soon</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>

            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-[10px] text-xs text-slate-800 focus:outline-hidden"
            >
              <option value="all">All Tiers</option>
              <option value="Basic">Basic</option>
              <option value="Pro">Pro</option>
              <option value="Enterprise">Enterprise</option>
            </select>

            <div className="flex items-center border border-slate-200 rounded-[8px] overflow-hidden">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-[#a73827] text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
                title="List View (Default)"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[#a73827] text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Client Roster Content */}
      {viewMode === 'table' ? (
        /* List / Table View (Default) */
        <div className="bg-white rounded-[10px] border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-3">Status / Tier</th>
                  <th className="py-3 px-3">Weight (lbs)</th>
                  <th className="py-3 px-3">BMI Index</th>
                  <th className="py-3 px-3">Progress Delta</th>
                  <th className="py-3 px-3">Expiry</th>
                  <th className="py-3 px-4 text-right">Client Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      No matching clients found in your roster.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => {
                    const weightDelta = Math.round((member.startWeightLbs - member.currentWeightLbs) * 10) / 10;
                    return (
                      <tr
                        key={member.id}
                        onClick={() => handleOpenMemberArea(member.id)}
                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={member.avatarUrl}
                              alt={member.fullName}
                              className="w-9 h-9 rounded-[8px] object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-slate-900 hover:text-[#a73827] transition-colors">
                                {member.fullName}
                              </p>
                              <p className="text-[11px] text-slate-500 font-mono">{member.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-[4px] ${
                                member.status === 'active'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {member.status}
                            </span>
                            <span className="text-[11px] text-slate-500 font-semibold">{member.tier}</span>
                          </div>
                        </td>

                        <td className="py-3 px-3 font-mono font-bold text-slate-900">
                          {member.currentWeightLbs} lbs
                        </td>

                        <td className="py-3 px-3">
                          <span className="font-mono font-bold text-slate-800">{member.currentBmi}</span>
                          <span className="ml-1 text-[10px] text-slate-500 font-medium">({member.bmiCategory})</span>
                        </td>

                        <td className="py-3 px-3">
                          <span className="text-emerald-700 font-bold font-mono">
                            {weightDelta >= 0 ? `-${weightDelta} lbs` : `+${Math.abs(weightDelta)} lbs`}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                          {member.membershipEndDate}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={(e) => handleOpenWorkoutPlan(e, member.id)}
                              className="p-1.5 rounded-[6px] bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                              title="Workout Routines"
                            >
                              <Dumbbell className="w-3.5 h-3.5 text-indigo-700" />
                            </button>
                            <button
                              onClick={(e) => handleOpenDietPlan(e, member.id)}
                              className="p-1.5 rounded-[6px] bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                              title="Meal Protocols"
                            >
                              <Apple className="w-3.5 h-3.5 text-emerald-700" />
                            </button>
                            <button
                              onClick={(e) => handleOpenChat(e, member.id)}
                              className="p-1.5 rounded-[6px] bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                              title="Real-Time Chat"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-blue-700" />
                            </button>
                            <button
                              onClick={(e) => handleOpenQuickWeight(e, member)}
                              className="p-1.5 rounded-[6px] bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                              title="Quick Log Weight"
                            >
                              <Scale className="w-3.5 h-3.5 text-[#a73827]" />
                            </button>
                            <button
                              onClick={(e) => handleOpenEditMember(e, member)}
                              className="p-1.5 rounded-[6px] bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                              title="Edit Client"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-slate-600" />
                            </button>
                            <button
                              onClick={() => handleOpenMemberArea(member.id)}
                              className="px-2.5 py-1.5 rounded-[6px] bg-[#a73827] hover:bg-[#8f2f20] text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                            >
                              <span>Manage</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => {
            const weightDelta = Math.round((member.startWeightLbs - member.currentWeightLbs) * 10) / 10;
            return (
              <div
                key={member.id}
                onClick={() => handleOpenMemberArea(member.id)}
                className="bg-white rounded-[10px] border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition-all cursor-pointer space-y-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatarUrl}
                    alt={member.fullName}
                    className="w-12 h-12 rounded-[8px] object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{member.fullName}</h3>
                    <p className="text-[11px] text-slate-500 font-mono truncate">{member.email}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-[4px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {member.status}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">{member.tier}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-100">
                  <div className="p-2 bg-slate-50 rounded-[6px] border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase">Weight</span>
                    <p className="font-mono font-bold text-slate-900 mt-0.5">{member.currentWeightLbs} lbs</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-[6px] border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase">BMI</span>
                    <p className="font-mono font-bold text-slate-900 mt-0.5">{member.currentBmi}</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-[6px] border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase">Delta</span>
                    <p className="font-mono font-bold text-emerald-700 mt-0.5">-{weightDelta} lbs</p>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => handleOpenWorkoutPlan(e, member.id)}
                    className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-[6px] text-xs font-bold flex items-center justify-center gap-1 cursor-pointer border border-slate-200"
                  >
                    <Dumbbell className="w-3.5 h-3.5 text-indigo-700" />
                    <span>Workouts</span>
                  </button>
                  <button
                    onClick={(e) => handleOpenDietPlan(e, member.id)}
                    className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-[6px] text-xs font-bold flex items-center justify-center gap-1 cursor-pointer border border-slate-200"
                  >
                    <Apple className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Diets</span>
                  </button>
                  <button
                    onClick={(e) => handleOpenChat(e, member.id)}
                    className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-[6px] cursor-pointer border border-slate-200"
                    title="Chat"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-blue-700" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Add Member */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Onboard New Assigned Client"
      >
        <form onSubmit={handleAddMemberSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Client Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Rachel Adams"
              value={newMember.fullName}
              onChange={(e) => setNewMember({ ...newMember, fullName: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#a73827]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="rachel@domain.com"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#a73827]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={newMember.phone}
                onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#a73827]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Current Wt (lbs)</label>
              <input
                type="number"
                value={newMember.currentWeightLbs}
                onChange={(e) => setNewMember({ ...newMember, currentWeightLbs: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Goal Wt (lbs)</label>
              <input
                type="number"
                value={newMember.goalWeightLbs}
                onChange={(e) => setNewMember({ ...newMember, goalWeightLbs: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Height (cm)</label>
              <input
                type="number"
                value={newMember.heightCm}
                onChange={(e) => setNewMember({ ...newMember, heightCm: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Membership Plan</label>
            <select
              value={newMember.tier}
              onChange={(e) => setNewMember({ ...newMember, tier: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900"
            >
              <option value="Basic">Basic Coaching</option>
              <option value="Pro">Pro 1-on-1 Periodization</option>
              <option value="Enterprise">Enterprise Elite</option>
            </select>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 rounded-[10px] text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-[10px] text-xs font-bold bg-[#a73827] hover:bg-[#8f2f20] text-white shadow-2xs transition-colors cursor-pointer"
            >
              Onboard Client
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Quick Weight & BMI Entry */}
      <Modal
        isOpen={showQuickWeightModal}
        onClose={() => setShowQuickWeightModal(false)}
        title={`Log Biometrics for ${selectedMemberForAction?.fullName}`}
      >
        <form onSubmit={handleSaveQuickWeight} className="space-y-4">
          <div className="p-3 bg-slate-50 rounded-[8px] text-xs space-y-1 border border-slate-200">
            <p className="text-slate-600">
              Height: <strong className="text-slate-900">{selectedMemberForAction?.heightCm || 175} cm</strong>
            </p>
            <p className="text-slate-600">
              Previous weight: <strong className="text-slate-900">{selectedMemberForAction?.currentWeightLbs} lbs</strong>
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">New Weight (lbs)</label>
            <input
              type="number"
              step="0.1"
              required
              value={quickWeightLbs}
              onChange={(e) => setQuickWeightLbs(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900 font-mono"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowQuickWeightModal(false)}
              className="px-4 py-2 rounded-[10px] text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-[10px] text-xs font-bold bg-[#a73827] hover:bg-[#8f2f20] text-white shadow-2xs transition-colors cursor-pointer"
            >
              Update Weight & Recalculate BMI
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Member Info */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`Edit ${selectedMemberForAction?.fullName}'s Profile`}
      >
        <form onSubmit={handleSaveEditMember} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={editMemberForm.fullName}
              onChange={(e) => setEditMemberForm({ ...editMemberForm, fullName: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={editMemberForm.email}
                onChange={(e) => setEditMemberForm({ ...editMemberForm, email: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
              <input
                type="text"
                value={editMemberForm.phone}
                onChange={(e) => setEditMemberForm({ ...editMemberForm, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tier</label>
              <select
                value={editMemberForm.tier}
                onChange={(e) => setEditMemberForm({ ...editMemberForm, tier: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900"
              >
                <option value="Basic">Basic</option>
                <option value="Pro">Pro</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
              <select
                value={editMemberForm.status}
                onChange={(e) => setEditMemberForm({ ...editMemberForm, status: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900"
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="expired">Expired</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Goal Weight (lbs)</label>
              <input
                type="number"
                value={editMemberForm.goalWeightLbs}
                onChange={(e) => setEditMemberForm({ ...editMemberForm, goalWeightLbs: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-[10px] border border-slate-200 bg-slate-50 text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setShowEditModal(false);
                if (selectedMemberForAction) {
                  setDangerModalState({
                    isOpen: true,
                    memberId: selectedMemberForAction.id,
                    memberName: selectedMemberForAction.fullName,
                    actionType: 'suspend',
                  });
                }
              }}
              className="text-xs text-rose-600 hover:text-rose-800 font-bold cursor-pointer"
            >
              Suspend Client Roster Access
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-[10px] text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-[10px] text-xs font-bold bg-[#a73827] hover:bg-[#8f2f20] text-white shadow-2xs transition-colors cursor-pointer"
              >
                Save Profile Changes
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Danger Confirm Modal */}
      <DangerConfirmModal
        isOpen={dangerModalState.isOpen}
        onClose={() => setDangerModalState({ isOpen: false, memberId: null, memberName: '', actionType: 'suspend' })}
        onConfirm={confirmDangerAction}
        title={`Suspend Client: ${dangerModalState.memberName}?`}
        message={`Are you sure you want to suspend coaching and platform access for ${dangerModalState.memberName}? They will be locked from logging workouts and viewing plans until reactivated.`}
        confirmText="Confirm Suspension"
      />
    </div>
  );
};
