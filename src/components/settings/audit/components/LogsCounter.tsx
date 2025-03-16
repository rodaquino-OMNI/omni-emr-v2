
import React from 'react';

interface LogsCounterProps {
  totalLogs: number;
  isFiltered: boolean;
}

const LogsCounter: React.FC<LogsCounterProps> = ({ totalLogs, isFiltered }) => {
  if (totalLogs === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between px-1">
      <p className="text-sm text-muted-foreground">
        Showing {isFiltered ? 'filtered' : 'all'} logs - {totalLogs} {totalLogs === 1 ? 'entry' : 'entries'}
      </p>
      <p className="text-xs text-muted-foreground">
        Last updated: {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
};

export default LogsCounter;
