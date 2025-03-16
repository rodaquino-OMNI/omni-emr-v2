
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
      'patient_summaries',
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
      
      // Apply data retention policies
      supabase.rpc('apply_data_retention_policies')
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
