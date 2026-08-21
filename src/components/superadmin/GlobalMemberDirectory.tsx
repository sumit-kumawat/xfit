import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomerProfile } from '../../types';
import {
  Users,
  CheckCircle,
  Clock,
  AlertOctagon,
  ChevronRight,
  Search,
  Eye,
  Calendar,
  Weight,
  Activity,
  HeartPulse,
  Ban,
  Trash2,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { DangerConfirmModal } from '../common/DangerConfirmModal';

export const GlobalMemberDirectory: React.FC = () => {
  const { customers, trainers, toggleCustomerStatus, showToast } = useApp();

  const [tierFilter, setTierFilter] = useState<'All' | 'Enterprise' | 'Pro' | 'Basic'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);

  // Danger Confirm Modal state
  const [dangerModalState, setDangerModalState] = useState<{
    isOpen: boolean;
    customerId: string | null;
    customerName: string;
    action: 'suspend' | 'activate';
  }>({
    isOpen: false,
    customerId: null,
    customerName: '',
    action: 'suspend',
  });

  const activeCount = customers.filter((c) => c.status === 'active').length;
  const pendingCount = customers.filter((c) => c.status === 'pending').length;
  const expiredCount = customers.filter((c) => c.status === 'expired' || c.status === 'suspended').length;

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === 'All' || c.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  const getTrainerInfo = (trainerId: string) => {
    const t = trainers.find((tr) => tr.id === trainerId);
    if (!t) return { name: 'Unassigned', initials: 'UA' };
    const initials = t.fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
    return { name: t.fullName, initials };
  };

  const confirmDangerAction = () => {
    if (!dangerModalState.customerId) return;
    toggleCustomerStatus(
      dangerModalState.customerId,
      dangerModalState.action === 'suspend' ? 'suspended' : 'active'
    );
    setDangerModalState({ isOpen: false, customerId: null, customerName: '', action: 'suspend' });
    showToast(
      'Status Updated',
      `Client membership ${dangerModalState.action === 'suspend' ? 'suspended' : 'activated'}.`,
      'info'
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200 pb-16">
      {/* Page Title */}
      <div className="bg-white p-5 rounded-[10px] border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Global Member Directory</h1>
          <p className="text-xs text-slate-500 mt-1">Cross-tenant visibility into all registered fitness clients and memberships.</p>
        </div>
        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-[8px] text-xs font-bold font-mono">
          {customers.length} Enrolled Clients
        </span>
      </div>

      {/* Summary Bento */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white p-4 rounded-[10px] border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Members</p>
          <p className="text-xl font-black text-slate-900 mt-1 font-mono">{customers.length}</p>
        </div>

        <div className="bg-white p-4 rounded-[10px] border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Active</p>
          <p className="text-xl font-black text-emerald-700 mt-1 font-mono">{activeCount}</p>
        </div>

        <div className="bg-white p-4 rounded-[10px] border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Pending Review</p>
          <p className="text-xl font-black text-blue-700 mt-1 font-mono">{pendingCount}</p>
        </div>

        <div className="bg-white p-4 rounded-[10px] border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Expired / Inactive</p>
          <p className="text-xl font-black text-rose-700 mt-1 font-mono">{expiredCount}</p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-[10px] p-4 border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by member name, email or ID..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-[10px] text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#a73827]/20 focus:border-[#a73827]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {(['All', 'Enterprise', 'Pro', 'Basic'] as const).map((tier) => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`px-3 py-1.5 rounded-[8px] text-xs font-bold transition-all cursor-pointer ${
                tierFilter === tier
                  ? 'bg-[#a73827] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[10px] border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Tier</th>
                <th className="py-3 px-3">Assigned Coach</th>
                <th className="py-3 px-3">Biometrics</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No members found matching your search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const trainer = getTrainerInfo(cust.assignedTrainerId);
                  const isActive = cust.status === 'active';
                  return (
                    <tr key={cust.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={cust.avatarUrl}
                            alt={cust.fullName}
                            className="w-9 h-9 rounded-[8px] object-cover border border-slate-200"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{cust.fullName}</span>
                            <span className="text-[11px] text-slate-500 font-mono">{cust.email}</span>
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
                          {cust.status}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-slate-100 text-slate-700">
                          {cust.tier}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-slate-800 font-medium">{trainer.name}</span>
                      </td>

                      <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                        {cust.currentWeightLbs} lbs • BMI {cust.currentBmi}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedCustomer(cust)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-[6px] text-xs font-bold cursor-pointer"
                          >
                            Dossier
                          </button>

                          {isActive ? (
                            <button
                              onClick={() =>
                                setDangerModalState({
                                  isOpen: true,
                                  customerId: cust.id,
                                  customerName: cust.fullName,
                                  action: 'suspend',
                                })
                              }
                              className="p-1 text-rose-600 hover:bg-rose-50 rounded-[6px] border border-rose-200 cursor-pointer"
                              title="Suspend Membership"
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                setDangerModalState({
                                  isOpen: true,
                                  customerId: cust.id,
                                  customerName: cust.fullName,
                                  action: 'activate',
                                })
                              }
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-[6px] border border-emerald-200 cursor-pointer"
                              title="Activate Membership"
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
        onClose={() => setDangerModalState({ isOpen: false, customerId: null, customerName: '', action: 'suspend' })}
        onConfirm={confirmDangerAction}
        title={`${dangerModalState.action === 'suspend' ? 'Suspend' : 'Activate'} Member ${dangerModalState.customerName}?`}
        message={`Are you sure you want to ${dangerModalState.action === 'suspend' ? 'suspend gym access and active coaching for' : 're-activate membership for'} ${dangerModalState.customerName}?`}
        confirmText={dangerModalState.action === 'suspend' ? 'Suspend Membership' : 'Activate Membership'}
      />

      {/* Customer Detail Dossier */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={`Member File: ${selectedCustomer.fullName}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <img
                src={selectedCustomer.avatarUrl}
                alt={selectedCustomer.fullName}
                className="w-14 h-14 rounded-[8px] object-cover border border-slate-200"
              />
              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedCustomer.fullName}</h3>
                <p className="text-slate-500 font-mono">{selectedCustomer.email}</p>
                <p className="text-[#a73827] font-semibold mt-0.5">{selectedCustomer.tier} Tier • Joined: {selectedCustomer.joinDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-[8px] border border-slate-200 font-mono">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-sans">Current Weight</span>
                <strong className="text-slate-900">{selectedCustomer.currentWeightLbs} lbs</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-sans">Target Goal</span>
                <strong className="text-slate-900">{selectedCustomer.goalWeightLbs} lbs</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-sans">Height</span>
                <strong className="text-slate-900">{selectedCustomer.heightCm} cm</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-sans">Calculated BMI</span>
                <strong className="text-slate-900">{selectedCustomer.currentBmi} ({selectedCustomer.bmiCategory})</strong>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
