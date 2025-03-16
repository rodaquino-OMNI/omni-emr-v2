
import { v4 as uuidv4 } from 'uuid';
import { VisitNote, VitalSigns } from './types';
import { getAllNotes, getNoteById, getPatientVitalSigns } from './operations/getVisitNotes';
import { createNote } from './operations/createVisitNote';
import { updateNote, deleteNote } from './operations/updateVisitNote';
import { recordVitalSigns } from './operations/vitalSignsOperations';

export { VisitNote, VitalSigns } from './types';

export const visitNoteService = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  recordVitalSigns,
  getPatientVitalSigns
};
