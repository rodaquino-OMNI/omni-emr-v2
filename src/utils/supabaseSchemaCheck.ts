
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Checks if the database schema is compatible with the application
 * @returns A boolean indicating if the schema is compatible
 */
export const checkDatabaseSchema = async (): Promise<boolean> => {
  try {
    // Check a few critical tables and their structure
    const tables = [
      'appointments',
      'audit_logs',
      'extended_audit_logs',
      'security_alerts',
      'profiles'
    ];
    
    let allTablesExist = true;
    
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('count', { count: 'exact', head: true })
        .limit(1);
      
      if (error) {
        console.error(`Table ${table} check failed:`, error);
        allTablesExist = false;
      }
    }
    
    // Check if patient_latest_vitals materialized view exists
    const { data: viewData, error: viewError } = await supabase
      .rpc('check_view_exists', { view_name: 'patient_latest_vitals' });
    
    if (viewError || !viewData) {
      console.error('Materialized view check failed:', viewError);
      allTablesExist = false;
    }
    
    return allTablesExist;
  } catch (error) {
    console.error('Error checking database schema:', error);
    return false;
  }
};

/**
 * Creates a helper function in the database to check if a view exists
 */
export const createViewCheckFunction = async (): Promise<void> => {
  try {
    await supabase.rpc('create_view_check_function');
  } catch (error) {
    console.error('Error creating view check function:', error);
    
    // Try to create the function directly if RPC call fails
    try {
      const { error: fnError } = await supabase.query(`
        CREATE OR REPLACE FUNCTION public.check_view_exists(view_name TEXT)
        RETURNS BOOLEAN
        LANGUAGE plpgsql
        SECURITY DEFINER
        SET search_path TO 'public'
        AS $$
        DECLARE
          view_exists BOOLEAN;
        BEGIN
          SELECT EXISTS (
            SELECT 1
            FROM pg_catalog.pg_class c
            JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
            WHERE c.relname = check_view_exists.view_name
              AND n.nspname = 'public'
              AND c.relkind = 'm'
          ) INTO view_exists;
          
          RETURN view_exists;
        END;
        $$;
      `);
      
      if (fnError) {
        console.error('Error creating view check function directly:', fnError);
      }
    } catch (directError) {
      console.error('Exception creating view check function:', directError);
    }
  }
};

/**
 * Shows database structure warnings if needed
 */
export const showDatabaseStructureWarnings = async (): Promise<void> => {
  // Create the view check function first
  await createViewCheckFunction();
  
  // Check the schema
  const isSchemaValid = await checkDatabaseSchema();
  
  if (!isSchemaValid) {
    toast.warning('Database Schema Issues Detected', {
      description: 'Some database objects may be missing or incorrectly configured. Contact your administrator.',
      duration: 10000,
    });
  }
};
