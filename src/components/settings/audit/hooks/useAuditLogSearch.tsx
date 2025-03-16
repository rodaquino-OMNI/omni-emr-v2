
import { useState, useMemo } from 'react';
import { AuditLogEntry } from './useAuditLogsData';

export const useAuditLogSearch = (filteredLogs: AuditLogEntry[], userMap: Record<string, string>) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const searchedLogs = useMemo(() => {
    if (!searchTerm) return filteredLogs;
    
    return filteredLogs.filter(log => 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (userMap[log.user_id] && userMap[log.user_id].toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.details && JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, filteredLogs, userMap]);

  // Determine if we're filtering
  const isFiltered = searchTerm !== '';
  
  return {
    searchTerm,
    setSearchTerm,
    searchedLogs,
    isFiltered
  };
};
