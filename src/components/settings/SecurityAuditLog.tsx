
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import AccessDenied from './audit/AccessDenied';
import AuditLogHeader from './audit/AuditLogHeader';
import AuditLogTable from './audit/AuditLogTable';
import ComplianceNotice from './audit/ComplianceNotice';
import { useAuditLogs } from './audit/useAuditLogs';

const SecurityAuditLog = () => {
  const { user } = useAuth();
  const { 
    filteredLogs, 
    loading, 
    filter, 
    setFilter, 
    userMap, 
    exportAuditLogs 
  } = useAuditLogs();

  // Only admins should be able to access this component
  if (user?.role !== 'admin') {
    return <AccessDenied />;
  }

  return (
    <div className="space-y-6">
      <AuditLogHeader 
        filter={filter} 
        setFilter={setFilter} 
        onExport={exportAuditLogs} 
      />

      <AuditLogTable 
        logs={filteredLogs} 
        userMap={userMap} 
        loading={loading} 
      />
      
      <ComplianceNotice />
    </div>
  );
};

export default SecurityAuditLog;
