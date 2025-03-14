
import { supabase } from '@/integrations/supabase/client';
import { RxNormMedicationDetails, RxNormNDC } from '@/types/rxnorm';
import { RXNORM_API_BASE_URL, RxNormNDCResponse } from './rxnormTypes';
import { mockGetMedicationDetails, mockGetMedicationNDCs, shouldUseMocks } from './mockRxnormService';

/**
 * Get medication details from RxNorm
 */
export const getMedicationDetails = async (rxcui: string): Promise<RxNormMedicationDetails> => {
  // Use mocks if configured or in test environment
  if (shouldUseMocks()) {
    return mockGetMedicationDetails(rxcui);
  }

  try {
    // First check the cache
    const { data: cachedDetails, error: cacheError } = await supabase
      .from('rxnorm_details_cache')
      .select('*')
      .eq('rxcui', rxcui)
      .maybeSingle();

    if (cachedDetails && !cacheError) {
      console.log('Using cached medication details for rxcui:', rxcui);
      return cachedDetails.details as RxNormMedicationDetails;
    }

    // Fetch from RxNorm API
    const response = await fetch(
      `${RXNORM_API_BASE_URL}/rxcui/${rxcui}/allrelated`
    );

    if (!response.ok) {
      throw new Error(`RxNorm API error: ${response.status}`);
    }

    const data = await response.json();
    const details: RxNormMedicationDetails = {
      rxcui,
      name: '',
      ingredients: [],
      brandNames: [],
      dosageForms: [],
      strengths: []
    };

    // Process the response to extract relevant details
    if (data.allRelatedGroup?.conceptGroup) {
      // Extract ingredients, brand names, dose forms, etc.
      data.allRelatedGroup.conceptGroup.forEach((group: any) => {
        if (group.tty === 'IN' && group.conceptProperties) {
          details.ingredients = group.conceptProperties;
        } else if (group.tty === 'BN' && group.conceptProperties) {
          details.brandNames = group.conceptProperties;
        } else if (group.tty === 'DF' && group.conceptProperties) {
          details.dosageForms = group.conceptProperties;
        }
      });
    }

    // Get the name of the medication
    const nameResponse = await fetch(
      `${RXNORM_API_BASE_URL}/rxcui/${rxcui}/property?propName=name`
    );
    
    if (nameResponse.ok) {
      const nameData = await nameResponse.json();
      if (nameData.propConceptGroup?.propConcept?.[0]?.propValue) {
        details.name = nameData.propConceptGroup.propConcept[0].propValue;
      }
    }

    // Cache the results
    const { error: insertError } = await supabase.from('rxnorm_details_cache').insert({
      rxcui,
      details,
      created_at: new Date().toISOString()
    });

    if (insertError) {
      console.error('Error caching medication details:', insertError);
    }

    return details;
  } catch (error) {
    console.error('Error getting medication details:', error);
    throw error;
  }
};

/**
 * Get National Drug Codes (NDCs) for a specific RxNorm concept
 */
export const getNDCsByRxCUI = async (rxcui: string): Promise<RxNormNDC[]> => {
  // Use mocks if configured or in test environment
  if (shouldUseMocks()) {
    return mockGetMedicationNDCs(rxcui);
  }

  try {
    // First check the cache
    const { data: cachedNDCs, error: cacheError } = await supabase
      .from('rxnorm_ndc_cache')
      .select('*')
      .eq('rxcui', rxcui)
      .maybeSingle();

    if (cachedNDCs && !cacheError) {
      console.log('Using cached NDCs for rxcui:', rxcui);
      return cachedNDCs.ndcs as RxNormNDC[];
    }

    // Fetch from RxNorm API
    const response = await fetch(
      `${RXNORM_API_BASE_URL}/rxcui/${rxcui}/ndcs`
    );

    if (!response.ok) {
      throw new Error(`RxNorm API error: ${response.status}`);
    }

    const data: RxNormNDCResponse = await response.json();
    const ndcs: RxNormNDC[] = [];
    
    if (data.ndcGroup?.ndcList?.ndc) {
      data.ndcGroup.ndcList.ndc.forEach((ndc: string) => {
        ndcs.push({ 
          ndc, 
          rxcui, 
          status: 'active',
          source: 'RxNorm API'
        });
      });
    }

    // Cache the results
    const { error: insertError } = await supabase.from('rxnorm_ndc_cache').insert({
      rxcui,
      ndcs,
      created_at: new Date().toISOString()
    });

    if (insertError) {
      console.error('Error caching NDCs:', insertError);
    }

    return ndcs;
  } catch (error) {
    console.error('Error getting NDCs:', error);
    return [];
  }
};

/**
 * Map RxNorm to ANVISA (Brazil's medication codes)
 */
export const mapRxNormToANVISA = async (rxcui: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('rxnorm_anvisa_mappings')
      .select('anvisa_code')
      .eq('rxnorm_code', rxcui)
      .maybeSingle();

    if (error) {
      console.error('Error fetching ANVISA mapping:', error);
      return null;
    }

    return data?.anvisa_code || null;
  } catch (error) {
    console.error('Error mapping RxNorm to ANVISA:', error);
    return null;
  }
};
