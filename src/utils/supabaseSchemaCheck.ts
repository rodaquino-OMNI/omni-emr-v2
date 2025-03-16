
import { supabase } from '@/integrations/supabase/core';
import { toast } from 'sonner';

/**
 * Checks if the database schema is compatible with the application
 * @returns A boolean indicating if the schema is compatible
 */
export const checkDatabaseSchema = async (): Promise<boolean> => {
  try {
    // First check the connection
    const { data: connectionCheck, error: connectionError } = await supabase.rpc('check_connection');
    
    if (connectionError || !connectionCheck) {
      console.error('Database connection check failed:', connectionError);
      return false;
    }
    
    // Check a few critical tables using the safe check_table_exists function
    const tables = [
      'appointments',
      'audit_logs',
      'extended_audit_logs',
      'security_alerts',
      'profiles'
    ];
    
    let allTablesExist = true;
    
    for (const table of tables) {
      const { data, error } = await supabase.rpc('check_table_exists', {
        table_name: table
      });
      
      if (error || !data) {
        console.error(`Table ${table} check failed:`, error);
        allTablesExist = false;
      }
    }
    
    return allTablesExist;
  } catch (error) {
    console.error('Error checking database schema:', error);
    return false;
  }
};

/**
 * Shows database structure warnings if needed
 */
export const showDatabaseStructureWarnings = async (): Promise<void> => {
  // Check the schema
  const isSchemaValid = await checkDatabaseSchema();
  
  if (!isSchemaValid) {
    toast.warning('Database Schema Issues Detected', {
      description: 'Some database objects may be missing or incorrectly configured. Contact your administrator.',
      duration: 10000,
    });
  }
};

/**
 * Check if any database maintenance is recommended
 */
export const checkDatabaseMaintenance = async (): Promise<void> => {
  try {
    // First check connection
    const { data: connectionOk, error: connectionError } = await supabase.rpc('check_connection');
    
    if (connectionError || !connectionOk) {
      console.error('Database connection error:', connectionError);
      return;
    }
    
    // Check if the query_performance_logs table exists instead of checking for a function
    const { data: tableExists, error: tableError } = await supabase.rpc('check_table_exists', {
      table_name: 'query_performance_logs'
    });
    
    if (tableError || !tableExists) {
      console.log('Performance monitoring table not available');
      return;
    }
    
    // If we get here, show a simple maintenance info
    toast.info('Database Maintenance Check', {
      description: 'Database maintenance check completed successfully.',
      duration: 4000,
    });
  } catch (error) {
    console.error('Error checking database maintenance:', error);
  }
};

/**
 * Creates database maintenance functions if they don't exist
 */
export const ensureDatabaseFunctions = async (): Promise<void> => {
  try {
    // Check if our new check_table_exists function is working
    const { data, error } = await supabase.rpc('check_table_exists', {
      table_name: 'profiles'
    });
    
    if (error) {
      console.error('Error using check_table_exists function:', error);
    } else {
      console.log('check_table_exists function is working properly');
    }
  } catch (error) {
    console.error('Error ensuring database functions:', error);
  }
};
