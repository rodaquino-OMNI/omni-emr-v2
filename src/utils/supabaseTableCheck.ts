
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type TableName = 'appointments' | 'audit_logs' | 'profiles';

/**
 * Safely checks if a specific table exists in the Supabase database
 * @param tableName The name of the table to check
 * @returns A boolean indicating if the table exists
 */
export const checkTableExists = async (tableName: TableName): Promise<boolean> => {
  try {
    // Using the safe check_table_exists function with explicit schema prefix
    const { data, error } = await supabase.rpc('check_table_exists', {
      table_name: tableName
    });
    
    if (error) {
      console.error(`Error checking if table '${tableName}' exists:`, error);
      return false;
    }
    
    return data || false;
  } catch (err) {
    console.error(`Exception checking if table '${tableName}' exists:`, err);
    return false;
  }
};

/**
 * Safely verifies the required tables exist in Supabase and displays a toast notification if they don't
 */
export const verifyRequiredTables = async (): Promise<void> => {
  const requiredTables: TableName[] = ['appointments', 'audit_logs', 'profiles'];
  const missingTables: string[] = [];
  
  try {
    // First check if we can connect to Supabase
    const { data: connectionOk, error: connectionError } = await supabase.rpc('check_connection');
    
    if (connectionError || !connectionOk) {
      console.error('Database connection error:', connectionError);
      toast.error('Database Connection Error', {
        description: 'Could not connect to the database. Some features may not work properly.',
      });
      return;
    }
    
    // Then check for each required table
    for (const table of requiredTables) {
      const exists = await checkTableExists(table);
      if (!exists) {
        missingTables.push(table);
      }
    }
    
    if (missingTables.length > 0) {
      const tableList = missingTables.join(', ');
      toast.error(`Missing required database tables: ${tableList}`, {
        description: 'The application may not function correctly. Please contact your administrator.',
        duration: 10000,
      });
      
      console.error(`Missing required database tables: ${tableList}`);
    }
  } catch (error) {
    console.error('Error verifying required tables:', error);
    toast.error('Database Verification Error', {
      description: 'There was a problem checking the database structure.',
    });
  }
};
