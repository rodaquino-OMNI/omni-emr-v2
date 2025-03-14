
import { useCallback } from 'react';
import { AuditLogEntry } from './useAuditLogsData';

export const useAuditLogExport = (
  filteredLogs: AuditLogEntry[],
  userMap: Record<string, string>
) => {
  const exportAuditLogs = useCallback(() => {
    const formatTimestamp = (timestamp: string) => {
      return new Date(timestamp).toLocaleString();
    };

    const getUserName = (userId: string) => {
      return userMap[userId] || `User ${userId.substring(0, 6)}...`;
    };

    const csvContent = 
      "data:text/csv;charset=utf-8," + 
      "Timestamp,User,Action,Resource Type,Resource ID,Details\n" +
      filteredLogs.map(log => {
        return `${formatTimestamp(log.timestamp)},"${getUserName(log.user_id)}",${log.action},${log.resource_type},${log.resource_id},"${JSON.stringify(log.details).replace(/"/g, '""')}"`;
      }).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `security-audit-log-${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredLogs, userMap]);
  
  return { exportAuditLogs };
};
