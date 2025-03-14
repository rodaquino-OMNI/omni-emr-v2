
import { RxNormMedication, RxNormMedicationDetails, RxNormConcept, RxNormNDC, RxNormDisplayTerm, RxNormInteraction } from '@/types/rxnorm';
import { Json } from '@/integrations/supabase/types';

/**
 * API Response Types for RxNorm services
 */
export interface RxNormSearchResponse {
  rxnormData: {
    idGroup?: {
      rxnormId: string[];
    };
    drugGroup?: {
      conceptGroup: Array<{
        tty: string;
        conceptProperties: RxNormMedication[];
      }>;
    };
  };
}

export interface RxNormRelatedResponse {
  relatedGroup: {
    rxcui: string;
    rxcuiName: string;
    termType: string[];
    conceptGroup: Array<{
      tty: string;
      conceptProperties: Array<{
        rxcui: string;
        name: string;
        tty: string;
      }>;
    }>;
  };
}

export interface RxNormHistoryResponse {
  rxcuiStatusHistory: {
    rxcui: string;
    status: string;
    history: Array<{
      rxcui: string;
      sab: string;
      code: string;
      originalRxcui: string;
      changeType: string;
      changeDate: string;
    }>;
  };
}

export interface RxNormAllPropResponse {
  propConceptGroup: {
    propConcept: Array<{
      propName: string;
      propValue: string;
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

export interface RxNormDisplayTermsResponse {
  displayTermsList: {
    term: RxNormDisplayTerm[];
  };
}

export interface RxNormInteractionResponse {
  interactionTypeGroup: {
    interactionType: RxNormInteraction[];
  };
}

export interface MappingEntry {
  rxnormCode: string;
  anvisaCode: string;
  name: string;
  mappingDate: Date;
  isVerified: boolean;
}

// RxNorm API base URL
export const RXNORM_API_BASE_URL = 'https://rxnav.nlm.nih.gov/REST';
