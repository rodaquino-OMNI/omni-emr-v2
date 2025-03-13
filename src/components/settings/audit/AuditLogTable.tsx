
import React from 'react';
import { Clock, User, FileText } from 'lucide-react';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details: any;
  ip_address?: string;
  user_agent?: string;
}

interface AuditLogTableProps {
  logs: AuditLogEntry[];
  userMap: Record<string, string>;
  loading: boolean;
}

const AuditLogTable = ({ logs, userMap, loading }: AuditLogTableProps) => {
  const actionColors: Record<string, string> = {
    login: 'bg-green-100 text-green-800',
    logout: 'bg-blue-100 text-blue-800',
    register: 'bg-purple-100 text-purple-800',
    view: 'bg-gray-100 text-gray-800',
    create: 'bg-indigo-100 text-indigo-800',
    update: 'bg-amber-100 text-amber-800',
    delete: 'bg-red-100 text-red-800',
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getUserName = (userId: string) => {
    return userMap[userId] || `User ${userId.substring(0, 6)}...`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted">
              <th className="text-left p-3 font-medium text-sm">Timestamp</th>
              <th className="text-left p-3 font-medium text-sm">User</th>
              <th className="text-left p-3 font-medium text-sm">Action</th>
              <th className="text-left p-3 font-medium text-sm">Resource</th>
              <th className="text-left p-3 font-medium text-sm">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-muted-foreground">
                  No audit logs found.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-t hover:bg-muted/50">
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      {formatTimestamp(log.timestamp)}
                    </div>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      {getUserName(log.user_id)}
                    </div>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${actionColors[log.action] || 'bg-gray-100 text-gray-800'}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      {log.resource_type}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-sm text-muted-foreground truncate max-w-xs">
                      {log.details ? JSON.stringify(log.details) : '-'}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogTable;
