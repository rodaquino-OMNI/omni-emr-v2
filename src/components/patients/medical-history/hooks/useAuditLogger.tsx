
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export const useAuditLogger = (resourceType: string, patientId: string) => {
  const { user } = useAuth();
  
  const logAuditEvent = useCallback(async (action: string, details: any) => {
    if (!user?.id) return;
    
    try {
      const clientInfo = {
        ip: 'client_ip_unknown',
        userAgent: navigator.userAgent || 'unknown'
      };
      
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user.id,
          action,
          resource_type: resourceType,
          resource_id: patientId,
          details: JSON.stringify(details),
          ip_address: clientInfo.ip,
          user_agent: clientInfo.userAgent
        });
    } catch (error) {
      console.error(`Error logging ${action} audit event:`, error);
      // Don't block the main flow if audit logging fails
    }
  }, [user?.id, resourceType, patientId]);
  
  return { logAuditEvent };
};
