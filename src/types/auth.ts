
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

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: string[];
  avatar_url?: string;
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
