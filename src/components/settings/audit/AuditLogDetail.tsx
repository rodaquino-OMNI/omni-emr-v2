
import React from 'react';
import { 
  Clock, User, FileText, Shield, Server, 
  Map, Info, AlertTriangle, Activity, X, 
  Layers
} from 'lucide-react';
import { AuditLogEntry } from './hooks/useAuditLogsData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface AuditLogDetailProps {
  log: AuditLogEntry | null;
  onClose: () => void;
  userMap: Record<string, string>;
}

const AuditLogDetail = ({ log, onClose, userMap }: AuditLogDetailProps) => {
  if (!log) return null;

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getUserName = (userId: string) => {
    return userMap[userId] || `User ${userId.substring(0, 6)}...`;
  };

  const getSecurityRiskLevel = (action: string): { level: 'low' | 'medium' | 'high', color: string } => {
    if (['delete', 'register'].includes(action)) {
      return { level: 'high', color: 'text-red-500' };
    } else if (['update', 'create'].includes(action)) {
      return { level: 'medium', color: 'text-amber-500' };
    } else {
      return { level: 'low', color: 'text-green-500' };
    }
  };

  const security = getSecurityRiskLevel(log.action);

  return (
    <Card className="border-t-4 border-t-primary">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Log Details
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Complete information about the selected audit log entry
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className={`p-1.5 rounded-full ${
              security.level === 'high' ? 'bg-red-100 dark:bg-red-900/30' : 
              security.level === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30' : 
              'bg-green-100 dark:bg-green-900/30'
            }`}>
              <AlertTriangle className={`h-5 w-5 ${security.color}`} />
            </div>
            <div className="space-y-1">
              <p className="font-medium">Security risk level</p>
              <p className={`capitalize text-sm ${security.color}`}>{security.level}</p>
            </div>
          </div>
          
          <div className="p-2 bg-muted rounded-md text-xs font-mono">
            Event ID: {log.id}
          </div>
        </div>

        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Time Information</p>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium">Timestamp</p>
                  <p className="text-sm text-muted-foreground">{formatTimestamp(log.timestamp)}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">User Information</p>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium">{getUserName(log.user_id)}</p>
                  <p className="text-sm text-muted-foreground">User ID: {log.user_id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Map className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium">IP Address</p>
                  <p className="text-sm text-muted-foreground">{log.ip_address || 'Not available'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Activity Information</p>
          
          <div className="bg-muted/50 rounded-md p-3 space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-primary/10">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium capitalize">{log.action} Action</p>
                <p className="text-sm text-muted-foreground">Type of action performed</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-primary/10">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">{log.resource_type}</p>
                <p className="text-sm text-muted-foreground">Resource ID: {log.resource_id}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Technical Details</p>
          
          <div className="bg-muted p-3 rounded-md overflow-x-auto">
            <p className="font-mono text-xs whitespace-pre">{JSON.stringify(log.details, null, 2)}</p>
          </div>
          
          {log.user_agent && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Server className="h-3.5 w-3.5" />
              <p>User Agent: {log.user_agent}</p>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Layers className="h-4 w-4 mr-1" />
            View Related Logs
          </Button>
          <Button size="sm">
            <Shield className="h-4 w-4 mr-1" />
            Investigate
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AuditLogDetail;
