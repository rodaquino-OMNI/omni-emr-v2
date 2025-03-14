
import { describe, it, expect } from 'vitest';
import { canAccessPatientData } from '../patientAccess';
import { testUsers } from './testSetup';

describe('patientAccess', () => {
  describe('canAccessPatientData', () => {
    const patientId = 'patient-123';
    const currentPatientUser = {
      ...testUsers.patient,
      id: patientId
    };

    it('should return false for null user', () => {
      expect(canAccessPatientData(null, patientId)).toBe(false);
    });

    it('should return true for admin and system administrators', () => {
      expect(canAccessPatientData(testUsers.admin, patientId)).toBe(true);
      expect(canAccessPatientData(testUsers.systemAdmin, patientId)).toBe(true);
    });

    it('should return true for clinical staff', () => {
      expect(canAccessPatientData(testUsers.doctor, patientId)).toBe(true);
      expect(canAccessPatientData(testUsers.nurse, patientId)).toBe(true);
      expect(canAccessPatientData(testUsers.specialist, patientId)).toBe(true);
      expect(canAccessPatientData(testUsers.pharmacist, patientId)).toBe(true);
    });

    it('should allow patients to access only their own data', () => {
      // Patient accessing their own data
      expect(canAccessPatientData(currentPatientUser, patientId)).toBe(true);
      
      // Patient trying to access someone else's data
      expect(canAccessPatientData(testUsers.patient, 'different-patient-id')).toBe(false);
    });

    it('should allow administrative staff with view_patients permission', () => {
      expect(canAccessPatientData(testUsers.administrative, patientId)).toBe(true);
    });

    it('should allow lab and radiology technicians with view_patients permission', () => {
      expect(canAccessPatientData(testUsers.labTechnician, patientId)).toBe(true);
    });
  });
});
