
import { supabase } from './core';

/**
 * Check if a user has a specific permission
 */
export const userHasPermission = async (userId: string, permissionCode: string): Promise<boolean> => {
  try {
    // Check if the function exists using our safe function
    const { data: functionExists, error: functionError } = await supabase.rpc('check_table_exists', {
      table_name: 'user_has_permission'
    });
    
    if (functionError || !functionExists) {
      console.error('user_has_permission function does not exist, using fallback check');
      // Fallback to a simpler check
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
        
      if (userError) throw userError;
      
      // Simplified permission check based on role
      const userRole = userData?.role;
      if (userRole === 'admin') return true;
      if (permissionCode.includes('read') && ['doctor', 'nurse'].includes(userRole as string)) return true;
      if (permissionCode.includes('write') && userRole === 'doctor') return true;
      
      return false;
    }
    
    // If function exists, use it
    const { data, error } = await supabase.rpc(
      'user_has_permission', 
      {
        p_user_id: userId,
        p_permission_code: permissionCode
      }
    );
    
    if (error) throw error;
    
    return !!data;
  } catch (error) {
    console.error('Error checking user permission:', error);
    return false;
  }
};
