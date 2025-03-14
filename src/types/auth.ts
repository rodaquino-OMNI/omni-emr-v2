
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

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: string[];
}

export type Language = 'en' | 'pt';
