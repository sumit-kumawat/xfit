export type UserRole = 'super_admin' | 'trainer' | 'customer' | string;

export type TenantId = string;

export interface Tenant {
  id: string;
  subdomain?: string;
  businessName: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  footerText?: string;
  status: 'active' | 'suspended';
  createdAt?: string;
}

export interface User {
  id: string;
  tenantId?: string;
  email: string;
  username?: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  status: 'active' | 'pending' | 'disabled' | 'suspended' | 'expired' | string;
  tier?: string;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface TrainerProfile {
  id: string;
  userId: string;
  tenantId: TenantId;
  title: string;
  workplace: string;
  yearsOfExperience: number;
  specializations: string[];
  certifications: string[];
  fitnessExpertise: string;
  dietExpertise: string;
  trainingExpertise: string;
  bio: string;
  rating: number;
  totalMembers: number;
  monthlyPayoutDue: number;
  pricingMonthly: number;
  pricingAnnual: number;
  status: 'active' | 'disabled' | 'suspended';
  avatarUrl: string;
  fullName: string;
  email: string;
}

export interface BodyMeasurementRecord {
  id: string;
  customerId: string;
  tenantId: TenantId;
  date: string;
  waistInches: number;
  hipsInches: number;
  chestInches: number;
  armsInches?: number;
  thighsInches?: number;
  recordedBy: string;
}

export interface BmiRecord {
  id: string;
  customerId: string;
  tenantId: TenantId;
  date: string;
  weightLbs: number;
  weightKg: number;
  heightCm: number;
  bmi: number;
  category: 'Under' | 'Normal' | 'Over' | 'Obese';
}

export interface CustomerProfile {
  id: string;
  userId: string;
  tenantId: TenantId;
  assignedTrainerId: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  status: 'active' | 'pending' | 'expired' | 'suspended';
  tier: 'Basic' | 'Pro' | 'Enterprise';
  membershipStartDate: string;
  membershipEndDate: string;
  currentWeightLbs: number;
  currentWeightKg: number;
  startWeightLbs: number;
  goalWeightLbs: number;
  heightCm: number;
  currentBmi: number;
  bmiCategory: 'Under' | 'Normal' | 'Over' | 'Obese';
  targetCalories: number;
  targetProteinG: number;
  targetCarbsG: number;
  targetFatsG: number;
  activeWorkoutPlanId?: string;
  activeDietPlanId?: string;
  trainerNotes: { id: string; date: string; title: string; note: string }[];
  emergencyContact?: { name: string; phone: string };
  medicalNotes?: string;
  lastLogin: string;
}

export interface ExerciseItem {
  id: string;
  name: string;
  category: string; // 'Main Lift' | 'Accessory' | 'Cardio'
  sets: number;
  reps: string;
  targetWeight: string;
  restTime: string;
  instructions: string;
  isCompleted?: boolean;
  imageUrl?: string;
}

export type WorkoutExercise = ExerciseItem;

export interface WorkoutDay {
  id: string;
  dayNumber: number;
  dayName: string;
  focus: string;
  estimatedMinutes: number;
  exercises: ExerciseItem[];
  isExpanded?: boolean;
}

export interface ProgressPhoto {
  id: string;
  customerId: string;
  tenantId: TenantId;
  date: string;
  weightLbs: number;
  photoUrl: string;
  tag: 'Front View' | 'Side View' | 'Back View' | 'Milestone';
  notes?: string;
}

export interface WorkoutPlan {
  id: string;
  tenantId: TenantId;
  trainerId: string;
  customerId?: string; // If assigned to specific client, or general template
  title: string;
  description: string;
  daysPerWeek: number;
  durationWeeks: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'active' | 'draft' | 'archived' | 'paused';
  startDate?: string;
  endDate?: string;
  trainerNotes?: string;
  daysLogged: number;
  completionRate: number;
  days: WorkoutDay[];
}

export interface MealItem {
  name: string;
  quantity: string;
  calories?: number;
  proteinG?: number;
  carbsG?: number;
  fatsG?: number;
}

export type DietItem = MealItem;

export interface DietMeal {
  id: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Pre-Workout' | 'Post-Workout';
  timeStr: string;
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatsG: number;
  instructions?: string;
  notes?: string;
  items: MealItem[];
  imageUrl?: string;
  isCompleted?: boolean;
}

export interface DietPlan {
  id: string;
  tenantId: TenantId;
  trainerId: string;
  customerId?: string;
  title: string;
  dietType?: 'Vegetarian' | 'Non-Vegetarian';
  description?: string;
  status: 'active' | 'archived' | 'paused' | 'draft';
  startDate?: string;
  endDate?: string;
  dailyCalories: number;
  targetProteinG: number;
  targetCarbsG: number;
  targetFatsG: number;
  trainerNotes: string;
  meals: DietMeal[];
}

export interface TrackerPlan {
  id: string;
  tenantId: TenantId;
  trainerId: string;
  customerId: string;
  type: 'weekly' | 'monthly';
  title: string;
  periodLabel: string;
  startDate: string;
  endDate: string;
  targetWeightLbs: number;
  currentWeightLbs: number;
  goalWeightLbs: number;
  targetWorkoutsPerWeek: number;
  completedWorkouts: number;
  dailyWaterTargetLiters: number;
  dailyStepsTarget: number;
  adherenceRate: number;
  bodyFatTargetPct?: number;
  currentBodyFatPct?: number;
  circumferenceGoals?: {
    waistInches?: number;
    chestInches?: number;
    armsInches?: number;
    hipsInches?: number;
    thighsInches?: number;
  };
  trainerFeedback?: string;
  status: 'active' | 'completed' | 'draft';
}

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  type?: 'image' | 'document' | 'video' | 'pdf';
  fileType?: 'image' | 'document' | 'video' | 'pdf' | string;
  size?: string;
  fileSizeBytes?: number;
}

export interface PaymentTransaction {
  id: string;
  tenantId: TenantId;
  trainerId: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  transactionId: string;
  amount: number;
  currency: string;
  date: string;
  method: 'Credit Card' | 'Stripe' | 'Bank Transfer' | 'Cash';
  status: 'Completed' | 'Pending' | 'Failed' | 'Refunded';
  planName: string;
  invoiceNumber: string;
}

export interface TrainerPayout {
  id: string;
  trainerId: string;
  trainerName: string;
  trainerSpecialty: string;
  trainerAvatar: string;
  sessions: number;
  amountDue: number;
  nextCycleDate: string;
  status: 'Pending' | 'Processed';
}

export interface ChatMessage {
  id: string;
  tenantId: TenantId;
  senderId: string;
  recipientId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  mediaUrl?: string;
  mediaType?: 'video' | 'image';
  attachments?: MessageAttachment[];
  timestamp: string;
  read: boolean;
}

export interface SystemLogEntry {
  id: string;
  timestamp: string;
  level: 'CRIT' | 'WARN' | 'INFO';
  service: 'AUTH_SVC' | 'BILLING_SVC' | 'DB_CLUSTER' | 'CRON_SVC' | 'PAY_GW' | 'API_GATEWAY';
  message: string;
  ip?: string;
}

export interface SmtpConfig {
  host: string;
  port: number;
  encryption: 'TLS' | 'SSL' | 'None';
  username: string;
  fromEmail: string;
  fromName: string;
  status: 'Connected' | 'Error' | 'Untested';
  lastTestedAt?: string;
}

export interface PlatformSettings {
  portalDisplayName: string;
  platformLogoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  smtp: SmtpConfig;
  payoutCycleDay: number;
  maintenanceMode: boolean;
}

// ----------------------------------------------------
// Installation & Admin Auth Types
// ----------------------------------------------------

export type AppRoute =
  | 'install'
  | 'install_cleanup'
  | 'admin_login'
  | 'admin'
  | 'trainer'
  | 'customer';

export type InstallationStatus =
  | 'not_installed'
  | 'in_progress'
  | 'installed_pending_cleanup'
  | 'installed_completed';

export interface SystemCheckItem {
  id: string;
  category: 'runtime' | 'database' | 'storage' | 'security' | 'service';
  name: string;
  required: string;
  current: string;
  passed: boolean;
  notes?: string;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  databaseName: string;
  username: string;
  password: string;
  tablePrefix: string;
  isConnected: boolean;
  tablesCreated: boolean;
  version?: string;
  charset?: string;
}

export interface SuperAdminAccountConfig {
  fullName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface SystemSettingsConfig {
  applicationName: string;
  baseUrl: string;
  defaultTimezone: string;
  platformCurrency: string;
  environment: 'production' | 'staging' | 'development';
  sessionTimeoutMinutes: number;
  enforce2FA: boolean;
  rateLimitPerMin: number;
  adminIpWhitelist: string;
}

export interface InstallationState {
  status: InstallationStatus;
  installFolderExists: boolean;
  currentStep: number;
  database: DatabaseConfig;
  superAdmin: SuperAdminAccountConfig;
  system: SystemSettingsConfig;
  installedAt?: string;
}

export interface AdminAuthSession {
  isAuthenticated: boolean;
  token: string | null;
  adminUser: {
    fullName: string;
    email: string;
    username: string;
    role: 'super_admin';
    lastLogin: string;
  } | null;
}

export interface SmtpTestResult {
  success: boolean;
  message: string;
  latencyMs: number;
  timestamp: string;
  logs: string[];
}

