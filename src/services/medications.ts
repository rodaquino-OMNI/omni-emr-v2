
// Define interfaces for medication search and interactions
export interface MedicationSearchResult {
  rxcui: string;
  name: string;
  synonym?: string;
  tty?: string; // Term type
  language?: string;
  suppress?: string;
  umlscui?: string;
}

export interface MedicationInteraction {
  rxcui1: string;
  rxcui2: string;
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  description: string;
}

/**
 * Search for medications by name
 * @param searchTerm The term to search for
 * @returns Array of medication search results
 */
export const searchMedications = async (searchTerm: string): Promise<MedicationSearchResult[]> => {
  // This would normally make an API call to RxNav or a similar service
  // For now, returning mock data
  console.log(`Searching for medications with term: ${searchTerm}`);
  
  if (!searchTerm || searchTerm.length < 2) {
    return [];
  }
  
  // Mock data for demonstration
  const mockResults: MedicationSearchResult[] = [
    { rxcui: '1123', name: 'Aspirin 325 MG Oral Tablet' },
    { rxcui: '2670', name: 'Ibuprofen 200 MG Oral Tablet' },
    { rxcui: '1161', name: 'Acetaminophen 325 MG Oral Tablet' }
  ];
  
  // Filter based on search term
  return mockResults.filter(med => 
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

/**
 * Check for drug interactions with a medication
 * @param rxcui The RxNorm Concept Unique Identifier for the medication
 * @returns Array of medication interactions
 */
export const checkMedicationInteractions = async (rxcui: string): Promise<MedicationInteraction[]> => {
  console.log(`Checking interactions for medication with rxcui: ${rxcui}`);
  
  // Mock interactions data
  if (rxcui === '1123') { // Aspirin
    return [
      {
        rxcui1: '1123',
        rxcui2: '2670',
        severity: 'Moderate',
        description: 'May increase risk of bleeding'
      }
    ];
  }
  
  if (rxcui === '2670') { // Ibuprofen
    return [
      {
        rxcui1: '2670',
        rxcui2: '1123',
        severity: 'Moderate',
        description: 'May increase risk of bleeding'
      }
    ];
  }
  
  return [];
};
