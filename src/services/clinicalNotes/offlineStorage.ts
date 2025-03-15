
import { ClinicalNote, NoteStatus, NoteTemplate } from "@/types/clinicalNotes";

// Constants for localStorage keys
const OFFLINE_NOTES_KEY = 'offlineNotes';
const OFFLINE_TEMPLATES_KEY = 'offlineTemplates';
const SYNC_QUEUE_KEY = 'noteSyncQueue';

// Helper to get item with expiry check
const getWithExpiry = (key: string) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;
  
  const item = JSON.parse(itemStr);
  const now = new Date();
  
  // Check if the item is expired
  if (item.expiry && now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  
  return item.value;
};

// Helper to set item with expiry
const setWithExpiry = (key: string, value: any, ttl: number) => {
  const now = new Date();
  const item = {
    value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const offlineStorage = {
  /**
   * Save a note to offline storage (localStorage)
   */
  saveNote: (note: ClinicalNote): void => {
    const notes = offlineStorage.getNotes();
    const existingIndex = notes.findIndex(n => n.id === note.id);
    
    if (existingIndex >= 0) {
      notes[existingIndex] = note;
    } else {
      notes.push(note);
    }
    
    // Store for 30 days
    setWithExpiry(OFFLINE_NOTES_KEY, notes, 30 * 24 * 60 * 60 * 1000);
    
    // If the note is finalized (signed or cosigned), add to sync queue
    if (note.status === 'signed' || note.status === 'cosigned') {
      offlineStorage.addToSyncQueue(note.id);
    }
  },
  
  /**
   * Get all notes from offline storage
   */
  getNotes: (): ClinicalNote[] => {
    return getWithExpiry(OFFLINE_NOTES_KEY) || [];
  },
  
  /**
   * Get a specific note by ID
   */
  getNoteById: (id: string): ClinicalNote | null => {
    const notes = offlineStorage.getNotes();
    return notes.find(note => note.id === id) || null;
  },
  
  /**
   * Save templates for offline use
   */
  saveTemplates: (templates: NoteTemplate[]): void => {
    // Store templates for 7 days
    setWithExpiry(OFFLINE_TEMPLATES_KEY, templates, 7 * 24 * 60 * 60 * 1000);
  },
  
  /**
   * Get all templates from offline storage
   */
  getTemplates: (): NoteTemplate[] => {
    return getWithExpiry(OFFLINE_TEMPLATES_KEY) || [];
  },
  
  /**
   * Add a note ID to the sync queue for later synchronization
   */
  addToSyncQueue: (noteId: string): void => {
    const queue = offlineStorage.getSyncQueue();
    if (!queue.includes(noteId)) {
      queue.push(noteId);
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    }
  },
  
  /**
   * Get all note IDs in the sync queue
   */
  getSyncQueue: (): string[] => {
    const queueStr = localStorage.getItem(SYNC_QUEUE_KEY);
    return queueStr ? JSON.parse(queueStr) : [];
  },
  
  /**
   * Remove a note ID from the sync queue after successful sync
   */
  removeFromSyncQueue: (noteId: string): void => {
    const queue = offlineStorage.getSyncQueue();
    const updatedQueue = queue.filter(id => id !== noteId);
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(updatedQueue));
  },
  
  /**
   * Clear all offline storage (for testing or reset)
   */
  clearOfflineStorage: (): void => {
    localStorage.removeItem(OFFLINE_NOTES_KEY);
    localStorage.removeItem(OFFLINE_TEMPLATES_KEY);
    localStorage.removeItem(SYNC_QUEUE_KEY);
  }
};
