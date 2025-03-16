
import { supabase } from './core';

/**
 * Refresh a materialized view
 */
export const refreshMaterializedView = async (viewName: string): Promise<boolean> => {
  try {
    // First check if the materialized view exists
    const { data: viewExists, error: viewError } = await supabase.rpc('check_table_exists', {
      table_name: viewName
    });
    
    if (viewError || !viewExists) {
      console.error(`Materialized view ${viewName} does not exist`);
      return false;
    }
    
    // Try a direct refresh via RPC
    try {
      await supabase.rpc('refresh_materialized_view', { view_name: viewName });
      return true;
    } catch (directError) {
      console.error(`Error refreshing materialized view ${viewName}:`, directError);
      return false;
    }
  } catch (error) {
    console.error(`Error refreshing materialized view ${viewName}:`, error);
    return false;
  }
};

/**
 * Safe method to execute a database maintenance function
 */
export const safeExecuteMaintenanceFunction = async (functionName: string, params: any = {}): Promise<any> => {
  try {
    // Check if the function exists using our safe function
    const { data: functionExists, error: functionError } = await supabase.rpc('check_table_exists', {
      table_name: functionName
    });
    
    if (functionError || !functionExists) {
      console.log(`Maintenance function ${functionName} does not exist`);
      return null;
    }
    
    // Call the function
    const { data, error } = await supabase.rpc(functionName, params);
    
    if (error) {
      console.error(`Error executing ${functionName}:`, error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error(`Error in safeExecuteMaintenanceFunction for ${functionName}:`, error);
    return null;
  }
};

/**
 * Refresh all materialized views in the database
 */
export const refreshAllMaterializedViews = async (): Promise<boolean> => {
  try {
    // Since we can't directly query pg_matviews anymore, let's check specific views we know might exist
    const viewsToCheck = ['patient_latest_vitals', 'medication_interactions_summary'];
    let allSuccess = true;
    
    for (const view of viewsToCheck) {
      // Check if the view exists first
      const { data: viewExists, error: viewError } = await supabase.rpc('check_table_exists', {
        table_name: view
      });
      
      if (viewError || !viewExists) {
        console.log(`View ${view} does not exist, skipping`);
        continue;
      }
      
      // Refresh the view if it exists
      const success = await refreshMaterializedView(view);
      if (!success) {
        allSuccess = false;
      }
    }
    
    return allSuccess;
  } catch (error) {
    console.error('Error refreshing all materialized views:', error);
    return false;
  }
};
