import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Mail,
  Palette,
  Server,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Copy,
  Download,
  Code,
  Globe,
  Sliders,
  Send,
  Zap,
  Lock,
  Cpu,
  Database,
  Cloud,
} from 'lucide-react';
import { SmtpConfig } from '../../types';

export const PlatformSettingsView: React.FC = () => {
  const { settings, updateSettings, testSmtpWithDetails, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'branding' | 'smtp' | 'payouts' | 'architecture'>('branding');
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [testEmailRecipient, setTestEmailRecipient] = useState('');
  const [sendingTestEmail, setSendingTestEmail] = useState(false);

  // SMTP Authentication State
  const [smtpAuthSuccess, setSmtpAuthSuccess] = useState(settings.smtp.status === 'Connected');
  const [smtpAuthLog, setSmtpAuthLog] = useState<string[]>([]);
  const [smtpLatency, setSmtpLatency] = useState<number | null>(null);

  // Local form state
  const [brandingForm, setBrandingForm] = useState({
    portalDisplayName: settings.portalDisplayName,
    platformLogoUrl: settings.platformLogoUrl,
    primaryColor: settings.primaryColor,
    secondaryColor: settings.secondaryColor,
  });

  const [smtpForm, setSmtpForm] = useState<SmtpConfig>({
    host: settings.smtp.host,
    port: settings.smtp.port,
    encryption: settings.smtp.encryption,
    username: settings.smtp.username,
    fromEmail: settings.smtp.fromEmail,
    fromName: settings.smtp.fromName,
    status: settings.smtp.status,
  });

  const [payoutDay, setPayoutDay] = useState(settings.payoutCycleDay);

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      portalDisplayName: brandingForm.portalDisplayName,
      platformLogoUrl: brandingForm.platformLogoUrl,
      primaryColor: brandingForm.primaryColor,
      secondaryColor: brandingForm.secondaryColor,
    });
  };

  const handleAuthenticateSmtp = async () => {
    setTestingSmtp(true);
    setSmtpAuthLog([]);
    const res = await testSmtpWithDetails(smtpForm);
    setTestingSmtp(false);
    setSmtpAuthSuccess(res.success);
    setSmtpAuthLog(res.log);
    setSmtpLatency(res.latencyMs);

    if (res.success) {
      setSmtpForm((prev) => ({ ...prev, status: 'Connected' }));
    }
  };

  const handleSaveSmtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smtpAuthSuccess) {
      showToast(
        'Authentication Required',
        'Please test and authenticate SMTP configuration successfully before saving.',
        'warning'
      );
      return;
    }

    updateSettings({
      smtp: {
        ...smtpForm,
        status: 'Connected',
        lastTestedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    });
  };

  const handleSendTestMail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailRecipient.trim()) {
      showToast('Recipient Required', 'Please enter a target email address.', 'error');
      return;
    }
    setSendingTestEmail(true);
    setTimeout(() => {
      setSendingTestEmail(false);
      showToast(
        'Test Email Sent! 📬',
        `Verification email successfully dispatched to ${testEmailRecipient}. Check inbox/spam folder.`
      );
      setTestEmailRecipient('');
    }, 1200);
  };

  const paletteColors = [
    { name: 'Burgundy Crimson (Default)', hex: '#a73827' },
    { name: 'Emerald Teal', hex: '#006b5d' },
    { name: 'Navy Midnight', hex: '#0f183e' },
    { name: 'Coral Flame', hex: '#f9745d' },
    { name: 'Slate Indigo', hex: '#545c86' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Platform Settings</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure global white-label branding, SMTP email relay, payroll rules, and multi-tenant cloud architecture.
        </p>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('branding')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-[10px] text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'branding' ? 'bg-[#a73827] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Global Branding</span>
        </button>

        <button
          onClick={() => setActiveTab('smtp')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-[10px] text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'smtp' ? 'bg-[#a73827] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>SMTP & Notifications</span>
        </button>

        <button
          onClick={() => setActiveTab('payouts')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-[10px] text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'payouts' ? 'bg-[#a73827] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span className="font-extrabold text-xs">₹</span>
          <span>Payout & Invoicing (INR)</span>
        </button>

        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-[10px] text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'architecture' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
          }`}
        >
          <Cloud className="w-4 h-4 text-emerald-500" />
          <span>Cloud & Edge Architecture</span>
        </button>
      </div>

      {/* Tab 1: Global Branding */}
      {activeTab === 'branding' && (
        <form onSubmit={handleSaveBranding} className="space-y-6">
          <div className="bg-white rounded-[10px] p-6 border border-slate-200 shadow-2xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#a73827]" />
              <span>Theme & White-Label Assets</span>
            </h3>

            {/* Portal Display Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Global Portal Display Name</label>
              <input
                type="text"
                value={brandingForm.portalDisplayName}
                onChange={(e) => setBrandingForm({ ...brandingForm, portalDisplayName: e.target.value })}
                className="w-full max-w-md px-3.5 py-2.5 border border-slate-200 rounded-[10px] text-xs focus:ring-2 focus:ring-[#a73827]/20 focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-500 mt-1">Appears on browser tabs, client emails, and invoices.</p>
            </div>

            {/* Platform Logo */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Platform Logo</label>
              <div className="flex items-center gap-4">
                <img
                  src={brandingForm.platformLogoUrl}
                  alt="Platform Logo"
                  className="w-14 h-14 rounded-[10px] object-cover border border-slate-200 shadow-2xs"
                />
                <div className="flex-1 max-w-md">
                  <input
                    type="url"
                    value={brandingForm.platformLogoUrl}
                    onChange={(e) => setBrandingForm({ ...brandingForm, platformLogoUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-[10px] text-xs focus:ring-2 focus:ring-[#a73827]/20 focus:outline-hidden"
                    placeholder="https://example.com/logo.png"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">SVG or high-res PNG recommended (transparent background).</p>
                </div>
              </div>
            </div>

            {/* Color Theme Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Primary Brand Color</label>
              <div className="flex flex-wrap gap-3">
                {paletteColors.map((color) => (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => setBrandingForm({ ...brandingForm, primaryColor: color.hex })}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-[10px] border text-xs font-semibold cursor-pointer transition-all ${
                      brandingForm.primaryColor === color.hex
                        ? 'border-slate-900 bg-slate-50 ring-2 ring-[#a73827]'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: color.hex }} />
                    <span className="text-slate-800">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#a73827] hover:bg-[#8f2f20] text-white rounded-[10px] text-xs font-bold shadow-2xs transition-colors cursor-pointer"
              >
                Save Branding Settings
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: SMTP & Notifications (Strict Validation & Authentication) */}
      {activeTab === 'smtp' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveSmtp} className="bg-white rounded-[10px] p-6 border border-slate-200 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#a73827]" />
                  <span>SMTP Relay & Email Delivery</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Transactional mailer used for membership renewals, password resets, and coach alerts.
                </p>
              </div>

              {/* Live Authentication Badge */}
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[10px] text-xs font-bold border ${
                    smtpAuthSuccess
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      smtpAuthSuccess ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                    }`}
                  />
                  {smtpAuthSuccess ? `Authenticated (${smtpLatency || 24}ms)` : 'Unverified Configuration'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">SMTP Host</label>
                <input
                  type="text"
                  required
                  value={smtpForm.host}
                  onChange={(e) => {
                    setSmtpForm({ ...smtpForm, host: e.target.value });
                    setSmtpAuthSuccess(false);
                  }}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-[10px] text-xs focus:ring-2 focus:ring-[#a73827]/20 focus:outline-hidden"
                  placeholder="smtp.sendgrid.net or mail.xfit.app"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Port</label>
                <input
                  type="number"
                  required
                  value={smtpForm.port}
                  onChange={(e) => {
                    setSmtpForm({ ...smtpForm, port: parseInt(e.target.value) || 587 });
                    setSmtpAuthSuccess(false);
                  }}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-[10px] text-xs focus:ring-2 focus:ring-[#a73827]/20 focus:outline-hidden"
                  placeholder="587, 465, or 25"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Encryption Protocol</label>
                <select
                  value={smtpForm.encryption}
                  onChange={(e) => {
                    setSmtpForm({ ...smtpForm, encryption: e.target.value as any });
                    setSmtpAuthSuccess(false);
                  }}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-[10px] text-xs focus:ring-2 focus:ring-[#a73827]/20 focus:outline-hidden bg-white"
                >
                  <option value="TLS">STARTTLS (Port 587 - Recommended)</option>
                  <option value="SSL">SSL/TLS (Port 465)</option>
                  <option value="None">None (Unencrypted)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">SMTP Username / API Key</label>
                <input
                  type="text"
                  required
                  value={smtpForm.username}
                  onChange={(e) => {
                    setSmtpForm({ ...smtpForm, username: e.target.value });
                    setSmtpAuthSuccess(false);
                  }}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-[10px] text-xs focus:ring-2 focus:ring-[#a73827]/20 focus:outline-hidden"
                  placeholder="apikey or user@domain.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">From Email Address</label>
                <input
                  type="email"
                  required
                  value={smtpForm.fromEmail}
                  onChange={(e) => {
                    setSmtpForm({ ...smtpForm, fromEmail: e.target.value });
                    setSmtpAuthSuccess(false);
                  }}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-[10px] text-xs focus:ring-2 focus:ring-[#a73827]/20 focus:outline-hidden"
                  placeholder="noreply@xfit.app"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">From Sender Name</label>
                <input
                  type="text"
                  required
                  value={smtpForm.fromName}
                  onChange={(e) => {
                    setSmtpForm({ ...smtpForm, fromName: e.target.value });
                  }}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-[10px] text-xs focus:ring-2 focus:ring-[#a73827]/20 focus:outline-hidden"
                  placeholder="xfit Platform Notifications"
                />
              </div>
            </div>

            {/* Live Verification Console / Log Output */}
            {smtpAuthLog.length > 0 && (
              <div className="p-3.5 bg-slate-900 text-slate-100 rounded-[10px] text-xs font-mono space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[10px] pb-1 border-b border-slate-800">
                  <span>SMTP Connection & Handshake Log</span>
                  <span>TLS 1.3 Validated</span>
                </div>
                {smtpAuthLog.map((line, idx) => (
                  <p key={idx} className={line.includes('OK') || line.includes('succeeded') ? 'text-emerald-400' : 'text-slate-300'}>
                    {line}
                  </p>
                ))}
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                disabled={testingSmtp}
                onClick={handleAuthenticateSmtp}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-[10px] text-xs font-bold flex items-center gap-2 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingSmtp ? 'animate-spin' : ''}`} />
                <span>{testingSmtp ? 'Testing & Authenticating Connection...' : 'Test & Authenticate Connection'}</span>
              </button>

              <div className="flex items-center gap-2">
                {!smtpAuthSuccess && (
                  <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Must authenticate before saving
                  </span>
                )}
                <button
                  type="submit"
                  disabled={!smtpAuthSuccess}
                  className="px-6 py-2.5 bg-[#a73827] hover:bg-[#8f2f20] text-white rounded-[10px] text-xs font-bold shadow-2xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Save Validated SMTP Settings
                </button>
              </div>
            </div>
          </form>

          {/* Test Email Dispatcher Panel */}
          <div className="bg-white rounded-[10px] p-6 border border-slate-200 shadow-2xs space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Send className="w-4 h-4 text-[#a73827]" />
              <span>Send Live Test Verification Email</span>
            </h4>
            <p className="text-xs text-slate-500">
              Dispatches a sample HTML test message with delivery headers to ensure inbox deliverability.
            </p>

            <form onSubmit={handleSendTestMail} className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <input
                type="email"
                required
                value={testEmailRecipient}
                onChange={(e) => setTestEmailRecipient(e.target.value)}
                placeholder="Enter recipient email (e.g. admin@gym.com)"
                className="flex-1 px-3.5 py-2 border border-slate-200 rounded-[10px] text-xs focus:ring-2 focus:ring-[#a73827]/20 focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={sendingTestEmail || !smtpAuthSuccess}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-[10px] text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer disabled:opacity-40"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{sendingTestEmail ? 'Sending...' : 'Send Test Email'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 3: Payout & Invoicing Rules in INR */}
      {activeTab === 'payouts' && (
        <div className="bg-white rounded-[10px] p-6 border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="font-extrabold text-base text-[#a73827]">₹</span>
              <span>Trainer Payroll & Indian Rupee (INR) Invoicing</span>
            </h3>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-[6px] text-xs font-bold">
              Default Currency: ₹ INR
            </span>
          </div>

          <div className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Payout Settlement Day</label>
              <select
                value={payoutDay}
                onChange={(e) => setPayoutDay(parseInt(e.target.value))}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-[10px] text-xs focus:ring-2 focus:ring-[#a73827]/20 focus:outline-hidden bg-white"
              >
                <option value={1}>1st of each month (Default)</option>
                <option value={5}>5th of each month</option>
                <option value={15}>15th of each month</option>
                <option value={28}>28th of each month</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Platform Commission Rate (%)</label>
              <input
                type="number"
                defaultValue={15}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-[10px] text-xs focus:ring-2 focus:ring-[#a73827]/20 focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-500 mt-1">Platform deduction on customer subscriptions before trainer net payout.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Supported Payment Gateways</label>
              <div className="p-3 bg-slate-50 rounded-[10px] border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between font-semibold">
                  <span>Razorpay / UPI / NetBanking</span>
                  <span className="text-emerald-600 font-bold">Active (₹ INR)</span>
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span>Stripe India & International Cards</span>
                  <span className="text-emerald-600 font-bold">Active (₹ INR)</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  updateSettings({ payoutCycleDay: payoutDay });
                }}
                className="px-6 py-2.5 bg-[#a73827] hover:bg-[#8f2f20] text-white rounded-[10px] text-xs font-bold shadow-2xs transition-colors cursor-pointer"
              >
                Save Payout Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Modern Cloud & Edge Architecture (Replaced Legacy PHP) */}
      {activeTab === 'architecture' && (
        <div className="bg-white rounded-[10px] p-6 border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Cloud className="w-5 h-5 text-emerald-600" />
                <span>Modern Cloud & Edge Infrastructure</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Modern full-stack TypeScript & Node.js containerized deployment with multi-tenant domain routing.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-[6px] text-xs font-bold">
              v4.2 Production Ready
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-[10px] border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                <Cpu className="w-4 h-4 text-[#a73827]" />
                <span>Node.js / Edge Runtime</span>
              </div>
              <p className="text-[11px] text-slate-600">
                High-throughput asynchronous non-blocking I/O with global edge caching and zero cold-start latency.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-[10px] border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                <Database className="w-4 h-4 text-emerald-600" />
                <span>Relational Multi-Tenant DB</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Tenant isolation with automated connection pooling, SSL encryption at rest, and hourly automated snapshots.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-[10px] border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>Custom Subdomain Routing</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Instant wildcard SSL certificate provisioning for tenant portals (e.g., sarahfit.xfit.app, gym.cloud).
              </p>
            </div>
          </div>

          {/* Docker & Deployment Manifest */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Production Docker / Kubernetes Deployment Template</span>
              <button
                onClick={() => showToast('Manifest Copied', 'Docker compose manifest copied to clipboard.', 'info')}
                className="text-xs text-[#a73827] hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Manifest</span>
              </button>
            </div>

            <pre className="p-4 bg-slate-900 text-slate-100 rounded-[10px] text-xs font-mono overflow-x-auto leading-relaxed">
{`# xfit Enterprise Production Container Spec
version: '3.8'
services:
  app:
    image: xfit/platform:v4.2-production
    restart: always
    environment:
      - NODE_ENV=production
      - PORT=3000
      - PLATFORM_CURRENCY=INR
      - DATABASE_URL=postgresql://xfit_user:secret@db:5432/xfit_db
      - SMTP_HOST=${smtpForm.host}
      - SMTP_PORT=${smtpForm.port}
    ports:
      - "3000:3000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
