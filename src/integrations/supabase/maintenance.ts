
import { supabase } from './core';

/**
 * Refresh a materialized view
 */
export const refreshMaterializedView = async (viewName: string): Promise<boolean> => {
  try {
    // First check if the view exists
    const { data: viewExists, error: viewError } = await supabase
      .from('pg_class')
      .select('exists')
      .eq('relname', viewName)
      .eq('relkind', 'm')
      .single();
    
    if (viewError || !viewExists || !viewExists.exists) {
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
    // Check if the function exists using the proper supabase syntax
    const { data: functionExists, error: functionError } = await supabase.rpc('check_function_exists', {
      function_name: functionName
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
    // Get all materialized views
    const { data, error } = await supabase
      .from('pg_matviews')
      .select('matviewname');
    
    if (error) {
      console.error('Error getting materialized views:', error);
      return false;
    }
    
    if (!data || data.length === 0) {
      console.log('No materialized views found');
      return true;
    }
    
    // Refresh each view
    const results = await Promise.all(
      data.map(view => refreshMaterializedView(view.matviewname))
    );
    
    // Return true only if all refreshes were successful
    return results.every(result => result === true);
  } catch (error) {
    console.error('Error refreshing all materialized views:', error);
    return false;
  }
};
