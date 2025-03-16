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
    
    // Check if patient_latest_vitals materialized view exists - using a safer approach
    const { data: viewData, error: viewError } = await supabase
      .from('pg_class')
      .select('exists')
      .eq('relname', 'patient_latest_vitals')
      .eq('relkind', 'm')
      .single();
    
    if (viewError || !viewData || !viewData.exists) {
      console.error('Materialized view check failed:', viewError);
      allTablesExist = false;
    }
    
    // Check if partitioned audit logs exist
    const { data: partitionedLogs, error: partitionError } = await supabase
      .from('pg_class')
      .select('exists')
      .eq('relname', 'audit_logs_partitioned')
      .single();
    
    if (partitionError || !partitionedLogs || !partitionedLogs.exists) {
      console.log('Partitioned audit logs do not exist yet - this is an optional feature');
    } else {
      console.log('Partitioned audit logs are set up correctly');
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
    // Check if the function exists first using a simpler approach
    const { data: functionCheck, error: functionError } = await supabase
      .from('pg_proc')
      .select('exists')
      .eq('proname', 'check_table_bloat')
      .single();
    
    if (functionError || !functionCheck || !functionCheck.exists) {
      console.log('Table bloat check function not available');
      return;
    }
    
    // If the function exists, call it
    const { data, error } = await supabase.rpc('check_table_bloat');
    
    if (error) {
      console.error('Error checking table bloat:', error);
      return;
    }
    
    // Check if any tables need maintenance
    const tablesNeedingVacuum = data.filter((table: any) => 
      table.recommended_action.includes('VACUUM')
    );
    
    if (tablesNeedingVacuum.length > 0) {
      toast.warning('Database Maintenance Recommended', {
        description: `${tablesNeedingVacuum.length} tables could benefit from VACUUM operation`,
        duration: 8000,
      });
    }
  } catch (error) {
    console.error('Error checking database maintenance:', error);
  }
};

/**
 * Creates database maintenance functions if they don't exist
 */
export const ensureDatabaseFunctions = async (): Promise<void> => {
  try {
    // Check if the function exists to avoid errors
    const { data: functionCheck, error: functionError } = await supabase
      .from('pg_proc')
      .select('exists')
      .eq('proname', 'check_function_exists')
      .single();
    
    if (functionError || !functionCheck || !functionCheck.exists) {
      // Function doesn't exist, we can try to create it via RPC
      try {
        await supabase.rpc('create_check_function_exists_function');
        console.log('Created check_function_exists function');
      } catch (createError) {
        console.error('Error creating check_function_exists function:', createError);
      }
    }
  } catch (error) {
    console.error('Error ensuring database functions:', error);
  }
};
