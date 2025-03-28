
import { supabase } from '@/integrations/supabase/client';
import { RxNormMedication, RxNormDisplayTerm } from '@/types/rxnorm';
import { Json } from '@/integrations/supabase/types';
import { RXNORM_API_BASE_URL } from './rxnormTypes';
import { handleApiError } from '@/utils/errorHandling';

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
      console.log('Using cached display terms for', term);
      return (cachedResult.terms as unknown as RxNormDisplayTerm[]);
    }

    console.log('Fetching display terms from RxNorm API for', term);
    const response = await fetch(
      `${RXNORM_API_BASE_URL}/displayTerms?term=${encodeURIComponent(term)}&maxResults=${maxResults}`
    );

    if (!response.ok) {
      console.error(`RxNorm API error: ${response.status} for term: ${term}`);
      throw new Error(`RxNorm API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('RxNorm API response:', data);
    
    let terms: RxNormDisplayTerm[] = [];
    
    if (data.displayTermsList?.term) {
      terms = data.displayTermsList.term;
      console.log('Found terms:', terms.length);
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
    
    // For testing purposes, return mock data if the API fails
    if (process.env.NODE_ENV === 'development') {
      console.log('Returning mock display terms data');
      return [
        { rxcui: '161', name: 'Acetaminophen', tty: 'IN' },
        { rxcui: '1011', name: 'Aspirin', tty: 'IN' },
        { rxcui: '1188', name: 'Amoxicillin', tty: 'IN' }
      ].filter(item => 
        item.name.toLowerCase().includes(term.toLowerCase())
      );
    }
    
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
