
import { supabase } from '@/integrations/supabase/core';
import { toast } from 'sonner';
import { checkSupabaseConnection as checkConnectivity } from './supabaseConnectivity';
import { checkTableExists } from './supabaseTableCheck';

/**
 * Safely checks if the database schema is compatible with the application
 * @returns A boolean indicating if the schema is compatible
 */
export const checkDatabaseSchema = async (): Promise<boolean> => {
  try {
    // First check the connection using the safe method
    const isConnected = await checkConnectivity();
    
    if (!isConnected) {
      console.error('Database connection error');
      return false;
    }
    
    // Check a few critical tables using the safe check_table_exists function
    const tables = [
      'appointments',
      'audit_logs',
      'profiles'
    ];
    
    let allTablesExist = true;
    
    for (const table of tables) {
      const exists = await checkTableExists(table as any);
      
      if (!exists) {
        console.error(`Table ${table} does not exist`);
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
  try {
    // Check the schema
    const isSchemaValid = await checkDatabaseSchema();
    
    if (!isSchemaValid) {
      toast.warning('Database Schema Issues Detected', {
        description: 'Some database objects may be missing or incorrectly configured. Contact your administrator.',
        duration: 10000,
      });
    }
  } catch (error) {
    console.error('Error checking database schema:', error);
  }
};

/**
 * Check if any database maintenance is recommended
 */
export const checkDatabaseMaintenance = async (): Promise<void> => {
  try {
    // First check connection using safe method
    const isConnected = await checkConnectivity();
    
    if (!isConnected) {
      console.error('Database connection error');
      return;
    }
    
    // Check if the query_performance_logs table exists
    const tableExists = await checkTableExists('appointments' as any);
    
    if (!tableExists) {
      console.log('Required table not available');
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
 * Checks database functionality by verifying essential tables
 */
export const ensureDatabaseFunctions = async (): Promise<void> => {
  try {
    // Check if we can connect to the database
    const isConnected = await checkConnectivity();
    
    if (!isConnected) {
      toast.error('Database Connection Error', {
        description: 'Cannot connect to the database. Please contact your administrator.',
        duration: 6000,
      });
      return;
    }
    
    // Check if our essential tables exist
    const profilesExist = await checkTableExists('profiles' as any);
    
    if (!profilesExist) {
      toast.error('Database Structure Error', {
        description: 'Critical tables are missing. The application may not function correctly.',
        duration: 8000,
      });
    } else {
      console.log('Essential database tables are available');
    }
  } catch (error) {
    console.error('Error ensuring database functions:', error);
    toast.error('Database Check Error', {
      description: 'An error occurred while checking the database structure.',
      duration: 5000,
    });
  }
};
