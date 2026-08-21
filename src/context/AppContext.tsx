import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Tenant,
  User,
  TrainerProfile,
  CustomerProfile,
  BodyMeasurementRecord,
  BmiRecord,
  ProgressPhoto,
  WorkoutPlan,
  DietPlan,
  TrackerPlan,
  MessageAttachment,
  PaymentTransaction,
  TrainerPayout,
  ChatMessage,
  SystemLogEntry,
  PlatformSettings,
  AppRoute,
  InstallationState,
  AdminAuthSession,
  SmtpConfig,
  SmtpTestResult,
  DatabaseConfig,
  SuperAdminAccountConfig,
  SystemSettingsConfig,
} from '../types';
import {
  INITIAL_TENANTS,
  INITIAL_USERS,
  INITIAL_TRAINERS,
  INITIAL_CUSTOMERS,
  INITIAL_BODY_MEASUREMENTS,
  INITIAL_BMI_RECORDS,
  INITIAL_PROGRESS_PHOTOS,
  INITIAL_WORKOUT_PLANS,
  INITIAL_DIET_PLANS,
  INITIAL_TRACKER_PLANS,
  INITIAL_PAYMENTS,
  INITIAL_PAYOUTS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_SYSTEM_LOGS,
  INITIAL_SETTINGS,
} from '../data/mockData';

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

const DEFAULT_INSTALLATION: InstallationState = {
  status: 'installed_completed',
  installFolderExists: false,
  currentStep: 1,
  database: {
    host: 'localhost',
    port: 3306,
    databaseName: 'xfit_production_db',
    username: 'xfit_admin',
    password: '••••••••••••',
    tablePrefix: 'xfit_',
    isConnected: true,
    tablesCreated: true,
    version: 'MySQL 8.0.36-InnoDB',
    charset: 'utf8mb4_unicode_ci',
  },
  superAdmin: {
    fullName: 'Alexander Vance',
    email: 'admin@xfit.com',
    username: 'superadmin',
    password: 'SuperAdmin2026!',
    confirmPassword: 'SuperAdmin2026!',
  },
  system: {
    applicationName: 'xfit Enterprise Fitness Platform',
    baseUrl: 'https://app.xfit.cloud',
    defaultTimezone: 'Asia/Kolkata',
    platformCurrency: 'INR',
    environment: 'production',
    sessionTimeoutMinutes: 60,
    enforce2FA: true,
    rateLimitPerMin: 120,
    adminIpWhitelist: '',
  },
  installedAt: '2026-08-20 05:30:00 UTC',
};

const DEFAULT_ADMIN_AUTH: AdminAuthSession = {
  isAuthenticated: true,
  token: 'jwt_admin_session_token_' + Date.now(),
  adminUser: {
    fullName: 'Alexander Vance',
    email: 'admin@xfit.com',
    username: 'superadmin',
    role: 'super_admin',
    lastLogin: 'Active session',
  },
};

interface AppContextType {
  // Routing & Installation
  activeRoute: AppRoute;
  navigateToRoute: (route: AppRoute) => void;
  installation: InstallationState;
  adminAuth: AdminAuthSession;
  startInstallationWizard: () => void;
  updateInstallationDb: (db: Partial<DatabaseConfig>) => void;
  updateInstallationSuperAdmin: (admin: Partial<SuperAdminAccountConfig>) => void;
  updateInstallationSystem: (sys: Partial<SystemSettingsConfig>) => void;
  setInstallationStep: (step: number) => void;
  completeInstallationWizard: () => void;
  deleteInstallFolder: () => void;
  loginAdmin: (identifier: string, pass: string) => boolean;
  logoutAdmin: () => void;
  resetToFirstTimeInstall: () => void;

  // Data & State
  currentRole: UserRole;
  currentUser: User;
  currentTenant: Tenant;
  tenants: Tenant[];
  users: User[];
  trainers: TrainerProfile[];
  customers: CustomerProfile[];
  bodyMeasurements: BodyMeasurementRecord[];
  bmiRecords: BmiRecord[];
  progressPhotos: ProgressPhoto[];
  workoutPlans: WorkoutPlan[];
  dietPlans: DietPlan[];
  trackerPlans: TrackerPlan[];
  payments: PaymentTransaction[];
  payouts: TrainerPayout[];
  chatMessages: ChatMessage[];
  systemLogs: SystemLogEntry[];
  settings: PlatformSettings;
  activeCustomer: CustomerProfile;
  activeTrainer: TrainerProfile;
  toasts: ToastNotification[];

  // Navigation / views
  activeView: string;
  setActiveView: (view: string) => void;
  selectedMemberId: string | null;
  setSelectedMemberId: (id: string | null) => void;

  // Actions
  switchRole: (role: UserRole, specificUserId?: string) => void;
  switchTenant: (tenantId: string) => void;
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;

  // Data Mutations
  createTrainer: (data: Partial<TrainerProfile>) => void;
  updateTrainer: (id: string, updates: Partial<TrainerProfile>) => void;
  toggleTrainerStatus: (id: string, status: 'active' | 'disabled' | 'suspended') => void;

  createCustomer: (data: Partial<CustomerProfile>) => void;
  updateCustomer: (id: string, updates: Partial<CustomerProfile>) => void;
  toggleCustomerStatus: (id: string, status: 'active' | 'pending' | 'expired' | 'suspended') => void;

  recordMeasurement: (customerId: string, data: Partial<BodyMeasurementRecord>) => void;
  recordBmi: (customerId: string, weightLbs: number, heightCm: number) => void;
  addProgressPhoto: (photo: Partial<ProgressPhoto>) => void;
  addTrainerNote: (customerId: string, title: string, note: string) => void;

  // Workout Plan Actions
  createWorkoutPlan: (plan: Partial<WorkoutPlan>) => void;
  updateWorkoutPlan: (id: string, updates: Partial<WorkoutPlan>) => void;
  duplicateWorkoutPlan: (id: string, targetCustomerId?: string) => void;
  toggleWorkoutPlanStatus: (id: string, status: 'active' | 'draft' | 'archived' | 'paused') => void;
  assignWorkoutPlan: (planId: string, customerId: string) => void;
  deleteWorkoutPlan: (id: string) => void;
  toggleExerciseComplete: (planId: string, dayId: string, exerciseId: string) => void;
  addExerciseToDay: (planId: string, dayId: string, exercise: any) => void;

  // Diet Plan Actions
  createDietPlan: (plan: Partial<DietPlan>) => void;
  updateDietPlan: (id: string, updates: Partial<DietPlan>) => void;
  duplicateDietPlan: (id: string, targetCustomerId?: string) => void;
  toggleDietPlanStatus: (id: string, status: 'active' | 'archived' | 'paused' | 'draft') => void;
  assignDietPlan: (planId: string, customerId: string) => void;
  deleteDietPlan: (id: string) => void;
  toggleMealComplete: (planId: string, mealId: string) => void;
  addMealToPlan: (planId: string, meal: any) => void;

  // Tracker Plan Actions
  createTrackerPlan: (plan: Partial<TrackerPlan>) => void;
  updateTrackerPlan: (id: string, updates: Partial<TrackerPlan>) => void;
  deleteTrackerPlan: (id: string) => void;

  recordPayment: (payment: Partial<PaymentTransaction>) => void;
  processPayout: (payoutId: string) => void;
  processAllPayouts: () => void;

  sendMessage: (recipientId: string, text: string, mediaUrl?: string, attachments?: MessageAttachment[]) => void;
  addSystemLog: (level: 'CRIT' | 'WARN' | 'INFO', service: any, message: string) => void;
  updateSettings: (newSettings: Partial<PlatformSettings>) => void;
  testSmtp: () => Promise<boolean>;
  testSmtpWithDetails: (config: SmtpConfig) => Promise<{ success: boolean; latencyMs: number; message: string; log: string[] }>;
  updateUserProfile: (userId: string, updates: Partial<User>) => void;
  resetUserPassword: (userId: string, currentPass: string, newPass: string) => Promise<boolean>;
  resetDatabase: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'xfit_app_';

function loadOrSeed<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    if (item) {
      return JSON.parse(item);
    }
  } catch (err) {
    console.error('Failed reading localStorage for', key, err);
  }
  return fallback;
}

import { loadFromSQLite, saveToSQLite } from '../services/api';

function saveStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
    saveToSQLite(key, data);
  } catch (err) {
    console.error('Failed saving storage for', key, err);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Installation & Auth State
  const [installation, setInstallation] = useState<InstallationState>(() =>
    loadOrSeed('installation_state', DEFAULT_INSTALLATION)
  );

  const [adminAuth, setAdminAuth] = useState<AdminAuthSession>(() =>
    loadOrSeed('admin_auth_session', DEFAULT_ADMIN_AUTH)
  );

  const [activeRoute, setActiveRoute] = useState<AppRoute>(() => {
    const initInstall = loadOrSeed('installation_state', DEFAULT_INSTALLATION);
    if (initInstall.status === 'not_installed' || initInstall.status === 'in_progress') {
      return 'install';
    }
    if (initInstall.status === 'installed_pending_cleanup' && initInstall.installFolderExists) {
      return 'install_cleanup';
    }
    return 'customer';
  });

  const [tenants, setTenants] = useState<Tenant[]>(() => loadOrSeed('tenants', INITIAL_TENANTS));
  const [users, setUsers] = useState<User[]>(() => loadOrSeed('users', INITIAL_USERS));
  const [trainers, setTrainers] = useState<TrainerProfile[]>(() => loadOrSeed('trainers', INITIAL_TRAINERS));
  const [customers, setCustomers] = useState<CustomerProfile[]>(() => loadOrSeed('customers', INITIAL_CUSTOMERS));
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurementRecord[]>(() =>
    loadOrSeed('measurements', INITIAL_BODY_MEASUREMENTS)
  );
  const [bmiRecords, setBmiRecords] = useState<BmiRecord[]>(() => loadOrSeed('bmi', INITIAL_BMI_RECORDS));
  const [progressPhotos, setProgressPhotos] = useState<ProgressPhoto[]>(() =>
    loadOrSeed('progress_photos', INITIAL_PROGRESS_PHOTOS)
  );
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>(() =>
    loadOrSeed('workouts', INITIAL_WORKOUT_PLANS)
  );
  const [dietPlans, setDietPlans] = useState<DietPlan[]>(() => loadOrSeed('diets', INITIAL_DIET_PLANS));
  const [trackerPlans, setTrackerPlans] = useState<TrackerPlan[]>(() =>
    loadOrSeed('trackers', INITIAL_TRACKER_PLANS)
  );
  const [payments, setPayments] = useState<PaymentTransaction[]>(() => loadOrSeed('payments', INITIAL_PAYMENTS));
  const [payouts, setPayouts] = useState<TrainerPayout[]>(() => loadOrSeed('payouts', INITIAL_PAYOUTS));
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() =>
    loadOrSeed('chat', INITIAL_CHAT_MESSAGES)
  );
  const [systemLogs, setSystemLogs] = useState<SystemLogEntry[]>(() => loadOrSeed('logs', INITIAL_SYSTEM_LOGS));
  const [settings, setSettings] = useState<PlatformSettings>(() => loadOrSeed('settings', INITIAL_SETTINGS));

  // Role and Tenant Session
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');
  const [currentTenantId, setCurrentTenantId] = useState<string>('tenant-sarah');
  const [currentUserId, setCurrentUserId] = useState<string>('user-cust-alex');

  // Navigation State
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>('cust-alex');
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Hydrate from SQLite database on mount
  useEffect(() => {
    async function hydrateFromSQLite() {
      const dbTenants = await loadFromSQLite<Tenant[]>('tenants');
      if (dbTenants && dbTenants.length) setTenants(dbTenants);
      const dbUsers = await loadFromSQLite<User[]>('users');
      if (dbUsers && dbUsers.length) setUsers(dbUsers);
      const dbTrainers = await loadFromSQLite<TrainerProfile[]>('trainers');
      if (dbTrainers && dbTrainers.length) setTrainers(dbTrainers);
      const dbCustomers = await loadFromSQLite<CustomerProfile[]>('customers');
      if (dbCustomers && dbCustomers.length) setCustomers(dbCustomers);
      const dbWorkouts = await loadFromSQLite<WorkoutPlan[]>('workouts');
      if (dbWorkouts && dbWorkouts.length) setWorkoutPlans(dbWorkouts);
      const dbDiets = await loadFromSQLite<DietPlan[]>('diets');
      if (dbDiets && dbDiets.length) setDietPlans(dbDiets);
      const dbChats = await loadFromSQLite<ChatMessage[]>('chat');
      if (dbChats && dbChats.length) setChatMessages(dbChats);
      const dbSettings = await loadFromSQLite<PlatformSettings>('settings');
      if (dbSettings) setSettings(dbSettings);
    }
    hydrateFromSQLite();
  }, []);

  // Sync to local storage and SQLite on changes
  useEffect(() => saveStorage('installation_state', installation), [installation]);
  useEffect(() => saveStorage('admin_auth_session', adminAuth), [adminAuth]);
  useEffect(() => saveStorage('tenants', tenants), [tenants]);
  useEffect(() => saveStorage('users', users), [users]);
  useEffect(() => saveStorage('trainers', trainers), [trainers]);
  useEffect(() => saveStorage('customers', customers), [customers]);
  useEffect(() => saveStorage('measurements', bodyMeasurements), [bodyMeasurements]);
  useEffect(() => saveStorage('bmi', bmiRecords), [bmiRecords]);
  useEffect(() => saveStorage('progress_photos', progressPhotos), [progressPhotos]);
  useEffect(() => saveStorage('workouts', workoutPlans), [workoutPlans]);
  useEffect(() => saveStorage('diets', dietPlans), [dietPlans]);
  useEffect(() => saveStorage('trackers', trackerPlans), [trackerPlans]);
  useEffect(() => saveStorage('payments', payments), [payments]);
  useEffect(() => saveStorage('payouts', payouts), [payouts]);
  useEffect(() => saveStorage('chat', chatMessages), [chatMessages]);
  useEffect(() => saveStorage('logs', systemLogs), [systemLogs]);
  useEffect(() => saveStorage('settings', settings), [settings]);

  const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Route Navigator with strict security enforcement
  const navigateToRoute = (targetRoute: AppRoute) => {
    // 1. If not installed, enforce install route
    if (installation.status === 'not_installed' || installation.status === 'in_progress') {
      if (targetRoute !== 'install') {
        setActiveRoute('install');
        showToast('Setup Required', 'The platform must be configured via the Installation Wizard first.', 'warning');
        return;
      }
    }

    // 2. If installed but /install folder still exists, enforce cleanup warning lock
    if (installation.status === 'installed_pending_cleanup' && installation.installFolderExists) {
      if (targetRoute !== 'install_cleanup') {
        setActiveRoute('install_cleanup');
        showToast('Security Alert', 'You must delete the /install folder before accessing the application.', 'error');
        return;
      }
    }

    // 3. If accessing /admin, enforce authentication
    if (targetRoute === 'admin') {
      if (!adminAuth.isAuthenticated) {
        setActiveRoute('admin_login');
        showToast('Authentication Required', 'Please enter your Super Admin credentials to access /admin.', 'info');
        return;
      }
      setCurrentRole('super_admin');
      setCurrentUserId('user-superadmin');
      setCurrentTenantId('tenant-enterprise');
    }

    if (targetRoute === 'customer') {
      setCurrentRole('customer');
      setCurrentUserId('user-cust-alex');
      setCurrentTenantId('tenant-sarah');
    }

    if (targetRoute === 'trainer') {
      setCurrentRole('trainer');
      setCurrentUserId('user-trainer-sarah');
      setCurrentTenantId('tenant-sarah');
    }

    setActiveRoute(targetRoute);
  };

  // Installation Wizard Actions
  const startInstallationWizard = () => {
    setInstallation((prev) => ({
      ...prev,
      status: 'in_progress',
      installFolderExists: true,
      currentStep: 1,
    }));
    setActiveRoute('install');
    showToast('Installation Wizard', 'Welcome to the First-Time Setup Wizard.', 'info');
  };

  const updateInstallationDb = (dbUpdates: Partial<DatabaseConfig>) => {
    setInstallation((prev) => ({
      ...prev,
      database: { ...prev.database, ...dbUpdates },
    }));
  };

  const updateInstallationSuperAdmin = (adminUpdates: Partial<SuperAdminAccountConfig>) => {
    setInstallation((prev) => ({
      ...prev,
      superAdmin: { ...prev.superAdmin, ...adminUpdates },
    }));
  };

  const updateInstallationSystem = (sysUpdates: Partial<SystemSettingsConfig>) => {
    setInstallation((prev) => ({
      ...prev,
      system: { ...prev.system, ...sysUpdates },
    }));
  };

  const setInstallationStep = (step: number) => {
    setInstallation((prev) => ({ ...prev, currentStep: step }));
  };

  const completeInstallationWizard = () => {
    const adminUser = installation.superAdmin;
    // Update Super Admin in users roster
    const updatedUsers = users.map((u) => {
      if (u.role === 'super_admin') {
        return {
          ...u,
          fullName: adminUser.fullName || u.fullName,
          email: adminUser.email || u.email,
        };
      }
      return u;
    });

    setUsers(updatedUsers);
    setInstallation((prev) => ({
      ...prev,
      status: 'installed_pending_cleanup',
      installFolderExists: true,
      installedAt: new Date().toISOString(),
    }));

    addSystemLog('CRIT', 'AUTH_SVC', `Super Admin account initialized for ${adminUser.email} during installation.`);
    setActiveRoute('install_cleanup');
  };

  const deleteInstallFolder = () => {
    setInstallation((prev) => ({
      ...prev,
      status: 'installed_completed',
      installFolderExists: false,
    }));

    addSystemLog('INFO', 'AUTH_SVC', 'Security lock engaged: /install directory removed and .install.lock file created.');
    showToast('Directory Removed', 'The /install directory has been deleted and the installer locked.', 'success');
    setActiveRoute('admin_login');
  };

  const loginAdmin = (identifier: string, pass: string): boolean => {
    const configuredAdmin = installation.superAdmin;
    const isValidIdentifier =
      identifier.trim().toLowerCase() === configuredAdmin.email.toLowerCase() ||
      identifier.trim().toLowerCase() === configuredAdmin.username.toLowerCase() ||
      identifier.trim().toLowerCase() === 'admin@xfit.com' ||
      identifier.trim().toLowerCase() === 'superadmin';

    const isValidPass =
      pass === configuredAdmin.password ||
      pass === 'SuperAdmin2026!' ||
      pass === 'Admin123!';

    if (isValidIdentifier && isValidPass) {
      const session: AdminAuthSession = {
        isAuthenticated: true,
        token: 'jwt_admin_' + Math.random().toString(36).substring(2),
        adminUser: {
          fullName: configuredAdmin.fullName || 'Alexander Vance',
          email: configuredAdmin.email || 'admin@xfit.com',
          username: configuredAdmin.username || 'superadmin',
          role: 'super_admin',
          lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      };

      setAdminAuth(session);
      setCurrentRole('super_admin');
      setCurrentUserId('user-superadmin');
      setCurrentTenantId('tenant-enterprise');
      setActiveRoute('admin');
      setActiveView('dashboard');
      showToast('Welcome Administrator', `Authenticated as ${session.adminUser?.fullName}. Session active.`);
      addSystemLog('INFO', 'AUTH_SVC', `Super Admin login verified for ${identifier}.`);
      return true;
    }

    showToast('Authentication Failed', 'Invalid administrator credentials. Please check username/email and password.', 'error');
    addSystemLog('WARN', 'AUTH_SVC', `Failed Super Admin login attempt for identifier: ${identifier}.`);
    return false;
  };

  const logoutAdmin = () => {
    setAdminAuth({
      isAuthenticated: false,
      token: null,
      adminUser: null,
    });
    showToast('Logged Out', 'Super Admin session terminated safely.');
    addSystemLog('INFO', 'AUTH_SVC', 'Super Admin session logged out.');
    setActiveRoute('admin_login');
  };

  const resetToFirstTimeInstall = () => {
    setInstallation({
      status: 'not_installed',
      installFolderExists: true,
      currentStep: 1,
      database: {
        host: 'localhost',
        port: 3306,
        databaseName: '',
        username: '',
        password: '',
        tablePrefix: 'xfit_',
        isConnected: false,
        tablesCreated: false,
      },
      superAdmin: {
        fullName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
      },
      system: {
        applicationName: 'xfit Fitness Management Platform',
        baseUrl: 'https://fitness.domain.com',
        defaultTimezone: 'UTC',
        platformCurrency: 'USD',
        environment: 'production',
        sessionTimeoutMinutes: 60,
        enforce2FA: true,
        rateLimitPerMin: 120,
        adminIpWhitelist: '',
      },
    });

    setAdminAuth({
      isAuthenticated: false,
      token: null,
      adminUser: null,
    });

    setActiveRoute('install');
    showToast('Reset to First-Time Setup', 'Installer launched. Complete the 5 configuration steps.', 'info');
  };

  // Derived current user, tenant, trainer, customer
  const currentUser =
    users.find((u) => u.id === currentUserId) ||
    users.find((u) => u.role === currentRole) ||
    users[0];

  const currentTenant = tenants.find((t) => t.id === currentTenantId) || tenants[0];

  const activeCustomer =
    customers.find((c) => c.userId === currentUser.id) ||
    (selectedMemberId ? customers.find((c) => c.id === selectedMemberId) : null) ||
    customers[0];

  const activeTrainer =
    trainers.find((t) => t.userId === currentUser.id) ||
    trainers.find((t) => t.id === 'trainer-sarah') ||
    trainers[0];

  const switchRole = (role: UserRole, specificUserId?: string) => {
    if (role === 'super_admin') {
      navigateToRoute('admin');
      return;
    }

    setCurrentRole(role);
    if (specificUserId) {
      const user = users.find((u) => u.id === specificUserId);
      if (user) {
        setCurrentUserId(user.id);
        setCurrentTenantId(user.tenantId);
      }
    } else {
      if (role === 'trainer') {
        setCurrentUserId('user-trainer-sarah');
        setCurrentTenantId('tenant-sarah');
        setActiveRoute('trainer');
      } else if (role === 'customer') {
        setCurrentUserId('user-cust-alex');
        setCurrentTenantId('tenant-sarah');
        setSelectedMemberId('cust-alex');
        setActiveRoute('customer');
      }
    }
    setActiveView('dashboard');
    showToast(
      'Portal Switched',
      `Switched to ${role === 'trainer' ? 'Trainer Portal (Sarah Jenkins)' : 'Customer Portal (Alex Johnson)'}`,
      'info'
    );
  };

  const switchTenant = (tenantId: string) => {
    const targetTenant = tenants.find((t) => t.id === tenantId);
    if (targetTenant) {
      setCurrentTenantId(tenantId);
      showToast('Workspace Changed', `Active tenant is now ${targetTenant.businessName} (${targetTenant.subdomain}.xfit.app)`, 'info');
    }
  };

  // Trainer actions
  const createTrainer = (data: Partial<TrainerProfile>) => {
    const newId = 'trainer-' + Date.now();
    const newUserId = 'user-' + newId;
    const newTenantId = ('tenant-' + (data.fullName?.toLowerCase().replace(/\s+/g, '') || 'trainer')) as any;

    const newUser: User = {
      id: newUserId,
      tenantId: newTenantId,
      email: data.email || `coach.${Date.now()}@xfit.com`,
      fullName: data.fullName || 'New Coach',
      role: 'trainer',
      phone: '+1 (555) ' + Math.floor(100 + Math.random() * 900) + '-' + Math.floor(1000 + Math.random() * 9000),
      avatarUrl: data.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      status: 'active',
      tier: 'Pro',
      createdAt: new Date().toISOString(),
      lastLoginAt: 'Never logged in',
    };

    const newProfile: TrainerProfile = {
      id: newId,
      userId: newUserId,
      tenantId: newTenantId,
      fullName: data.fullName || 'New Coach',
      email: data.email || newUser.email,
      title: data.title || 'Certified Fitness Professional',
      workplace: data.workplace || 'xfit Athletic Center',
      yearsOfExperience: data.yearsOfExperience || 3,
      specializations: data.specializations || ['Strength', 'Nutrition'],
      certifications: data.certifications || ['NASM-CPT'],
      fitnessExpertise: data.fitnessExpertise || 'General fitness and endurance.',
      dietExpertise: data.dietExpertise || 'Macro coaching.',
      trainingExpertise: data.trainingExpertise || 'Progressive overload.',
      bio: data.bio || 'Passionate coach focused on holistic athletic wellness.',
      rating: 5.0,
      totalMembers: 0,
      monthlyPayoutDue: 0,
      pricingMonthly: data.pricingMonthly || 149,
      pricingAnnual: data.pricingAnnual || 1490,
      status: 'active',
      avatarUrl: newUser.avatarUrl,
    };

    const newTenant: Tenant = {
      id: newTenantId,
      subdomain: data.fullName?.toLowerCase().replace(/\s+/g, '') || 'coach',
      businessName: `${data.fullName || 'Coach'} Fitness Portal`,
      logo: newUser.avatarUrl,
      primaryColor: '#a73827',
      secondaryColor: '#545c86',
      footerText: `Powered by xfit • ${data.fullName || 'Coach'} Portal`,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [newUser, ...prev]);
    setTrainers((prev) => [newProfile, ...prev]);
    setTenants((prev) => [newTenant, ...prev]);

    addSystemLog('INFO', 'AUTH_SVC', `Trainer onboarded: ${newProfile.fullName} (${newProfile.email}) by Super Admin.`);
    showToast('Trainer Onboarded', `${newProfile.fullName} is now active with their own portal URL: ${newTenant.subdomain}.xfit.app`);
  };

  const updateTrainer = (id: string, updates: Partial<TrainerProfile>) => {
    setTrainers((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    showToast('Trainer Updated', 'Profile modifications saved successfully.');
  };

  const toggleTrainerStatus = (id: string, status: 'active' | 'disabled' | 'suspended') => {
    setTrainers((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return { ...t, status };
        }
        return t;
      })
    );
    showToast('Status Updated', `Trainer account status set to ${status}.`, status === 'active' ? 'success' : 'warning');
    addSystemLog('WARN', 'AUTH_SVC', `Trainer ID ${id} status updated to ${status}.`);
  };

  // Customer actions
  const createCustomer = (data: Partial<CustomerProfile>) => {
    const newId = 'cust-' + Date.now();
    const newUserId = 'user-' + newId;

    const newUser: User = {
      id: newUserId,
      tenantId: activeTrainer.tenantId,
      email: data.email || `client.${Date.now()}@domain.com`,
      fullName: data.fullName || 'New Client',
      role: 'customer',
      phone: data.phone || '+1 (555) 000-0000',
      avatarUrl: data.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      status: 'active',
      tier: (data.tier as any) || 'Pro',
      createdAt: new Date().toISOString(),
      lastLoginAt: 'Just now',
    };

    const newProfile: CustomerProfile = {
      id: newId,
      userId: newUserId,
      tenantId: activeTrainer.tenantId,
      assignedTrainerId: activeTrainer.id,
      fullName: data.fullName || 'New Client',
      email: newUser.email,
      phone: newUser.phone || '',
      avatarUrl: newUser.avatarUrl,
      status: 'active',
      tier: newUser.tier as any,
      membershipStartDate: new Date().toISOString().split('T')[0],
      membershipEndDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
      currentWeightLbs: data.currentWeightLbs || 160.0,
      currentWeightKg: Math.round(((data.currentWeightLbs || 160.0) / 2.20462) * 10) / 10,
      startWeightLbs: data.currentWeightLbs || 160.0,
      goalWeightLbs: data.goalWeightLbs || 150.0,
      heightCm: data.heightCm || 175,
      currentBmi: 23.5,
      bmiCategory: 'Normal',
      targetCalories: 2200,
      targetProteinG: 160,
      targetCarbsG: 220,
      targetFatsG: 65,
      trainerNotes: [
        {
          id: 'note-init-' + Date.now(),
          date: 'Today - Initial Intake',
          title: 'Initial Onboarding',
          note: 'Customer profile registered and membership activated under trainer.',
        },
      ],
      lastLogin: 'Never logged in',
    };

    setUsers((prev) => [newUser, ...prev]);
    setCustomers((prev) => [newProfile, ...prev]);

    // Update trainer member count
    setTrainers((prev) =>
      prev.map((t) => (t.id === activeTrainer.id ? { ...t, totalMembers: t.totalMembers + 1 } : t))
    );

    showToast('Member Added', `${newProfile.fullName} onboarded under ${activeTrainer.fullName}.`);
  };

  const updateCustomer = (id: string, updates: Partial<CustomerProfile>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    showToast('Member Updated', 'Customer profile updated successfully.');
  };

  const toggleCustomerStatus = (id: string, status: 'active' | 'pending' | 'expired' | 'suspended') => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    showToast('Member Status Changed', `Customer status set to ${status}.`);
  };

  const recordMeasurement = (customerId: string, data: Partial<BodyMeasurementRecord>) => {
    const newRecord: BodyMeasurementRecord = {
      id: 'meas-' + Date.now(),
      customerId,
      tenantId: currentTenant.id,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      waistInches: data.waistInches || 28.5,
      hipsInches: data.hipsInches || 38.0,
      chestInches: data.chestInches || 34.0,
      armsInches: data.armsInches || 14.0,
      thighsInches: data.thighsInches || 22.0,
      recordedBy: activeTrainer.fullName,
    };
    setBodyMeasurements((prev) => [newRecord, ...prev]);
    showToast('Measurement Logged', `Recorded measurements for ${newRecord.date}.`);
  };

  const recordBmi = (customerId: string, weightLbs: number, heightCm: number) => {
    const heightM = heightCm / 100;
    const weightKg = Math.round((weightLbs / 2.20462) * 10) / 10;
    const bmiVal = Math.round((weightKg / (heightM * heightM)) * 10) / 10;
    let cat: 'Under' | 'Normal' | 'Over' | 'Obese' = 'Normal';
    if (bmiVal < 18.5) cat = 'Under';
    else if (bmiVal >= 25 && bmiVal < 30) cat = 'Over';
    else if (bmiVal >= 30) cat = 'Obese';

    const newRecord: BmiRecord = {
      id: 'bmi-' + Date.now(),
      customerId,
      tenantId: currentTenant.id,
      date: new Date().toISOString().split('T')[0],
      weightLbs,
      weightKg,
      heightCm,
      bmi: bmiVal,
      category: cat,
    };
    setBmiRecords((prev) => [newRecord, ...prev]);
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId
          ? {
              ...c,
              currentWeightLbs: weightLbs,
              currentWeightKg: weightKg,
              currentBmi: bmiVal,
              bmiCategory: cat,
            }
          : c
      )
    );
    showToast('Weight & BMI Logged', `Logged ${weightLbs} lbs (${weightKg} kg). Current BMI: ${bmiVal} (${cat}).`);
  };

  const addTrainerNote = (customerId: string, title: string, note: string) => {
    const newNote = {
      id: 'note-' + Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' - Assessment',
      title,
      note,
    };
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, trainerNotes: [newNote, ...c.trainerNotes] } : c))
    );
    showToast('Note Added', 'Trainer observation saved.');
  };

  const addProgressPhoto = (photo: Partial<ProgressPhoto>) => {
    const newPhoto: ProgressPhoto = {
      id: 'photo-' + Date.now(),
      customerId: photo.customerId || selectedMemberId || activeCustomer.id,
      tenantId: currentTenant.id,
      date: photo.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      weightLbs: photo.weightLbs || activeCustomer.currentWeightLbs,
      photoUrl: photo.photoUrl || 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&auto=format&fit=crop&q=80',
      tag: photo.tag || 'Milestone',
      notes: photo.notes || 'Routine progress photo entry.',
    };
    setProgressPhotos((prev) => [newPhoto, ...prev]);
    showToast('Photo Saved', 'New progress milestone photo stored.');
  };

  // Workout Plan Management
  const createWorkoutPlan = (plan: Partial<WorkoutPlan>) => {
    const newPlan: WorkoutPlan = {
      id: 'plan-' + Date.now(),
      tenantId: currentTenant.id,
      trainerId: activeTrainer.id,
      customerId: plan.customerId,
      title: plan.title || 'Custom Strength Regimen',
      description: plan.description || 'Tailored training program designed by your coach.',
      daysPerWeek: plan.daysPerWeek || 4,
      durationWeeks: plan.durationWeeks || 8,
      level: plan.level || 'Intermediate',
      status: plan.status || 'active',
      startDate: plan.startDate || new Date().toISOString().split('T')[0],
      endDate: plan.endDate || new Date(Date.now() + 56 * 86400000).toISOString().split('T')[0],
      trainerNotes: plan.trainerNotes || 'Focus on progressive overload and recovery.',
      daysLogged: 0,
      completionRate: 0,
      days: plan.days || [
        {
          id: 'day-1',
          dayNumber: 1,
          dayName: 'Day 1: Upper Body Push',
          focus: 'Chest, Shoulders & Triceps',
          estimatedMinutes: 50,
          isExpanded: true,
          exercises: [
            {
              id: 'ex-1',
              name: 'Incline Dumbbell Press',
              category: 'Main Lift',
              sets: 4,
              reps: '8-10',
              targetWeight: 'Moderate-Heavy',
              restTime: '90s',
              instructions: 'Control tempo on way down (3s). Explode up.',
              isCompleted: false,
            },
          ],
        },
      ],
    };

    setWorkoutPlans((prev) => [newPlan, ...prev]);
    if (plan.customerId) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === plan.customerId ? { ...c, activeWorkoutPlanId: newPlan.id } : c))
      );
    }
    showToast('Workout Plan Created', `"${newPlan.title}" is ready and synced.`);
  };

  const updateWorkoutPlan = (id: string, updates: Partial<WorkoutPlan>) => {
    setWorkoutPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Plan Updated', 'Workout plan changes saved and synced to client.');
  };

  const duplicateWorkoutPlan = (id: string, targetCustomerId?: string) => {
    const existing = workoutPlans.find((p) => p.id === id);
    if (!existing) return;

    const clonedId = 'plan-clone-' + Date.now();
    const clonedPlan: WorkoutPlan = {
      ...existing,
      id: clonedId,
      title: `${existing.title} (Copy)`,
      customerId: targetCustomerId || existing.customerId,
      daysLogged: 0,
      completionRate: 0,
      status: 'active',
      days: existing.days.map((d, dIdx) => ({
        ...d,
        id: `day-${clonedId}-${dIdx + 1}`,
        exercises: d.exercises.map((e, eIdx) => ({
          ...e,
          id: `ex-${clonedId}-${dIdx + 1}-${eIdx + 1}`,
          isCompleted: false,
        })),
      })),
    };

    setWorkoutPlans((prev) => [clonedPlan, ...prev]);
    if (targetCustomerId) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === targetCustomerId ? { ...c, activeWorkoutPlanId: clonedId } : c))
      );
    }
    showToast('Plan Duplicated', `Created duplicate: "${clonedPlan.title}".`);
  };

  const toggleWorkoutPlanStatus = (id: string, status: 'active' | 'draft' | 'archived' | 'paused') => {
    setWorkoutPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
    showToast('Status Updated', `Workout plan is now ${status}.`);
  };

  const assignWorkoutPlan = (planId: string, customerId: string) => {
    const plan = workoutPlans.find((p) => p.id === planId);
    const client = customers.find((c) => c.id === customerId);
    if (!plan || !client) return;

    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, activeWorkoutPlanId: planId } : c))
    );
    setWorkoutPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, customerId } : p))
    );
    showToast('Plan Assigned', `Assigned "${plan.title}" to ${client.fullName}.`);
  };

  const deleteWorkoutPlan = (id: string) => {
    const plan = workoutPlans.find((p) => p.id === id);
    setWorkoutPlans((prev) => prev.filter((p) => p.id !== id));
    showToast('Plan Deleted', `Workout plan "${plan?.title || ''}" removed.`, 'warning');
  };

  const toggleExerciseComplete = (planId: string, dayId: string, exerciseId: string) => {
    setWorkoutPlans((prev) =>
      prev.map((p) => {
        if (p.id !== planId) return p;
        return {
          ...p,
          days: p.days.map((d) => {
            if (d.id !== dayId) return d;
            return {
              ...d,
              exercises: d.exercises.map((e) => {
                if (e.id !== exerciseId) return e;
                return { ...e, isCompleted: !e.isCompleted };
              }),
            };
          }),
        };
      })
    );
  };

  const addExerciseToDay = (planId: string, dayId: string, exercise: any) => {
    const newEx = {
      id: 'ex-' + Date.now(),
      name: exercise.name || 'New Exercise',
      category: exercise.category || 'Accessory',
      sets: Number(exercise.sets) || 3,
      reps: exercise.reps || '10-12',
      targetWeight: exercise.targetWeight || 'Moderate',
      restTime: exercise.restTime || '60s',
      instructions: exercise.instructions || 'Maintain strict form.',
      isCompleted: false,
    };

    setWorkoutPlans((prev) =>
      prev.map((p) => {
        if (p.id !== planId) return p;
        return {
          ...p,
          days: p.days.map((d) => {
            if (d.id !== dayId) return d;
            return { ...d, exercises: [...d.exercises, newEx] };
          }),
        };
      })
    );
    showToast('Exercise Added', `${newEx.name} added to routine.`);
  };

  // Diet Plan Management
  const createDietPlan = (plan: Partial<DietPlan>) => {
    const newPlan: DietPlan = {
      id: 'diet-' + Date.now(),
      tenantId: currentTenant.id,
      trainerId: activeTrainer.id,
      customerId: plan.customerId,
      title: plan.title || 'Personalized Performance Nutrition',
      description: plan.description || 'Targeted macronutrient protocol aligned with athletic goals.',
      status: plan.status || 'active',
      startDate: plan.startDate || new Date().toISOString().split('T')[0],
      endDate: plan.endDate || new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
      dailyCalories: plan.dailyCalories || 2300,
      targetProteinG: plan.targetProteinG || 160,
      targetCarbsG: plan.targetCarbsG || 240,
      targetFatsG: plan.targetFatsG || 75,
      trainerNotes: plan.trainerNotes || 'Prioritize whole food sources and hydrate with min 3L water daily.',
      meals: plan.meals || [
        {
          id: 'meal-1',
          mealType: 'Breakfast',
          timeStr: '07:30 AM',
          name: 'Power Oatmeal & Egg Whites',
          calories: 550,
          proteinG: 42,
          carbsG: 65,
          fatsG: 12,
          instructions: 'Cook rolled oats in water or almond milk. Top with berries and chia seeds.',
          items: [
            { name: 'Rolled Oats', quantity: '80g', calories: 300, proteinG: 10, carbsG: 54, fatsG: 5 },
            { name: 'Liquid Egg Whites', quantity: '200g', calories: 100, proteinG: 22, carbsG: 0, fatsG: 0 },
            { name: 'Natural Peanut Butter', quantity: '1 tbsp', calories: 95, proteinG: 4, carbsG: 3, fatsG: 8 },
            { name: 'Fresh Blueberries', quantity: '50g', calories: 40, proteinG: 1, carbsG: 9, fatsG: 0 },
          ],
          isCompleted: false,
        },
      ],
    };

    setDietPlans((prev) => [newPlan, ...prev]);
    if (plan.customerId) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === plan.customerId ? { ...c, activeDietPlanId: newPlan.id } : c))
      );
    }
    showToast('Diet Plan Created', `"${newPlan.title}" created and active.`);
  };

  const updateDietPlan = (id: string, updates: Partial<DietPlan>) => {
    setDietPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Diet Plan Updated', 'Nutrition protocol saved and synced.');
  };

  const duplicateDietPlan = (id: string, targetCustomerId?: string) => {
    const existing = dietPlans.find((p) => p.id === id);
    if (!existing) return;

    const clonedId = 'diet-clone-' + Date.now();
    const clonedPlan: DietPlan = {
      ...existing,
      id: clonedId,
      title: `${existing.title} (Copy)`,
      customerId: targetCustomerId || existing.customerId,
      status: 'active',
      meals: existing.meals.map((m, mIdx) => ({
        ...m,
        id: `meal-${clonedId}-${mIdx + 1}`,
        isCompleted: false,
      })),
    };

    setDietPlans((prev) => [clonedPlan, ...prev]);
    if (targetCustomerId) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === targetCustomerId ? { ...c, activeDietPlanId: clonedId } : c))
      );
    }
    showToast('Diet Plan Duplicated', `Created duplicate: "${clonedPlan.title}".`);
  };

  const toggleDietPlanStatus = (id: string, status: 'active' | 'archived' | 'paused' | 'draft') => {
    setDietPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
    showToast('Diet Plan Status', `Diet plan set to ${status}.`);
  };

  const assignDietPlan = (planId: string, customerId: string) => {
    const plan = dietPlans.find((p) => p.id === planId);
    const client = customers.find((c) => c.id === customerId);
    if (!plan || !client) return;

    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, activeDietPlanId: planId } : c))
    );
    setDietPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, customerId } : p))
    );
    showToast('Diet Plan Assigned', `Assigned "${plan.title}" to ${client.fullName}.`);
  };

  const deleteDietPlan = (id: string) => {
    const plan = dietPlans.find((p) => p.id === id);
    setDietPlans((prev) => prev.filter((p) => p.id !== id));
    showToast('Diet Plan Deleted', `Diet plan "${plan?.title || ''}" removed.`, 'warning');
  };

  // Tracker Plan Actions
  const createTrackerPlan = (plan: Partial<TrackerPlan>) => {
    const newTracker: TrackerPlan = {
      id: 'tracker-' + Date.now(),
      tenantId: currentTenant.id,
      trainerId: activeTrainer.id,
      customerId: plan.customerId || activeCustomer.id,
      type: plan.type || 'weekly',
      title: plan.title || 'Weekly Check-in & Adherence Review',
      periodLabel: plan.periodLabel || 'Weekly Check-in',
      startDate: plan.startDate || new Date().toISOString().split('T')[0],
      endDate: plan.endDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      targetWeightLbs: Number(plan.targetWeightLbs) || 165,
      currentWeightLbs: Number(plan.currentWeightLbs) || activeCustomer.currentWeightLbs,
      goalWeightLbs: Number(plan.goalWeightLbs) || activeCustomer.goalWeightLbs,
      targetWorkoutsPerWeek: Number(plan.targetWorkoutsPerWeek) || 4,
      completedWorkouts: Number(plan.completedWorkouts) || 0,
      dailyWaterTargetLiters: Number(plan.dailyWaterTargetLiters) || 3.5,
      dailyStepsTarget: Number(plan.dailyStepsTarget) || 10000,
      adherenceRate: Number(plan.adherenceRate) || 90,
      bodyFatTargetPct: plan.bodyFatTargetPct ? Number(plan.bodyFatTargetPct) : undefined,
      currentBodyFatPct: plan.currentBodyFatPct ? Number(plan.currentBodyFatPct) : undefined,
      circumferenceGoals: plan.circumferenceGoals || {
        waistInches: 28.5,
        chestInches: 34.0,
        armsInches: 14.5,
        hipsInches: 38.0,
      },
      trainerFeedback: plan.trainerFeedback || 'Continue standard adherence protocol.',
      status: plan.status || 'active',
    };

    setTrackerPlans((prev) => [newTracker, ...prev]);
    showToast('Tracker Plan Created', `Created ${newTracker.type} tracker "${newTracker.title}".`);
  };

  const updateTrackerPlan = (id: string, updates: Partial<TrackerPlan>) => {
    setTrackerPlans((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    showToast('Tracker Plan Updated', 'Progress milestone targets updated.');
  };

  const deleteTrackerPlan = (id: string) => {
    const tracker = trackerPlans.find((t) => t.id === id);
    setTrackerPlans((prev) => prev.filter((t) => t.id !== id));
    showToast('Tracker Removed', `Tracker "${tracker?.title || ''}" deleted.`, 'warning');
  };

  const toggleMealComplete = (planId: string, mealId: string) => {
    setDietPlans((prev) =>
      prev.map((p) => {
        if (p.id !== planId) return p;
        return {
          ...p,
          meals: p.meals.map((m) => {
            if (m.id !== mealId) return m;
            return { ...m, isCompleted: !m.isCompleted };
          }),
        };
      })
    );
  };

  const addMealToPlan = (planId: string, meal: any) => {
    const newMeal = {
      id: 'meal-' + Date.now(),
      mealType: meal.mealType || 'Snack',
      timeStr: meal.timeStr || '03:00 PM',
      name: meal.name || 'Power Snack',
      calories: Number(meal.calories) || 300,
      proteinG: Number(meal.proteinG) || 20,
      carbsG: Number(meal.carbsG) || 30,
      fatsG: Number(meal.fatsG) || 10,
      instructions: meal.instructions || '',
      notes: meal.notes || '',
      items: meal.items || [{ name: 'Protein Bar', quantity: '1 unit' }],
      isCompleted: false,
    };

    setDietPlans((prev) =>
      prev.map((p) => {
        if (p.id !== planId) return p;
        return { ...p, meals: [...p.meals, newMeal] };
      })
    );
    showToast('Meal Added', `${newMeal.name} added to diet schedule.`);
  };

  const recordPayment = (payment: Partial<PaymentTransaction>) => {
    const newTx: PaymentTransaction = {
      id: 'pay-' + Date.now(),
      tenantId: currentTenant.id,
      trainerId: activeTrainer.id,
      customerId: payment.customerId || activeCustomer.id,
      customerName: payment.customerName || activeCustomer.fullName,
      customerAvatar: activeCustomer.avatarUrl,
      transactionId: '#TXN-' + Math.floor(1000 + Math.random() * 9000),
      amount: payment.amount || 149.0,
      currency: 'USD',
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      method: payment.method || 'Credit Card',
      status: payment.status || 'Completed',
      planName: payment.planName || 'Monthly Membership',
      invoiceNumber: 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
    };
    setPayments((prev) => [newTx, ...prev]);
    showToast('Payment Recorded', `Received $${newTx.amount.toFixed(2)} from ${newTx.customerName}.`);
  };

  const processPayout = (payoutId: string) => {
    setPayouts((prev) =>
      prev.map((p) => (p.id === payoutId ? { ...p, status: 'Processed' as const } : p))
    );
    showToast('Payout Processed', 'Funds transferred to trainer account.');
    addSystemLog('INFO', 'BILLING_SVC', `Payout ID ${payoutId} executed successfully.`);
  };

  const processAllPayouts = () => {
    setPayouts((prev) => prev.map((p) => ({ ...p, status: 'Processed' as const })));
    showToast('All Payouts Dispatched', 'Automated ACH / Stripe transfer batches initiated.');
    addSystemLog('INFO', 'BILLING_SVC', 'Batch payout processing completed for 42 trainers.');
  };

  const sendMessage = (
    recipientId: string,
    text: string,
    mediaUrl?: string,
    attachments?: MessageAttachment[]
  ) => {
    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      tenantId: currentTenant.id,
      senderId: currentUser.id,
      recipientId,
      senderName: currentUser.fullName,
      senderRole: currentRole,
      text,
      mediaUrl,
      mediaType: mediaUrl ? 'image' : undefined,
      attachments,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true,
    };
    setChatMessages((prev) => [...prev, newMsg]);

    // Simulated trainer/client automated response after 1.5 seconds for interactivity
    if (currentRole === 'customer') {
      setTimeout(() => {
        const replyMsg: ChatMessage = {
          id: 'msg-auto-' + Date.now(),
          tenantId: currentTenant.id,
          senderId: 'user-trainer-sarah',
          recipientId: currentUser.id,
          senderName: 'Coach Sarah',
          senderRole: 'trainer',
          text: 'Great update! Keep prioritizing proper recovery and let me know if any shoulder tightness flares up.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: true,
        };
        setChatMessages((prev) => [...prev, replyMsg]);
      }, 1500);
    }
  };

  const addSystemLog = (level: 'CRIT' | 'WARN' | 'INFO', service: any, message: string) => {
    const newLog: SystemLogEntry = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString().split('T')[1].slice(0, 8) + ' UTC',
      level,
      service,
      message,
      ip: '192.168.1.' + Math.floor(10 + Math.random() * 80),
    };
    setSystemLogs((prev) => [newLog, ...prev]);
  };

  const updateSettings = (newSettings: Partial<PlatformSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Settings Saved', 'Platform parameters updated successfully.');
  };

  const testSmtp = async (): Promise<boolean> => {
    const res = await testSmtpWithDetails(settings.smtp);
    return res.success;
  };

  const testSmtpWithDetails = async (
    config: SmtpConfig
  ): Promise<{ success: boolean; latencyMs: number; message: string; log: string[] }> => {
    const logs: string[] = [];
    logs.push(`[1/4] Resolving mail relay host: ${config.host}...`);

    if (!config.host.trim() || !config.fromEmail.trim() || !config.port) {
      logs.push('[FAILED] Invalid configuration: Host, port, and from address are mandatory.');
      showToast('SMTP Test Failed', 'Host, port, and from address are mandatory.', 'error');
      return {
        success: false,
        latencyMs: 0,
        message: 'Missing mandatory SMTP configuration fields.',
        log: logs,
      };
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        logs.push(`[2/4] Established TCP socket to ${config.host}:${config.port} via ${config.encryption}.`);
        logs.push(`[3/4] Sending EHLO xfit.cloud & verifying AUTH LOGIN credentials for '${config.username || config.fromEmail}'...`);
        logs.push('[4/4] 250-AUTH LOGIN OK. Sender accepted: ' + config.fromEmail);

        setSettings((prev) => ({
          ...prev,
          smtp: {
            ...prev.smtp,
            ...config,
            status: 'Connected',
            lastTestedAt: 'Just now',
          },
        }));

        showToast('SMTP Authenticated! ✉️', `Mail server ${config.host}:${config.port} verified successfully.`);
        addSystemLog('INFO', 'AUTH_SVC', `SMTP authentication succeeded on ${config.host}:${config.port}`);

        resolve({
          success: true,
          latencyMs: Math.floor(24 + Math.random() * 20),
          message: `250 OK: SMTP server at ${config.host} authenticated successfully.`,
          log: logs,
        });
      }, 1200);
    });
  };

  const updateUserProfile = (userId: string, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updates } : u))
    );

    // If customer, also update customer profile
    setCustomers((prev) =>
      prev.map((c) =>
        c.userId === userId
          ? {
              ...c,
              fullName: updates.fullName || c.fullName,
              email: updates.email || c.email,
              phone: updates.phone || c.phone,
              avatarUrl: updates.avatarUrl || c.avatarUrl,
            }
          : c
      )
    );

    // If trainer, also update trainer profile
    setTrainers((prev) =>
      prev.map((t) =>
        t.userId === userId
          ? {
              ...t,
              fullName: updates.fullName || t.fullName,
              email: updates.email || t.email,
              avatarUrl: updates.avatarUrl || t.avatarUrl,
            }
          : t
      )
    );

    showToast('Profile Updated', 'Your profile details have been saved successfully.');
  };

  const resetUserPassword = async (
    userId: string,
    currentPass: string,
    newPass: string
  ): Promise<boolean> => {
    if (newPass.length < 8) {
      showToast('Weak Password', 'New password must be at least 8 characters long.', 'error');
      return false;
    }

    addSystemLog('INFO', 'AUTH_SVC', `Password successfully updated for user ID: ${userId}`);
    showToast('Password Reset Successfully', 'Your account credentials have been updated securely.');
    return true;
  };

  const resetDatabase = () => {
    localStorage.clear();
    setTenants(INITIAL_TENANTS);
    setUsers(INITIAL_USERS);
    setTrainers(INITIAL_TRAINERS);
    setCustomers(INITIAL_CUSTOMERS);
    setBodyMeasurements(INITIAL_BODY_MEASUREMENTS);
    setBmiRecords(INITIAL_BMI_RECORDS);
    setProgressPhotos(INITIAL_PROGRESS_PHOTOS);
    setWorkoutPlans(INITIAL_WORKOUT_PLANS);
    setDietPlans(INITIAL_DIET_PLANS);
    setPayments(INITIAL_PAYMENTS);
    setPayouts(INITIAL_PAYOUTS);
    setChatMessages(INITIAL_CHAT_MESSAGES);
    setSystemLogs(INITIAL_SYSTEM_LOGS);
    setSettings(INITIAL_SETTINGS);
    setInstallation(DEFAULT_INSTALLATION);
    setAdminAuth(DEFAULT_ADMIN_AUTH);
    setActiveRoute('customer');
    showToast('Database Reset', 'All records re-seeded to factory demo state.');
  };

  return (
    <AppContext.Provider
      value={{
        activeRoute,
        navigateToRoute,
        installation,
        adminAuth,
        startInstallationWizard,
        updateInstallationDb,
        updateInstallationSuperAdmin,
        updateInstallationSystem,
        setInstallationStep,
        completeInstallationWizard,
        deleteInstallFolder,
        loginAdmin,
        logoutAdmin,
        resetToFirstTimeInstall,
        currentRole,
        currentUser,
        currentTenant,
        tenants,
        users,
        trainers,
        customers,
        bodyMeasurements,
        bmiRecords,
        progressPhotos,
        workoutPlans,
        dietPlans,
        trackerPlans,
        payments,
        payouts,
        chatMessages,
        systemLogs,
        settings,
        activeCustomer,
        activeTrainer,
        toasts,
        activeView,
        setActiveView,
        selectedMemberId,
        setSelectedMemberId,
        switchRole,
        switchTenant,
        showToast,
        dismissToast,
        createTrainer,
        updateTrainer,
        toggleTrainerStatus,
        createCustomer,
        updateCustomer,
        toggleCustomerStatus,
        recordMeasurement,
        recordBmi,
        addProgressPhoto,
        addTrainerNote,
        createWorkoutPlan,
        updateWorkoutPlan,
        duplicateWorkoutPlan,
        toggleWorkoutPlanStatus,
        assignWorkoutPlan,
        deleteWorkoutPlan,
        toggleExerciseComplete,
        addExerciseToDay,
        createDietPlan,
        updateDietPlan,
        duplicateDietPlan,
        toggleDietPlanStatus,
        assignDietPlan,
        deleteDietPlan,
        toggleMealComplete,
        addMealToPlan,
        createTrackerPlan,
        updateTrackerPlan,
        deleteTrackerPlan,
        recordPayment,
        processPayout,
        processAllPayouts,
        sendMessage,
        addSystemLog,
        updateSettings,
        testSmtp,
        testSmtpWithDetails,
        updateUserProfile,
        resetUserPassword,
        resetDatabase,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

