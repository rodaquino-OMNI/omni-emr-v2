
import { describe, it, expect } from 'vitest';
import { canPerformAppointmentAction } from '../appointmentManagement';
import { testUsers } from './testSetup';

describe('appointmentManagement', () => {
  describe('canPerformAppointmentAction', () => {
    it('should return false for null user', () => {
      expect(canPerformAppointmentAction(null, 'schedule')).toBe(false);
    });

    it('should allow doctors to schedule appointments', () => {
      expect(canPerformAppointmentAction(testUsers.doctor, 'schedule')).toBe(true);
    });

    it('should allow patients to schedule their own appointments', () => {
      expect(canPerformAppointmentAction(testUsers.patient, 'schedule')).toBe(true);
    });

    it('should allow administrative staff to schedule and reschedule appointments', () => {
      expect(canPerformAppointmentAction(testUsers.administrative, 'schedule')).toBe(true);
      // Changed 'modify' to 'reschedule' to match the allowed actions
      expect(canPerformAppointmentAction(testUsers.administrative, 'reschedule')).toBe(true);
      expect(canPerformAppointmentAction(testUsers.administrative, 'cancel')).toBe(true);
    });

    it('should deny patients from modifying appointments', () => {
      // Changed 'modify' to 'reschedule' to match the allowed actions
      expect(canPerformAppointmentAction(testUsers.patient, 'reschedule')).toBe(false);
      expect(canPerformAppointmentAction(testUsers.patient, 'cancel')).toBe(false);
    });

    it('should allow clinical staff to view appointments', () => {
      expect(canPerformAppointmentAction(testUsers.doctor, 'view')).toBe(true);
      expect(canPerformAppointmentAction(testUsers.nurse, 'view')).toBe(true);
    });

    it('should allow patients to view their own appointments', () => {
      expect(canPerformAppointmentAction(testUsers.patient, 'view')).toBe(true);
    });
  });
});
