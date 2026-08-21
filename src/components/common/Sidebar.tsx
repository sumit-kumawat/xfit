import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Dumbbell,
  Users,
  CreditCard,
  Terminal,
  Settings,
  Megaphone,
  CalendarDays,
  TrendingUp,
  MessageSquare,
  Compass,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const { currentRole, activeView, setActiveView, showToast } = useApp();

  const handleNavClick = (view: string) => {
    setActiveView(view);
    if (onCloseMobile) onCloseMobile();
  };

  // Trainer Navigation items
  const trainerNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'members', label: 'Members Directory', icon: Users },
    { id: 'progress', label: 'Member Progress & BMI', icon: TrendingUp },
    { id: 'workout_plans', label: 'Workout Plans', icon: Dumbbell },
    { id: 'diet_plans', label: 'Diet & Nutrition', icon: CalendarDays },
    { id: 'chat', label: 'Client Messages', icon: MessageSquare },
    { id: 'revenue', label: 'Revenue & Invoices', icon: CreditCard },
  ];

  // Customer Navigation items
  const customerNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'active_workout', label: 'Active Workout', icon: Dumbbell },
    { id: 'plans', label: 'My Nutrition & Plans', icon: CalendarDays },
    { id: 'progress', label: 'Your Progress & BMI', icon: TrendingUp },
    { id: 'chat', label: 'Coach Messages', icon: MessageSquare },
    { id: 'trainers', label: 'Find Trainers', icon: Compass },
    { id: 'billing', label: 'Membership & Receipts', icon: CreditCard },
  ];

  // Super Admin Navigation items
  const superAdminNav = [
    { id: 'dashboard', label: 'Overview & MRR', icon: LayoutDashboard },
    { id: 'trainers', label: 'Trainer Roster', icon: Dumbbell },
    { id: 'members', label: 'Global Members', icon: Users },
    { id: 'revenue', label: 'Revenue Engine', icon: CreditCard },
    { id: 'system_logs', label: 'System Logs & Edge', icon: Terminal },
    { id: 'settings', label: 'Platform & Architecture', icon: Settings },
  ];

  const items =
    currentRole === 'super_admin' ? superAdminNav : currentRole === 'trainer' ? trainerNav : customerNav;

  const renderNavContent = () => (
    <div className="flex flex-col h-full">
      {/* Mobile-only close button header */}
      {onCloseMobile && (
        <div className="lg:hidden flex items-center justify-between pb-3 mb-2 border-b border-black/5">
          <span className="text-[11px] font-bold text-[#86868b] uppercase tracking-wider">Navigation Menu</span>
          <button
            onClick={onCloseMobile}
            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-full hover:bg-black/5 cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar pr-0.5 pt-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 active:scale-[0.98] cursor-pointer ${
                isActive
                  ? 'bg-[#0071e3] text-white font-semibold shadow-sm'
                  : 'text-[#1d1d1f] hover:bg-black/5 hover:text-black'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#86868b]'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom info / actions */}
      <div className="mt-auto pt-3 border-t border-black/5">
        {currentRole === 'super_admin' ? (
          <button
            onClick={() => showToast('System Alert Broadcasted', 'Live notification sent to all tenant instances.', 'warning')}
            className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold py-2.5 px-3 rounded-full flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <Megaphone className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">New System Alert</span>
          </button>
        ) : (
          <div className="text-[11px] text-[#86868b] text-center py-1 font-medium tracking-tight">
            xfit Platform • Enterprise
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <aside className="relative w-72 max-w-[80vw] apple-glass h-full p-4 shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200 border-r border-black/5">
            {renderNavContent()}
          </aside>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col apple-glass border-r border-black/5 py-4 px-3 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto z-20">
        {renderNavContent()}
      </aside>
    </>
  );
};
