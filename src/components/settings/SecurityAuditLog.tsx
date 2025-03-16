
import React from 'react';
import { useAuditLogs } from './audit/useAuditLogs';
import { useAuditLogSearch } from './audit/hooks/useAuditLogSearch';
import { useLogDetailView } from './audit/hooks/useLogDetailView';
import AuditLogMainContent from './audit/AuditLogMainContent';

const SecurityAuditLog = () => {
  const { 
    filteredLogs, 
    loading, 
    filter, 
    setFilter, 
    userMap, 
    exportAuditLogs,
    refreshLogs
  } = useAuditLogs();

  const {
    searchTerm,
    setSearchTerm,
    searchedLogs,
    isFiltered: isSearchFiltered
  } = useAuditLogSearch(filteredLogs, userMap);

  const {
    selectedLog,
    detailOpen,
    setDetailOpen,
    handleViewDetails,
    handleCloseDetails
  } = useLogDetailView();

  // Determine if we're filtering by any criteria
  const isFiltered = filter !== 'all' || isSearchFiltered;

  return (
    <AuditLogMainContent
      searchTerm={searchTerm}
      filter={filter}
      searchedLogs={searchedLogs}
      isFiltered={isFiltered}
      loading={loading}
      userMap={userMap}
      selectedLog={selectedLog}
      detailOpen={detailOpen}
      setDetailOpen={setDetailOpen}
      setFilter={setFilter}
      setSearchTerm={setSearchTerm}
      exportAuditLogs={exportAuditLogs}
      refreshLogs={refreshLogs}
      handleViewDetails={handleViewDetails}
      handleCloseDetails={handleCloseDetails}
    />
  );
};

export default SecurityAuditLog;
