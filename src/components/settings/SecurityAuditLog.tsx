
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import AccessDenied from './audit/AccessDenied';
import AuditLogHeader from './audit/AuditLogHeader';
import AuditLogTable from './audit/AuditLogTable';
import AuditLogDetail from './audit/AuditLogDetail';
import ComplianceNotice from './audit/ComplianceNotice';
import { useAuditLogs } from './audit/useAuditLogs';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AuditLogEntry } from './audit/hooks/useAuditLogsData';
import { Badge } from '@/components/ui/badge';

const SecurityAuditLog = () => {
  const { user } = useAuth();
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { 
    filteredLogs, 
    loading, 
    filter, 
    setFilter, 
    userMap, 
    exportAuditLogs,
    refreshLogs
  } = useAuditLogs();

  const handleViewDetails = (log: AuditLogEntry) => {
    setSelectedLog(log);
    setDetailOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailOpen(false);
  };

  // Search functionality
  const searchedLogs = searchTerm 
    ? filteredLogs.filter(log => 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (userMap[log.user_id] && userMap[log.user_id].toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.details && JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : filteredLogs;

  // Determine if we're filtering
  const isFiltered = filter !== 'all' || searchTerm !== '';

  // Only admins should be able to access this component
  if (user?.role !== 'admin') {
    return <AccessDenied />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <h1 className="text-3xl font-bold">Security Audit</h1>
        <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800">
          HIPAA Compliant
        </Badge>
      </div>
      
      <AuditLogHeader 
        filter={filter} 
        setFilter={setFilter} 
        onExport={exportAuditLogs}
        onRefresh={refreshLogs}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        totalLogs={searchedLogs.length}
        isFiltered={isFiltered}
      />

      <AuditLogTable 
        logs={searchedLogs} 
        userMap={userMap} 
        loading={loading}
        onViewDetails={handleViewDetails}
      />
      
      <ComplianceNotice />

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-[600px] p-0">
          <AuditLogDetail 
            log={selectedLog} 
            onClose={handleCloseDetails} 
            userMap={userMap}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SecurityAuditLog;
