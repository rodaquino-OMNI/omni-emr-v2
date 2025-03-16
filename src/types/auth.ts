
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
  | 'guest';

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
