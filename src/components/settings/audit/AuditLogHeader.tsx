
import React from 'react';

interface AuditLogHeaderProps {
  filter: string;
  setFilter: (value: string) => void;
  onExport: () => void;
}

const AuditLogHeader = ({ filter, setFilter, onExport }: AuditLogHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-medium">Security Audit Logs</h2>
        <p className="text-muted-foreground">
          HIPAA-compliant log of all security-relevant activities in the system.
        </p>
      </div>
      <div className="flex gap-2">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-10 px-3 rounded-md border border-input bg-background"
        >
          <option value="all">All Activities</option>
          <option value="login">Logins</option>
          <option value="logout">Logouts</option>
          <option value="register">Registrations</option>
          <option value="view">View Records</option>
          <option value="create">Create Records</option>
          <option value="update">Update Records</option>
          <option value="delete">Delete Records</option>
        </select>
        <button
          onClick={onExport}
          className="h-10 bg-primary text-white rounded-md px-4 text-sm font-medium"
        >
          Export Logs
        </button>
      </div>
    </div>
  );
};

export default AuditLogHeader;
