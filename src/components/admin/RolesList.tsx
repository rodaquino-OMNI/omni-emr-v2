
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { UserRole } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';

// Define role display names
const roleDisplayNames: Record<UserRole, string> = {
  doctor: 'Physician',
  nurse: 'Nurse',
  admin: 'Administrator',
  patient: 'Patient',
  pharmacist: 'Pharmacist',
  lab_technician: 'Lab Technician',
  administrative: 'Administrative Staff',
  system_administrator: 'System Administrator',
  specialist: 'Specialist',
  caregiver: 'Caregiver',
  radiology_technician: 'Radiology Technician'
};

// Role descriptions for better understanding
const roleDescriptions: Record<UserRole, string> = {
  doctor: 'Medical practitioners who diagnose and treat patients',
  nurse: 'Healthcare professionals who provide patient care',
  admin: 'System administrators with full access',
  patient: 'Healthcare recipients',
  pharmacist: 'Medication management specialists',
  lab_technician: 'Laboratory test specialists',
  administrative: 'Non-clinical staff handling administrative duties',
  system_administrator: 'Technical administrators with full system access',
  specialist: 'Specialized medical practitioners',
  caregiver: 'Non-medical staff providing patient assistance',
  radiology_technician: 'Imaging specialists'
};

const RolesList = () => {
  const { toast } = useToast();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch roles from the database
  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        // In a real application, you would fetch from a roles table
        // For now, we'll use the predefined roles from the roleDisplayNames object
        setRoles(Object.keys(roleDisplayNames) as UserRole[]);
      } catch (error) {
        console.error('Error fetching roles:', error);
        toast({
          title: 'Error',
          description: 'Failed to load roles',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [toast]);

  const handleAddRole = async () => {
    // Implementation for adding a new role
    // This would typically involve a database operation
    toast({
      title: 'Not Implemented',
      description: 'Adding new roles requires database schema changes',
    });
    setIsAddDialogOpen(false);
  };

  const handleEditRole = (role: UserRole) => {
    setSelectedRole(role);
    setNewRoleName(roleDisplayNames[role]);
    setNewRoleDescription(roleDescriptions[role]);
    setIsEditDialogOpen(true);
  };

  const handleUpdateRole = async () => {
    // Implementation for updating role details
    toast({
      title: 'Not Implemented',
      description: 'Updating roles would be implemented in a production environment',
    });
    setIsEditDialogOpen(false);
  };

  const handleDeleteConfirm = (role: UserRole) => {
    setSelectedRole(role);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteRole = async () => {
    // Implementation for deleting a role
    toast({
      title: 'Not Implemented',
      description: 'Deleting roles would be implemented in a production environment',
    });
    setIsDeleteDialogOpen(false);
  };

  if (loading) {
    return <div className="flex justify-center">Loading roles...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">System Roles</h3>
        <Button onClick={() => setIsAddDialogOpen(true)} size="sm">
          <Plus className="mr-2 h-4 w-4" /> Add Role
        </Button>
      </div>
      
      <div className="grid gap-4">
        {roles.map((role) => (
          <Card key={role} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{roleDisplayNames[role]}</h4>
                    <Badge variant={role === 'admin' || role === 'system_administrator' ? 'destructive' : 'outline'}>
                      {role}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{roleDescriptions[role]}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEditRole(role)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleDeleteConfirm(role)}
                    disabled={role === 'admin' || role === 'system_administrator'}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Role Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Role</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="Enter role name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newRoleDescription}
                onChange={(e) => setNewRoleDescription(e.target.value)}
                placeholder="Enter role description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRole}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Display Name</Label>
              <Input
                id="edit-name"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={newRoleDescription}
                onChange={(e) => setNewRoleDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRole}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Role Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this role?</p>
          <p className="text-muted-foreground text-sm">
            This action cannot be undone. Users with this role will need to be reassigned.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteRole}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RolesList;
