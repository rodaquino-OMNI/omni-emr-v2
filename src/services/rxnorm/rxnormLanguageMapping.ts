
import { supabase } from '@/integrations/supabase/client';
import { RxNormMedication } from '@/types/rxnorm';

/**
 * Types for mapping RxNorm (English) to Brazilian medication names
 */
interface MedicationNameMapping {
  rxnormCode: string;
  englishName: string;
  portugueseName: string;
  anvisaCode?: string;
  lastUpdated: string;
}

/**
 * Get Brazilian medication name from RxNorm code
 */
export const getPortugueseMedicationName = async (
  rxcui: string
): Promise<string | null> => {
  try {
    // Check if mapping exists in our database
    const { data: mapping, error } = await supabase
      .from('rxnorm_portuguese_mappings')
      .select('portuguese_name')
      .eq('rxnorm_code', rxcui)
      .maybeSingle();

    if (mapping && !error) {
      return mapping.portuguese_name;
    }

    // If no mapping found, return null
    return null;
  } catch (error) {
    console.error('Error getting Portuguese medication name:', error);
    return null;
  }
};

/**
 * Save a mapping between RxNorm code and Portuguese medication name
 */
export const savePortugueseNameMapping = async (
  rxnormCode: string,
  englishName: string,
  portugueseName: string,
  anvisaCode?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase.from('rxnorm_portuguese_mappings').insert({
      rxnorm_code: rxnormCode,
      english_name: englishName,
      portuguese_name: portugueseName,
      anvisa_code: anvisaCode,
      last_updated: new Date().toISOString()
    });
    
    if (error) {
      console.error('Error saving Portuguese name mapping:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving RxNorm-Portuguese mapping:', error);
    return false;
  }
};

/**
 * Search medications by Brazilian name or RxNorm name
 * @param searchTerm The search term (works with Portuguese or English terms)
 */
export const searchMedicationsByBilingualName = async (
  searchTerm: string
): Promise<RxNormMedication[]> => {
  try {
    // First, check our Portuguese mappings
    const { data: mappings, error: mappingError } = await supabase
      .from('rxnorm_portuguese_mappings')
      .select('rxnorm_code, english_name, portuguese_name')
      .or(`portuguese_name.ilike.%${searchTerm}%,english_name.ilike.%${searchTerm}%`);
      
    if (mappingError) {
      console.error('Error searching Portuguese mappings:', mappingError);
    }
    
    if (mappings && mappings.length > 0) {
      // Return mapped medications
      return mappings.map(mapping => ({
        rxcui: mapping.rxnorm_code,
        name: mapping.english_name,
        portugueseName: mapping.portuguese_name
      }));
    }
    
    // If no matches in our mappings, fall back to regular RxNorm search
    // We'll import the existing search function from rxnormSearch.ts
    const { searchMedicationsByName } = await import('./rxnormSearch');
    const englishResults = await searchMedicationsByName(searchTerm);
    
    return englishResults;
  } catch (error) {
    console.error('Error in bilingual medication search:', error);
    return [];
  }
};

/**
 * Get both English and Portuguese names for a medication
 */
export const getBilingualMedicationNames = async (
  rxcui: string
): Promise<{ english: string; portuguese: string | null }> => {
  try {
    // Check if we have a Portuguese mapping
    const { data: mapping, error } = await supabase
      .from('rxnorm_portuguese_mappings')
      .select('english_name, portuguese_name')
      .eq('rxnorm_code', rxcui)
      .maybeSingle();
      
    if (mapping && !error) {
      return {
        english: mapping.english_name,
        portuguese: mapping.portuguese_name
      };
    }
    
    // If no mapping, get just the English name
    const { getMedicationDetails } = await import('./rxnormDetails');
    const details = await getMedicationDetails(rxcui);
    
    return {
      english: details.name,
      portuguese: null
    };
  } catch (error) {
    console.error('Error getting bilingual medication names:', error);
    return { english: '', portuguese: null };
  }
};

/**
 * Get medication suggestions in both languages
 */
export const getBilingualMedicationSuggestions = async (
  term: string,
  maxResults = 10
): Promise<{
  englishSuggestions: string[];
  portugueseSuggestions: string[];
}> => {
  try {
    // Get English suggestions from RxNorm
    const { getSpellingSuggestions } = await import('./rxnormSearch');
    const englishSuggestions = await getSpellingSuggestions(term);
    
    // Get Portuguese suggestions from our mappings
    const { data: mappings, error } = await supabase
      .from('rxnorm_portuguese_mappings')
      .select('portuguese_name')
      .ilike('portuguese_name', `%${term}%`)
      .limit(maxResults);
      
    const portugueseSuggestions = mappings ? 
      mappings.map(m => m.portuguese_name) : [];
    
    return {
      englishSuggestions,
      portugueseSuggestions
    };
  } catch (error) {
    console.error('Error getting bilingual suggestions:', error);
    return { englishSuggestions: [], portugueseSuggestions: [] };
  }
};
