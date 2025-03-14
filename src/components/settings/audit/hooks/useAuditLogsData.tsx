
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AuditLogEntry {
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

export const useAuditLogsData = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userMap, setUserMap] = useState<Record<string, string>>({});

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

  return {
    auditLogs,
    loading,
    userMap
  };
};
