import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { ToastContainer } from './components/common/Toast';

// Installation & Security Lock Components
import { InstallationWizard } from './components/install/InstallationWizard';
import { InstallCleanupWarning } from './components/install/InstallCleanupWarning';

// Dedicated Admin Portal
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';

// Trainer Components
import { TrainerDashboard } from './components/trainer/TrainerDashboard';
import { TrainerMembersDirectory } from './components/trainer/TrainerMembersDirectory';
import { TrainerMemberProgressDashboard } from './components/trainer/TrainerMemberProgressDashboard';
import { TrainerWorkoutPlansView } from './components/trainer/TrainerWorkoutPlansView';
import { TrainerDietPlansView } from './components/trainer/TrainerDietPlansView';
import { TrainerMemberMessagesView } from './components/trainer/TrainerMemberMessagesView';
import { RevenueAnalytics } from './components/superadmin/RevenueAnalytics';

// Customer Components
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { ActiveWorkoutView } from './components/customer/ActiveWorkoutView';
import { CustomerPlansView } from './components/customer/CustomerPlansView';
import { CustomerProgressView } from './components/customer/CustomerProgressView';
import { CustomerChatView } from './components/customer/CustomerChatView';
import { CustomerTrainerDirectoryView } from './components/customer/CustomerTrainerDirectoryView';
import { CustomerBillingView } from './components/customer/CustomerBillingView';

const MainContent: React.FC = () => {
  const { activeRoute, currentRole, activeView, adminAuth } = useApp();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // ROUTE 1: First-Time Installation Wizard (/install)
  if (activeRoute === 'install') {
    return <InstallationWizard />;
  }

  // ROUTE 2: Security Warning Lock - Delete /install folder
  if (activeRoute === 'install_cleanup') {
    return <InstallCleanupWarning />;
  }

  // ROUTE 3: Super Admin Login (/admin/login)
  if (activeRoute === 'admin_login') {
    return <AdminLogin />;
  }

  // ROUTE 4: Dedicated Super Admin Portal (/admin)
  if (activeRoute === 'admin') {
    if (!adminAuth.isAuthenticated) {
      return <AdminLogin />;
    }
    return <AdminLayout />;
  }

  // ROUTE 5 & 6: Public Customer & Trainer Portals (Completely separated from Admin)
  const renderPortalView = () => {
    // TRAINER VIEWS
    if (currentRole === 'trainer') {
      switch (activeView) {
        case 'dashboard':
          return <TrainerDashboard />;
        case 'members':
          return <TrainerMembersDirectory />;
        case 'member_detail':
        case 'progress':
          return <TrainerMemberProgressDashboard />;
        case 'workout_plans':
          return <TrainerWorkoutPlansView />;
        case 'diet_plans':
          return <TrainerDietPlansView />;
        case 'chat':
          return <TrainerMemberMessagesView />;
        case 'revenue':
          return <RevenueAnalytics />;
        default:
          return <TrainerDashboard />;
      }
    }

    // CUSTOMER VIEWS
    switch (activeView) {
      case 'dashboard':
        return <CustomerDashboard />;
      case 'active_workout':
        return <ActiveWorkoutView />;
      case 'plans':
        return <CustomerPlansView />;
      case 'progress':
        return <CustomerProgressView />;
      case 'chat':
        return <CustomerChatView />;
      case 'trainers':
        return <CustomerTrainerDirectoryView />;
      case 'billing':
        return <CustomerBillingView />;
      default:
        return <CustomerDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex flex-col font-sans antialiased selection:bg-[#0071e3]/20 selection:text-[#0071e3] tracking-tight">
      {/* Top Universal Header */}
      <Header onToggleSidebar={() => setIsMobileSidebarOpen(true)} />

      {/* Main Body Shell (Flexbox with non-overlapping sticky sidebar and main container) */}
      <div className="flex-1 flex w-full max-w-[1600px] mx-auto">
        {/* Desktop Left Sidebar & Mobile Drawer */}
        <Sidebar
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Dynamic Content Surface with zero clipping and zero overlapping */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 overflow-y-auto max-w-full">
          {renderPortalView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation (Visible on mobile screens) */}
      <BottomNav />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
      {/* Toast Notification Container */}
      <ToastContainer />
    </AppProvider>
  );
}

export default App;
