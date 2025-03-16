
import { User } from '../../../types/auth';

// Test user factory
export const createMockUser = (role: string, customPermissions: string[] = []): User => {
  return {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    role: role as any,
    permissions: customPermissions,
    status: 'active',
    approvalStatus: 'approved'
  };
};

// Create test users with different roles
export const testUsers = {
  admin: createMockUser('admin'),
  doctor: createMockUser('doctor'),
  nurse: createMockUser('nurse'),
  patient: createMockUser('patient'),
  caregiver: createMockUser('caregiver'),
  pharmacist: createMockUser('pharmacist'),
  administrative: createMockUser('administrative'),
  labTechnician: createMockUser('lab_technician'),
  specialist: createMockUser('specialist'),
  systemAdmin: createMockUser('system_administrator'),
  customRole: createMockUser('patient', ['custom_permission'])
};
