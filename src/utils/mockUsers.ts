
import { User } from '../context/AuthContext';

// Mock users for demo purposes
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@omnicare.com',
    name: 'Admin User',
    role: 'admin',
    status: 'active',
  },
  {
    id: '2',
    email: 'doctor@omnicare.com',
    name: 'Dr. Sarah Chen',
    role: 'doctor',
    status: 'active',
  },
  {
    id: '3',
    email: 'nurse@omnicare.com',
    name: 'Nurse Johnson',
    role: 'nurse',
    status: 'active',
  },
  {
    id: '4',
    email: 'patient@omnicare.com',
    name: 'John Patient',
    role: 'patient',
    status: 'active',
  }
];
