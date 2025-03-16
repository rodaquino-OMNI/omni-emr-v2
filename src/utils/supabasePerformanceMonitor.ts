
/**
 * Utility for monitoring and optimizing Supabase performance
 */
import { supabase, getQueryPerformanceStats, refreshMaterializedView } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PerformanceStatsOptions {
  minExecutionTime?: number;
  limit?: number;
  sortBy?: 'execution_time' | 'created_at';
  filterResourceType?: string;
}

/**
 * Get statistics on slow database queries
 */
export const getSlowQueryStats = async (options: PerformanceStatsOptions = {}) => {
  const { 
    minExecutionTime = 100, 
    limit = 50,
    sortBy = 'execution_time',
    filterResourceType
  } = options;
  
  try {
    // Get raw performance stats
    const data = await getQueryPerformanceStats(minExecutionTime, limit);
    
    // Filter by resource type if specified
    let filteredData = data;
    if (filterResourceType) {
      filteredData = data.filter((item: any) => 
        item.query_text.toLowerCase().includes(filterResourceType.toLowerCase())
      );
    }
    
    // Process and categorize the slow queries
    const categorizedQueries = {
      verySlowQueries: filteredData.filter((q: any) => q.execution_time > 1000),
      slowQueries: filteredData.filter((q: any) => q.execution_time > 100 && q.execution_time <= 1000),
      normalQueries: filteredData.filter((q: any) => q.execution_time <= 100),
    };
    
    return {
      slowQueryCount: filteredData.length,
      averageExecutionTime: filteredData.reduce((acc: number, q: any) => acc + q.execution_time, 0) / filteredData.length,
      maxExecutionTime: Math.max(...filteredData.map((q: any) => q.execution_time)),
      categorizedQueries,
      rawData: filteredData
    };
  } catch (error) {
    console.error('Error getting slow query stats:', error);
    return null;
  }
};

/**
 * Refresh materialized views for faster query response times
 */
export const refreshAllMaterializedViews = async () => {
  try {
    // List of materialized views to refresh
    const viewsToRefresh = [
      'patient_latest_vitals'
    ];
    
    // Refresh each view
    const results = await Promise.all(
      viewsToRefresh.map(async (view) => {
        const success = await refreshMaterializedView(view);
        return { view, success };
      })
    );
    
    // Log results
    const successCount = results.filter(r => r.success).length;
    
    toast.success(
      `Refreshed ${successCount} of ${viewsToRefresh.length} materialized views`,
      {
        description: successCount === viewsToRefresh.length 
          ? 'All views refreshed successfully' 
          : 'Some views failed to refresh'
      }
    );
    
    return results;
  } catch (error) {
    console.error('Error refreshing materialized views:', error);
    toast.error('Failed to refresh materialized views');
    return [];
  }
};

/**
 * Run database maintenance tasks
 */
export const runDatabaseMaintenance = async () => {
  try {
    // Run various maintenance tasks
    const maintenanceTasks = [
      // Clean expired cache
      supabase.rpc('clean_rxnorm_cache', { retention_days: 7 }),
      
      // Apply data retention policies - safely check if function exists first
      supabase.rpc('check_function_exists', { function_name: 'apply_data_retention_policies' })
        .then(({ data, error }) => {
          if (!error && data) {
            return supabase.rpc('apply_data_retention_policies');
          }
          console.log('apply_data_retention_policies function does not exist, skipping');
          return Promise.resolve();
        })
    ];
    
    await Promise.all(maintenanceTasks);
    
    toast.success('Database maintenance completed successfully');
    return true;
  } catch (error) {
    console.error('Error running database maintenance:', error);
    toast.error('Failed to complete database maintenance');
    return false;
  }
};

/**
 * Check for table bloat and recommend optimizations
 */
export const checkTableBloat = async () => {
  try {
    // First check if the function exists
    const { data: functionExists, error: functionCheckError } = await supabase
      .rpc('check_function_exists', { function_name: 'check_table_bloat' });
    
    if (functionCheckError || !functionExists) {
      console.log('check_table_bloat function does not exist');
      return null;
    }
    
    // Call the function to check table bloat
    const { data, error } = await supabase.rpc('check_table_bloat');
    
    if (error) {
      throw error;
    }
    
    const tablesNeedingAction = data.filter((table: any) => 
      table.recommended_action !== 'No action needed'
    );
    
    if (tablesNeedingAction.length > 0) {
      toast.warning('Database optimization recommended', {
        description: `${tablesNeedingAction.length} tables could benefit from maintenance`,
        duration: 10000,
      });
    }
    
    return data;
  } catch (error) {
    console.error('Error checking table bloat:', error);
    return null;
  }
};

/**
 * Get database performance statistics
 */
export const getDatabasePerformanceStats = async () => {
  try {
    // Check if the view exists
    const { data: viewExists, error: viewCheckError } = await supabase
      .rpc('check_view_exists', { view_name: 'performance_statistics' });
    
    if (viewCheckError || !viewExists) {
      console.log('performance_statistics view does not exist');
      return null;
    }
    
    // Query the performance statistics view
    const { data, error } = await supabase
      .from('performance_statistics')
      .select('*')
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting database performance stats:', error);
    return null;
  }
};

/**
 * Create helper function to check if a database function exists
 * This should be called before trying to use any custom function
 */
export const checkFunctionExists = async (functionName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.query(`
      SELECT EXISTS (
        SELECT 1
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE p.proname = '${functionName}'
        AND n.nspname = 'public'
      ) as exists
    `);
    
    if (error) {
      console.error(`Error checking if function ${functionName} exists:`, error);
      return false;
    }
    
    return data[0]?.exists || false;
  } catch (error) {
    console.error(`Exception checking if function ${functionName} exists:`, error);
    return false;
  }
};
