
import { useEffect } from 'react';
import { useMedicalHistoryData, HistoryEntry } from './useMedicalHistoryData';
import { logPatientAccess } from '../utils/auditUtils';

/**
 * Hook to manage medical history data with audit logging
 */
export const useMedicalHistory = (patientId: string, userId?: string) => {
  const { historyEntries, loading, error } = useMedicalHistoryData(patientId);

  // Log access to patient data for audit trail
  useEffect(() => {
    if (patientId && userId) {
      logPatientAccess(userId, patientId).catch(err => {
        console.error('Failed to log patient access:', err);
      });
    }
  }, [patientId, userId]);

  return {
    historyEntries,
    loading,
    error
  };
};
