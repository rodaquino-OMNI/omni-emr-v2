
import { describe, it, expect } from 'vitest';
import { hasPermission, getUserPermissions } from '../roleChecks';
import { testUsers, createMockUser } from './testSetup';
import { sharedPermissions } from '../../../utils/permissions/permissionTypes';

describe('roleChecks', () => {
  describe('hasPermission', () => {
    it('should return false for null user', () => {
      expect(hasPermission(null, 'any_permission')).toBe(false);
    });

    it('should return true for shared permissions for any authenticated user', () => {
      expect(hasPermission(testUsers.patient, 'manage_profile')).toBe(true);
      expect(hasPermission(testUsers.nurse, 'system_login')).toBe(true);
    });

    it('should return true for admin and system_administrator for any permission', () => {
      expect(hasPermission(testUsers.admin, 'prescribe_medications')).toBe(true);
      expect(hasPermission(testUsers.systemAdmin, 'prescribe_medications')).toBe(true);
    });

    it('should return true for role-specific permissions', () => {
      expect(hasPermission(testUsers.doctor, 'prescribe_medications')).toBe(true);
      expect(hasPermission(testUsers.nurse, 'administer_medications')).toBe(true);
      expect(hasPermission(testUsers.pharmacist, 'verify_medications')).toBe(false);
    });

    it('should return true for permissions in the user.permissions array', () => {
      const user = createMockUser('patient', ['special_access']);
      expect(hasPermission(user, 'special_access')).toBe(true);
    });

    it('should return false for permissions not in the user.permissions array or role permissions', () => {
      expect(hasPermission(testUsers.patient, 'prescribe_medications')).toBe(false);
    });
  });

  describe('getUserPermissions', () => {
    it('should return empty array for null user', async () => {
      const permissions = await getUserPermissions(null);
      expect(permissions).toEqual([]);
    });

    it('should include shared permissions for all users', async () => {
      const patientPermissions = await getUserPermissions(testUsers.patient);
      for (const permission of sharedPermissions) {
        expect(patientPermissions).toContain(permission);
      }
    });

    it('should include role-based permissions', async () => {
      const doctorPermissions = await getUserPermissions(testUsers.doctor);
      expect(doctorPermissions).toContain('prescribe_medications');
      expect(doctorPermissions).toContain('create_clinical_notes');
    });

    it('should include explicit permissions assigned to the user', async () => {
      const user = createMockUser('patient', ['custom_permission']);
      const permissions = await getUserPermissions(user);
      expect(permissions).toContain('custom_permission');
    });

    it('should deduplicate permissions', async () => {
      const user = createMockUser('patient', ['view_own_records']); // Already in patient role
      const permissions = await getUserPermissions(user);
      const occurrences = permissions.filter(p => p === 'view_own_records').length;
      expect(occurrences).toBe(1);
    });

    it('should include all possible permissions if user has "all" permission', async () => {
      const user = createMockUser('custom', ['all']);
      const permissions = await getUserPermissions(user);
      expect(permissions).toContain('prescribe_medications');
      expect(permissions).toContain('administer_medications');
      expect(permissions.length).toBeGreaterThan(sharedPermissions.length + 1);
    });
  });
});
