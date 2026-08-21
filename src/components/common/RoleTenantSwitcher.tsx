import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserCheck,
  Building2,
  Lock,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Settings,
  Shield,
  Layers,
  Wrench,
} from 'lucide-react';
import { Modal } from './Modal';

export const RoleTenantSwitcher: React.FC = () => {
  const {
    currentRole,
    switchRole,
    currentTenant,
    tenants,
    switchTenant,
    resetDatabase,
    resetToFirstTimeInstall,
    navigateToRoute,
    activeRoute,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 bg-[#f8f9ff] hover:bg-[#eff4ff] border border-[#e2e8f0] rounded-xl text-xs font-semibold text-gray-800 shadow-sm active:scale-95 transition-all"
        title="Switch Portal or Workspace"
      >
        <span className="w-2 h-2 rounded-full bg-[#10b981]" />
        <span className="hidden sm:inline font-bold">
          {activeRoute === 'admin'
            ? 'Super Admin Portal'
            : currentRole === 'trainer'
            ? 'Trainer: Sarah'
            : 'Client: Alex'}
        </span>
        <span className="text-gray-400">|</span>
        <span className="text-gray-600 truncate max-w-[90px]">{currentTenant.businessName}</span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Workspace & Portal Switcher"
        subtitle="Switch between client, trainer and administrative environments"
        maxWidth="md"
      >
        <div className="space-y-5 text-xs">
          
          {/* Active Portal Selector */}
          <div>
            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#a73827]" />
              <span>Select Active User Portal</span>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  switchRole('customer');
                  setIsOpen(false);
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  currentRole === 'customer' && activeRoute === 'customer'
                    ? 'border-[#a73827] bg-[#fff0ee]'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">Client / Customer</span>
                  {currentRole === 'customer' && activeRoute === 'customer' && (
                    <span className="w-2 h-2 rounded-full bg-[#a73827]" />
                  )}
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Alex Johnson (Pro Tier)</p>
              </button>

              <button
                onClick={() => {
                  switchRole('trainer');
                  setIsOpen(false);
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  currentRole === 'trainer' && activeRoute === 'trainer'
                    ? 'border-[#a73827] bg-[#fff0ee]'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">Personal Trainer</span>
                  {currentRole === 'trainer' && activeRoute === 'trainer' && (
                    <span className="w-2 h-2 rounded-full bg-[#a73827]" />
                  )}
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Sarah Jenkins (Coach)</p>
              </button>
            </div>
          </div>

          {/* Super Admin Entry */}
          <div className="p-3.5 bg-gray-900 text-white rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-[#73f8e0]" />
              <div>
                <p className="font-bold text-xs">Super Admin Portal (/admin)</p>
                <p className="text-[11px] text-gray-400">Master platform controls & multi-tenant logs</p>
              </div>
            </div>
            <button
              onClick={() => {
                navigateToRoute('admin');
                setIsOpen(false);
              }}
              className="px-3 py-1.5 bg-[#a73827] hover:bg-[#872112] text-white rounded-xl text-xs font-bold transition-all"
            >
              Enter /admin
            </button>
          </div>

          {/* Tenant Gym Subdomain Workspace */}
          <div>
            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#545c86]" />
              <span>Tenant Gym Subdomain Workspace</span>
            </h4>
            <div className="space-y-1.5">
              {tenants.map((tenant) => {
                const isSelected = currentTenant.id === tenant.id;
                return (
                  <button
                    key={tenant.id}
                    onClick={() => {
                      switchTenant(tenant.id);
                      setIsOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-[#006b5d] bg-emerald-50/50 font-bold text-gray-900'
                        : 'border-gray-100 hover:border-gray-300 text-gray-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#006b5d]" />
                      <span>{tenant.businessName}</span>
                    </div>
                    <span className="text-[11px] font-mono text-gray-500">
                      {tenant.subdomain}.xfit.app
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Installation & Factory Reset Tools */}
          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            <button
              onClick={() => {
                resetToFirstTimeInstall();
                setIsOpen(false);
              }}
              className="w-full py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Wrench className="w-3.5 h-3.5 text-amber-600" />
              <span>Launch First-Time Installation Wizard (/install)</span>
            </button>

            <button
              onClick={() => {
                resetDatabase();
                setIsOpen(false);
              }}
              className="w-full py-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Local Database to Default Demo</span>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
