
import { supabase } from '@/integrations/supabase/client';
import { RxNormDisplayTerm, RxNormInteraction, RxNormMedication } from '@/types/rxnorm';
import { Json } from '@/integrations/supabase/types';
import { handleDatabaseError } from '@/utils/errorHandling';

/**
 * Caches RxNorm search results
 */
export const cacheSearchResults = async (
  searchTerm: string,
  searchType: 'name' | 'code',
  results: RxNormMedication[]
): Promise<void> => {
  try {
    const { error } = await supabase.from('rxnorm_search_cache').insert({
      search_term: searchTerm,
      search_type: searchType,
      results: JSON.stringify(results), // Convert to string for storage
      created_at: new Date().toISOString()
    });

    if (error) {
      console.error('Error caching search results:', error);
    }
  } catch (error) {
    console.error('Error caching search results:', error);
  }
};

/**
 * Gets cached RxNorm search results
 */
export const getCachedSearchResults = async (
  searchTerm: string,
  searchType: 'name' | 'code'
): Promise<RxNormMedication[] | null> => {
  try {
    const { data, error } = await supabase
      .from('rxnorm_search_cache')
      .select('results')
      .eq('search_term', searchTerm)
      .eq('search_type', searchType)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    // Parse the JSON string from storage
    return JSON.parse(data.results as unknown as string) as RxNormMedication[];
  } catch (error) {
    console.error('Error getting cached search results:', error);
    return null;
  }
};

/**
 * Caches display terms for autocomplete
 */
export const cacheDisplayTerms = async (
  term: string,
  results: RxNormDisplayTerm[]
): Promise<void> => {
  try {
    const { error } = await supabase.from('rxnorm_displayterms_cache').insert({
      search_term: term,
      terms: JSON.stringify(results), // Convert to string for storage
      created_at: new Date().toISOString()
    });

    if (error) {
      console.error('Error caching display terms:', error);
    }
  } catch (error) {
    console.error('Error caching display terms:', error);
  }
};

/**
 * Gets cached display terms
 */
export const getCachedDisplayTerms = async (
  term: string
): Promise<RxNormDisplayTerm[] | null> => {
  try {
    const { data, error } = await supabase
      .from('rxnorm_displayterms_cache')
      .select('terms')
      .eq('search_term', term)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    // Parse the JSON string from storage
    return JSON.parse(data.terms as unknown as string) as RxNormDisplayTerm[];
  } catch (error) {
    console.error('Error getting cached display terms:', error);
    return null;
  }
};

/**
 * Caches drug-drug interactions
 */
export const cacheInteractions = async (
  interactionKey: string,
  rxcuis: string[],
  interactions: RxNormInteraction
): Promise<void> => {
  try {
    const { error } = await supabase.from('rxnorm_interactions_cache').insert({
      interaction_key: interactionKey,
      rxcuis: rxcuis,
      interactions: JSON.stringify(interactions), // Convert to string for storage
      created_at: new Date().toISOString()
    });

    if (error) {
      console.error('Error caching interactions:', error);
    }
  } catch (error) {
    console.error('Error caching interactions:', error);
  }
};

/**
 * Gets cached drug-drug interactions
 */
export const getCachedInteractions = async (
  interactionKey: string
): Promise<RxNormInteraction | null> => {
  try {
    const { data, error } = await supabase
      .from('rxnorm_interactions_cache')
      .select('interactions')
      .eq('interaction_key', interactionKey)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    // Parse the JSON string from storage
    return JSON.parse(data.interactions as unknown as string) as RxNormInteraction;
  } catch (error) {
    console.error('Error getting cached interactions:', error);
    return null;
  }
};

/**
 * Clear all RxNorm caches
 */
export const clearRxNormCaches = async (): Promise<void> => {
  try {
    await supabase.from('rxnorm_search_cache').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('rxnorm_details_cache').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('rxnorm_ndc_cache').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('rxnorm_displayterms_cache').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('rxnorm_interactions_cache').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    console.log('All RxNorm caches cleared successfully');
  } catch (error) {
    console.error('Error clearing RxNorm caches:', error);
  }
};

/**
 * Clear expired RxNorm cache entries (older than 30 days)
 */
export const clearExpiredCache = async (): Promise<{success: boolean; count?: number}> => {
  try {
    // Calculate date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoffDate = thirtyDaysAgo.toISOString();
    
    // Delete expired entries from each cache table
    const { count: searchCount, error: searchError } = await supabase
      .from('rxnorm_search_cache')
      .delete()
      .lt('created_at', cutoffDate)
      .select('count');
      
    const { count: detailsCount, error: detailsError } = await supabase
      .from('rxnorm_details_cache')
      .delete()
      .lt('created_at', cutoffDate)
      .select('count');
      
    const { count: ndcCount, error: ndcError } = await supabase
      .from('rxnorm_ndc_cache')
      .delete()
      .lt('created_at', cutoffDate)
      .select('count');
      
    const { count: termsCount, error: termsError } = await supabase
      .from('rxnorm_displayterms_cache')
      .delete()
      .lt('created_at', cutoffDate)
      .select('count');
      
    const { count: interactionsCount, error: interactionsError } = await supabase
      .from('rxnorm_interactions_cache')
      .delete()
      .lt('created_at', cutoffDate)
      .select('count');
    
    if (searchError || detailsError || ndcError || termsError || interactionsError) {
      console.error('Errors clearing expired caches:', {
        searchError, detailsError, ndcError, termsError, interactionsError
      });
      return { success: false };
    }
    
    // Sum up all deleted entries
    const totalDeleted = (searchCount || 0) + 
                        (detailsCount || 0) + 
                        (ndcCount || 0) + 
                        (termsCount || 0) + 
                        (interactionsCount || 0);
    
    console.log(`Cleared ${totalDeleted} expired cache entries`);
    return { success: true, count: totalDeleted };
  } catch (error) {
    console.error('Error clearing expired caches:', error);
    return { success: false };
  }
};
