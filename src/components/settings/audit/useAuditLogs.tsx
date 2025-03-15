
import { useAuditLogsData } from './hooks/useAuditLogsData';
import { useAuditLogFilters } from './hooks/useAuditLogFilters';
import { useAuditLogExport } from './hooks/useAuditLogExport';
import { useState, useCallback } from 'react';

export const useAuditLogs = () => {
  const [refreshCounter, setRefreshCounter] = useState(0);
  const { auditLogs, loading, userMap, fetchLogs } = useAuditLogsData(refreshCounter);
  const { filter, setFilter, filteredLogs } = useAuditLogFilters(auditLogs);
  const { exportAuditLogs } = useAuditLogExport(filteredLogs, userMap);
  
  const refreshLogs = useCallback(() => {
    setRefreshCounter(prev => prev + 1);
  }, []);
  
  return {
    filteredLogs,
    loading,
    filter,
    setFilter,
    userMap,
    exportAuditLogs,
    refreshLogs
  };
};
