
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * List of tables that are required for the application to function properly
 */
const REQUIRED_TABLES = [
  'patients',
  'profiles',
  'patient_sectors',
  'hospital_sectors',
  'user_sector_access',
  'provider_patient_assignments'
];

/**
 * List of materialized views that are used by the application
 */
const IMPORTANT_MATERIALIZED_VIEWS = [
  'patient_latest_vitals',
  'patient_status_view'
];

/**
 * Verify that all required tables exist in the database
 * @returns Promise<boolean> true if all tables exist, false otherwise
 */
export const verifyRequiredTables = async (): Promise<boolean> => {
  try {
    // First check if we can connect to the database
    const { data: connected, error: connError } = await supabase.rpc('check_connection');
    
    if (connError || !connected) {
      console.error('Database connection error:', connError);
      return false;
    }
    
    // Check if all required tables exist
    for (const table of REQUIRED_TABLES) {
      const { data, error } = await supabase.rpc('check_table_exists', { table_name: table });
      
      if (error || !data) {
        console.error(`Required table ${table} does not exist:`, error);
        return false;
      }
    }
    
    // Check important materialized views (not critical, but log warning if they don't exist)
    for (const view of IMPORTANT_MATERIALIZED_VIEWS) {
      const { data, error } = await supabase.rpc('check_table_exists', { table_name: view });
      
      if (error || !data) {
        console.warn(`Important materialized view ${view} does not exist:`, error);
        // Don't return false for views, as they're not critical
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error verifying required tables:', error);
    return false;
  }
};

/**
 * Check if a specific table exists in the database
 * @param tableName Name of the table to check
 * @returns Promise<boolean> true if the table exists, false otherwise
 */
export const checkTableExists = async (tableName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('check_table_exists', { table_name: tableName });
    
    if (error) {
      console.error(`Error checking if table ${tableName} exists:`, error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
};

/**
 * Initialize the database check and display appropriate notifications
 */
export const initializeDatabaseCheck = async () => {
  const tablesExist = await verifyRequiredTables();
  
  if (!tablesExist) {
    toast.error('Database schema issue detected', {
      description: 'Some required tables are missing. Please contact support.',
      duration: 10000
    });
  }
};
