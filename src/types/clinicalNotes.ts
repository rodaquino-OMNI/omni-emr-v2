
// Update the existing file with new fields and types
export type NoteType = 'progress' | 'admission' | 'consultation' | 'procedure' | 'discharge';

export type NoteStatus = 'draft' | 'pending_cosign' | 'signed' | 'cosigned';

export interface ClinicalNote {
  id: string;
  patientId: string;
  authorId: string;
  authorName: string;
  type: NoteType;
  title: string;
  content: string;
  status: NoteStatus;
  createdAt: Date;
  updatedAt: Date;
  signedAt?: Date;
  cosignerId?: string;
  cosignerName?: string;
  cosignedAt?: Date;
  aiGenerated: boolean;
  aiAssistance?: string;
  offlineId?: string; // For offline-created notes
  needsSync?: boolean; // Flag for notes that need to be synced
  lastSyncAttempt?: Date; // Last sync attempt timestamp
  collaborators?: string[]; // For collaborative editing
  attachments?: { type: 'image' | 'drawing', url: string }[]; // For note attachments
  roles?: string[]; // For role-based access to notes
}

export interface NoteTemplate {
  id: string;
  type: NoteType;
  name: string;
  template: string;
  isDefault: boolean;
  sections: Array<{
    title: string;
    content: string;
    required: boolean;
  }>;
  roles?: string[]; // Role-based access to templates
}

export interface NoteValidator {
  validate: (note: ClinicalNote) => { valid: boolean, errors: string[] };
  requiredFields: string[];
}
