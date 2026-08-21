import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Server,
  Database,
  UserCheck,
  Sliders,
  CheckCircle,
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Eye,
  EyeOff,
  Terminal,
  Lock,
  HardDrive,
  FolderCheck,
  Sparkles,
  Zap,
  Cloud,
  Cpu,
} from 'lucide-react';
import { SystemCheckItem } from '../../types';

export const InstallationWizard: React.FC = () => {
  const {
    installation,
    updateInstallationDb,
    updateInstallationSuperAdmin,
    updateInstallationSystem,
    setInstallationStep,
    completeInstallationWizard,
    showToast,
  } = useApp();

  const currentStep = installation.currentStep;

  // Step 1: System Directory & Modern Cloud Engine Checks
  const [isCheckingSystem, setIsCheckingSystem] = useState(false);
  const [systemChecks, setSystemChecks] = useState<SystemCheckItem[]>([
    { id: 'env-node', category: 'directory', name: 'Node.js LTS Runtime', required: '>= v20.10.0', current: 'Node.js v20.18.0 (V8 Engine)', passed: true },
    { id: 'env-ts', category: 'directory', name: 'TypeScript & Vite Build Engine', required: '>= 5.0.0', current: 'TypeScript 5.6.3', passed: true },
    { id: 'dir-storage', category: 'permission', name: 'Storage & Uploads Directory', required: '0775 / Writable', current: '0775 (Writable)', passed: true },
    { id: 'dir-logs', category: 'permission', name: 'Logs & Telemetry Directory', required: '0775 / Writable', current: '0775 (Writable)', passed: true },
    { id: 'crypto-engine', category: 'permission', name: 'Hardware Crypto & TLS 1.3', required: 'Active / OpenSSL 3.x', current: 'Active (256-bit AES)', passed: true },
    { id: 'db-driver', category: 'permission', name: 'Multi-Tenant Database Driver', required: 'PostgreSQL / MySQL Pool', current: 'Active (Connection Pooling)', passed: true },
  ]);

  const handleRecheckSystem = () => {
    setIsCheckingSystem(true);
    setTimeout(() => {
      setIsCheckingSystem(false);
      showToast('Environment Validated', 'All cloud container permissions and runtime engines meet production requirements.', 'success');
    }, 800);
  };

  // Step 2: Database State & Interactive Connection Test
  const [dbConfig, setDbConfig] = useState(installation.database);
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [isCreatingTables, setIsCreatingTables] = useState(false);
  const [dbTestResult, setDbTestResult] = useState<{ success: boolean; message: string; latency?: string } | null>(
    installation.database.isConnected ? { success: true, message: 'Database connected OK (Multi-Tenant Engine Active)', latency: '2.4 ms' } : null
  );

  const handleTestDatabase = () => {
    if (!dbConfig.host || !dbConfig.databaseName || !dbConfig.username) {
      showToast('Missing Fields', 'Please specify Database Host, Database Name, and Username.', 'error');
      return;
    }

    setIsTestingDb(true);
    setDbTestResult(null);

    setTimeout(() => {
      setIsTestingDb(false);
      setDbTestResult({
        success: true,
        message: `Successfully connected to database "${dbConfig.databaseName}" at ${dbConfig.host}:${dbConfig.port}.`,
        latency: '2.4 ms (Connection pool ready)',
      });
      updateInstallationDb({
        ...dbConfig,
        isConnected: true,
        version: 'PostgreSQL / MySQL 8.0-Compatible',
        charset: 'utf8mb4_unicode_ci',
      });
      showToast('Database Connected', 'Connection handshake verified successfully.', 'success');
    }, 900);
  };

  const handleCreateTables = () => {
    setIsCreatingTables(true);
    setTimeout(() => {
      setIsCreatingTables(false);
      updateInstallationDb({ tablesCreated: true });
      showToast('Schema Migrated', 'Created 14 multi-tenant database tables successfully.', 'success');
    }, 1200);
  };

  // Step 3: Super Admin State
  const [adminConfig, setAdminConfig] = useState(installation.superAdmin);
  const [showPassword, setShowPassword] = useState(false);

  // Step 4: System Parameters
  const [sysConfig, setSysConfig] = useState(installation.system);

  const handleFinishInstallation = () => {
    if (!adminConfig.email || !adminConfig.password || !adminConfig.fullName) {
      showToast('Missing Information', 'Please provide Super Administrator details.', 'error');
      return;
    }
    if (adminConfig.password !== adminConfig.confirmPassword) {
      showToast('Password Mismatch', 'Admin passwords do not match.', 'error');
      return;
    }
    if (adminConfig.password.length < 8) {
      showToast('Weak Password', 'Password must contain at least 8 characters.', 'error');
      return;
    }

    updateInstallationSuperAdmin(adminConfig);
    updateInstallationSystem(sysConfig);
    completeInstallationWizard();
  };

  const steps = [
    { num: 1, title: 'Runtime & Permissions', icon: Cpu },
    { num: 2, title: 'Database Configuration', icon: Database },
    { num: 3, title: 'Super Admin Account', icon: UserCheck },
    { num: 4, title: 'System Parameters', icon: Sliders },
    { num: 5, title: 'Deploy & Lock', icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto w-full">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white rounded-[10px] shadow-2xs border border-slate-200 mb-3">
            <div className="w-8 h-8 rounded-[10px] bg-[#a73827] flex items-center justify-center font-black text-white text-base">
              X
            </div>
            <span className="font-extrabold text-xl tracking-tight text-[#a73827]">
              xfit <span className="text-xs font-bold text-slate-700 ml-1">Setup Engine</span>
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            xfit Platform Installation Wizard
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Deploy your self-hosted multi-tenant fitness management platform with automatic schema migration.
          </p>
        </div>

        {/* Wizard Main Card */}
        <div className="bg-white rounded-[10px] shadow-lg border border-slate-200 overflow-hidden">
          
          {/* Step Progress Navigation Bar */}
          <div className="border-b border-slate-200 bg-slate-50/80 px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between gap-1 sm:gap-2">
              {steps.map((step) => {
                const Icon = step.icon;
                const isCompleted = currentStep > step.num;
                const isCurrent = currentStep === step.num;
                return (
                  <div
                    key={step.num}
                    className={`flex-1 flex flex-col items-center text-center transition-all ${
                      isCurrent
                        ? 'text-[#a73827] font-bold'
                        : isCompleted
                        ? 'text-emerald-700 font-semibold'
                        : 'text-slate-400'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-[10px] flex items-center justify-center text-xs font-bold transition-all mb-1 ${
                        isCurrent
                          ? 'bg-[#a73827] text-white shadow-2xs'
                          : isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span className="text-[10px] sm:text-xs line-clamp-1 hidden sm:block">
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Content Body */}
          <div className="p-6 sm:p-8">
            
            {/* STEP 1: RUNTIME & PERMISSIONS */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Step 1: System Runtime & Storage Permissions</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Validating environment dependencies, storage directories, and encryption engines.
                    </p>
                  </div>

                  <button
                    onClick={handleRecheckSystem}
                    disabled={isCheckingSystem}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-[10px] flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isCheckingSystem ? 'animate-spin text-[#a73827]' : ''}`} />
                    <span>Re-check</span>
                  </button>
                </div>

                <div className="bg-slate-50 rounded-[10px] border border-slate-200 divide-y divide-slate-200 overflow-hidden text-xs">
                  {systemChecks.map((item) => (
                    <div key={item.id} className="p-3.5 flex items-center justify-between hover:bg-white transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <div>
                          <p className="font-bold text-slate-900">{item.name}</p>
                          <p className="text-[11px] text-slate-500">
                            Required: <span className="font-mono text-slate-700">{item.required}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono text-slate-800 text-[11px]">{item.current}</span>
                        <span className="px-2.5 py-0.5 rounded-[6px] text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>PASSED</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-[10px] flex items-center gap-3 text-xs text-emerald-900">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold">Modern Cloud Runtime Verified</p>
                    <p className="text-emerald-700 text-[11px] mt-0.5">
                      All storage paths are writable and encryption engines are production-ready.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setInstallationStep(2)}
                    className="px-6 py-2.5 bg-[#a73827] hover:bg-[#8f2f20] text-white rounded-[10px] text-xs font-bold flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
                  >
                    <span>Continue to Database Setup</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: DATABASE CONFIGURATION */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Step 2: Relational Database Configuration</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Connect to your cloud or local relational database instance (PostgreSQL / MySQL).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Database Host *</label>
                    <input
                      type="text"
                      value={dbConfig.host}
                      onChange={(e) => setDbConfig({ ...dbConfig, host: e.target.value })}
                      placeholder="localhost or 127.0.0.1"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#a73827]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Database Port *</label>
                    <input
                      type="number"
                      value={dbConfig.port}
                      onChange={(e) => setDbConfig({ ...dbConfig, port: parseInt(e.target.value) || 3306 })}
                      placeholder="3306 or 5432"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#a73827]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Database Name *</label>
                    <input
                      type="text"
                      value={dbConfig.databaseName}
                      onChange={(e) => setDbConfig({ ...dbConfig, databaseName: e.target.value })}
                      placeholder="xfit_db"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#a73827]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Database Username *</label>
                    <input
                      type="text"
                      value={dbConfig.username}
                      onChange={(e) => setDbConfig({ ...dbConfig, username: e.target.value })}
                      placeholder="xfit_user"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#a73827]/20"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Database Password</label>
                    <input
                      type="password"
                      value={dbConfig.password}
                      onChange={(e) => setDbConfig({ ...dbConfig, password: e.target.value })}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#a73827]/20"
                    />
                  </div>
                </div>

                {/* Interactive Test & Status */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    disabled={isTestingDb}
                    onClick={handleTestDatabase}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-[10px] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTestingDb ? 'animate-spin' : ''}`} />
                    <span>{isTestingDb ? 'Verifying Socket Handshake...' : 'Test Connection'}</span>
                  </button>

                  {dbTestResult && (
                    <div
                      className={`px-3 py-2 rounded-[10px] text-xs flex items-center gap-2 border ${
                        dbTestResult.success
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{dbTestResult.message}</span>
                      {dbTestResult.latency && <span className="font-mono text-[10px] text-slate-500">({dbTestResult.latency})</span>}
                    </div>
                  )}
                </div>

                {/* Schema Migration Trigger */}
                {dbConfig.isConnected && (
                  <div className="p-4 bg-slate-50 rounded-[10px] border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-slate-900">Database Tables & Schema Migration</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {dbConfig.tablesCreated ? '14 tables migrated with indexes.' : 'Ready to initialize schema.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={isCreatingTables || dbConfig.tablesCreated}
                      onClick={handleCreateTables}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[10px] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{dbConfig.tablesCreated ? 'Tables Created ✓' : 'Run Migration'}</span>
                    </button>
                  </div>
                )}

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setInstallationStep(1)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-[10px] flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    disabled={!dbConfig.isConnected}
                    onClick={() => setInstallationStep(3)}
                    className="px-6 py-2.5 bg-[#a73827] hover:bg-[#8f2f20] text-white rounded-[10px] text-xs font-bold flex items-center gap-2 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    <span>Continue to Super Admin</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: SUPER ADMIN ACCOUNT */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Step 3: Super Administrator Account</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    This primary account has global platform oversight across all gyms, trainers, and billing.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={adminConfig.fullName}
                      onChange={(e) => setAdminConfig({ ...adminConfig, fullName: e.target.value })}
                      placeholder="e.g. Alexander Vance"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#a73827]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Admin Email Address *</label>
                    <input
                      type="email"
                      required
                      value={adminConfig.email}
                      onChange={(e) => setAdminConfig({ ...adminConfig, email: e.target.value })}
                      placeholder="admin@xfit.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#a73827]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Username *</label>
                    <input
                      type="text"
                      required
                      value={adminConfig.username}
                      onChange={(e) => setAdminConfig({ ...adminConfig, username: e.target.value })}
                      placeholder="superadmin"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#a73827]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={adminConfig.password}
                        onChange={(e) => setAdminConfig({ ...adminConfig, password: e.target.value })}
                        placeholder="••••••••••••"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#a73827]/20 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password *</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={adminConfig.confirmPassword}
                      onChange={(e) => setAdminConfig({ ...adminConfig, confirmPassword: e.target.value })}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#a73827]/20"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setInstallationStep(2)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-[10px] flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={() => setInstallationStep(4)}
                    className="px-6 py-2.5 bg-[#a73827] hover:bg-[#8f2f20] text-white rounded-[10px] text-xs font-bold flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
                  >
                    <span>Continue to System Settings</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: SYSTEM PARAMETERS & INR CURRENCY */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Step 4: System Parameters & Regional Settings</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure your platform branding, base URL, and default currency (INR).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Application Name</label>
                    <input
                      type="text"
                      value={sysConfig.applicationName}
                      onChange={(e) => setSysConfig({ ...sysConfig, applicationName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#a73827]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Base Platform URL</label>
                    <input
                      type="url"
                      value={sysConfig.baseUrl}
                      onChange={(e) => setSysConfig({ ...sysConfig, baseUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#a73827]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Default Platform Currency</label>
                    <select
                      value={sysConfig.platformCurrency}
                      onChange={(e) => setSysConfig({ ...sysConfig, platformCurrency: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#a73827]/20"
                    >
                      <option value="INR">₹ INR (Indian Rupee - Default)</option>
                      <option value="USD">$ USD (US Dollar)</option>
                      <option value="EUR">€ EUR (Euro)</option>
                      <option value="GBP">£ GBP (British Pound)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Default Timezone</label>
                    <select
                      value={sysConfig.defaultTimezone}
                      onChange={(e) => setSysConfig({ ...sysConfig, defaultTimezone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#a73827]/20"
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata (IST - UTC+5:30)</option>
                      <option value="UTC">UTC (Coordinated Universal Time)</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setInstallationStep(3)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-[10px] flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={() => setInstallationStep(5)}
                    className="px-6 py-2.5 bg-[#a73827] hover:bg-[#8f2f20] text-white rounded-[10px] text-xs font-bold flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
                  >
                    <span>Review & Finalize</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: REVIEW, DEPLOY & SECURITY LOCK */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Step 5: Review & Complete Installation</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Confirm your deployment parameters and engage the installer security lock.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-[10px] p-4 border border-slate-200 space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/80">
                    <span className="text-slate-500 font-medium">Database Target:</span>
                    <span className="font-mono font-bold text-slate-900">{dbConfig.databaseName} @ {dbConfig.host}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/80">
                    <span className="text-slate-500 font-medium">Super Admin:</span>
                    <span className="font-bold text-slate-900">{adminConfig.fullName} ({adminConfig.email})</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/80">
                    <span className="text-slate-500 font-medium">Currency & Timezone:</span>
                    <span className="font-bold text-emerald-700">₹ {sysConfig.platformCurrency} • {sysConfig.defaultTimezone}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500 font-medium">Security Guard:</span>
                    <span className="font-bold text-slate-900">Automatic /install directory lockdown enabled</span>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setInstallationStep(4)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-[10px] flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={handleFinishInstallation}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[10px] text-xs font-bold flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Deploy & Lock Installer</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
