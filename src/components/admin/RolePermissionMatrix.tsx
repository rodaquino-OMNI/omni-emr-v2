import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface Role {
  id: string;
  name: string;
}

interface Permission {
  id: string;
  name: string;
}

interface RolePermission {
  role_id: string;
  permission_id: string;
}

const RolePermissionMatrix: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleTypes, setRoleTypes] = useState<string[]>([]);

  const fetchRoles = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*');

      if (error) {
        throw error;
      }

      setRoles(data || []);
    } catch (err: any) {
      console.error('Error fetching roles:', err);
      setError(err?.message || 'Failed to fetch roles');
    }
  }, []);

  const fetchPermissions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('permissions')
        .select('*');

      if (error) {
        throw error;
      }

      setPermissions(data || []);
    } catch (err: any) {
      console.error('Error fetching permissions:', err);
      setError(err?.message || 'Failed to fetch permissions');
    }
  }, []);

  const fetchRolePermissions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('role_permissions')
        .select('*');

      if (error) {
        throw error;
      }

      setRolePermissions(data || []);
    } catch (err: any) {
      console.error('Error fetching role permissions:', err);
      setError(err?.message || 'Failed to fetch role permissions');
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        await Promise.all([
          fetchRoles(),
          fetchPermissions(),
          fetchRolePermissions(),
        ]);

        // Extract unique role types
        const uniqueRoleTypes = [...new Set(roles.map(role => role.name))];
        setRoleTypes(uniqueRoleTypes);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err?.message || 'Failed to fetch data');
        toast({
          title: "Error loading roles and permissions",
          description: "Failed to load security roles and permissions. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchRoles, fetchPermissions, fetchRolePermissions]);

  const isPermissionAssigned = (roleId: string, permissionId: string): boolean => {
    return rolePermissions.some(
      (rp) => rp.role_id === roleId && rp.permission_id === permissionId
    );
  };

  const togglePermission = async (roleId: string, permissionId: string) => {
    const assigned = isPermissionAssigned(roleId, permissionId);

    try {
      if (assigned) {
        // Remove permission
        const { error } = await supabase
          .from('role_permissions')
          .delete()
          .eq('role_id', roleId)
          .eq('permission_id', permissionId);

        if (error) {
          throw error;
        }

        setRolePermissions(prev => prev.filter(
          rp => !(rp.role_id === roleId && rp.permission_id === permissionId)
        ));
      } else {
        // Add permission
        const { error } = await supabase
          .from('role_permissions')
          .insert([{ role_id: roleId, permission_id: permissionId }]);

        if (error) {
          throw error;
        }

        setRolePermissions(prev => [...prev, { role_id: roleId, permission_id: permissionId }]);
      }
    } catch (err: any) {
      console.error('Error toggling permission:', err);
      setError(err?.message || 'Failed to toggle permission');
      toast({
        title: "Error updating permission",
        description: "Failed to update security permission. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Role Permission Matrix</h1>
      {error && (
        <div className="text-red-500 mb-4">Error: {error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="ml-3 text-muted-foreground">Loading roles and permissions...</p>
        </div>
      ) : (
        <div className="overflow-auto">
          <Table>
            <TableCaption>A matrix displaying roles and their associated permissions.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Roles</TableHead>
                {permissions.map((permission) => (
                  <TableHead key={permission.id} className="w-[150px]">
                    {permission.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  {permissions.map((permission) => (
                    <TableCell key={permission.id}>
                      <Checkbox
                        checked={isPermissionAssigned(role.id, permission.id)}
                        onCheckedChange={() => togglePermission(role.id, permission.id)}
                        disabled={loading}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default RolePermissionMatrix;
