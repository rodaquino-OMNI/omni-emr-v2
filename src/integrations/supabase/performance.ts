
import { supabase } from './core';

/**
 * Log slow query for performance monitoring
 */
export const logSlowQuery = async (
  queryText: string,
  executionTime: number,
  rowsReturned: number,
  queryPlan: any,
  thresholdMs = 100
): Promise<void> => {
  try {
    if (executionTime < thresholdMs) return;
    
    // Check if the table exists first
    const { data: tableExists, error: tableError } = await supabase
      .from('pg_tables')
      .select('*')
      .eq('schemaname', 'public')
      .eq('tablename', 'query_performance_logs')
      .single();
    
    if (tableError || !tableExists) {
      console.log('Performance logs table does not exist - skipping logging');
      return;
    }
    
    await supabase
      .from('query_performance_logs')
      .insert({
        query_text: queryText,
        execution_time: executionTime,
        rows_returned: rowsReturned,
        query_plan: queryPlan
      });
  } catch (error) {
    console.error('Error logging slow query:', error);
  }
};

/**
 * Get query performance statistics
 */
export const getQueryPerformanceStats = async (minExecutionTime = 100, limit = 50) => {
  try {
    // Check if performance monitoring table exists
    const { data: tableExists, error: tableError } = await supabase
      .from('pg_tables')
      .select('exists')
      .eq('schemaname', 'public')
      .eq('tablename', 'query_performance_logs')
      .single();
    
    if (tableError || !tableExists || !tableExists.exists) {
      console.error('Performance logs table does not exist');
      return [];
    }
    
    const { data, error } = await supabase
      .from('query_performance_logs')
      .select('*')
      .gte('execution_time', minExecutionTime)
      .order('execution_time', { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting query performance stats:', error);
    return [];
  }
};

/**
 * Get performance monitoring statistics
 */
export const getPerformanceStatistics = async (): Promise<any> => {
  try {
    // Check if the view exists
    const { data: viewExists, error: viewError } = await supabase
      .from('pg_class')
      .select('exists')
      .eq('relname', 'performance_statistics')
      .eq('relkind', 'v')
      .single();
    
    if (viewError || !viewExists || !viewExists.exists) {
      console.log('performance_statistics view does not exist');
      return null;
    }
    
    // Query the view
    const { data, error } = await supabase
      .from('performance_statistics')
      .select('*')
      .single();
      
    if (error) {
      console.error('Error querying performance statistics:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getPerformanceStatistics:', error);
    return null;
  }
};
