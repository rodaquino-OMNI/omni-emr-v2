
import { supabase } from '@/integrations/supabase/client';

// RxNorm API base URL
const RXNORM_API_BASE_URL = 'https://rxnav.nlm.nih.gov/REST';

/**
 * Types for RxNorm API responses
 */
export interface RxNormMedication {
  rxcui: string;
  name: string;
  synonym?: string;
  tty?: string; // Term Type
  language?: string;
  suppress?: string;
  umlsCui?: string;
}

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

export interface MappingEntry {
  rxnormCode: string;
  anvisaCode: string;
  name: string;
  mappingDate: Date;
  isVerified: boolean;
}

/**
 * Search for medications in RxNorm by name
 */
export const searchMedicationsByName = async (name: string): Promise<RxNormMedication[]> => {
  try {
    // First, check if we have this search cached in our database
    const { data: cachedResults } = await supabase
      .from('rxnorm_search_cache')
      .select('results')
      .eq('search_term', name.toLowerCase())
      .eq('search_type', 'name')
      .single();

    if (cachedResults) {
      console.log('Using cached search results for', name);
      return cachedResults.results;
    }

    const response = await fetch(
      `${RXNORM_API_BASE_URL}/drugs?name=${encodeURIComponent(name)}`
    );

    if (!response.ok) {
      throw new Error(`RxNorm API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract medications from the response
    let medications: RxNormMedication[] = [];
    
    if (data.drugGroup?.conceptGroup) {
      data.drugGroup.conceptGroup.forEach((group: any) => {
        if (group.conceptProperties) {
          medications = [...medications, ...group.conceptProperties];
        }
      });
    }

    // Cache the search results in our database
    await supabase.from('rxnorm_search_cache').insert({
      search_term: name.toLowerCase(),
      search_type: 'name',
      results: medications,
      created_at: new Date().toISOString()
    });

    return medications;
  } catch (error) {
    console.error('Error searching medications by name:', error);
    return [];
  }
};

/**
 * Search for a medication in RxNorm by its RxCUI code
 */
export const getMedicationByRxCUI = async (rxcui: string): Promise<RxNormMedication | null> => {
  try {
    // Check cache first
    const { data: cachedResult } = await supabase
      .from('rxnorm_items')
      .select('*')
      .eq('rxcui', rxcui)
      .single();

    if (cachedResult) {
      return {
        rxcui: cachedResult.rxcui,
        name: cachedResult.name,
        tty: cachedResult.term_type
      };
    }

    const response = await fetch(
      `${RXNORM_API_BASE_URL}/rxcui/${rxcui}/allProperties?prop=names`
    );

    if (!response.ok) {
      throw new Error(`RxNorm API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.propConceptGroup) {
      return null;
    }
    
    const nameProps = data.propConceptGroup.propConcept.filter(
      (prop: any) => prop.propName === 'RxNorm Name'
    );
    
    if (nameProps.length === 0) {
      return null;
    }
    
    const medication: RxNormMedication = {
      rxcui,
      name: nameProps[0].propValue
    };
    
    // Cache the result
    await supabase.from('rxnorm_items').insert({
      rxcui: medication.rxcui,
      name: medication.name,
      term_type: medication.tty || 'SCD',
      last_updated: new Date().toISOString()
    });
    
    return medication;
  } catch (error) {
    console.error('Error getting medication by RxCUI:', error);
    return null;
  }
};

/**
 * Get medication details including ingredients, dosage form, etc.
 */
export const getMedicationDetails = async (rxcui: string) => {
  try {
    // Check if we have the details cached
    const { data: cachedDetails } = await supabase
      .from('rxnorm_details_cache')
      .select('details')
      .eq('rxcui', rxcui)
      .single();

    if (cachedDetails) {
      return cachedDetails.details;
    }

    const response = await fetch(
      `${RXNORM_API_BASE_URL}/rxcui/${rxcui}/allrelated`
    );

    if (!response.ok) {
      throw new Error(`RxNorm API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Process and structure the medication details
    const details = {
      rxcui,
      name: data.relatedGroup?.rxcuiName || '',
      ingredients: extractConceptsByType(data, 'IN'),
      brandNames: extractConceptsByType(data, 'BN'),
      dosageForms: extractConceptsByType(data, 'DF'),
      strengths: extractConceptsByType(data, 'SCDC')
    };
    
    // Cache the details
    await supabase.from('rxnorm_details_cache').insert({
      rxcui,
      details,
      created_at: new Date().toISOString()
    });
    
    return details;
  } catch (error) {
    console.error('Error getting medication details:', error);
    return null;
  }
};

/**
 * Helper function to extract concepts by type from RxNorm API response
 */
const extractConceptsByType = (data: RxNormRelatedResponse, type: string) => {
  if (!data.relatedGroup?.conceptGroup) {
    return [];
  }
  
  const group = data.relatedGroup.conceptGroup.find(g => g.tty === type);
  
  if (!group || !group.conceptProperties) {
    return [];
  }
  
  return group.conceptProperties.map(prop => ({
    rxcui: prop.rxcui,
    name: prop.name
  }));
};

/**
 * Map RxNorm code to ANVISA code
 */
export const mapRxNormToANVISA = async (
  rxcui: string
): Promise<string | null> => {
  try {
    // Check if mapping exists in our database
    const { data: mapping } = await supabase
      .from('rxnorm_anvisa_mappings')
      .select('anvisa_code')
      .eq('rxnorm_code', rxcui)
      .single();

    if (mapping) {
      return mapping.anvisa_code;
    }

    // If no mapping found, return null
    return null;
  } catch (error) {
    console.error('Error mapping RxNorm to ANVISA:', error);
    return null;
  }
};

/**
 * Save a mapping between RxNorm and ANVISA codes
 */
export const saveRxNormAnvisaMapping = async (
  rxnormCode: string,
  anvisaCode: string,
  name: string,
  isVerified = false
): Promise<boolean> => {
  try {
    await supabase.from('rxnorm_anvisa_mappings').insert({
      rxnorm_code: rxnormCode,
      anvisa_code: anvisaCode,
      medication_name: name,
      mapping_date: new Date().toISOString(),
      is_verified: isVerified
    });
    
    return true;
  } catch (error) {
    console.error('Error saving RxNorm-ANVISA mapping:', error);
    return false;
  }
};

/**
 * Sync RxNorm data based on frequently used medications
 */
export const syncFrequentlyUsedMedications = async (): Promise<{
  success: boolean;
  count: number;
}> => {
  try {
    // Get list of most frequently prescribed medications
    const { data: frequentMeds } = await supabase
      .rpc('get_frequently_prescribed_medications', { limit_count: 100 });
    
    if (!frequentMeds || frequentMeds.length === 0) {
      return { success: true, count: 0 };
    }
    
    let count = 0;
    
    // Update details for each medication
    for (const med of frequentMeds) {
      if (med.rxnorm_code) {
        await getMedicationDetails(med.rxnorm_code);
        count++;
      }
    }
    
    // Update last sync timestamp
    await supabase.from('rxnorm_sync_log').insert({
      sync_date: new Date().toISOString(),
      items_synced: count,
      sync_type: 'frequently_used'
    });
    
    return { success: true, count };
  } catch (error) {
    console.error('Error syncing frequently used medications:', error);
    return { success: false, count: 0 };
  }
};

/**
 * Clear expired cache entries
 */
export const clearExpiredCache = async (): Promise<boolean> => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7); // Keep 7 days of cache
    
    await supabase
      .from('rxnorm_search_cache')
      .delete()
      .lt('created_at', cutoffDate.toISOString());
      
    await supabase
      .from('rxnorm_details_cache')
      .delete()
      .lt('created_at', cutoffDate.toISOString());
    
    return true;
  } catch (error) {
    console.error('Error clearing expired cache:', error);
    return false;
  }
};
