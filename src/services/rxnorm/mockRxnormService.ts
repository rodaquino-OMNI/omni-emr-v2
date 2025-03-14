
import { RxNormMedication, RxNormDisplayTerm, RxNormMedicationDetails, RxNormNDC } from '@/types/rxnorm';

// Mock medications database
const mockMedications: RxNormMedication[] = [
  { rxcui: '161', name: 'Acetaminophen', tty: 'IN' },
  { rxcui: '1011', name: 'Aspirin', tty: 'IN' },
  { rxcui: '1188', name: 'Amoxicillin', tty: 'IN' },
  { rxcui: '10582', name: 'Lisinopril', tty: 'IN' },
  { rxcui: '83367', name: 'Atorvastatin', tty: 'IN' },
  { rxcui: '6809', name: 'Metformin', tty: 'IN' },
  { rxcui: '10582', name: 'Levothyroxine', tty: 'IN' },
  { rxcui: '17767', name: 'Amlodipine', tty: 'IN' },
  { rxcui: '6918', name: 'Metoprolol', tty: 'IN' },
  { rxcui: '7646', name: 'Omeprazole', tty: 'IN' },
  { rxcui: '203150', name: 'Acetaminophen 500 MG Oral Tablet', tty: 'SCD' },
  { rxcui: '731535', name: 'Aspirin 81 MG Oral Tablet', tty: 'SCD' },
  { rxcui: '308182', name: 'Amoxicillin 500 MG Oral Capsule', tty: 'SCD' }
];

// Mock display terms for autocomplete
export const mockDisplayTerms = mockMedications.map(med => ({
  rxcui: med.rxcui,
  name: med.name,
  tty: med.tty || 'IN'
}));

/**
 * Mock implementation of searchMedicationsByName
 */
export const mockSearchMedicationsByName = (name: string): Promise<RxNormMedication[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = mockMedications.filter(med => 
        med.name.toLowerCase().includes(name.toLowerCase())
      );
      resolve(results);
    }, 300); // Simulate network delay
  });
};

/**
 * Mock implementation of getDisplayTerms
 */
export const mockGetDisplayTerms = (term: string): Promise<RxNormDisplayTerm[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = mockDisplayTerms.filter(term => 
        term.name.toLowerCase().includes(term.toLowerCase())
      );
      resolve(results);
    }, 200); // Simulate network delay
  });
};

/**
 * Mock implementation of getMedicationDetails
 */
export const mockGetMedicationDetails = (rxcui: string): Promise<RxNormMedicationDetails> => {
  return new Promise((resolve) => {
    const medication = mockMedications.find(med => med.rxcui === rxcui);
    
    setTimeout(() => {
      resolve({
        rxcui,
        name: medication?.name || 'Unknown Medication',
        ingredients: [{ rxcui, name: medication?.name || 'Unknown', tty: 'IN' }],
        dosageForms: [{ rxcui: '0', name: 'Tablet', tty: 'DF' }],
        brandNames: [{ rxcui: '0', name: 'Generic', tty: 'BN' }]
      });
    }, 300);
  });
};

/**
 * Determines if we should use mocks based on environment or config
 */
export const shouldUseMocks = (): boolean => {
  // Check if we're in a test environment
  if (process.env.NODE_ENV === 'test') return true;
  
  // Can also check for a feature flag or localStorage setting
  return localStorage.getItem('use_rxnorm_mocks') === 'true';
};
