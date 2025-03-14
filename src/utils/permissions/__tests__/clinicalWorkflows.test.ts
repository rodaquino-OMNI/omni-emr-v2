
import { describe, it, expect } from 'vitest';
import {
  canPerformEmergencyCare,
  canPerformCareCoordination,
  canPerformTelemedicine,
  canManageFluidBalance,
  canPerformTriageAssessment
} from '../clinicalWorkflows';
import { testUsers } from './testSetup';

describe('clinicalWorkflows', () => {
  describe('canPerformEmergencyCare', () => {
    it('should return false for null user', () => {
      expect(canPerformEmergencyCare(null, 'triage')).toBe(false);
    });

    it('should allow doctors to perform all emergency care', () => {
      expect(canPerformEmergencyCare(testUsers.doctor, 'triage')).toBe(true);
      expect(canPerformEmergencyCare(testUsers.doctor, 'treatment')).toBe(true);
    });

    it('should allow nurses to perform triage', () => {
      expect(canPerformEmergencyCare(testUsers.nurse, 'triage')).toBe(true);
    });

    it('should deny administrative staff from performing emergency care', () => {
      expect(canPerformEmergencyCare(testUsers.administrative, 'triage')).toBe(false);
      expect(canPerformEmergencyCare(testUsers.administrative, 'treatment')).toBe(false);
    });
  });

  describe('canPerformCareCoordination', () => {
    it('should return false for null user', () => {
      expect(canPerformCareCoordination(null, 'planning')).toBe(false);
    });

    it('should allow doctors to perform all care coordination', () => {
      expect(canPerformCareCoordination(testUsers.doctor, 'planning')).toBe(true);
      expect(canPerformCareCoordination(testUsers.doctor, 'transition')).toBe(true);
    });

    it('should deny patients from performing care coordination', () => {
      expect(canPerformCareCoordination(testUsers.patient, 'planning')).toBe(false);
      expect(canPerformCareCoordination(testUsers.patient, 'transition')).toBe(false);
    });
  });

  describe('canPerformTelemedicine', () => {
    it('should return false for null user', () => {
      expect(canPerformTelemedicine(null)).toBe(false);
    });

    it('should allow doctors to perform telemedicine', () => {
      expect(canPerformTelemedicine(testUsers.doctor)).toBe(true);
    });

    it('should deny patients from performing telemedicine', () => {
      expect(canPerformTelemedicine(testUsers.patient)).toBe(false);
    });
  });

  describe('canManageFluidBalance', () => {
    it('should return false for null user', () => {
      expect(canManageFluidBalance(null)).toBe(false);
    });

    it('should allow nurses to manage fluid balance', () => {
      expect(canManageFluidBalance(testUsers.nurse)).toBe(true);
    });

    it('should deny administrative staff from managing fluid balance', () => {
      expect(canManageFluidBalance(testUsers.administrative)).toBe(false);
    });
  });

  describe('canPerformTriageAssessment', () => {
    it('should return false for null user', () => {
      expect(canPerformTriageAssessment(null)).toBe(false);
    });

    it('should allow nurses to perform triage assessment', () => {
      expect(canPerformTriageAssessment(testUsers.nurse)).toBe(true);
    });

    it('should deny administrative staff from performing triage assessment', () => {
      expect(canPerformTriageAssessment(testUsers.administrative)).toBe(false);
    });
  });
});
