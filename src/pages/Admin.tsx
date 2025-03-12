
import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, ShieldCheck } from 'lucide-react';
import { useAuth, User, UserRole } from '../context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

// Mock user data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@medcare.com',
    name: 'Admin User',
    role: 'admin',
    permissions: ['all']
  },
  {
    id: '2',
    email: 'doctor@medcare.com',
    name: 'Dr. Sarah Chen',
    role: 'doctor',
    permissions: ['view_patients', 'edit_patients', 'prescribe_medications', 'view_records', 'edit_records', 'schedule_appointments', 'telemedicine']
  },
  {
    id: '3',
    email: 'nurse@medcare.com',
    name: 'Nurse Johnson',
    role: 'nurse',
    permissions: ['view_patients', 'edit_patients', 'view_medications', 'view_records', 'schedule_appointments']
  },
  {
    id: '4',
    email: 'caregiver@medcare.com',
    name: 'Jane Thompson',
    role: 'caregiver',
    permissions: ['view_patients', 'view_medications', 'view_records']
  }
];

// Available permissions
const availablePermissions = [
  { id: 'view_dashboard', label: 'View Dashboard' },
  { id: 'view_patients', label: 'View Patients' },
  { id: 'edit_patients', label: 'Edit Patients' },
  { id: 'view_records', label: 'View Records' },
  { id: 'edit_records', label: 'Edit Records' },
  { id: 'view_medications', label: 'View Medications' },
  { id: 'prescribe_medications', label: 'Prescribe Medications' },
  { id: 'view_schedule', label: 'View Schedule' },
  { id: 'schedule_appointments', label: 'Schedule Appointments' },
  { id: 'view_messages', label: 'View Messages' },
  { id: 'telemedicine', label: 'Telemedicine' }
];

interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
}

const Admin = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'caregiver',
    permissions: []
  });

  // Start with empty form for new user or populate with existing data for edit
  const openUserForm = (user: User | null = null) => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      });
      setEditingUser(user);
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'caregiver',
        permissions: []
      });
      setEditingUser(null);
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For demo purposes, we'll just update our local state
    if (editingUser) {
      // Update existing user
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? { ...u, ...formData } 
          : u
      ));
      
      toast({
        title: "User updated",
        description: `${formData.name} has been updated successfully.`
      });
    } else {
      // Add new user
      const newUser: User = {
        id: Date.now().toString(),
        ...formData
      };
      setUsers([...users, newUser]);
      
      toast({
        title: "User added",
        description: `${formData.name} has been added successfully.`
      });
    }
    
    setIsDialogOpen(false);
  };

  const handleDelete = (userId: string) => {
    // Don't allow deleting self
    if (userId === user?.id) {
      toast({
        title: "Error",
        description: "You cannot delete your own account.",
        variant: "destructive"
      });
      return;
    }
    
    // Filter out the deleted user
    setUsers(users.filter(u => u.id !== userId));
    
    toast({
      title: "User deleted",
      description: "The user has been deleted successfully."
    });
  };

  const handlePermissionChange = (permissionId: string) => {
    setFormData(prev => {
      const newPermissions = prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId];
        
      return { ...prev, permissions: newPermissions };
    });
  };

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-6xl mx-auto w-full">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold">{t('userAdmin')}</h1>
              
              <Button onClick={() => openUserForm()}>
                <Plus className="mr-2 h-4 w-4" />
                {t('addUser')}
              </Button>
            </div>
            
            <div className="glass-card p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium">{t('patientName')}</th>
                      <th className="text-left py-3 px-4 font-medium">{t('email')}</th>
                      <th className="text-left py-3 px-4 font-medium">{t('userRole')}</th>
                      <th className="text-left py-3 px-4 font-medium">{t('permissions')}</th>
                      <th className="text-right py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-border hover:bg-accent/5">
                        <td className="py-3 px-4">{user.name}</td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4 capitalize">{user.role}</td>
                        <td className="py-3 px-4">
                          {user.permissions.includes('all') 
                            ? <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                <ShieldCheck className="mr-1 h-3 w-3" />
                                All Permissions
                              </span>
                            : <span>{user.permissions.length} permissions</span>
                          }
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => openUserForm(user)}
                            className="mr-2"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(user.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? t('editUser') : t('addUser')}
            </DialogTitle>
            <DialogDescription>
              {editingUser 
                ? "Update user information and permissions" 
                : "Create a new user with specific permissions"}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  className="w-full h-10 px-3 rounded-md border border-border bg-background"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full h-10 px-3 rounded-md border border-border bg-background"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">
                  Role
                </label>
                <select
                  id="role"
                  className="w-full h-10 px-3 rounded-md border border-border bg-background"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
                >
                  <option value="admin">Administrator</option>
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="caregiver">Caregiver</option>
                  <option value="patient">Patient</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Permissions
                </label>
                <div className="max-h-40 overflow-y-auto bg-accent/5 rounded-md p-2">
                  {availablePermissions.map(permission => (
                    <div key={permission.id} className="flex items-center py-1">
                      <input
                        type="checkbox"
                        id={permission.id}
                        checked={formData.permissions.includes(permission.id)}
                        onChange={() => handlePermissionChange(permission.id)}
                        className="mr-2"
                      />
                      <label htmlFor={permission.id} className="text-sm">
                        {permission.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                {t('cancel')}
              </Button>
              <Button type="submit">
                {editingUser ? t('save') : t('add')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
