
import { useAuditLogsData } from './hooks/useAuditLogsData';
import { useAuditLogFilters } from './hooks/useAuditLogFilters';
import { useAuditLogExport } from './hooks/useAuditLogExport';

export const useAuditLogs = () => {
  const { auditLogs, loading, userMap } = useAuditLogsData();
  const { filter, setFilter, filteredLogs } = useAuditLogFilters(auditLogs);
  const { exportAuditLogs } = useAuditLogExport(filteredLogs, userMap);
  
  return {
    filteredLogs,
    loading,
    filter,
    setFilter,
    userMap,
    exportAuditLogs
  };
};
