
export interface ProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  phone?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileFormData {
  name: string;
  email: string;
  role: string;
  department: string;
  phone: string;
  bio: string;
}
