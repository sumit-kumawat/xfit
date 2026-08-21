import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentTransaction } from '../../types';
import {
  CreditCard,
  Download,
  CheckCircle,
  Calendar,
  ShieldCheck,
  Zap,
  Printer,
  FileText,
} from 'lucide-react';
import { PrintDocumentModal } from '../common/PrintDocumentModal';

export const CustomerBillingView: React.FC = () => {
  const { payments, activeCustomer, activeTrainer, showToast } = useApp();
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentTransaction | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const customerPayments = payments.filter((p) => p.customerId === activeCustomer.id);

  const handleOpenReceipt = (payment: PaymentTransaction) => {
    setSelectedReceipt(payment);
    setIsPrintModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Membership & Billing</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your subscription tier, billing receipts, and payment method in INR (₹).
        </p>
      </div>

      {/* Active Plan Card */}
      <div className="bg-white rounded-[10px] p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#a73827] uppercase tracking-wider">Current Membership</span>
              <span className="px-2 py-0.5 rounded-[6px] text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                ACTIVE
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
              {activeCustomer.tier} Coaching Package
            </h2>
            <p className="text-xs text-slate-500">
              Assigned Coach: <span className="font-semibold text-slate-700">{activeTrainer.fullName}</span> • Billed monthly
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-2xl font-black text-slate-900">₹3,499.00</span>
            <span className="text-xs text-slate-400 block font-normal">Renews Feb 28, 2026</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-[10px] border border-slate-200 flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-slate-600 shrink-0" />
            <div>
              <p className="font-bold text-slate-900">UPI / RuPay •••• 4242</p>
              <p className="text-[11px] text-slate-500">Autopay Active via Razorpay</p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-[10px] border border-slate-200 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <p className="font-bold text-slate-900">256-Bit SSL Encrypted</p>
              <p className="text-[11px] text-slate-500">Official GST Compliant Billing</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => showToast('Payment Method', 'Redirecting to Razorpay payment method updater...', 'info')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-[10px] text-xs font-semibold cursor-pointer transition-colors"
          >
            Update Payment Method
          </button>
        </div>
      </div>

      {/* Invoice History Table */}
      <div className="bg-white rounded-[10px] border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Payment Receipts & Tax Invoices</h3>
            <p className="text-[11px] text-slate-500">Download official PDF receipts for reimbursement and records.</p>
          </div>
          <span className="text-xs font-medium text-slate-500">{customerPayments.length} Total Receipts</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {customerPayments.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No payment receipts found.</div>
          ) : (
            customerPayments.map((p) => (
              <div key={p.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-900">{p.planName}</p>
                    <span className="px-2 py-0.5 rounded-[6px] text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {p.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {p.date} • Ref: {p.transactionId} • Invoice: {p.invoiceNumber}
                  </p>
                </div>

                <div className="flex items-center gap-4 justify-between sm:justify-end">
                  <div className="text-left sm:text-right">
                    <p className="font-black text-slate-900 text-sm">
                      ₹{p.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                    <span className="text-[10px] text-slate-400">Incl. 18% GST</span>
                  </div>

                  <button
                    onClick={() => handleOpenReceipt(p)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-[#a73827] text-slate-700 hover:text-[#a73827] rounded-[8px] text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View / PDF</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Print / Export Receipt Lightbox */}
      {selectedReceipt && (
        <PrintDocumentModal
          isOpen={isPrintModalOpen}
          onClose={() => {
            setIsPrintModalOpen(false);
            setSelectedReceipt(null);
          }}
          documentType="payment_receipt"
          data={{
            payment: selectedReceipt,
            customer: activeCustomer,
            trainer: activeTrainer,
          }}
        />
      )}
    </div>
  );
};
