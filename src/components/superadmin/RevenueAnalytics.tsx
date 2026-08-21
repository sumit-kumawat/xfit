import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  CreditCard,
  Users,
  Clock,
  ArrowUpRight,
  CheckCircle,
  AlertCircle,
  Plus,
  Zap,
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const RevenueAnalytics: React.FC = () => {
  const { payments, payouts, processPayout, processAllPayouts, recordPayment, showToast, customers } = useApp();
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);
  const [newPay, setNewPay] = useState({
    customerId: customers[0]?.id || '',
    amount: 3499.0,
    planName: 'Elite Transformation (Pro Tier)',
    method: 'Credit Card / UPI',
  });

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === newPay.customerId) || customers[0];
    recordPayment({
      customerId: cust.id,
      customerName: cust.fullName,
      amount: Number(newPay.amount),
      currency: 'INR',
      planName: newPay.planName,
      method: newPay.method as any,
      status: 'Completed',
    });
    setShowRecordPaymentModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Revenue & Invoicing Engine</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Platform MRR growth, automated GST invoices, and coach settlements in INR (₹).</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRecordPaymentModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#a73827] hover:bg-[#8f2f20] text-white rounded-[10px] text-xs font-bold shadow-2xs active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record Manual Transaction</span>
          </button>
        </div>
      </div>

      {/* KPI Cards in INR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-[10px] border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly MRR</span>
            <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-[6px] border border-emerald-200">
              <TrendingUp className="w-3 h-3" /> +14.2%
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">₹24.8 Lakhs</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">vs ₹21.6L last month</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[10px] border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Members</span>
            <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-[6px] border border-emerald-200">
              <TrendingUp className="w-3 h-3" /> +5.8%
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">2,845</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Paying subscribers</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[10px] border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">ARPU (Average Ticket)</span>
            <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-[6px] border border-emerald-200">
              <TrendingUp className="w-3 h-3" /> +2.1%
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">₹3,499</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Per client average</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[10px] border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Payouts</span>
            <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-[6px]">
              Settlement Ready
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">₹1,11,500</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">To 3 coaching accounts</p>
          </div>
        </div>
      </div>

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MRR Growth Chart */}
        <div className="lg:col-span-2 bg-white rounded-[10px] p-6 border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">MRR Growth Trajectory (in Lakhs ₹)</h3>
              <p className="text-xs text-slate-400">Monthly recurring gross run-rate</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-[6px]">
              Annual Target: ₹3.0 Cr
            </span>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2">
            {[
              { month: 'Oct', val: 16.5 },
              { month: 'Nov', val: 18.2 },
              { month: 'Dec', val: 20.0 },
              { month: 'Jan', val: 21.6 },
              { month: 'Feb', val: 23.4 },
              { month: 'Mar', val: 24.8 },
            ].map((pt, idx) => (
              <div key={pt.month} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="relative w-full flex justify-center items-end h-36">
                  <div
                    style={{ height: `${(pt.val / 30) * 100}%` }}
                    className={`w-full max-w-[36px] rounded-t-[6px] transition-all ${
                      idx === 5 ? 'bg-[#a73827]' : 'bg-[#545c86]'
                    }`}
                  />
                  <span className="absolute -top-6 text-[10px] font-bold text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                    ₹{pt.val}L
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-400">{pt.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by Tier */}
        <div className="bg-white rounded-[10px] p-6 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-slate-900">Revenue by Plan</h3>
            <span className="text-[11px] text-slate-400">Active</span>
          </div>

          <div className="space-y-4 my-2">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Enterprise Pro Tier</span>
                <span className="text-[#a73827]">₹11.16L (45%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#a73827] h-full rounded-full" style={{ width: '45%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Coaching Plus</span>
                <span className="text-[#545c86]">₹8.68L (35%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#545c86] h-full rounded-full" style={{ width: '35%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Standard Membership</span>
                <span className="text-slate-500">₹4.96L (20%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-slate-300 h-full rounded-full" style={{ width: '20%' }} />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Billing cycle: 1st of month</span>
            <span className="text-emerald-700 font-bold">Razorpay / Stripe Active</span>
          </div>
        </div>
      </div>

      {/* Tables Row: Recent Transactions & Trainer Payouts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-[10px] border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#a73827]" />
              <span>Recent Transactions (₹ INR)</span>
            </h3>
            <span className="text-xs text-slate-400">Live Invoices</span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[300px]">
            {payments.map((tx) => (
              <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <img
                    src={tx.customerAvatar}
                    alt={tx.customerName}
                    className="w-9 h-9 rounded-[10px] object-cover border border-slate-200"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{tx.customerName}</p>
                    <p className="text-[10px] text-slate-400">{tx.planName} • {tx.transactionId}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-black text-slate-900">₹{tx.amount.toLocaleString('en-IN')}</p>
                  <span
                    className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-[6px] border ${
                      tx.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : tx.status === 'Pending'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trainer Payouts Queue */}
        <div className="bg-white rounded-[10px] border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="font-extrabold text-sm text-[#006b5d]">₹</span>
              <span>Trainer Payouts Due (₹ INR)</span>
            </h3>
            <button
              onClick={processAllPayouts}
              className="text-xs font-bold text-[#a73827] hover:text-[#8f2f20] bg-rose-50 border border-rose-200 px-3 py-1 rounded-[8px] transition-colors cursor-pointer"
            >
              Process All Payouts
            </button>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[300px]">
            {payouts.map((po) => (
              <div key={po.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <img
                    src={po.trainerAvatar}
                    alt={po.trainerName}
                    className="w-9 h-9 rounded-[10px] object-cover border border-slate-200"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{po.trainerName}</p>
                    <p className="text-[10px] text-slate-400">{po.trainerSpecialty} • {po.sessions} sessions</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-900">₹{po.amountDue.toLocaleString('en-IN')}</p>
                    <span className="text-[10px] text-slate-400">Due {po.nextCycleDate}</span>
                  </div>

                  {po.status === 'Pending' ? (
                    <button
                      onClick={() => processPayout(po.id)}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-[8px] text-xs font-bold transition-colors cursor-pointer"
                    >
                      Process
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Settled
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Manual Payment Entry Modal */}
      <Modal
        isOpen={showRecordPaymentModal}
        onClose={() => setShowRecordPaymentModal(false)}
        title="Record Customer Transaction"
        subtitle="Manually create a payment receipt or invoice in INR (₹)"
        maxWidth="md"
      >
        <form onSubmit={handleRecordPaymentSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Customer</label>
            <select
              value={newPay.customerId}
              onChange={(e) => setNewPay({ ...newPay, customerId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-[10px] text-xs focus:ring-2 focus:ring-[#a73827]/20 focus:outline-hidden h-[38px] bg-white"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName} ({c.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Amount (₹ INR)</label>
            <input
              type="number"
              step="1"
              required
              value={newPay.amount}
              onChange={(e) => setNewPay({ ...newPay, amount: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-200 rounded-[10px] text-xs focus:ring-2 focus:ring-[#a73827]/20 focus:outline-hidden h-[38px]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Plan / Description</label>
            <input
              type="text"
              value={newPay.planName}
              onChange={(e) => setNewPay({ ...newPay, planName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-[10px] text-xs focus:ring-2 focus:ring-[#a73827]/20 focus:outline-hidden h-[38px]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Payment Gateway / Method</label>
            <select
              value={newPay.method}
              onChange={(e) => setNewPay({ ...newPay, method: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-[10px] text-xs focus:ring-2 focus:ring-[#a73827]/20 focus:outline-hidden h-[38px] bg-white"
            >
              <option value="UPI / Razorpay">UPI / Razorpay (Instant)</option>
              <option value="Credit Card">Credit Card (Stripe India)</option>
              <option value="Bank Transfer">NEFT / IMPS NetBanking</option>
              <option value="Cash">Cash / POS Terminal</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowRecordPaymentModal(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-[10px] font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#a73827] hover:bg-[#8f2f20] text-white rounded-[10px] font-bold shadow-2xs cursor-pointer"
            >
              Record Payment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
