
import { v4 as uuidv4 } from 'uuid';
import { getAllNotes, getNoteById, getPatientVitalSigns } from './operations/getVisitNotes';
import { createNote } from './operations/createVisitNote';
import { updateNote, deleteNote } from './operations/updateVisitNote';
import { recordVitalSigns, getFHIRVitalSigns } from './operations/vitalSignsOperations';
import { logAuditEvent, logEnhancedAuditEvent } from '@/integrations/supabase/client';
import { supabase } from '@/integrations/supabase/client';

// Export types with proper type keyword
export type { VisitNote, VitalSigns, FHIRVitalSign, AuditEvent } from './types';

/**
 * Service for handling visit notes and vital sign operations
 * Enhanced with FHIR compliance and HIPAA audit logging
 */
export const visitNoteService = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  recordVitalSigns,
  getPatientVitalSigns,
  getFHIRVitalSigns,
  
  /**
   * Log access to vital signs with enhanced HIPAA-compliant audit logging
   */
  logVitalSignsAccess: async (userId: string, patientId: string, reason?: string) => {
    try {
      // Log to the enhanced audit logs for better HIPAA compliance
      await logEnhancedAuditEvent({
        userId,
        action: 'access',
        resourceType: 'VitalSigns',
        resourceId: patientId,
        patientId,
        accessReason: reason || 'clinical_review',
        accessType: 'standard_access',
        details: {
          accessMethod: 'visit_note_service',
          applicationArea: 'clinical_documentation'
        }
      });
    } catch (error) {
      console.error('Failed to log vital signs access:', error);
      
      // Fallback to basic audit logging if enhanced logging fails
      try {
        await logAuditEvent(
          userId,
          'access',
          'VitalSigns',
          patientId,
          {
            accessReason: reason || 'clinical_review',
            accessMethod: 'visit_note_service'
          }
        );
      } catch (fallbackError) {
        console.error('Failed to log vital signs access with fallback:', fallbackError);
      }
    }
  },
  
  /**
   * Request emergency access to patient data (break-glass procedure)
   */
  requestEmergencyAccess: async (userId: string, patientId: string, reason: string): Promise<boolean> => {
    try {
      // Get client information
      const clientInfo = {
        ipAddress: 'client_ip_address', // In a real implementation, this would be the client's IP
        userAgent: navigator?.userAgent || 'unknown'
      };
      
      // Record the emergency access
      const { data, error } = await supabase
        .from('emergency_access_logs')
        .insert({
          user_id: userId,
          patient_id: patientId,
          reason: reason,
          ip_address: clientInfo.ipAddress,
          user_agent: clientInfo.userAgent,
          access_scope: JSON.stringify({
            clinical_data: true,
            medications: true,
            vital_signs: true,
            notes: true
          }),
          review_status: 'pending',
          session_id: uuidv4()
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error logging emergency access:', error);
        return false;
      }
      
      // Log a special audit event for emergency access
      await logEnhancedAuditEvent({
        userId,
        action: 'emergency_access',
        resourceType: 'Patient',
        resourceId: patientId,
        patientId,
        accessReason: reason,
        accessType: 'emergency_access',
        isEmergencyAccess: true,
        emergencyReason: reason,
        details: {
          emergencyAccessId: data.id,
          accessMethod: 'break_glass_procedure',
          session_id: data.session_id
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error in requestEmergencyAccess:', error);
      return false;
    }
  },
  
  /**
   * Check if database connectivity and structure is valid
   */
  checkDatabaseHealth: async (): Promise<boolean> => {
    try {
      // Check if key tables exist
      const { count, error } = await supabase
        .from('vital_signs')
        .select('count', { count: 'exact', head: true })
        .limit(1);
        
      if (error) {
        console.error('Database health check failed:', error);
        return false;
      }
      
      // Check if materialized views are accessible
      try {
        const { error: viewError } = await supabase
          .rpc('refresh_materialized_view', { view_name: 'patient_latest_vitals' });
          
        if (viewError) {
          console.error('Materialized view refresh failed:', viewError);
          // Don't return false here, as the view might not exist yet
        }
      } catch (viewError) {
        console.error('Error checking materialized view:', viewError);
      }
      
      return true;
    } catch (error) {
      console.error('Error checking database health:', error);
      return false;
    }
  }
};
