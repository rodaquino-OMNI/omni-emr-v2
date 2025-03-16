
import { supabase } from '../integrations/supabase/client';

/**
 * Refresh all materialized views in the database to ensure up-to-date data
 * @returns Promise that resolves when all views have been refreshed
 */
export const refreshAllMaterializedViews = async (): Promise<void> => {
  console.log('Refreshing materialized views...');
  
  try {
    // Get list of materialized views
    const { data: views, error } = await supabase
      .from('pg_matviews')
      .select('matviewname')
      .neq('matviewname', 'information_schema');
    
    if (error) {
      console.error('Error fetching materialized views:', error);
      return;
    }
    
    if (!views || views.length === 0) {
      console.log('No materialized views found to refresh');
      return;
    }
    
    // Refresh each view
    for (const view of views) {
      try {
        const { error: refreshError } = await supabase.rpc(
          'refresh_materialized_view',
          { view_name: view.matviewname }
        );
        
        if (refreshError) {
          console.error(`Error refreshing view ${view.matviewname}:`, refreshError);
        } else {
          console.log(`Successfully refreshed view: ${view.matviewname}`);
        }
      } catch (refreshError) {
        console.error(`Exception refreshing view ${view.matviewname}:`, refreshError);
      }
    }
    
    console.log('Materialized view refresh complete');
  } catch (e) {
    console.error('Exception in refreshAllMaterializedViews:', e);
  }
};

/**
 * Apply data retention policies by removing old data
 * @returns Promise that resolves when data retention has been applied
 */
export const applyDataRetentionPolicy = async (): Promise<void> => {
  try {
    // Check if policy already exists
    const { data: policyExists, error: checkError } = await supabase.rpc(
      'check_data_retention_policy_exists'
    );
    
    if (checkError) {
      console.error('Error checking data retention policy:', checkError);
      return;
    }
    
    // Create policy if needed, then apply it
    if (!policyExists) {
      const { error: createError } = await supabase.rpc(
        'create_data_retention_policy'
      );
      
      if (createError) {
        console.error('Error creating data retention policy:', createError);
        return;
      }
    }
    
    // Apply the policy
    const { error: applyError } = await supabase.rpc(
      'apply_data_retention_policies'
    );
    
    if (applyError) {
      console.error('Error applying data retention policies:', applyError);
    } else {
      console.log('Data retention policies successfully applied');
    }
  } catch (e) {
    console.error('Exception in applyDataRetentionPolicy:', e);
  }
};

export default {
  refreshAllMaterializedViews,
  applyDataRetentionPolicy
};
