import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { UserRole } from '@/types/auth';
import { permissionCategories, allPermissions } from '@/utils/permissions';
import { rolePermissions } from '@/utils/permissions/roleDefinitions';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AlertCircle, Save, Filter } from 'lucide-react';
import { getFunctionDisplayName } from '@/utils/functionBlocks';

// Helper function to group permissions
const groupPermissionsByCategory = () => {
  return Object.entries(permissionCategories).map(([category, permissions]) => ({
    category,
    permissions,
    displayName: category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' ')
  }));
};

const RolePermissionMatrix = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showChangesOnly, setShowChangesOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveInProgress, setSaveInProgress] = useState(false);
  
  // State to track all permissions and their assignment to roles
  const [permissionMatrix, setPermissionMatrix] = useState<Record<string, Record<UserRole, boolean>>>({});
  
  // Keep track of original permissions to detect changes
  const [originalMatrix, setOriginalMatrix] = useState<Record<string, Record<UserRole, boolean>>>({});
  
  // Get all role types excluding certain ones
  const roleTypes = Object.keys(rolePermissions)
    .filter(role => role !== 'patient') as UserRole[];

  // Initialize permission matrix from rolePermissions data
  useEffect(() => {
    const initMatrix: Record<string, Record<UserRole, boolean>> = {};
    
    // Initialize all permissions with false values for all roles
    allPermissions.forEach(permission => {
      initMatrix[permission] = {} as Record<UserRole, boolean>;
      roleTypes.forEach(role => {
        initMatrix[permission][role] = false;
      });
    });
    
    // Set the actual permissions from rolePermissions
    roleTypes.forEach(role => {
      const permissions = rolePermissions[role] || [];
      permissions.forEach(permission => {
        if (initMatrix[permission]) {
          initMatrix[permission][role] = true;
        }
      });
    });
    
    setPermissionMatrix(initMatrix);
    setOriginalMatrix(JSON.parse(JSON.stringify(initMatrix))); // Deep copy for comparison
  }, []);

  // Handle permission toggle
  const handlePermissionToggle = (permission: string, role: UserRole) => {
    setPermissionMatrix(prev => ({
      ...prev,
      [permission]: {
        ...prev[permission],
        [role]: !prev[permission][role]
      }
    }));
  };

  // Check if a permission has been changed from its original value
  const hasPermissionChanged = (permission: string, role: UserRole) => {
    return originalMatrix[permission]?.[role] !== permissionMatrix[permission]?.[role];
  };

  // Get filtered permissions based on selected category and search
  const getFilteredPermissions = () => {
    let filtered = allPermissions;
    
    // Filter by category if not "all"
    if (selectedCategory !== 'all') {
      filtered = permissionCategories[selectedCategory] || [];
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(permission => 
        permission.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter to show only changed permissions
    if (showChangesOnly) {
      filtered = filtered.filter(permission => 
        roleTypes.some(role => hasPermissionChanged(permission, role))
      );
    }
    
    return filtered;
  };

  // Save changes to database
  const saveChanges = async () => {
    setSaveInProgress(true);
    try {
      // In a real implementation, this would update the database
      // For now, we'll simulate success and update the originalMatrix
      
      // Demo implementation - in a real app, this would be a database update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the originalMatrix to match the current state
      setOriginalMatrix(JSON.parse(JSON.stringify(permissionMatrix)));
      
      toast({
        title: "Changes saved",
        description: "Role permissions have been updated successfully",
      });
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast({
        title: "Error saving changes",
        description: "There was a problem updating role permissions",
        variant: "destructive",
      });
    } finally {
      setSaveInProgress(false);
    }
  };

  // Check if there are any unsaved changes
  const hasUnsavedChanges = () => {
    return Object.keys(permissionMatrix).some(permission => 
      roleTypes.some(role => hasPermissionChanged(permission, role))
    );
  };

  // Get all permission categories for filtering
  const permissionGroups = groupPermissionsByCategory();
  const filteredPermissions = getFilteredPermissions();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Function Assignment by Role</h3>
          <p className="text-sm text-muted-foreground">
            Assign system functions to roles to control what user groups can access
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-changes"
              checked={showChangesOnly}
              onCheckedChange={setShowChangesOnly}
            />
            <Label htmlFor="show-changes">Show changes only</Label>
          </div>
          
          <Button
            onClick={saveChanges}
            disabled={!hasUnsavedChanges() || saveInProgress}
          >
            <Save className="mr-2 h-4 w-4" />
            {saveInProgress ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
      
      {/* Category Filter Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="mb-4 flex flex-wrap">
          <TabsTrigger value="all">All</TabsTrigger>
          {permissionGroups.map(group => (
            <TabsTrigger key={group.category} value={group.category}>
              {group.displayName}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      {/* Search and Results Count */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search functions..."
            className="w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {filteredPermissions.length} of {allPermissions.length} functions
        </div>
      </div>
      
      {/* Permission Matrix Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px] sticky left-0 bg-background">Function</TableHead>
                {roleTypes.map(role => (
                  <TableHead key={role} className="text-center">
                    {role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPermissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={roleTypes.length + 1} className="text-center py-6">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <AlertCircle className="h-6 w-6 mb-2" />
                      {searchTerm ? (
                        <p>No functions match your search</p>
                      ) : showChangesOnly ? (
                        <p>No changes to display</p>
                      ) : (
                        <p>No functions available in this category</p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPermissions.map(permission => (
                  <TableRow key={permission} className="group hover:bg-muted/50">
                    <TableCell className="font-medium sticky left-0 bg-background group-hover:bg-muted/50">
                      <div className="flex items-center gap-2">
                        {getFunctionDisplayName(permission)}
                        {roleTypes.some(role => hasPermissionChanged(permission, role)) && (
                          <Badge variant="outline" className="bg-yellow-100">modified</Badge>
                        )}
                      </div>
                    </TableCell>
                    {roleTypes.map(role => (
                      <TableCell key={`${permission}-${role}`} className="text-center">
                        <Checkbox
                          checked={permissionMatrix[permission]?.[role] || false}
                          onCheckedChange={() => handlePermissionToggle(permission, role)}
                          className={hasPermissionChanged(permission, role) ? "border-yellow-500" : ""}
                          disabled={role === 'admin' || role === 'system_administrator'} // Admin roles always have all permissions
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default RolePermissionMatrix;
