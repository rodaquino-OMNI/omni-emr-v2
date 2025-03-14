
import React from 'react';
import { FileText, FilePlus, FileEdit, FileCheck, FileX } from 'lucide-react';
import { NoteType } from '@/types/clinicalNotes';

export const templateIcons: Record<NoteType, React.ReactNode> = {
  progress: <FileText className="h-5 w-5 text-blue-500" />,
  admission: <FilePlus className="h-5 w-5 text-purple-500" />,
  consultation: <FileEdit className="h-5 w-5 text-green-500" />,
  procedure: <FileCheck className="h-5 w-5 text-amber-500" />,
  discharge: <FileX className="h-5 w-5 text-red-500" />
};
