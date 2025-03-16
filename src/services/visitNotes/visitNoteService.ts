
import { v4 as uuidv4 } from 'uuid';
import { VisitNote, VitalSigns, FHIRVitalSign, AuditEvent } from './types';
import { getAllNotes, getNoteById, getPatientVitalSigns } from './operations/getVisitNotes';
import { createNote } from './operations/createVisitNote';
import { updateNote, deleteNote } from './operations/updateVisitNote';
import { recordVitalSigns, getFHIRVitalSigns } from './operations/vitalSignsOperations';
import { logAuditEvent, logEnhancedAuditEvent } from '@/integrations/supabase/client';

export { VisitNote, VitalSigns, FHIRVitalSign, AuditEvent } from './types';

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
      // Log to the new enhanced audit logs for better HIPAA compliance
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
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Record the emergency access
      const { data, error } = await supabase
        .from('emergency_access_logs')
        .insert({
          user_id: userId,
          patient_id: patientId,
          reason: reason,
          ip_address: 'client_ip', // In a real implementation, this would be the client's IP
          user_agent: navigator?.userAgent || 'unknown'
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
          accessMethod: 'break_glass_procedure'
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error in requestEmergencyAccess:', error);
      return false;
    }
  }
};
