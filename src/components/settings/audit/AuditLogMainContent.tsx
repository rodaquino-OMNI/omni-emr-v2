
import React from 'react';
import { Badge } from '@/components/ui/badge';
import AuditLogHeader from './AuditLogHeader';
import AuditLogTable from './AuditLogTable';
import ComplianceNotice from './ComplianceNotice';
import { AuditLogEntry } from './hooks/useAuditLogsData';
import AccessDenied from './AccessDenied';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import AuditLogDetail from './AuditLogDetail';

interface AuditLogMainContentProps {
  searchTerm: string;
  filter: string;
  searchedLogs: AuditLogEntry[];
  isFiltered: boolean;
  loading: boolean;
  userMap: Record<string, string>;
  selectedLog: AuditLogEntry | null;
  detailOpen: boolean;
  setDetailOpen: (open: boolean) => void;
  setFilter: (filter: string) => void;
  setSearchTerm: (term: string) => void;
  exportAuditLogs: () => void;
  refreshLogs: () => void;
  handleViewDetails: (log: AuditLogEntry) => void;
  handleCloseDetails: () => void;
}

const AuditLogMainContent: React.FC<AuditLogMainContentProps> = ({
  searchTerm,
  filter,
  searchedLogs,
  isFiltered,
  loading,
  userMap,
  selectedLog,
  detailOpen,
  setDetailOpen,
  setFilter,
  setSearchTerm,
  exportAuditLogs,
  refreshLogs,
  handleViewDetails,
  handleCloseDetails
}) => {
  const { user } = useAuth();

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

export default AuditLogMainContent;
