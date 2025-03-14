
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
}
