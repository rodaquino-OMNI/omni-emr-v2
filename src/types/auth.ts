
import { Session, Provider } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'doctor' | 'nurse' | 'caregiver' | 'patient' | 'specialist' | 'administrative';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: string[];
}

export type Language = 'en' | 'pt';
