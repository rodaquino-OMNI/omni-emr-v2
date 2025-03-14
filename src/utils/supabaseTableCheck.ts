
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type TableName = 'appointments' | 'audit_logs' | 'profiles';

/**
 * Checks if a specific table exists in the Supabase database
 * @param tableName The name of the table to check
 * @returns A boolean indicating if the table exists
 */
export const checkTableExists = async (tableName: TableName): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(tableName)
      .select('count')
      .limit(1);
    
    // If there's no error, the table exists
    if (!error) {
      return true;
    }
    
    // Check the error message to determine if it's a table not found error
    if (error.message.includes('relation') && error.message.includes('does not exist')) {
      console.error(`Table '${tableName}' does not exist:`, error);
      return false;
    }
    
    // Some other error occurred
    console.error(`Error checking if table '${tableName}' exists:`, error);
    return false;
  } catch (err) {
    console.error(`Exception checking if table '${tableName}' exists:`, err);
    return false;
  }
};

/**
 * Verifies the required tables exist in Supabase and displays a toast notification if they don't
 */
export const verifyRequiredTables = async (): Promise<void> => {
  const requiredTables: TableName[] = ['appointments', 'audit_logs', 'profiles'];
  const missingTables: string[] = [];
  
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
};
