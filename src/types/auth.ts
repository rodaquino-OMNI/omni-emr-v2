
export interface AuthContextType {
  user: User | null | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | null | undefined>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  signIn: (credentials: any) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (data: any) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
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
  lastLogin?: string | Date; // Updated to accept both string and Date
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

// Adding language types for better compatibility
export type Language = 'en' | 'pt';
export type UserRole = 'doctor' | 'nurse' | 'admin' | 'patient' | 'pharmacist' | 'lab_technician' | 'administrative' | 'specialist' | 'system_administrator' | 'caregiver' | 'radiology_technician';
export type ApprovalStatus = 'approved' | 'pending' | 'rejected';
