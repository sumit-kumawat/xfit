import React from 'react';
import { Printer, Download, X, ShieldCheck, CheckCircle2 } from 'lucide-react';
import {
  CustomerProfile,
  TrainerProfile,
  PaymentTransaction,
  DietPlan,
  WorkoutPlan,
} from '../../types';

export type PrintableDocumentType =
  | 'payment_receipt'
  | 'nutrition_plan'
  | 'meal_plan'
  | 'weekly_tracker'
  | 'monthly_tracker';

interface PrintDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: PrintableDocumentType;
  title?: string;
  data: {
    payment?: PaymentTransaction;
    customer?: CustomerProfile;
    trainer?: TrainerProfile;
    dietPlan?: DietPlan;
    workoutPlan?: WorkoutPlan;
    tracker?: {
      type: 'weekly' | 'monthly';
      periodLabel: string;
      startDate: string;
      endDate: string;
      startWeightLbs: number;
      currentWeightLbs: number;
      goalWeightLbs: number;
      targetWorkouts: number;
      completedWorkouts: number;
      dailyWaterLiters: number;
      dailySteps: number;
      adherenceRate: number;
      bodyFatPct?: number;
      measurements?: {
        waistInches?: number;
        chestInches?: number;
        armsInches?: number;
        hipsInches?: number;
        thighsInches?: number;
      };
      trainerFeedback?: string;
    };
  };
}

export const PrintDocumentModal: React.FC<PrintDocumentModalProps> = ({
  isOpen,
  onClose,
  documentType,
  data,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const renderContent = () => {
    switch (documentType) {
      case 'payment_receipt': {
        const p = data.payment;
        const cust = data.customer;
        const tr = data.trainer;
        const subtotal = p ? p.amount / 1.18 : 2965.25;
        const gst = p ? p.amount - subtotal : 533.75;
        const total = p ? p.amount : 3499.0;

        return (
          <div className="space-y-6 text-slate-900 printable-document">
            {/* Invoice Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-[8px] bg-[#a73827] flex items-center justify-center font-black text-white text-base">
                    X
                  </div>
                  <span className="text-2xl font-black tracking-tight text-slate-900">
                    xfit <span className="text-[#a73827]">Enterprise</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  xfit Health & Performance Systems India Pvt. Ltd.
                </p>
                <p className="text-[11px] text-slate-400">
                  GSTIN: 27AABCV1234D1ZP • CIN: U72900MH2025PTC123456
                </p>
              </div>

              <div className="text-right">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-[6px] text-xs font-black uppercase">
                  TAX INVOICE / PAID
                </span>
                <p className="text-xs font-bold text-slate-900 mt-2 font-mono">
                  {p?.invoiceNumber || 'INV-2026-0892'}
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  Date: {p?.date || new Date().toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>

            {/* Billing Addresses */}
            <div className="grid grid-cols-2 gap-6 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-[8px] border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Billed To (Member)
                </p>
                <p className="font-bold text-slate-900 text-sm">{cust?.fullName || p?.customerName || 'Alex Johnson'}</p>
                <p className="text-slate-600">{cust?.email || 'alex.j@example.com'}</p>
                <p className="text-slate-600">{cust?.phone || '+91 98765 43210'}</p>
                <p className="text-[11px] text-slate-500 mt-1">Tier: {cust?.tier || 'Pro'} Member</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-[8px] border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Assigned Coaching Unit
                </p>
                <p className="font-bold text-slate-900 text-sm">{tr?.fullName || 'Coach Sarah Jenkins'}</p>
                <p className="text-slate-600">{tr?.title || 'Senior Performance Specialist'}</p>
                <p className="text-slate-600">Location: Mumbai High-Performance Facility</p>
                <p className="text-[11px] text-slate-500 mt-1">Txn Ref: {p?.transactionId || '#TXN-8921'}</p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-slate-200 rounded-[8px] overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Description</th>
                    <th className="py-2.5 px-4 text-center">HSN/SAC</th>
                    <th className="py-2.5 px-4 text-center">Qty</th>
                    <th className="py-2.5 px-4 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{p?.planName || 'Monthly 1-on-1 Coaching Subscription'}</p>
                      <p className="text-[11px] text-slate-500">
                        Custom workout programming, daily dietary macro coaching & biometric tracker access.
                      </p>
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-slate-600">999723</td>
                    <td className="py-3 px-4 text-center text-slate-800">1 Mo</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      ₹{subtotal.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Calculations & Total */}
            <div className="flex justify-end text-xs">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Taxable Value:</span>
                  <span className="font-mono">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>CGST (9.0%):</span>
                  <span className="font-mono">₹{(gst / 2).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>SGST (9.0%):</span>
                  <span className="font-mono">₹{(gst / 2).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-300 pt-2">
                  <span>Total Paid (INR):</span>
                  <span className="text-[#a73827] font-mono">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Digitally Verified by Razorpay / Stripe Gateway Engine</span>
              </div>
              <span className="font-mono">Computer Generated Official Receipt</span>
            </div>
          </div>
        );
      }

      case 'nutrition_plan':
      case 'meal_plan': {
        const diet = data.dietPlan;
        const cust = data.customer;
        const tr = data.trainer;

        return (
          <div className="space-y-6 text-slate-900 printable-document">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-[8px] bg-[#a73827] flex items-center justify-center font-black text-white text-base">
                    X
                  </div>
                  <span className="text-xl font-black tracking-tight text-slate-900">
                    xfit <span className="text-[#a73827]">Clinical Nutrition Protocol</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {diet?.title || 'Precision Macronutrient & Meal Timing Blueprint'}
                </p>
              </div>

              <div className="text-right text-xs">
                <span className="px-2.5 py-0.5 rounded-[6px] text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ACTIVE PROTOCOL
                </span>
                <p className="text-slate-500 mt-1 font-mono">Prescribed: {new Date().toLocaleDateString('en-IN')}</p>
              </div>
            </div>

            {/* Profile & Coach Badge */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-[8px] border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Member Profile</p>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{cust?.fullName || 'Alex Johnson'}</p>
                <p className="text-slate-600">Weight: {cust?.currentWeightKg || 78} kg ({cust?.currentWeightLbs || 172} lbs) • BMI: {cust?.currentBmi || 24.6}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-[8px] border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prescribing Coach</p>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{tr?.fullName || 'Sarah Jenkins'}</p>
                <p className="text-slate-600">Specialization: {tr?.dietExpertise || 'Precision Sports Nutrition'}</p>
              </div>
            </div>

            {/* Macro Targets Box */}
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-100 rounded-[8px] border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Daily Calories</span>
                <p className="text-xl font-black text-slate-900 mt-0.5">{diet?.dailyCalories || 2450} kcal</p>
              </div>
              <div className="p-3 bg-rose-50 rounded-[8px] border border-rose-200">
                <span className="text-[10px] font-bold text-rose-700 uppercase">Protein</span>
                <p className="text-xl font-black text-rose-700 mt-0.5">{diet?.targetProteinG || 180}g</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-[8px] border border-blue-200">
                <span className="text-[10px] font-bold text-blue-700 uppercase">Carbohydrates</span>
                <p className="text-xl font-black text-blue-700 mt-0.5">{diet?.targetCarbsG || 250}g</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-[8px] border border-amber-200">
                <span className="text-[10px] font-bold text-amber-700 uppercase">Fats</span>
                <p className="text-xl font-black text-amber-700 mt-0.5">{diet?.targetFatsG || 65}g</p>
              </div>
            </div>

            {/* Meal Windows & Structured Bullet Items */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
                Meal Windows & Structured Nutritional Items
              </h4>

              <div className="space-y-3 text-xs">
                {diet?.meals?.map((meal, idx) => (
                  <div key={meal.id || idx} className="p-3.5 bg-slate-50 rounded-[8px] border border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">
                          {meal.timeStr} • {meal.mealType}: {meal.name}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-slate-700 text-[11px]">
                        {meal.calories} kcal (P: {meal.proteinG}g | C: {meal.carbsG}g | F: {meal.fatsG}g)
                      </span>
                    </div>

                    {/* Standard Bullet List of Meal Items */}
                    <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
                      {meal.items && meal.items.length > 0 ? (
                        meal.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="leading-relaxed">
                            <span className="font-medium text-slate-900">{item.name}</span>
                            <span className="text-slate-500 font-mono ml-1.5">[{item.quantity}]</span>
                            {item.calories && (
                              <span className="text-slate-400 text-[10px] ml-1">({item.calories} kcal)</span>
                            )}
                          </li>
                        ))
                      ) : (
                        <li className="text-slate-500 italic">Standard portion matching macro targets.</li>
                      )}
                    </ul>

                    {meal.instructions && (
                      <p className="text-[11px] text-slate-500 mt-2 italic bg-white p-2 rounded-[6px] border border-slate-200">
                        Note: {meal.instructions}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Coach Clinical Notes */}
            {diet?.trainerNotes && (
              <div className="p-3 bg-amber-50 rounded-[8px] border border-amber-200 text-xs">
                <p className="font-bold text-amber-900">Coach Instructions & Hydration Protocol:</p>
                <p className="text-amber-800 mt-1 leading-relaxed">{diet.trainerNotes}</p>
              </div>
            )}
          </div>
        );
      }

      case 'weekly_tracker':
      case 'monthly_tracker': {
        const tracker = data.tracker || {
          type: 'weekly',
          periodLabel: 'Week 3 Check-in (Feb 16 - Feb 22, 2026)',
          startDate: '2026-02-16',
          endDate: '2026-02-22',
          startWeightLbs: 178.0,
          currentWeightLbs: 172.0,
          goalWeightLbs: 165.0,
          targetWorkouts: 4,
          completedWorkouts: 4,
          dailyWaterLiters: 3.5,
          dailySteps: 10500,
          adherenceRate: 94,
          bodyFatPct: 15.8,
          measurements: {
            waistInches: 28.5,
            chestInches: 34.0,
            armsInches: 14.5,
            hipsInches: 38.0,
          },
          trainerFeedback:
            'Outstanding adherence on both resistance splits and carbohydrate cycling. Waist decreased by 0.7 inches while maintaining compound pressing strength.',
        };
        const cust = data.customer;
        const tr = data.trainer;

        return (
          <div className="space-y-6 text-slate-900 printable-document">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-[8px] bg-[#a73827] flex items-center justify-center font-black text-white text-base">
                    X
                  </div>
                  <span className="text-xl font-black tracking-tight text-slate-900">
                    xfit <span className="text-[#a73827]">
                      {tracker.type === 'weekly' ? 'Weekly Milestone Review' : 'Monthly Performance Review'}
                    </span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">{tracker.periodLabel}</p>
              </div>

              <div className="text-right text-xs">
                <span className="px-2.5 py-0.5 rounded-[6px] text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ADHERENCE: {tracker.adherenceRate}%
                </span>
                <p className="text-slate-500 mt-1 font-mono">Date: {new Date().toLocaleDateString('en-IN')}</p>
              </div>
            </div>

            {/* Member & Coach Meta */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-[8px] border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Member Details</p>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{cust?.fullName || 'Alex Johnson'}</p>
                <p className="text-slate-600">
                  Weight: {tracker.currentWeightLbs} lbs (Delta: -{(tracker.startWeightLbs - tracker.currentWeightLbs).toFixed(1)} lbs)
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-[8px] border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reviewing Coach</p>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{tr?.fullName || 'Coach Sarah Jenkins'}</p>
                <p className="text-slate-600">Status: Signed Off & Validated</p>
              </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-4 gap-3 text-center text-xs">
              <div className="p-3 bg-slate-100 rounded-[8px] border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Workouts Done</span>
                <p className="text-xl font-black text-slate-900 mt-0.5">
                  {tracker.completedWorkouts} / {tracker.targetWorkouts}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-[8px] border border-blue-200">
                <span className="text-[10px] font-bold text-blue-700 uppercase">Daily Hydration</span>
                <p className="text-xl font-black text-blue-700 mt-0.5">{tracker.dailyWaterLiters} Liters</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-[8px] border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Avg Daily Steps</span>
                <p className="text-xl font-black text-emerald-700 mt-0.5">{tracker.dailySteps.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-rose-50 rounded-[8px] border border-rose-200">
                <span className="text-[10px] font-bold text-rose-700 uppercase">Est Body Fat</span>
                <p className="text-xl font-black text-rose-700 mt-0.5">{tracker.bodyFatPct || 15.8}%</p>
              </div>
            </div>

            {/* Measurements Table */}
            {tracker.measurements && (
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Body Circumferences & Metrics
                </h4>
                <div className="grid grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-[8px] border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Waist</span>
                    <p className="font-bold text-slate-900 mt-0.5">{tracker.measurements.waistInches}"</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-[8px] border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Chest</span>
                    <p className="font-bold text-slate-900 mt-0.5">{tracker.measurements.chestInches}"</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-[8px] border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Arms</span>
                    <p className="font-bold text-slate-900 mt-0.5">{tracker.measurements.armsInches}"</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-[8px] border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Hips</span>
                    <p className="font-bold text-slate-900 mt-0.5">{tracker.measurements.hipsInches}"</p>
                  </div>
                </div>
              </div>
            )}

            {/* Coach Clinical Evaluation */}
            <div className="p-4 bg-slate-50 rounded-[8px] border border-slate-200 text-xs">
              <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
                Coach Assessment & Next Period Objectives
              </p>
              <p className="text-slate-700 leading-relaxed">{tracker.trainerFeedback}</p>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500">
              <span>xfit Certified Clinical Coaching Protocol</span>
              <span className="font-mono">Progress Milestone Document</span>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative bg-white rounded-[10px] shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col z-10 animate-in zoom-in-95 duration-150 overflow-hidden"
      >
        {/* Top Control Bar (Hidden during actual print) */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between no-print">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Document Export & Print Preview</h3>
            <p className="text-[11px] text-slate-500">
              Official branded format for PDF download and printing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#a73827] hover:bg-[#8f2f20] text-white rounded-[10px] text-xs font-bold shadow-2xs active:scale-95 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-[8px] transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Printable View Container */}
        <div className="p-6 sm:p-8 overflow-y-auto max-h-[calc(90vh-80px)] bg-white printable-body">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
