
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

// Mock NDCs for medications
const mockNDCs: Record<string, RxNormNDC[]> = {
  '161': [
    { ndc: '00904-2015-01', rxcui: '161', status: 'active', source: 'FDA' },
    { ndc: '00536-3231-01', rxcui: '161', status: 'active', source: 'FDA' }
  ],
  '1011': [
    { ndc: '00904-2013-61', rxcui: '1011', status: 'active', source: 'FDA' }
  ],
  '1188': [
    { ndc: '00093-4150-78', rxcui: '1188', status: 'active', source: 'FDA' },
    { ndc: '00093-4156-56', rxcui: '1188', status: 'active', source: 'FDA' }
  ],
  '10582': [
    { ndc: '00781-5078-10', rxcui: '10582', status: 'active', source: 'FDA' }
  ],
  '203150': [
    { ndc: '00904-5788-60', rxcui: '203150', status: 'active', source: 'FDA' }
  ],
  '731535': [
    { ndc: '69784-961-01', rxcui: '731535', status: 'active', source: 'FDA' }
  ],
  '308182': [
    { ndc: '00074-3273-13', rxcui: '308182', status: 'active', source: 'FDA' }
  ]
};

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
      const results = mockDisplayTerms.filter(displayTerm => 
        displayTerm.name.toLowerCase().includes(term.toLowerCase())
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
 * Mock implementation of getMedicationNDCs
 * Gets National Drug Codes for a medication
 */
export const mockGetMedicationNDCs = (rxcui: string): Promise<RxNormNDC[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Look up NDCs for the medication
      const ndcs = mockNDCs[rxcui] || [];
      resolve(ndcs);
    }, 250);
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

/**
 * Sets mock mode for RxNorm service for testing/development
 */
export const setMockMode = (useMocks: boolean): void => {
  localStorage.setItem('use_rxnorm_mocks', useMocks ? 'true' : 'false');
  console.log(`RxNorm mock mode ${useMocks ? 'enabled' : 'disabled'}`);
};

/**
 * Validates an RxCUI identifier format
 */
export const isValidRxCUI = (rxcui: string): boolean => {
  // RxCUI should be a numeric string
  return /^\d+$/.test(rxcui);
};
