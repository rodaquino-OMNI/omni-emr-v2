
import { useState } from 'react';
import { AuditLogEntry } from './useAuditLogsData';

export const useLogDetailView = () => {
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleViewDetails = (log: AuditLogEntry) => {
    setSelectedLog(log);
    setDetailOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailOpen(false);
  };

  return {
    selectedLog,
    detailOpen,
    setDetailOpen,
    handleViewDetails,
    handleCloseDetails
  };
};
