import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  HelpCircle,
  Search,
  Menu,
  Lock,
  User as UserIcon,
  KeyRound,
  LogOut,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Mail,
  Calendar,
  Building,
  Eye,
  EyeOff,
  Edit2,
  Save,
  X,
} from 'lucide-react';
import { Modal } from './Modal';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const {
    currentRole,
    currentUser,
    activeCustomer,
    activeTrainer,
    activeView,
    setActiveView,
    navigateToRoute,
    logoutAdmin,
    switchRole,
    updateUserProfile,
    resetUserPassword,
    showToast,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Profile Edit Form State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: currentUser.fullName,
    email: currentUser.email,
    phone: currentUser.phone || '+91 98765 43210',
    avatarUrl: currentUser.avatarUrl,
  });

  // Password Reset Form State
  const [passForm, setPassForm] = useState({
    currentPass: '',
    newPass: '',
    confirmPass: '',
  });
  const [showPassText, setShowPassText] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update profile form when user changes
  useEffect(() => {
    setProfileForm({
      fullName: currentUser.fullName,
      email: currentUser.email,
      phone: currentUser.phone || '+91 98765 43210',
      avatarUrl: currentUser.avatarUrl,
    });
    setIsEditingProfile(false);
  }, [currentUser]);

  const handleLogout = () => {
    if (currentRole === 'super_admin') {
      logoutAdmin();
    } else {
      showToast('Logged Out', 'You have been signed out successfully.', 'info');
      // Redirect to login or default customer view
      navigateToRoute('admin_login');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(currentUser.id, {
      fullName: profileForm.fullName.trim(),
      email: profileForm.email.trim(),
      phone: profileForm.phone.trim(),
      avatarUrl: profileForm.avatarUrl.trim(),
    });
    setIsEditingProfile(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passForm.newPass || !passForm.confirmPass) {
      showToast('Missing Fields', 'Please complete all required password fields.', 'error');
      return;
    }
    if (passForm.newPass !== passForm.confirmPass) {
      showToast('Mismatch Error', 'New password and confirmation password do not match.', 'error');
      return;
    }
    if (passForm.newPass.length < 8) {
      showToast('Weak Password', 'Password must be at least 8 characters long.', 'error');
      return;
    }

    setPassLoading(true);
    const ok = await resetUserPassword(currentUser.id, passForm.currentPass, passForm.newPass);
    setPassLoading(false);

    if (ok) {
      setShowPasswordModal(false);
      setPassForm({ currentPass: '', newPass: '', confirmPass: '' });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full apple-glass border-b border-black/5 shadow-xs h-16 transition-all duration-300">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          
          {/* Left zone: Mobile toggle and Brand mark */}
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-black/5 active:scale-95 transition-all cursor-pointer"
                aria-label="Toggle menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div
              onClick={() => setActiveView('dashboard')}
              className="cursor-pointer flex items-center gap-2.5 group select-none"
            >
              <div className="w-9 h-9 rounded-2xl bg-[#0071e3] flex items-center justify-center font-black text-white text-base shadow-sm group-hover:bg-[#0077ed] transition-all">
                X
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-[#1d1d1f]">
                xfit
                {currentRole === 'trainer' && (
                  <span className="text-xs font-bold text-slate-700 ml-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-black/5 hidden sm:inline-block">
                    Trainer Hub
                  </span>
                )}
                {currentRole === 'customer' && (
                  <span className="text-xs font-bold text-emerald-700 ml-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/60 hidden sm:inline-block">
                    Member App
                  </span>
                )}
                {currentRole === 'super_admin' && (
                  <span className="text-xs font-bold text-amber-800 ml-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/60 hidden sm:inline-block">
                    Admin
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Center search (desktop only) */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={
                  currentRole === 'trainer'
                    ? 'Search members, exercises, diet charts...'
                    : currentRole === 'super_admin'
                    ? 'Search gyms, trainers, members, telemetry...'
                    : 'Search workouts, meals, logs, metrics...'
                }
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-[10px] text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#a73827]/20 focus:border-[#a73827] focus:bg-white transition-all h-[38px]"
              />
            </div>
          </div>

          {/* Right zone: Notifications, Help, Profile Dropdown & Logout */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Notifications Button */}
            <button
              onClick={() => setShowNotifications(true)}
              className="relative p-2 text-slate-500 hover:text-[#a73827] rounded-[10px] hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#a73827] rounded-full ring-2 ring-white" />
            </button>

            {/* Help Button */}
            <button
              onClick={() => setShowHelpModal(true)}
              className="hidden sm:flex p-2 text-slate-500 hover:text-[#a73827] rounded-[10px] hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
              aria-label="Help and documentation"
              title="Support & Docs"
            >
              <HelpCircle className="w-4.5 h-4.5" />
            </button>

            {/* Modern Profile Dropdown Section */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-[10px] hover:bg-slate-100 border border-slate-200/80 transition-all cursor-pointer select-none text-left"
                aria-expanded={showProfileDropdown}
                aria-label="User menu"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.fullName}
                  className="w-7 h-7 rounded-[10px] object-cover border border-slate-200 shadow-2xs shrink-0"
                />
                <div className="hidden lg:block text-left text-xs leading-tight min-w-0 max-w-[120px]">
                  <div className="font-bold text-slate-900 truncate">{currentUser.fullName}</div>
                  <div className="text-[10px] text-slate-500 capitalize truncate">
                    {currentRole.replace('_', ' ')}
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${showProfileDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-[10px] border border-slate-200 shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* User details header inside dropdown */}
                  <div className="px-3.5 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{currentUser.fullName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-bold rounded-[6px] bg-slate-100 text-slate-700 capitalize border border-slate-200/60">
                      {currentRole.replace('_', ' ')} • Active
                    </span>
                  </div>

                  {/* Dropdown Actions */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        setShowProfileModal(true);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      <span>View Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        setShowPasswordModal(true);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <KeyRound className="w-4 h-4 text-slate-400" />
                      <span>Reset Password</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Consistent Logout Icon at the end of Header for ALL Users */}
            <button
              onClick={handleLogout}
              className="p-2 text-rose-600 hover:text-white hover:bg-[#a73827] rounded-[10px] border border-rose-200/80 hover:border-[#a73827] transition-all duration-150 active:scale-95 cursor-pointer ml-1"
              title="Sign Out / Logout"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* MODAL 1: VIEW PROFILE */}
      <Modal
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
          setIsEditingProfile(false);
        }}
        title="User Profile"
        subtitle="Manage personal account credentials and details"
        maxWidth="lg"
      >
        <div className="space-y-5">
          {/* Header Card with Avatar */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 bg-slate-50 rounded-[10px] border border-slate-200">
            <img
              src={profileForm.avatarUrl || currentUser.avatarUrl}
              alt={currentUser.fullName}
              className="w-18 h-18 rounded-[10px] object-cover border-2 border-white shadow-sm shrink-0"
            />
            <div className="text-center sm:text-left flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="text-base font-bold text-slate-900">{currentUser.fullName}</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-[6px] bg-[#a73827]/10 text-[#a73827] border border-[#a73827]/20 uppercase">
                  {currentRole.replace('_', ' ')}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-[6px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentUser.email}</span>
              </p>
              <p className="text-xs text-slate-600 mt-0.5 flex items-center justify-center sm:justify-start gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentUser.phone || '+91 98765 43210'}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="px-3 py-1.5 text-xs font-bold rounded-[10px] border border-slate-300 hover:bg-white text-slate-700 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer shrink-0"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>

          {/* Edit Form or Readonly View */}
          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-[10px] border border-slate-300 focus:ring-2 focus:ring-[#a73827]/20 focus:border-[#a73827] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-[10px] border border-slate-300 focus:ring-2 focus:ring-[#a73827]/20 focus:border-[#a73827] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-[10px] border border-slate-300 focus:ring-2 focus:ring-[#a73827]/20 focus:border-[#a73827] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Avatar Image URL</label>
                  <input
                    type="url"
                    value={profileForm.avatarUrl}
                    onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-[10px] border border-slate-300 focus:ring-2 focus:ring-[#a73827]/20 focus:border-[#a73827] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-[10px] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#a73827] hover:bg-[#8f2f20] text-white rounded-[10px] shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Role specific profile insights */}
              {currentRole === 'customer' && activeCustomer && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 rounded-[10px] border border-slate-200/80 text-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Current Weight</span>
                    <span className="text-base font-extrabold text-slate-900 mt-0.5 block">{activeCustomer.currentWeightKg} kg</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-[10px] border border-slate-200/80 text-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Body Mass Index</span>
                    <span className="text-base font-extrabold text-slate-900 mt-0.5 block">{activeCustomer.currentBmi} BMI</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-[10px] border border-slate-200/80 text-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Daily Calorie Goal</span>
                    <span className="text-base font-extrabold text-slate-900 mt-0.5 block">{activeCustomer.targetCalories} kcal</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-[10px] border border-slate-200/80 text-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Membership Plan</span>
                    <span className="text-base font-extrabold text-emerald-700 mt-0.5 block">{activeCustomer.tier} Tier</span>
                  </div>
                </div>
              )}

              {currentRole === 'trainer' && activeTrainer && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 rounded-[10px] border border-slate-200/80 text-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Active Members</span>
                    <span className="text-base font-extrabold text-slate-900 mt-0.5 block">{activeTrainer.totalMembers}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-[10px] border border-slate-200/80 text-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Experience</span>
                    <span className="text-base font-extrabold text-slate-900 mt-0.5 block">{activeTrainer.yearsOfExperience} Years</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-[10px] border border-slate-200/80 text-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Client Rating</span>
                    <span className="text-base font-extrabold text-amber-700 mt-0.5 block">★ {activeTrainer.rating}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-[10px] border border-slate-200/80 text-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Monthly Pricing</span>
                    <span className="text-base font-extrabold text-[#a73827] mt-0.5 block">₹{activeTrainer.pricingMonthly}</span>
                  </div>
                </div>
              )}

              {/* Account Security details */}
              <div className="p-3.5 bg-slate-50 rounded-[10px] border border-slate-200/80 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Security & Password</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Password last updated recently • Multi-factor authentication active</p>
                </div>
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    setShowPasswordModal(true);
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-[#a73827] bg-white border border-slate-200 hover:border-[#a73827] rounded-[10px] transition-colors cursor-pointer shadow-2xs"
                >
                  Change Password
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* MODAL 2: RESET PASSWORD */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPassForm({ currentPass: '', newPass: '', confirmPass: '' });
        }}
        title="Reset Account Password"
        subtitle="Ensure your account remains safe with a strong passphrase"
        maxWidth="md"
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Current Password</label>
            <input
              type={showPassText ? 'text' : 'password'}
              required
              value={passForm.currentPass}
              onChange={(e) => setPassForm({ ...passForm, currentPass: e.target.value })}
              placeholder="Enter current password"
              className="w-full px-3 py-2.5 text-xs rounded-[10px] border border-slate-300 focus:ring-2 focus:ring-[#a73827]/20 focus:border-[#a73827] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
            <input
              type={showPassText ? 'text' : 'password'}
              required
              value={passForm.newPass}
              onChange={(e) => setPassForm({ ...passForm, newPass: e.target.value })}
              placeholder="Enter new password (min. 8 characters)"
              className="w-full px-3 py-2.5 text-xs rounded-[10px] border border-slate-300 focus:ring-2 focus:ring-[#a73827]/20 focus:border-[#a73827] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password</label>
            <input
              type={showPassText ? 'text' : 'password'}
              required
              value={passForm.confirmPass}
              onChange={(e) => setPassForm({ ...passForm, confirmPass: e.target.value })}
              placeholder="Re-enter new password"
              className="w-full px-3 py-2.5 text-xs rounded-[10px] border border-slate-300 focus:ring-2 focus:ring-[#a73827]/20 focus:border-[#a73827] focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showPassText}
                onChange={(e) => setShowPassText(e.target.checked)}
                className="rounded border-slate-300 text-[#a73827] focus:ring-[#a73827]"
              />
              <span>Show passwords</span>
            </label>

            <span className="text-[11px] text-slate-400">Min. 8 characters</span>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowPasswordModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-[10px] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={passLoading}
              className="px-5 py-2 text-xs font-bold bg-[#a73827] hover:bg-[#8f2f20] text-white rounded-[10px] shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{passLoading ? 'Updating...' : 'Update Password'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: NOTIFICATIONS */}
      <Modal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        title="Recent Notifications"
        subtitle="System alerts and activity logs"
        maxWidth="md"
      >
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-[10px] flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-[#a73827] mt-1.5 shrink-0" />
            <div>
              <div className="font-bold text-slate-900">Workout Plan Logged</div>
              <p className="text-slate-600 mt-0.5">Heavy Leg Hypertrophy routine completed and verified.</p>
              <span className="text-[10px] text-slate-400 mt-1 block font-mono">10 mins ago</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-[10px] flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
            <div>
              <div className="font-bold text-slate-900">Payment Processed (₹3,499)</div>
              <p className="text-slate-600 mt-0.5">Pro Tier membership renewed successfully via Razorpay / Stripe.</p>
              <span className="text-[10px] text-slate-400 mt-1 block font-mono">2 hours ago</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-[10px] flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
            <div>
              <div className="font-bold text-slate-900">Coach Message Received</div>
              <p className="text-slate-600 mt-0.5">Coach Sarah sent weekly nutrition adjustments and form check feedback.</p>
              <span className="text-[10px] text-slate-400 mt-1 block font-mono">Yesterday</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* MODAL 4: HELP & DOCUMENTATION */}
      <Modal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        title="Help & Platform Support"
        subtitle="Role-based guides and operational documentation"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-[10px] border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900">Role-Based Access Overview</h4>
            <p className="text-slate-600 leading-relaxed">
              • <strong>Member:</strong> Track daily workouts, diet protocol, log body measurements & biometrics, chat with your trainer.
              <br />
              • <strong>Trainer:</strong> Manage assigned client roster, build customized workout & nutrition plans, review client progress.
              <br />
              • <strong>Super Admin:</strong> Oversee all tenant branches, trainer payroll, platform revenue analytics, system audit logs.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-[10px] border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">Default Platform Currency</span>
              <span className="text-slate-500 text-[11px]">Configured to INR (₹) across all transactions and plans</span>
            </div>
            <span className="px-2.5 py-1 bg-slate-200 rounded-[6px] text-xs font-bold text-slate-800">
              ₹ INR
            </span>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setShowHelpModal(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-[10px] text-xs font-bold cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
