
// RxNorm API endpoints
export const RXNORM_API_BASE_URL = 'https://rxnav.nlm.nih.gov/REST';

// For testing, uncomment the mock API if needed
// export const RXNORM_API_BASE_URL = 'https://mock-rxnorm-api.example.com';

// Response types for RxNorm API
export interface RxNormSearchResponse {
  rxnormId: string;
  name: string;
  synonym?: string;
  tty?: string;
}

export interface RxNormDisplayTermsResponse {
  displayTermsList: {
    term: Array<{
      rxcui: string;
      name: string;
      tty: string;
    }>;
  };
}

export interface RxNormNDCResponse {
  ndcGroup: {
    ndcList: {
      ndc: string[];
    };
  };
}

// Add custom JSON type for Supabase
export type Json = 
  | string
  | number
  | boolean
  | { [key: string]: Json }
  | Json[]
  | null;
