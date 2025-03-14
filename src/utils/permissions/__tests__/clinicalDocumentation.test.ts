
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
      expect(canPerformClinicalDocumentation(null, 'create')).toBe(false);
    });

    it('should allow doctors to create, modify, and finalize documentation', () => {
      expect(canPerformClinicalDocumentation(testUsers.doctor, 'create')).toBe(true);
      expect(canPerformClinicalDocumentation(testUsers.doctor, 'modify')).toBe(true);
      expect(canPerformClinicalDocumentation(testUsers.doctor, 'finalize')).toBe(true);
    });

    it('should allow nurses to create but not finalize documentation', () => {
      expect(canPerformClinicalDocumentation(testUsers.nurse, 'create')).toBe(true);
      expect(canPerformClinicalDocumentation(testUsers.nurse, 'finalize')).toBe(false);
    });

    it('should allow patients to view only their own records', () => {
      expect(canPerformClinicalDocumentation(testUsers.patient, 'view')).toBe(true);
      expect(canPerformClinicalDocumentation(testUsers.patient, 'create')).toBe(false);
    });
  });

  describe('canPerformClinicalAssessment', () => {
    it('should return false for null user', () => {
      expect(canPerformClinicalAssessment(null, 'initial')).toBe(false);
    });

    it('should allow doctors to perform any assessment', () => {
      expect(canPerformClinicalAssessment(testUsers.doctor, 'initial')).toBe(true);
      expect(canPerformClinicalAssessment(testUsers.doctor, 'ongoing')).toBe(true);
    });

    it('should allow nurses to perform initial and ongoing assessments', () => {
      expect(canPerformClinicalAssessment(testUsers.nurse, 'initial')).toBe(true);
      expect(canPerformClinicalAssessment(testUsers.nurse, 'ongoing')).toBe(true);
    });

    it('should deny patients from performing assessments', () => {
      expect(canPerformClinicalAssessment(testUsers.patient, 'initial')).toBe(false);
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
