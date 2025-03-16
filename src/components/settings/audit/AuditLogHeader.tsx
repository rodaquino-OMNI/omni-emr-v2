
import React, { useState } from 'react';
import HeaderTitle from './components/HeaderTitle';
import HeaderActions from './components/HeaderActions';
import StatsCardGrid from './components/StatsCardGrid';
import SearchAndFilterBar from './components/SearchAndFilterBar';
import LogsCounter from './components/LogsCounter';

interface AuditLogHeaderProps {
  filter: string;
  setFilter: (value: string) => void;
  onExport: () => void;
  onRefresh: () => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  totalLogs: number;
  isFiltered: boolean;
}

const AuditLogHeader = ({ 
  filter, 
  setFilter, 
  onExport, 
  onRefresh,
  searchTerm,
  setSearchTerm,
  totalLogs,
  isFiltered
}: AuditLogHeaderProps) => {
  const [timeRange, setTimeRange] = useState('24h');

  const handleClearFilters = () => {
    setFilter('all');
    setSearchTerm('');
    setTimeRange('24h');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <HeaderTitle 
          title="Security Audit Logs" 
          subtitle="HIPAA-compliant detailed record of all security-relevant activities in the system" 
        />
        <HeaderActions onRefresh={onRefresh} onExport={onExport} />
      </div>

      <StatsCardGrid />

      <SearchAndFilterBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filter={filter}
        setFilter={setFilter}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        isFiltered={isFiltered}
        onClearFilters={handleClearFilters}
      />

      <LogsCounter totalLogs={totalLogs} isFiltered={isFiltered} />
    </div>
  );
};

export default AuditLogHeader;
