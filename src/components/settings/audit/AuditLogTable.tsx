
import React, { useState } from 'react';
import { 
  Clock, User, FileText, Shield, Search, 
  MoreHorizontal, ExternalLink, Download, Info, AlertTriangle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { AuditLogEntry } from './hooks/useAuditLogsData';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getTimeAgo = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  const getUserName = (userId: string) => {
    return userMap[userId] || `User ${userId.substring(0, 6)}...`;
  };

  const getResourceIcon = (resourceType: string) => {
    return resourceIcons[resourceType.toLowerCase()] || <FileText className="h-4 w-4 text-muted-foreground" />;
  };

  const hasSecurityImplications = (log: AuditLogEntry) => {
    return ['login', 'logout', 'create', 'delete', 'update'].includes(log.action);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const paginatedLogs = logs.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(logs.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading security audit logs...</p>
      </div>
    );
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
              <TableRow>
                <TableCell colSpan={6} className="p-4 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center py-6 space-y-2">
                    <Search className="h-8 w-8 text-muted-foreground/60" />
                    <p>No audit logs found.</p>
                    <p className="text-sm text-muted-foreground/60">
                      Try adjusting your filters or search parameters.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedLogs.map((log) => (
                <TableRow key={log.id} className="group hover:bg-muted/50">
                  <TableCell className="font-mono text-xs">
                    <div className="flex flex-col">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{formatTimestamp(log.timestamp)}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p>{getTimeAgo(log.timestamp)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <span className="text-[10px] text-muted-foreground mt-1">
                        {getTimeAgo(log.timestamp)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-4 w-4 text-foreground" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{getUserName(log.user_id)}</span>
                        <span className="text-xs text-muted-foreground">{log.ip_address || 'No IP'}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${actionColors[log.action] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}
                      >
                        {log.action}
                      </span>
                      {hasSecurityImplications(log) && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="ml-1.5">
                                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              <p>Security relevant action</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {getResourceIcon(log.resource_type)}
                      <span className="text-sm font-medium">{log.resource_type}</span>
                      <span className="text-xs text-muted-foreground">ID: {log.resource_id.substring(0, 6)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-muted-foreground truncate max-w-xs">
                      {log.details ? JSON.stringify(log.details).substring(0, 60) + (JSON.stringify(log.details).length > 60 ? '...' : '') : '-'}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewDetails(log)}>
                          <Info className="mr-2 h-4 w-4" />
                          <span>View details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          <span>View related record</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          <span>Export entry</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {logs.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, logs.length)} of {logs.length} entries
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setPage(page > 1 ? page - 1 : 1)}
                  className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                
                // First page
                if (i === 0) pageNumber = 1;
                // Last page in our display window
                else if (i === 4) pageNumber = totalPages;
                // Middle pages
                else {
                  const middleOffset = Math.min(Math.max(page - 2, 0), totalPages - 5);
                  pageNumber = i + 1 + middleOffset;
                }
                
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink 
                      isActive={page === pageNumber}
                      onClick={() => setPage(pageNumber)}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
                  className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default AuditLogTable;
