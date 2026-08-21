import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Terminal,
  Activity,
  ShieldAlert,
  Download,
  Trash2,
  Pause,
  Play,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Search,
} from 'lucide-react';

export const SystemLogsView: React.FC = () => {
  const { systemLogs, addSystemLog, showToast } = useApp();
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CRIT' | 'WARN' | 'INFO' | 'AUTH' | 'DB'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPaused, setIsPaused] = useState(false);

  // Periodic heartbeat log simulation if not paused
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      const services = ['AUTH_SVC', 'BILLING_SVC', 'CRON_SVC', 'DB_CLUSTER', 'PAY_GW'];
      const randomService = services[Math.floor(Math.random() * services.length)];
      const sampleMessages = [
        'Tenant API health check response OK (200).',
        'Redis cache eviction cycle completed (14ms).',
        'Customer workout progress telemetry synchronized.',
        'Razorpay / Stripe webhook signature verified successfully.',
        'Diet plan macro recalculation complete for active clients.',
      ];
      const randomMsg = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
      addSystemLog('INFO', randomService as any, randomMsg);
    }, 12000);

    return () => clearInterval(timer);
  }, [isPaused, addSystemLog]);

  const filteredLogs = systemLogs.filter((log) => {
    if (activeFilter === 'CRIT' && log.level !== 'CRIT') return false;
    if (activeFilter === 'WARN' && log.level !== 'WARN') return false;
    if (activeFilter === 'INFO' && log.level !== 'INFO') return false;
    if (activeFilter === 'AUTH' && log.service !== 'AUTH_SVC') return false;
    if (activeFilter === 'DB' && log.service !== 'DB_CLUSTER') return false;

    if (searchQuery) {
      return (
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ip?.includes(searchQuery)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">System Logs & Security Audit</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time security telemetry, multi-tenant database replication logs, and authentication events.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-xs font-semibold border transition-all cursor-pointer ${
              isPaused ? 'bg-amber-50 text-amber-900 border-amber-300' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'Resume Stream' : 'Pause Stream'}</span>
          </button>
          <button
            onClick={() => showToast('Logs Exported', 'Audit trail exported as raw log file.', 'success')}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-[10px] text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Health Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-[10px] border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Platform Health</span>
            <p className="text-xl font-black text-emerald-700 mt-0.5">99.98% Uptime</p>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-500/40" />
        </div>

        <div className="bg-white p-4 rounded-[10px] border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Event Throughput</span>
            <p className="text-xl font-black text-slate-900 mt-0.5">10.4k / hour</p>
          </div>
          <Activity className="w-8 h-8 text-slate-400" />
        </div>

        <div className="bg-white p-4 rounded-[10px] border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Average Latency</span>
            <p className="text-xl font-black text-[#a73827] mt-0.5">2.4ms DB Pool</p>
          </div>
          <Terminal className="w-8 h-8 text-[#a73827]/40" />
        </div>
      </div>

      {/* Controls & Filter Pills */}
      <div className="bg-white rounded-[10px] p-4 border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
          {(['ALL', 'CRIT', 'WARN', 'INFO', 'AUTH', 'DB'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setActiveFilter(lvl)}
              className={`px-3 py-1.5 rounded-[10px] text-xs font-bold transition-all cursor-pointer ${
                activeFilter === lvl
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter messages or IPs..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-[10px] text-xs focus:ring-2 focus:ring-[#a73827]/20 focus:outline-hidden h-[36px]"
          />
        </div>
      </div>

      {/* Terminal View */}
      <div className="bg-slate-950 text-slate-200 rounded-[10px] border border-slate-800 shadow-xl overflow-hidden font-mono text-xs">
        {/* Terminal Header */}
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
            </div>
            <span className="text-[11px] text-slate-400 font-semibold ml-2">
              stdout / syslog — cloud-cluster-01.mumbai
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-bold">LIVE TAIL</span>
          </div>
        </div>

        {/* Log Entries */}
        <div className="p-4 space-y-2 max-h-[500px] overflow-y-auto font-mono text-[11px] leading-relaxed">
          {filteredLogs.map((log) => {
            const levelColors = {
              INFO: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
              WARN: 'text-amber-300 bg-amber-950/60 border-amber-800/60',
              CRIT: 'text-rose-400 bg-rose-950/60 border-rose-800/60',
            };

            const serviceColors = {
              AUTH_SVC: 'text-cyan-300',
              BILLING_SVC: 'text-purple-300',
              DB_CLUSTER: 'text-amber-400',
              CRON_SVC: 'text-blue-300',
              PAY_GW: 'text-rose-300',
            };

            return (
              <div
                key={log.id}
                className="flex flex-col sm:flex-row sm:items-start gap-2 hover:bg-white/5 p-1.5 rounded-[6px] transition-colors"
              >
                <span className="text-slate-500 shrink-0 select-none">[{log.timestamp}]</span>
                <span
                  className={`px-1.5 py-0.2 rounded-[4px] border text-[10px] font-bold shrink-0 text-center ${levelColors[log.level]}`}
                >
                  {log.level}
                </span>
                <span className={`font-bold shrink-0 ${serviceColors[log.service] || 'text-slate-300'}`}>
                  [{log.service}]
                </span>
                <span className="text-slate-200 flex-1">{log.message}</span>
                {log.ip && <span className="text-slate-500 text-[10px] shrink-0">IP: {log.ip}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
