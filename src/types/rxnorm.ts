
/**
 * Types for RxNorm integration
 */

// Base RxNorm medication record
export interface RxNormMedication {
  rxcui: string;
  name: string;
  tty?: string; // Term Type (SCD, SBD, etc.)
  language?: string;
  synonym?: string;
}

// RxNorm medication details including relationships
export interface RxNormMedicationDetails {
  rxcui: string;
  name: string;
  ingredients?: RxNormConcept[];
  brandNames?: RxNormConcept[];
  dosageForms?: RxNormConcept[];
  strengths?: RxNormConcept[];
  [key: string]: any; // Add index signature to make it assignable to JSON
}

// Basic concept type used for related entities
export interface RxNormConcept {
  rxcui: string;
  name: string;
  tty?: string;
}

// NDC (National Drug Code) record
export interface RxNormNDC {
  ndcItem?: string;
  packaging?: string;
  ndc: string;
  rxcui: string;
  status: string;
  source?: string; // Property for tracking the source of the NDC
  [key: string]: any; // Add index signature to make it assignable to JSON
}

// Autocomplete suggestion type
export interface RxNormDisplayTerm {
  rxcui: string;
  name: string;
  tty: string;
}

// Drug-drug interaction result
export interface RxNormInteraction {
  interactionPair: {
    interactionConcept: Array<{
      minConceptItem: {
        rxcui: string;
        name: string;
      };
    }>;
    severity: string;
    description: string;
  }[];
  [key: string]: any; // Add index signature to make it assignable to JSON
}

// ANVISA mapping record
export interface RxNormAnvisaMapping {
  rxnormCode: string;
  anvisaCode: string;
  medicationName: string;
  mappingDate: string;
  isVerified: boolean;
  verifiedBy?: string;
  comments?: string;
}

// Search cache record
export interface RxNormSearchCache {
  searchTerm: string;
  searchType: 'name' | 'code';
  results: RxNormMedication[];
  createdAt: string;
}

// Sync log entry
export interface RxNormSyncLog {
  syncDate: string;
  itemsSynced: number;
  syncType: 'manual' | 'scheduled' | 'frequently_used';
  errors?: string[];
}

// Database schema for RxNorm tables
export interface RxNormDatabaseSchema {
  rxnorm_items: {
    rxcui: string;
    name: string;
    term_type: string;
    active: boolean;
    last_updated: string;
  };
  
  rxnorm_anvisa_mappings: {
    id: string;
    rxnorm_code: string;
    anvisa_code: string;
    medication_name: string;
    mapping_date: string;
    is_verified: boolean;
    verified_by?: string;
    comments?: string;
  };
  
  rxnorm_search_cache: {
    id: string;
    search_term: string;
    search_type: string;
    results: RxNormMedication[];
    created_at: string;
  };
  
  rxnorm_details_cache: {
    id: string;
    rxcui: string;
    details: RxNormMedicationDetails;
    created_at: string;
  };
  
  rxnorm_sync_log: {
    id: string;
    sync_date: string;
    items_synced: number;
    sync_type: string;
    errors?: string[];
  };
}
