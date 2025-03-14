
import { useState, useMemo } from 'react';
import { AuditLogEntry } from './useAuditLogsData';

export const useAuditLogFilters = (auditLogs: AuditLogEntry[]) => {
  const [filter, setFilter] = useState<string>('all');
  
  const filteredLogs = useMemo(() => {
    return filter === 'all' 
      ? auditLogs 
      : auditLogs.filter(log => log.action === filter);
  }, [filter, auditLogs]);
  
  return {
    filter,
    setFilter,
    filteredLogs
  };
};
