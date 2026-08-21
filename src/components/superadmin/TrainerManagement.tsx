import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TrainerProfile } from '../../types';
import {
  Search,
  UserPlus,
  Download,
  Star,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Shield,
  CheckCircle,
  Ban,
  Edit,
  Mail,
  Award,
  Trash2,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { DangerConfirmModal } from '../common/DangerConfirmModal';

export const TrainerManagement: React.FC = () => {
  const { trainers, createTrainer, toggleTrainerStatus, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'disabled' | 'suspended'>('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedTrainerDetail, setSelectedTrainerDetail] = useState<TrainerProfile | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Danger Confirm Modal state
  const [dangerModalState, setDangerModalState] = useState<{
    isOpen: boolean;
    trainerId: string | null;
    trainerName: string;
    action: 'disable' | 'activate';
  }>({
    isOpen: false,
    trainerId: null,
    trainerName: '',
    action: 'disable',
  });

  // Invite Form State in INR
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    title: 'Senior Strength & Conditioning Coach',
    workplace: 'Metro Athletic Performance Hub',
    yearsOfExperience: 5,
    specializations: 'Powerlifting, Hypertrophy, Nutrition',
    certifications: 'NASM-CPT, CSCS, Precision Nutrition',
    fitnessExpertise: 'Movement biomechanics and strength periodization',
    dietExpertise: 'Caloric balance and sports macro prescription',
    trainingExpertise: 'Progressive overload and hypertrophy splits',
    bio: 'Experienced fitness coach transforming everyday athletes into peak performers.',
    pricingMonthly: 3499,
    pricingAnnual: 34990,
  });

  const filteredTrainers = trainers.filter((trainer) => {
    const matchesSearch =
      trainer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.specializations.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || trainer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) {
      showToast('Missing Fields', 'Please specify trainer name and email address.', 'error');
      return;
    }

    createTrainer({
      fullName: formData.fullName,
      email: formData.email,
      title: formData.title,
      workplace: formData.workplace,
      yearsOfExperience: Number(formData.yearsOfExperience),
      specializations: formData.specializations.split(',').map((s) => s.trim()),
      certifications: formData.certifications.split(',').map((s) => s.trim()),
      fitnessExpertise: formData.fitnessExpertise,
      dietExpertise: formData.dietExpertise,
      trainingExpertise: formData.trainingExpertise,
      bio: formData.bio,
      pricingMonthly: Number(formData.pricingMonthly),
      pricingAnnual: Number(formData.pricingAnnual),
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    });

    setShowInviteModal(false);
    setFormData({
      fullName: '',
      email: '',
      title: 'Senior Strength & Conditioning Coach',
      workplace: 'Metro Athletic Performance Hub',
      yearsOfExperience: 5,
      specializations: 'Powerlifting, Hypertrophy, Nutrition',
      certifications: 'NASM-CPT, CSCS, Precision Nutrition',
      fitnessExpertise: 'Movement biomechanics and strength periodization',
      dietExpertise: 'Caloric balance and sports macro prescription',
      trainingExpertise: 'Progressive overload and hypertrophy splits',
      bio: 'Experienced fitness coach transforming everyday athletes into peak performers.',
      pricingMonthly: 3499,
      pricingAnnual: 34990,
    });
    showToast('Coach Onboarded', 'Account provisioned with dedicated portal.', 'success');
  };

  const confirmDangerAction = () => {
    if (!dangerModalState.trainerId) return;
    toggleTrainerStatus(dangerModalState.trainerId, dangerModalState.action === 'disable' ? 'disabled' : 'active');
    setDangerModalState({ isOpen: false, trainerId: null, trainerName: '', action: 'disable' });
    showToast(
      'Account Status Updated',
      `Trainer account has been ${dangerModalState.action === 'disable' ? 'disabled' : 'activated'}.`,
      'info'
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200 pb-16">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-[10px] border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Trainer Directory</h1>
          <p className="text-xs text-slate-500 mt-1">Directory of all active and onboarded coaching staff across facilities.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast('CSV Exported', 'Exported directory of coaching staff.', 'success')}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 border border-slate-200 text-slate-800 rounded-[10px] text-xs font-bold hover:bg-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#a73827] hover:bg-[#8f2f20] text-white rounded-[10px] text-xs font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Onboard Coach</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-[10px] p-4 border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trainers by name or specialty..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-[10px] text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#a73827]/20 focus:border-[#a73827]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {(['all', 'active', 'disabled', 'suspended'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-[8px] text-xs font-bold capitalize whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-[#a73827] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {status === 'all' ? 'All Status' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-[10px] shadow-2xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="py-3 px-4">Coach Profile</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Specialty</th>
                <th className="py-3 px-3 text-right">Assigned Clients</th>
                <th className="py-3 px-3 text-right">Pricing (₹)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTrainers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No trainers found matching your search.
                  </td>
                </tr>
              ) : (
                filteredTrainers.map((trainer) => {
                  const isActive = trainer.status === 'active';
                  return (
                    <tr key={trainer.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={trainer.avatarUrl}
                            alt={trainer.fullName}
                            className={`w-10 h-10 rounded-[8px] object-cover border border-slate-200 ${!isActive ? 'grayscale' : ''}`}
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{trainer.fullName}</span>
                            <span className="text-[11px] text-slate-500 font-mono">{trainer.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-[4px] ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {trainer.status}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-slate-800 font-semibold">{trainer.specialty || trainer.specializations[0]}</span>
                        <span className="text-[10px] text-slate-400 block">{trainer.yearsOfExperience} yrs exp</span>
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                        {trainer.totalMembers || 8}
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                        ₹{(trainer.pricingMonthly || 3499).toLocaleString('en-IN')}/mo
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedTrainerDetail(trainer)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-[6px] text-xs font-bold cursor-pointer"
                          >
                            Profile
                          </button>

                          {trainer.status === 'active' ? (
                            <button
                              onClick={() =>
                                setDangerModalState({
                                  isOpen: true,
                                  trainerId: trainer.id,
                                  trainerName: trainer.fullName,
                                  action: 'disable',
                                })
                              }
                              className="p-1 text-rose-600 hover:bg-rose-50 rounded-[6px] border border-rose-200 cursor-pointer"
                              title="Disable Account"
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                setDangerModalState({
                                  isOpen: true,
                                  trainerId: trainer.id,
                                  trainerName: trainer.fullName,
                                  action: 'activate',
                                })
                              }
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-[6px] border border-emerald-200 cursor-pointer"
                              title="Activate Account"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
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

      {/* Danger Confirm Modal */}
      <DangerConfirmModal
        isOpen={dangerModalState.isOpen}
        onClose={() => setDangerModalState({ isOpen: false, trainerId: null, trainerName: '', action: 'disable' })}
        onConfirm={confirmDangerAction}
        title={`${dangerModalState.action === 'disable' ? 'Disable' : 'Activate'} Coach ${dangerModalState.trainerName}?`}
        message={`Are you sure you want to ${dangerModalState.action === 'disable' ? 'disable access for' : 're-activate'} coach ${dangerModalState.trainerName}?`}
        confirmText={dangerModalState.action === 'disable' ? 'Disable Account' : 'Activate Account'}
      />

      {/* Invite Coach Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Onboard Professional Coach"
      >
        <form onSubmit={handleInviteSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-[10px] bg-slate-50 text-slate-900"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-[10px] bg-slate-50 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Specializations (Comma separated)</label>
              <input
                type="text"
                value={formData.specializations}
                onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-[10px] bg-slate-50 text-slate-900"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Monthly Pricing (₹)</label>
              <input
                type="number"
                value={formData.pricingMonthly}
                onChange={(e) => setFormData({ ...formData, pricingMonthly: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-[10px] bg-slate-50 text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowInviteModal(false)}
              className="px-4 py-2 rounded-[10px] font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#a73827] text-white rounded-[10px] font-bold shadow-2xs hover:bg-[#8f2f20] cursor-pointer"
            >
              Save Coach Profile
            </button>
          </div>
        </form>
      </Modal>

      {/* Trainer Detail Modal */}
      {selectedTrainerDetail && (
        <Modal
          isOpen={!!selectedTrainerDetail}
          onClose={() => setSelectedTrainerDetail(null)}
          title={`Coach Profile: ${selectedTrainerDetail.fullName}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <img
                src={selectedTrainerDetail.avatarUrl}
                alt={selectedTrainerDetail.fullName}
                className="w-14 h-14 rounded-[8px] object-cover border border-slate-200"
              />
              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedTrainerDetail.fullName}</h3>
                <p className="text-slate-500 font-mono">{selectedTrainerDetail.email}</p>
                <p className="text-[#a73827] font-semibold mt-0.5">{selectedTrainerDetail.title}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-[8px] border border-slate-200 space-y-1.5">
              <p><strong>Workplace:</strong> {selectedTrainerDetail.workplace}</p>
              <p><strong>Specializations:</strong> {selectedTrainerDetail.specializations?.join(', ')}</p>
              <p><strong>Certifications:</strong> {selectedTrainerDetail.certifications?.join(', ')}</p>
              <p><strong>Bio:</strong> {selectedTrainerDetail.bio}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
