
import { User } from '../context/AuthContext';

// Mock users for demo purposes
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@medcare.com',
    name: 'Admin User',
    role: 'admin',
    permissions: ['all']
  },
  {
    id: '2',
    email: 'doctor@medcare.com',
    name: 'Dr. Sarah Chen',
    role: 'doctor',
    permissions: ['view_patients', 'edit_patients', 'prescribe_medications', 'view_records', 'edit_records', 'schedule_appointments', 'telemedicine']
  },
  {
    id: '3',
    email: 'nurse@medcare.com',
    name: 'Nurse Johnson',
    role: 'nurse',
    permissions: ['view_patients', 'edit_patients', 'view_medications', 'view_records', 'schedule_appointments']
  },
  {
    id: '4',
    email: 'patient@medcare.com',
    name: 'John Patient',
    role: 'patient',
    permissions: ['view_own_records', 'view_own_medications', 'view_own_appointments']
  }
];
