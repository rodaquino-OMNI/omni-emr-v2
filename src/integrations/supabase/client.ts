
// This is just a re-export from core.ts to maintain compatibility
// All implementations should gradually migrate to importing from core.ts directly
import { supabase, checkSupabaseConnection, logAuditEvent, logEnhancedAuditEvent, EnhancedAuditPayload, createAuditLogPartition } from './core';

// Re-export everything
export { 
  supabase,
  checkSupabaseConnection,
  logAuditEvent,
  logEnhancedAuditEvent,
  EnhancedAuditPayload,
  createAuditLogPartition
};

/**
 * Check if the Supabase connection is working
 * @deprecated Use checkSupabaseConnection from core.ts instead
 */
export const checkSupabaseConnectionLegacy = checkSupabaseConnection;
