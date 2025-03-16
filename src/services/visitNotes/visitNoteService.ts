
import { v4 as uuidv4 } from 'uuid';
import { VisitNote, VitalSigns, FHIRVitalSign, AuditEvent } from './types';
import { getAllNotes, getNoteById, getPatientVitalSigns } from './operations/getVisitNotes';
import { createNote } from './operations/createVisitNote';
import { updateNote, deleteNote } from './operations/updateVisitNote';
import { recordVitalSigns, getFHIRVitalSigns } from './operations/vitalSignsOperations';
import { logAuditEvent } from '@/integrations/supabase/client';

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
  logVitalSignsAccess: async (userId: string, patientId: string) => {
    try {
      await logAuditEvent(
        userId,
        'access',
        'VitalSigns',
        patientId,
        {
          accessReason: 'clinical_review',
          accessMethod: 'visit_note_service'
        }
      );
    } catch (error) {
      console.error('Failed to log vital signs access:', error);
      // Don't block the main flow if audit logging fails
    }
  }
};
