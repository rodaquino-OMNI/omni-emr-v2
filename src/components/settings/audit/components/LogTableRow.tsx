
import React from 'react';
import { 
  Clock, User, AlertTriangle, 
  MoreHorizontal, ExternalLink, Download, Info 
} from 'lucide-react';
import { AuditLogEntry } from '../hooks/useAuditLogsData';
import { formatDistanceToNow } from 'date-fns';
import { TableRow, TableCell } from '@/components/ui/table';
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
import { Button } from '@/components/ui/button';

interface LogTableRowProps {
  log: AuditLogEntry;
  userMap: Record<string, string>;
  onViewDetails: (log: AuditLogEntry) => void;
  actionColors: Record<string, string>;
  resourceIcons: Record<string, React.ReactNode>;
}

const LogTableRow: React.FC<LogTableRowProps> = ({ 
  log, 
  userMap, 
  onViewDetails, 
  actionColors, 
  resourceIcons 
}) => {
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
    return resourceIcons[resourceType.toLowerCase()] || 
      resourceIcons['default'] || 
      <Info className="h-4 w-4 text-muted-foreground" />;
  };

  const hasSecurityImplications = (action: string) => {
    return ['login', 'logout', 'create', 'delete', 'update'].includes(action);
  };

  return (
    <TableRow className="group hover:bg-muted/50">
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
          {hasSecurityImplications(log.action) && (
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
  );
};

export default LogTableRow;
