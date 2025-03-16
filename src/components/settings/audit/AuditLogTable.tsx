
import React, { useState } from 'react';
import { AuditLogEntry } from './hooks/useAuditLogsData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Shield, User } from 'lucide-react';
import LogTableRow from './components/LogTableRow';
import EmptyLogsState from './components/EmptyLogsState';
import LoadingState from './components/LoadingState';
import TablePagination from './components/TablePagination';

interface AuditLogTableProps {
  logs: AuditLogEntry[];
  userMap: Record<string, string>;
  loading: boolean;
  onViewDetails: (log: AuditLogEntry) => void;
}

const AuditLogTable = ({ logs, userMap, loading, onViewDetails }: AuditLogTableProps) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  
  const actionColors: Record<string, string> = {
    login: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    logout: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    register: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    view: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    create: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    update: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
    delete: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  const resourceIcons: Record<string, React.ReactNode> = {
    patient: <FileText className="h-4 w-4 text-blue-500" />,
    medication: <FileText className="h-4 w-4 text-green-500" />,
    appointment: <FileText className="h-4 w-4 text-purple-500" />,
    note: <FileText className="h-4 w-4 text-amber-500" />,
    system: <Shield className="h-4 w-4 text-gray-500" />,
    user: <User className="h-4 w-4 text-indigo-500" />,
    default: <FileText className="h-4 w-4 text-muted-foreground" />
  };

  const startIndex = (page - 1) * itemsPerPage;
  const paginatedLogs = logs.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(logs.length / itemsPerPage);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-md overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[180px]">Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="w-[120px]">Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead className="w-[200px]">Details</TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLogs.length === 0 ? (
              <EmptyLogsState />
            ) : (
              paginatedLogs.map((log) => (
                <LogTableRow 
                  key={log.id}
                  log={log}
                  userMap={userMap}
                  onViewDetails={onViewDetails}
                  actionColors={actionColors}
                  resourceIcons={resourceIcons}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        page={page}
        totalPages={totalPages}
        startIndex={startIndex}
        itemsPerPage={itemsPerPage}
        totalItems={logs.length}
        setPage={setPage}
      />
    </div>
  );
};

export default AuditLogTable;
