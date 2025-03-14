
import { supabase } from '@/integrations/supabase/client';
import { RxNormMedication, RxNormMedicationDetails, RxNormConcept, RxNormNDC } from '@/types/rxnorm';
import { Json } from '@/integrations/supabase/types';
import { RXNORM_API_BASE_URL } from './rxnormTypes';

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
    // Query the cache table directly
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
