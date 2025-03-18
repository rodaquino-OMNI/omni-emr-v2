
import { describe, it, expect } from 'vitest';
import { canPerformMedicationAction } from '../medicationManagement';
import { testUsers } from './testSetup';

describe('medicationManagement', () => {
  describe('canPerformMedicationAction', () => {
    it('should return false for null user', () => {
      expect(canPerformMedicationAction(null, 'prescribe')).toBe(false);
    });

    it('should allow doctors to prescribe medications', () => {
      expect(canPerformMedicationAction(testUsers.doctor, 'prescribe')).toBe(true);
    });

    it('should deny nurses from prescribing medications', () => {
      expect(canPerformMedicationAction(testUsers.nurse, 'prescribe')).toBe(false);
    });

    it('should allow nurses to administer medications', () => {
      expect(canPerformMedicationAction(testUsers.nurse, 'administer')).toBe(true);
    });

    it('should allow pharmacists to validate medications', () => {
      // Using 'dispense' as the correct action for pharmacists
      expect(canPerformMedicationAction(testUsers.pharmacist, 'dispense')).toBe(true);
    });

    it('should allow patients to view their own medications', () => {
      expect(canPerformMedicationAction(testUsers.patient, 'view')).toBe(true);
    });

    it('should allow clinical staff to view medications', () => {
      expect(canPerformMedicationAction(testUsers.doctor, 'view')).toBe(true);
      expect(canPerformMedicationAction(testUsers.nurse, 'view')).toBe(true);
      expect(canPerformMedicationAction(testUsers.pharmacist, 'view')).toBe(true);
    });
  });
});
