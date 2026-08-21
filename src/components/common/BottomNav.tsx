import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Dumbbell,
  CalendarDays,
  TrendingUp,
  MessageSquare,
  Users,
  CreditCard,
  Settings,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentRole, activeView, setActiveView } = useApp();

  const customerNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'active_workout', label: 'Workouts', icon: Dumbbell },
    { id: 'plans', label: 'Plans', icon: CalendarDays },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'chat', label: 'Messages', icon: MessageSquare },
  ];

  const trainerNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'workout_plans', label: 'Plans', icon: CalendarDays },
    { id: 'revenue', label: 'Revenue', icon: CreditCard },
    { id: 'chat', label: 'Messages', icon: MessageSquare },
  ];

  const superAdminNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'trainers', label: 'Trainers', icon: Dumbbell },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'revenue', label: 'Revenue', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const items =
    currentRole === 'super_admin' ? superAdminNav : currentRole === 'trainer' ? trainerNav : customerNav;

  return (
    <nav className="lg:hidden fixed bottom-3 left-3 right-3 z-40 apple-glass rounded-full border border-black/5 flex justify-around items-center h-16 px-3 shadow-lg">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex flex-col items-center justify-center w-12 h-11 rounded-full transition-all duration-200 active:scale-90 cursor-pointer ${
              isActive
                ? 'bg-[#0071e3] text-white shadow-sm font-semibold'
                : 'text-[#86868b] hover:bg-black/5 font-medium'
            }`}
          >
            <Icon className="w-4 h-4 mb-0.5" />
            <span className="text-[9px] leading-none tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
