
import { supabase } from '@/integrations/supabase/core';

export const logPatientAccess = async (userId: string, patientId: string) => {
  try {
    const clientInfo = {
      ip: 'client_ip_unknown',
      userAgent: navigator.userAgent || 'unknown'
    };
    
    await supabase
      .from('audit_logs')
      .insert({
        user_id: userId,
        action: 'view',
        resource_type: 'PatientHistory',
        resource_id: patientId,
        details: JSON.stringify({
          view_type: 'patient_history',
          patient_id: patientId
        }),
        ip_address: clientInfo.ip,
        user_agent: clientInfo.userAgent
      });
  } catch (err) {
    console.error('Failed to log access:', err);
    // Don't block the main flow if audit logging fails
  }
};
