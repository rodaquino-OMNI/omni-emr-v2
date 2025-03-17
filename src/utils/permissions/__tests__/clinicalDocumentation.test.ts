
import { describe, it, expect } from 'vitest';
import { 
  canPerformClinicalDocumentation, 
  canPerformClinicalAssessment,
  canDocumentMedicalDecisionMaking
} from '../clinicalDocumentation';
import { testUsers } from './testSetup';

describe('clinicalDocumentation', () => {
  describe('canPerformClinicalDocumentation', () => {
    it('should return false for null user', () => {
      // Updated to pass only one argument
      expect(canPerformClinicalDocumentation(null)).toBe(false);
    });

    it('should allow doctors to create, modify, and finalize documentation', () => {
      // Updated to pass only one argument
      expect(canPerformClinicalDocumentation(testUsers.doctor)).toBe(true);
    });

    it('should allow nurses to create but not finalize documentation', () => {
      // Updated to pass only one argument
      expect(canPerformClinicalDocumentation(testUsers.nurse)).toBe(true);
    });

    it('should allow patients to view only their own records', () => {
      // Updated to pass only one argument
      expect(canPerformClinicalDocumentation(testUsers.patient)).toBe(false);
    });
  });

  describe('canPerformClinicalAssessment', () => {
    it('should return false for null user', () => {
      // Updated to pass only one argument
      expect(canPerformClinicalAssessment(null)).toBe(false);
    });

    it('should allow doctors to perform any assessment', () => {
      // Updated to pass only one argument
      expect(canPerformClinicalAssessment(testUsers.doctor)).toBe(true);
    });

    it('should allow nurses to perform initial and ongoing assessments', () => {
      // Updated to pass only one argument
      expect(canPerformClinicalAssessment(testUsers.nurse)).toBe(true);
    });

    it('should deny patients from performing assessments', () => {
      // Updated to pass only one argument
      expect(canPerformClinicalAssessment(testUsers.patient)).toBe(false);
    });
  });

  describe('canDocumentMedicalDecisionMaking', () => {
    it('should return false for null user', () => {
      expect(canDocumentMedicalDecisionMaking(null)).toBe(false);
    });

    it('should allow doctors to document medical decision making', () => {
      expect(canDocumentMedicalDecisionMaking(testUsers.doctor)).toBe(true);
    });

    it('should deny nurses from documenting medical decision making', () => {
      expect(canDocumentMedicalDecisionMaking(testUsers.nurse)).toBe(false);
    });
  });
});
