
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Shield, Clock, User, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

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

const SecurityAuditLog = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [userMap, setUserMap] = useState<Record<string, string>>({});
  const { user } = useAuth();

  // Only admins should be able to access this component
  if (user?.role !== 'admin') {
    return (
      <div className="p-4 border border-yellow-400 bg-yellow-50 rounded-md mb-4 text-center">
        <AlertCircle className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
        <h3 className="text-lg font-medium text-yellow-800">Access Restricted</h3>
        <p className="text-yellow-700">You do not have permission to view security audit logs.</p>
      </div>
    );
  }

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) {
          throw error;
        }

        // Transform data to match our interface
        const transformedLogs = data?.map(log => ({
          id: log.id,
          timestamp: log.created_at,
          user_id: log.user_id,
          action: log.action,
          resource_type: log.resource_type,
          resource_id: log.resource_id,
          details: log.details,
          ip_address: log.ip_address,
          user_agent: log.user_agent
        })) || [];

        setAuditLogs(transformedLogs);
        
        // Collect unique user IDs
        const userIds = [...new Set(transformedLogs.map(log => log.user_id))];
        
        // Build a map of user IDs to names
        const userNameMap: Record<string, string> = {};
        for (const id of userIds) {
          if (!id) continue;
          
          // Fetch user from profiles
          const { data: userData } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', id)
            .maybeSingle();
              
          if (userData) {
            userNameMap[id] = userData.name;
          } else {
            userNameMap[id] = `User ${id.substring(0, 6)}...`;
          }
        }
        
        setUserMap(userNameMap);
      } catch (error) {
        console.error('Error fetching audit logs:', error);
        toast.error("Error loading audit logs", {
          description: "Failed to load security audit logs. Please try again."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();

    // Set up regular refresh every 5 minutes
    const intervalId = setInterval(fetchAuditLogs, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const filteredLogs = filter === 'all' 
    ? auditLogs 
    : auditLogs.filter(log => log.action === filter);

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

  const exportAuditLogs = () => {
    const csvContent = 
      "data:text/csv;charset=utf-8," + 
      "Timestamp,User,Action,Resource Type,Resource ID,Details\n" +
      filteredLogs.map(log => {
        return `${formatTimestamp(log.timestamp)},"${getUserName(log.user_id)}",${log.action},${log.resource_type},${log.resource_id},"${JSON.stringify(log.details).replace(/"/g, '""')}"`;
      }).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `security-audit-log-${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
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
            onClick={exportAuditLogs}
            className="h-10 bg-primary text-white rounded-md px-4 text-sm font-medium"
          >
            Export Logs
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
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
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-muted-foreground">
                      No audit logs found.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
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
      )}
      
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-blue-800">
        <div className="flex items-center mb-2">
          <Shield className="h-5 w-5 mr-2" />
          <h3 className="font-medium">HIPAA Security Compliance</h3>
        </div>
        <p className="text-sm">
          These audit logs track all security-relevant activities in accordance with HIPAA requirements.
          The logs are immutable and include user identification, timestamps, actions performed, and affected resources.
        </p>
      </div>
    </div>
  );
};

export default SecurityAuditLog;
