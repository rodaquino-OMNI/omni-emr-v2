import { supabase } from '@/integrations/supabase/client';
import { 
  RxNormMedication, 
  RxNormMedicationDetails, 
  RxNormConcept, 
  RxNormNDC,
  RxNormDisplayTerm,
  RxNormInteraction
} from '@/types/rxnorm';
import { Json } from '@/integrations/supabase/types';

// RxNorm API base URL
const RXNORM_API_BASE_URL = 'https://rxnav.nlm.nih.gov/REST';

/**
 * Types for RxNorm API responses
 */
interface RxNormSearchResponse {
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

interface RxNormRelatedResponse {
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

interface RxNormHistoryResponse {
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

interface RxNormAllPropResponse {
  propConceptGroup: {
    propConcept: Array<{
      propName: string;
      propValue: string;
    }>;
  };
}

interface RxNormNDCResponse {
  ndcGroup: {
    ndcList: {
      ndc: string[];
    };
  };
}

interface RxNormDisplayTermsResponse {
  displayTermsList: {
    term: RxNormDisplayTerm[];
  };
}

interface RxNormInteractionResponse {
  interactionTypeGroup: {
    interactionType: RxNormInteraction[];
  };
}

interface MappingEntry {
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
    const { data: cachedResults, error: cacheError } = await supabase
      .from('rxnorm_search_cache')
      .select('*')
      .eq('search_term', name.toLowerCase())
      .eq('search_type', 'name')
      .maybeSingle();

    if (cachedResults && !cacheError) {
      console.log('Using cached search results for', name);
      // Properly cast the JSON results to the expected type using a double cast
      return (cachedResults.results as unknown as RxNormMedication[]);
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
    // Convert the medications array to a JSON-compatible format with a double cast
    const { error: insertError } = await supabase.from('rxnorm_search_cache').insert({
      search_term: name.toLowerCase(),
      search_type: 'name',
      results: medications as unknown as Json,
      created_at: new Date().toISOString()
    });

    if (insertError) {
      console.error('Error caching search results:', insertError);
    }

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
    const { data: cachedResult, error: cacheError } = await supabase
      .from('rxnorm_items')
      .select('*')
      .eq('rxcui', rxcui)
      .maybeSingle();

    if (cachedResult && !cacheError) {
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
    const { error: insertError } = await supabase.from('rxnorm_items').insert({
      rxcui: medication.rxcui,
      name: medication.name,
      term_type: medication.tty || 'SCD',
      last_updated: new Date().toISOString()
    });

    if (insertError) {
      console.error('Error caching medication:', insertError);
    }
    
    return medication;
  } catch (error) {
    console.error('Error getting medication by RxCUI:', error);
    return null;
  }
};

/**
 * Get medication details including ingredients, dosage form, etc.
 */
export const getMedicationDetails = async (rxcui: string): Promise<RxNormMedicationDetails | null> => {
  try {
    // Check if we have the details cached
    const { data: cachedDetails, error: cacheError } = await supabase
      .from('rxnorm_details_cache')
      .select('*')
      .eq('rxcui', rxcui)
      .maybeSingle();

    if (cachedDetails && !cacheError) {
      // Properly cast the JSON results to the expected type using a double cast
      return (cachedDetails.details as unknown as RxNormMedicationDetails);
    }

    const response = await fetch(
      `${RXNORM_API_BASE_URL}/rxcui/${rxcui}/allrelated`
    );

    if (!response.ok) {
      throw new Error(`RxNorm API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Process and structure the medication details
    const details: RxNormMedicationDetails = {
      rxcui,
      name: data.relatedGroup?.rxcuiName || '',
      ingredients: extractConceptsByType(data, 'IN'),
      brandNames: extractConceptsByType(data, 'BN'),
      dosageForms: extractConceptsByType(data, 'DF'),
      strengths: extractConceptsByType(data, 'SCDC')
    };
    
    // Cache the details with proper type casting
    const { error: insertError } = await supabase.from('rxnorm_details_cache').insert({
      rxcui,
      details: details as unknown as Json,
      created_at: new Date().toISOString()
    });

    if (insertError) {
      console.error('Error caching medication details:', insertError);
    }
    
    return details;
  } catch (error) {
    console.error('Error getting medication details:', error);
    return null;
  }
};

/**
 * Helper function to extract concepts by type from RxNorm API response
 */
const extractConceptsByType = (data: any, type: string): RxNormConcept[] => {
  if (!data.relatedGroup?.conceptGroup) {
    return [];
  }
  
  const group = data.relatedGroup.conceptGroup.find((g: any) => g.tty === type);
  
  if (!group || !group.conceptProperties) {
    return [];
  }
  
  return group.conceptProperties.map((prop: any) => ({
    rxcui: prop.rxcui,
    name: prop.name
  }));
};

/**
 * Get NDCs (National Drug Codes) for a medication by RxCUI
 */
export const getNDCsByRxCUI = async (rxcui: string): Promise<RxNormNDC[]> => {
  try {
    // Query the cache table directly instead of using RPC
    const { data: cachedResult, error: cacheError } = await supabase
      .from('rxnorm_ndc_cache')
      .select('*')
      .eq('rxcui', rxcui)
      .maybeSingle();

    if (cachedResult && !cacheError) {
      return (cachedResult.ndcs as unknown as RxNormNDC[]);
    }

    const response = await fetch(
      `${RXNORM_API_BASE_URL}/rxcui/${rxcui}/ndcs`
    );

    if (!response.ok) {
      throw new Error(`RxNorm API error: ${response.status}`);
    }

    const data = await response.json();
    
    let ndcs: RxNormNDC[] = [];
    
    if (data.ndcGroup?.ndcList?.ndc) {
      ndcs = data.ndcGroup.ndcList.ndc.map((ndc: string) => ({
        ndc,
        rxcui,
        ndcItem: '',
        packaging: '',
        status: 'ACTIVE'
      }));
    }
    
    // Store in cache directly
    const { error: insertError } = await supabase
      .from('rxnorm_ndc_cache')
      .insert({
        rxcui,
        ndcs: ndcs as unknown as Json,
        created_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Error caching NDCs:', insertError);
    }
    
    return ndcs;
  } catch (error) {
    console.error('Error getting NDCs by RxCUI:', error);
    return [];
  }
};

/**
 * Get display terms for autocomplete
 */
export const getDisplayTerms = async (term: string, maxResults = 10): Promise<RxNormDisplayTerm[]> => {
  try {
    // Query the cache table directly
    const { data: cachedResult, error: cacheError } = await supabase
      .from('rxnorm_displayterms_cache')
      .select('*')
      .eq('search_term', term.toLowerCase())
      .maybeSingle();

    if (cachedResult && !cacheError) {
      return (cachedResult.terms as unknown as RxNormDisplayTerm[]);
    }

    const response = await fetch(
      `${RXNORM_API_BASE_URL}/displaynames?name=${encodeURIComponent(term)}&maxResults=${maxResults}`
    );

    if (!response.ok) {
      throw new Error(`RxNorm API error: ${response.status}`);
    }

    const data = await response.json();
    
    let terms: RxNormDisplayTerm[] = [];
    
    if (data.displayTermsList?.term) {
      terms = data.displayTermsList.term;
    }
    
    // Store in cache directly
    const { error: insertError } = await supabase
      .from('rxnorm_displayterms_cache')
      .insert({
        search_term: term.toLowerCase(),
        terms: terms as unknown as Json,
        created_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Error caching display terms:', insertError);
    }
    
    return terms;
  } catch (error) {
    console.error('Error getting display terms:', error);
    return [];
  }
};

/**
 * Check drug-drug interactions between medications
 */
export const checkDrugInteractions = async (rxcuis: string[]): Promise<RxNormInteraction[]> => {
  try {
    if (!rxcuis || rxcuis.length < 2) {
      return [];
    }
    
    // Generate a unique key for caching
    const interactionKey = rxcuis.sort().join('_');
    
    // Query the cache table directly
    const { data: cachedResult, error: cacheError } = await supabase
      .from('rxnorm_interactions_cache')
      .select('*')
      .eq('interaction_key', interactionKey)
      .maybeSingle();

    if (cachedResult && !cacheError) {
      return (cachedResult.interactions as unknown as RxNormInteraction[]);
    }

    // Note: Using the NIH Drug Interaction API which is separate from the RxNorm API
    const response = await fetch(
      `https://rxnav.nlm.nih.gov/REST/interaction/list?rxcuis=${rxcuis.join('+')}`
    );

    if (!response.ok) {
      throw new Error(`Drug Interaction API error: ${response.status}`);
    }

    const data = await response.json();
    
    let interactions: RxNormInteraction[] = [];
    
    if (data.interactionTypeGroup?.interactionType) {
      interactions = data.interactionTypeGroup.interactionType;
    }
    
    // Store in cache directly
    const { error: insertError } = await supabase
      .from('rxnorm_interactions_cache')
      .insert({
        interaction_key: interactionKey,
        rxcuis,
        interactions: interactions as unknown as Json,
        created_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Error caching interactions:', insertError);
    }
    
    return interactions;
  } catch (error) {
    console.error('Error checking drug interactions:', error);
    return [];
  }
};

/**
 * Get spelling suggestions for a medication name
 */
export const getSpellingSuggestions = async (term: string): Promise<string[]> => {
  try {
    const response = await fetch(
      `${RXNORM_API_BASE_URL}/spellingsuggestions?name=${encodeURIComponent(term)}`
    );

    if (!response.ok) {
      throw new Error(`RxNorm API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.suggestionGroup?.suggestionList?.suggestion) {
      return data.suggestionGroup.suggestionList.suggestion;
    }
    
    return [];
  } catch (error) {
    console.error('Error getting spelling suggestions:', error);
    return [];
  }
};

/**
 * Map RxNorm code to ANVISA code
 */
export const mapRxNormToANVISA = async (
  rxcui: string
): Promise<string | null> => {
  try {
    // Check if mapping exists in our database
    const { data: mapping, error: mappingError } = await supabase
      .from('rxnorm_anvisa_mappings')
      .select('*')
      .eq('rxnorm_code', rxcui)
      .maybeSingle();

    if (mapping && !mappingError) {
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
    const { error } = await supabase.from('rxnorm_anvisa_mappings').insert({
      rxnorm_code: rxnormCode,
      anvisa_code: anvisaCode,
      medication_name: name,
      mapping_date: new Date().toISOString(),
      is_verified: isVerified
    });
    
    if (error) {
      console.error('Error saving mapping:', error);
      return false;
    }
    
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
    const { data: frequentMeds, error: rpcError } = await supabase
      .rpc('get_frequently_prescribed_medications', { limit_count: 100 });
    
    if (rpcError) {
      console.error('Error fetching frequently prescribed medications:', rpcError);
      return { success: false, count: 0 };
    }
    
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
    const { error: syncLogError } = await supabase.from('rxnorm_sync_log').insert({
      sync_date: new Date().toISOString(),
      items_synced: count,
      sync_type: 'frequently_used'
    });
    
    if (syncLogError) {
      console.error('Error logging sync:', syncLogError);
    }
    
    return { success: true, count };
  } catch (error) {
    console.error('Error syncing frequently used medications:', error);
    return { success: false, count: 0 };
  }
};

/**
 * Clear expired cache entries with configurable retention period
 */
export const clearExpiredCache = async (retentionDays = 7): Promise<{
  success: boolean;
  details: {
    tableName: string;
    rowsDeleted: number;
  }[];
}> => {
  try {
    const { data, error } = await supabase
      .rpc('clean_rxnorm_cache', { retention_days: retentionDays });
      
    if (error) {
      console.error('Error clearing expired cache:', error);
      return { 
        success: false,
        details: []
      };
    }
    
    // Transform the data to match our frontend expectations
    const details = data.map((item: any) => ({
      tableName: item.table_name,
      rowsDeleted: item.rows_deleted
    }));
    
    return {
      success: true,
      details
    };
  } catch (error) {
    console.error('Error clearing expired cache:', error);
    return {
      success: false,
      details: []
    };
  }
};

/**
 * Get a patient's medication history
 */
export const getPatientMedicationHistory = async (
  patientId: string
): Promise<{
  rxcui: string;
  medicationName: string;
  startDate: string;
  endDate: string | null;
  status: string;
}[]> => {
  try {
    // Use our new stored procedure to get medication history
    const { data, error } = await supabase
      .rpc('get_patient_medication_history', { patient_id_param: patientId });
    
    if (error) {
      console.error('Error getting patient medication history:', error);
      return [];
    }
    
    // Transform the data to match our frontend type expectations
    return data.map((item: any) => ({
      rxcui: item.rxcui || '',
      medicationName: item.medication_name,
      startDate: item.start_date,
      endDate: item.end_date,
      status: item.status
    }));
  } catch (error) {
    console.error('Error getting patient medication history:', error);
    return [];
  }
};
