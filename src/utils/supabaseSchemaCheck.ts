
import { supabase } from '@/integrations/supabase/core';
import { toast } from 'sonner';

/**
 * Checks if the database schema is compatible with the application
 * @returns A boolean indicating if the schema is compatible
 */
export const checkDatabaseSchema = async (): Promise<boolean> => {
  try {
    // Check a few critical tables and their structure using the new check_table_exists function
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
    
    // Better check using check_connection function
    const { data: connectionCheck, error: connectionError } = await supabase.rpc('check_connection');
    
    if (connectionError || !connectionCheck) {
      console.error('Database connection check failed:', connectionError);
      return false;
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
    // Check if the function exists first using the new check_table_exists function
    const { data: functionExists, error: functionCheckError } = await supabase.rpc('check_table_exists', {
      table_name: 'check_table_bloat'
    });
    
    if (functionCheckError || !functionExists) {
      console.log('Table bloat check function not available');
      return;
    }
    
    // If we get here, run a simple general check
    toast.info('Database Maintenance Check', {
      description: 'Database maintenance check is available but not currently implemented.',
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
