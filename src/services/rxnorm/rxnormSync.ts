
import { supabase } from '@/integrations/supabase/client';
import { getMedicationDetails } from './rxnormDetails';

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
