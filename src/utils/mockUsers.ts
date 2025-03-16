
import { User, UserRole } from '../types/auth';
import { v4 as uuidv4 } from 'uuid';

// Helper to create mock users with consistent structure
const createMockUser = (
  role: UserRole, 
  name: string, 
  email: string, 
  permissions: string[] = []
): User => ({
  id: uuidv4(),
  name,
  email,
  role,
  status: 'active',
  permissions,
  mfaEnabled: false,
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
  preferredLanguage: 'en',
  approvalStatus: 'approved'
});

// Mock users for development and testing
export const mockUsers: User[] = [
  createMockUser(
    'doctor', 
    'Dr. Amanda Silva', 
    'doctor@example.com', 
    ['read:patients', 'write:prescriptions', 'read:medical_records', 'write:medical_records']
  ),
  createMockUser(
    'nurse', 
    'Nurse João Costa', 
    'nurse@example.com', 
    ['read:patients', 'read:prescriptions', 'write:vitals', 'read:medical_records']
  ),
  createMockUser(
    'admin', 
    'Admin Sarah Johnson', 
    'admin@example.com', 
    ['admin:all', 'read:all', 'write:all']
  ),
  createMockUser(
    'patient', 
    'Patient Carlos Oliveira', 
    'patient@example.com', 
    ['read:own_records', 'read:own_prescriptions']
  ),
  createMockUser(
    'pharmacist', 
    'Pharmacist Maria Santos', 
    'pharmacist@example.com', 
    ['read:prescriptions', 'write:medications', 'read:patients']
  ),
  createMockUser(
    'lab_technician', 
    'Lab Tech David Chen', 
    'lab@example.com', 
    ['read:lab_orders', 'write:lab_results', 'read:patients']
  )
];

export default mockUsers;
