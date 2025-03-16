
export interface AuthContextType {
  user: User | null | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | null | undefined>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  login: (email: string, password: string) => Promise<{success: boolean; pendingApproval?: boolean}>;
  logout: () => Promise<void>;
  loginWithSocial: (provider: string) => Promise<{success: boolean; error?: any}>;
  signUp: (email: string, password: string, name: string, role: UserRole) => Promise<{success: boolean; user?: User; error?: any}>;
  resetPassword: (email: string) => Promise<{success: boolean; error?: any}>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  checkAuthStatus: () => Promise<boolean>;
  hasPermission: (permission: string) => boolean;
  canAccessPatientData: (patientId: string) => boolean;
  session: any;
  sessionTimeoutMinutes: number;
  setSessionTimeoutMinutes: React.Dispatch<React.SetStateAction<number>>;
  lastActivity: Date;
  updateLastActivity?: () => void;
}

export interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  role: UserRole;
  status: 'active' | 'pending' | 'suspended' | 'inactive' | 'pending_approval';
  permissions?: string[];
  mfaEnabled?: boolean;
  createdAt?: string;
  organization?: string;
  lastLogin?: string | Date; // Accept both string and Date
  preferredLanguage?: Language;
  approvalStatus?: ApprovalStatus;
  avatar?: string;
  department?: string;
  specialties?: string[];
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
}

export type Language = 'en' | 'pt';
export type UserRole = 'doctor' | 'nurse' | 'admin' | 'patient' | 'pharmacist' | 'lab_technician' | 'administrative' | 'specialist' | 'system_administrator' | 'caregiver' | 'radiology_technician';
export type ApprovalStatus = 'approved' | 'pending' | 'rejected';
