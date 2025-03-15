
import { ClinicalNote, NoteStatus, NoteType } from "@/types/clinicalNotes";

// Define the database schema type
export interface DbClinicalNote {
  id: string;
  patient_id: string;
  author_id: string;
  author_name: string;
  note_type: string;
  note_title: string;
  note_content: string;
  signed: boolean;
  created_at: string;
  updated_at: string;
  signed_date?: string;
  cosigner_id?: string;
  cosigner_name?: string;
  cosigned_at?: string;
  encounter_date: string;
  version: number;
  ai_generated?: boolean;
  ai_assistance?: string;
  offline_id?: string;
  needs_sync?: boolean;
  last_sync_attempt?: string;
}

// Convert from database format to application model
export function mapDbToNote(dbNote: DbClinicalNote): ClinicalNote {
  return {
    id: dbNote.id,
    patientId: dbNote.patient_id,
    authorId: dbNote.author_id,
    authorName: dbNote.author_name,
    type: dbNote.note_type as NoteType,
    title: dbNote.note_title,
    content: dbNote.note_content,
    status: dbNote.signed ? 'signed' : 'draft' as NoteStatus, // Simplified - should check cosigned as well
    createdAt: new Date(dbNote.created_at),
    updatedAt: new Date(dbNote.updated_at),
    signedAt: dbNote.signed_date ? new Date(dbNote.signed_date) : undefined,
    cosignerId: dbNote.cosigner_id,
    cosignerName: dbNote.cosigner_name,
    cosignedAt: dbNote.cosigned_at ? new Date(dbNote.cosigned_at) : undefined,
    aiGenerated: dbNote.ai_generated || false,
    aiAssistance: dbNote.ai_assistance,
    offlineId: dbNote.offline_id,
    needsSync: dbNote.needs_sync,
    lastSyncAttempt: dbNote.last_sync_attempt ? new Date(dbNote.last_sync_attempt) : undefined
  };
}

// Convert from application model to database format
export function mapNoteToDb(note: ClinicalNote): DbClinicalNote {
  // Determine if note is signed based on its status
  const isSigned = note.status === 'signed' || note.status === 'cosigned';

  return {
    id: note.id,
    patient_id: note.patientId,
    author_id: note.authorId,
    author_name: note.authorName,
    note_type: note.type,
    note_title: note.title,
    note_content: note.content,
    signed: isSigned,
    created_at: note.createdAt.toISOString(),
    updated_at: note.updatedAt.toISOString(),
    signed_date: note.signedAt?.toISOString(),
    cosigner_id: note.cosignerId,
    cosigner_name: note.cosignerName,
    cosigned_at: note.cosignedAt?.toISOString(),
    encounter_date: new Date().toISOString(), // Default to current date if not provided
    version: 1, // Default version
    ai_generated: note.aiGenerated,
    ai_assistance: note.aiAssistance,
    offline_id: note.offlineId,
    needs_sync: note.needsSync,
    last_sync_attempt: note.lastSyncAttempt?.toISOString()
  };
}
