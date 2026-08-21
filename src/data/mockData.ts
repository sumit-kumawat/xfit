import {
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
  PaymentTransaction,
  TrainerPayout,
  ChatMessage,
  SystemLogEntry,
  PlatformSettings,
} from '../types';

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'tenant-enterprise',
    subdomain: 'enterprise',
    businessName: 'xfit Enterprise Global',
    logo: '',
    primaryColor: '#0071e3',
    secondaryColor: '#86868b',
    footerText: 'Powered by xfit Enterprise Platform',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-superadmin',
    tenantId: 'tenant-enterprise',
    email: 'admin@xfit.com',
    fullName: 'Alexander Vance',
    role: 'super_admin',
    phone: '+1 (555) 019-2831',
    avatarUrl: '',
    status: 'active',
    tier: 'Enterprise',
    createdAt: new Date().toISOString(),
    lastLoginAt: 'Active session',
  },
];

export const INITIAL_TRAINERS: TrainerProfile[] = [];
export const INITIAL_CUSTOMERS: CustomerProfile[] = [];
export const INITIAL_BODY_MEASUREMENTS: BodyMeasurementRecord[] = [];
export const INITIAL_BMI_RECORDS: BmiRecord[] = [];
export const INITIAL_PROGRESS_PHOTOS: ProgressPhoto[] = [];
export const INITIAL_WORKOUT_PLANS: WorkoutPlan[] = [];
export const INITIAL_DIET_PLANS: DietPlan[] = [];
export const INITIAL_TRACKER_PLANS: TrackerPlan[] = [];
export const INITIAL_PAYMENTS: PaymentTransaction[] = [];
export const INITIAL_PAYOUTS: TrainerPayout[] = [];
export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [];

export const INITIAL_SYSTEM_LOGS: SystemLogEntry[] = [
  {
    id: 'log-1',
    timestamp: new Date().toISOString(),
    level: 'INFO',
    service: 'DB_CLUSTER',
    message: 'SQLite production database engine initialized.',
    ip: '127.0.0.1',
  },
];

export const INITIAL_SETTINGS: PlatformSettings = {
  portalDisplayName: 'xfit Enterprise Fitness Hub',
  platformLogoUrl: '',
  primaryColor: '#0071e3',
  secondaryColor: '#86868b',
  smtp: {
    host: 'smtp.xfit.cloud',
    port: 587,
    encryption: 'TLS',
    username: 'notifications@xfit.cloud',
    fromEmail: 'noreply@xfit.cloud',
    fromName: 'xfit Cloud Services',
    status: 'Connected',
  },
  payoutCycleDay: 1,
  maintenanceMode: false,
};
