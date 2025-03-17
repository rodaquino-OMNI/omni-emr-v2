
export type UserRole = 
  | 'doctor' 
  | 'physician' 
  | 'nurse' 
  | 'pharmacist' 
  | 'lab_technician'
  | 'radiologist'
  | 'therapist'
  | 'patient'
  | 'receptionist'
  | 'medical_assistant'
  | 'insurance_staff'
  | 'researcher'
  | 'coordinator'
  | 'student'
  | 'guest'
  | 'specialist'
  | 'administrative'
  | 'caregiver'
  | 'radiology_technician'
  | 'medical_staff'
  | 'admin'
  | 'system_administrator'
  | 'all';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export type Languages = 'en' | 'pt';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: string[];
  avatar_url?: string;
  avatar?: string;
  app_metadata?: Record<string, any>;
  user_metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  last_sign_in_at?: string;
  aud?: string;
  confirmed_at?: string;
  recovery_sent_at?: string;
  confirmation_sent_at?: string;
  organization?: string;
  approvalStatus?: ApprovalStatus;
  status?: string;
  phoneNumber?: string;
  mfaEnabled?: boolean;
  createdAt?: Date;
  lastLogin?: Date;
  profileImageUrl?: string;
  country?: string | null;
  insurance?: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  name?: string;
  role?: UserRole;
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: string[];
}

export interface PaginatedUsersResponse {
  users: User[];
  totalCount: number;
  currentPage: number;
}

export interface UserMetadata {
  name?: string;
  role?: UserRole;
  organization?: string;
  specialty?: string;
  department?: string;
  title?: string;
  avatar_url?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean, pendingApproval?: boolean, error?: any }>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<{ success: boolean, user?: User, session?: any, error?: any }>;
  resetPassword: (email: string) => Promise<{ success: boolean, error?: any }>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  setError: () => void;
  hasPermission: (permission: string) => boolean;
  canAccessPatientData: (patientId: string) => boolean;
  language: Languages;
  setLanguage: (language: Languages) => void;
  loginWithSocial: (provider: string) => Promise<{ success: boolean, error?: any }>;
  session: any;
  lastActivity: Date;
  updateLastActivity: () => void;
  sessionTimeoutMinutes: number;
  setSessionTimeoutMinutes: (minutes: number) => void;
}

export interface UseSessionTimeoutProps {
  timeoutMinutes?: number;
  onTimeout?: () => void;
  onWarning?: () => void;
  warningMinutesBefore?: number;
  isEnabled?: boolean;
  defaultTimeoutMinutes?: number;
  warningThresholdMinutes?: number;
  isAuthenticated?: boolean;
  language?: Languages;
}
