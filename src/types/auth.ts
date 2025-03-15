
import { Session, Provider } from '@supabase/supabase-js';

export type UserRole = 
  | 'admin' 
  | 'doctor' 
  | 'nurse' 
  | 'caregiver' 
  | 'patient' 
  | 'specialist' 
  | 'administrative' 
  | 'pharmacist'
  | 'lab_technician'
  | 'radiology_technician'
  | 'system_administrator';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: string[];
  approvalStatus?: ApprovalStatus; // Added for clinical staff approval workflow
  avatar?: string; // Optional avatar property
}

export type Language = 'en' | 'pt';
