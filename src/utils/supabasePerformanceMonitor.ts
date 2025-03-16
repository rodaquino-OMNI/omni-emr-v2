
import { supabase } from '../integrations/supabase/core';

/**
 * Refresh all materialized views in the database to ensure up-to-date data
 * @returns Promise that resolves when all views have been refreshed
 */
export const refreshAllMaterializedViews = async (): Promise<void> => {
  console.log('Refreshing materialized views...');
  
  try {
    // Use our new safe function to check connection first
    const { data: connectionOk, error: connectionError } = await supabase.rpc('check_connection');
    
    if (connectionError || !connectionOk) {
      console.error('Database connection error:', connectionError);
      return;
    }
    
    // Check if refresh_materialized_view function exists
    const { data: functionExists, error: functionError } = await supabase.rpc('check_table_exists', {
      table_name: 'refresh_materialized_view'
    });
    
    if (functionError || !functionExists) {
      console.error('Refresh materialized view function does not exist:', functionError);
      return;
    }
    
    // Since we can't directly query pg_matviews anymore, we'll use a more targeted approach
    // Let's check for specific materialized views that we know should exist
    const viewsToCheck = ['patient_latest_vitals', 'medication_interactions_summary'];
    
    for (const view of viewsToCheck) {
      try {
        const { data: viewExists, error: viewError } = await supabase.rpc('check_table_exists', {
          table_name: view
        });
        
        if (viewError || !viewExists) {
          console.log(`Materialized view ${view} does not exist`);
          continue;
        }
        
        // If the view exists, try to refresh it
        const { error: refreshError } = await supabase.rpc(
          'refresh_materialized_view',
          { view_name: view }
        );
        
        if (refreshError) {
          console.error(`Error refreshing view ${view}:`, refreshError);
        } else {
          console.log(`Successfully refreshed view: ${view}`);
        }
      } catch (refreshError) {
        console.error(`Exception refreshing view ${view}:`, refreshError);
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
    // First check connection
    const { data: connectionOk, error: connectionError } = await supabase.rpc('check_connection');
    
    if (connectionError || !connectionOk) {
      console.error('Database connection error:', connectionError);
      return;
    }
    
    // Check if the data_retention_policies table exists
    const { data: tableExists, error: tableError } = await supabase.rpc('check_table_exists', {
      table_name: 'data_retention_policies'
    });
    
    if (tableError || !tableExists) {
      console.error('Data retention policies table does not exist:', tableError);
      return;
    }
    
    // Check if policy functions exist
    const { data: checkFnExists, error: checkFnError } = await supabase.rpc('check_table_exists', {
      table_name: 'check_data_retention_policy_exists'
    });
    
    if (checkFnError || !checkFnExists) {
      console.error('Data retention policy check function does not exist:', checkFnError);
      return;
    }
    
    // Create policy if needed, then apply it
    const { data: applyFnExists, error: applyFnError } = await supabase.rpc('check_table_exists', {
      table_name: 'apply_data_retention_policies'
    });
    
    if (applyFnError || !applyFnExists) {
      console.error('Apply data retention policies function does not exist:', applyFnError);
      return;
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
