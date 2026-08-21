import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Header } from '../common/Header';
import { Sidebar } from '../common/Sidebar';
import { SuperAdminDashboard } from '../superadmin/SuperAdminDashboard';
import { TrainerManagement } from '../superadmin/TrainerManagement';
import { GlobalMemberDirectory } from '../superadmin/GlobalMemberDirectory';
import { RevenueAnalytics } from '../superadmin/RevenueAnalytics';
import { SystemLogsView } from '../superadmin/SystemLogsView';
import { PlatformSettingsView } from '../superadmin/PlatformSettingsView';
import { TrainerMemberDetail } from '../trainer/TrainerMemberDetail';
import { CustomerChatView } from '../customer/CustomerChatView';

export const AdminLayout: React.FC = () => {
  const { activeView } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderAdminView = () => {
    switch (activeView) {
      case 'dashboard':
        return <SuperAdminDashboard />;
      case 'trainers':
        return <TrainerManagement />;
      case 'members':
        return <GlobalMemberDirectory />;
      case 'member_detail':
        return <TrainerMemberDetail />;
      case 'revenue':
        return <RevenueAnalytics />;
      case 'system_logs':
        return <SystemLogsView />;
      case 'settings':
        return <PlatformSettingsView />;
      case 'chat':
        return <CustomerChatView />;
      default:
        return <SuperAdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-[#a73827]/10 selection:text-[#a73827]">
      {/* Top Navigation Header (Unified light theme, h-16, identical across all views) */}
      <Header onToggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

      {/* Main Admin Body Layout */}
      <div className="flex-1 flex w-full max-w-[1600px] mx-auto">
        {/* Persistent Desktop / Drawer Sidebar */}
        <Sidebar
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Dynamic Admin Content Surface */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 overflow-y-auto max-w-full">
          {renderAdminView()}
        </main>
      </div>
    </div>
  );
};
