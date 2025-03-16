
// User roles
export type UserRole = 
  | 'admin'
  | 'system_administrator'
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
  | 'doctor'
  | 'specialist'
  | 'administrative'
  | 'caregiver'
  | 'radiology_technician';

// User permissions
export type Permission = string;

// User interface
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: UserRole;
  permissions?: Permission[];
  metadata?: Record<string, any>;
  lastLogin?: Date;
  isActive?: boolean;
  profileImageUrl?: string;
  phoneNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
  avatar?: string;
  approvalStatus?: ApprovalStatus;
  status?: string;
  mfaEnabled?: boolean;
}

// Auth context state
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  language: Languages;
}

// Supported languages
export type Languages = 'en' | 'pt';

// Auth provider props
export interface AuthProviderProps {
  children: React.ReactNode;
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Registration data
export interface RegistrationData extends LoginCredentials {
  name: string;
  role?: UserRole;
}

// Auth error
export interface AuthError {
  message: string;
  code?: string;
}

// Auth context type
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{success: boolean, pendingApproval?: boolean, error?: any}>;
  logout: () => Promise<void>;
  register: (data: RegistrationData) => Promise<{success: boolean, error?: any}>;
  resetPassword: (email: string) => Promise<{success: boolean, error?: any}>;
  updateProfile: (profile: Partial<User>) => Promise<void>;
  setError: (error: string | null) => void;
  hasPermission: (permission: string) => boolean;
  canAccessPatientData: (patientId: string) => boolean;
  language: Languages;
  setLanguage: (language: Languages) => void;
  loginWithSocial: (provider: string) => Promise<{success: boolean, error?: any}>;
  session: any;
  lastActivity: Date;
  updateLastActivity: () => void;
  sessionTimeoutMinutes: number;
  setSessionTimeoutMinutes: (minutes: number) => void;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<{success: boolean, error?: any, user?: User | null, session?: any}>;
}

// Approval status for user accounts
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

// Session timeout props
export interface UseSessionTimeoutProps {
  defaultTimeoutMinutes?: number;
  onTimeout: () => void;
  onWarning?: () => void;
  warningThresholdMinutes?: number;
  isAuthenticated: boolean;
  language: Languages;
}
