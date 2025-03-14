
import { supabase } from '@/integrations/supabase/client';
import { RxNormInteraction } from '@/types/rxnorm';
import { Json } from '@/integrations/supabase/types';

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
 * Format interactions for display in the UI
 * This adapts the complex RxNorm interaction response to a simpler format
 */
export const formatInteractionsForDisplay = (
  interactions: RxNormInteraction[], 
  medicationNameMap: Record<string, string>
): Array<{
  description: string;
  severity: string;
  source?: string;
  drugs: string[];
}> => {
  if (!interactions || interactions.length === 0) {
    return [];
  }

  return interactions.flatMap(interaction => {
    return interaction.interactionPair.map(pair => {
      // Extract drug RxCUIs from the interaction
      const drugRxcuis = pair.interactionConcept.map(
        concept => concept.minConceptItem.rxcui
      );
      
      // Map RxCUIs to medication names
      const drugNames = drugRxcuis.map(
        rxcui => medicationNameMap[rxcui] || rxcui
      );
      
      return {
        description: pair.description,
        severity: pair.severity,
        drugs: drugNames
      };
    });
  });
};
