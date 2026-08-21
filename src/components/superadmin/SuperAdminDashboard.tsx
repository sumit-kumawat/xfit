import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  CreditCard,
  Users,
  Dumbbell,
  Activity,
  HardDrive,
  Cpu,
  Download,
  AlertTriangle,
  UserPlus,
  RefreshCw,
  Zap,
} from 'lucide-react';

export const SuperAdminDashboard: React.FC = () => {
  const { trainers, customers, payments, systemLogs, showToast, setActiveView } = useApp();

  const activeTrainersCount = trainers.filter((t) => t.status === 'active').length;
  const activeMembersCount = customers.filter((c) => c.status === 'active').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">System Overview</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Real-time telemetry and aggregated platform metrics across all gyms.</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-white border border-slate-200 rounded-[10px] px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#a73827]/20 focus:outline-hidden h-[38px] shadow-2xs">
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>Year to Date (FY 2026)</option>
          </select>
          <button
            onClick={() => showToast('Report Exported', 'Telemetry snapshot downloaded as CSV.', 'success')}
            className="bg-white border border-slate-200 rounded-[10px] p-2 text-slate-800 hover:bg-slate-50 h-[38px] w-[38px] flex items-center justify-center shadow-2xs active:scale-95 transition-all cursor-pointer"
            title="Download CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div
          onClick={() => setActiveView('revenue')}
          className="bg-white rounded-[10px] p-5 border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-[#a73827] transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 bg-[#a73827]/10 rounded-[10px] text-[#a73827]">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-[6px] border border-emerald-200">
              <TrendingUp className="w-3 h-3" /> +14.2%
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Platform MRR</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">₹1.98 Cr</h3>
          </div>
        </div>

        {/* KPI 2 */}
        <div
          onClick={() => setActiveView('members')}
          className="bg-white rounded-[10px] p-5 border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-[#a73827] transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 bg-blue-50 rounded-[10px] text-blue-700">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-[6px] border border-emerald-200">
              <TrendingUp className="w-3 h-3" /> +8.2%
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Memberships</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">38,205</h3>
          </div>
        </div>

        {/* KPI 3 */}
        <div
          onClick={() => setActiveView('members')}
          className="bg-white rounded-[10px] p-5 border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-[#a73827] transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 bg-slate-100 rounded-[10px] text-slate-700">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-[6px] border border-slate-200">
              +2.1%
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Clients</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">45,892</h3>
          </div>
        </div>

        {/* KPI 4 */}
        <div
          onClick={() => setActiveView('trainers')}
          className="bg-white rounded-[10px] p-5 border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-[#a73827] transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 bg-slate-100 rounded-[10px] text-[#a73827]">
              <Dumbbell className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-[6px] border border-emerald-200">
              <TrendingUp className="w-3 h-3" /> +5.4%
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Certified Coaches</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">1,248</h3>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trends Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-[10px] p-6 border border-slate-200 shadow-2xs flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Revenue Trends (Monthly MRR in ₹)</h3>
              <p className="text-xs text-slate-400">Total gross revenue across all multi-tenant fitness hubs</p>
            </div>
            <span className="text-xs font-bold text-[#a73827] bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-[6px]">
              2026 Fiscal
            </span>
          </div>

          {/* Bar Visualization */}
          <div className="flex-1 flex items-end justify-between gap-2 pt-6 pb-2 min-h-[220px]">
            {[
              { m: 'Jan', v: 12.5 },
              { m: 'Feb', v: 13.8 },
              { m: 'Mar', v: 15.2 },
              { m: 'Apr', v: 14.6 },
              { m: 'May', v: 16.0 },
              { m: 'Jun', v: 17.5 },
              { m: 'Jul', v: 17.1 },
              { m: 'Aug', v: 19.2 },
              { m: 'Sep', v: 20.8 },
              { m: 'Oct', v: 20.0 },
              { m: 'Nov', v: 21.7 },
              { m: 'Dec', v: 24.5 },
            ].map((bar, i) => (
              <div key={bar.m} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="relative w-full flex justify-center items-end h-40">
                  <div
                    style={{ height: `${(bar.v / 25) * 100}%` }}
                    className={`w-full max-w-[28px] rounded-t-[6px] transition-all group-hover:opacity-90 ${
                      i === 11 ? 'bg-[#a73827]' : 'bg-[#f9745d]'
                    }`}
                  />
                  <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded-[4px] pointer-events-none whitespace-nowrap z-10 font-mono">
                    ₹{bar.v}L
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-400">{bar.m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Distribution */}
        <div className="bg-white rounded-[10px] p-6 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-slate-900">Customer Distribution</h3>
            <span className="text-[11px] text-slate-400">By Tier</span>
          </div>

          <div className="flex items-center justify-center relative my-4">
            <div className="w-44 h-44 relative">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#e2e8f0" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#545c86" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset="47.7" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#a73827" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset="155.1" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-900">45.8k</span>
                <span className="text-[11px] text-slate-400 font-medium">Total Clients</span>
              </div>
            </div>
          </div>

          <div className="flex justify-around pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#a73827]" />
              <span className="text-slate-600">Enterprise 35%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#545c86]" />
              <span className="text-slate-600">Pro 45%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="text-slate-600">Basic 20%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Live Feed & System Logs preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Activity Feed */}
        <div className="bg-white rounded-[10px] border border-slate-200 shadow-2xs flex flex-col overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#a73827]" />
              <span>Live Activity Feed</span>
            </h3>
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-[6px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[320px] overflow-y-auto">
            <div className="p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors">
              <div className="p-2 bg-rose-50 text-[#a73827] rounded-[8px] shrink-0 border border-rose-200">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex-1 text-xs">
                <p className="text-slate-900 font-medium">
                  <strong>System Alert:</strong> High API throughput handled by load balancer. Zero drops.
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block font-mono">2 mins ago</span>
              </div>
            </div>

            <div className="p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors">
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-[8px] shrink-0 border border-emerald-200">
                <UserPlus className="w-4 h-4" />
              </div>
              <div className="flex-1 text-xs">
                <p className="text-slate-900 font-medium">
                  <strong>New Coach Onboarded:</strong> Coach Sarah Jenkins registered 142 members to Elite Hub.
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block font-mono">15 mins ago</span>
              </div>
            </div>

            <div className="p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors">
              <div className="p-2 bg-blue-50 text-blue-700 rounded-[8px] shrink-0 border border-blue-200">
                <CreditCard className="w-4 h-4" />
              </div>
              <div className="flex-1 text-xs">
                <p className="text-slate-900 font-medium">
                  <strong>Payout Settlement:</strong> Processed ₹48,000 monthly coach payout via UPI / IMPS.
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block font-mono">1 hour ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Telemetry & Cluster State */}
        <div className="bg-white rounded-[10px] border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#a73827]" />
              <span>Multi-Tenant Cluster Health</span>
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-[6px]">
              100% Operational
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-[10px] border border-slate-200">
              <span className="text-slate-500 font-medium block">Database Latency</span>
              <span className="text-base font-extrabold text-slate-900 mt-0.5 block">2.4 ms</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-[10px] border border-slate-200">
              <span className="text-slate-500 font-medium block">Active API Sockets</span>
              <span className="text-base font-extrabold text-slate-900 mt-0.5 block">1,842 Live</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-[10px] border border-slate-200">
              <span className="text-slate-500 font-medium block">Edge Cache Hit Ratio</span>
              <span className="text-base font-extrabold text-emerald-700 mt-0.5 block">99.4%</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-[10px] border border-slate-200">
              <span className="text-slate-500 font-medium block">Default Platform Currency</span>
              <span className="text-base font-extrabold text-[#a73827] mt-0.5 block">₹ INR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
