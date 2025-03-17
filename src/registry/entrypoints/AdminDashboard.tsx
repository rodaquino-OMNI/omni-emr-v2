
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Users, Settings, Database, Shield } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">System Administration</h1>
        <div className="flex space-x-2">
          <Button onClick={() => navigate('/admin/users')}>
            <Users className="h-4 w-4 mr-2" />
            User Management
          </Button>
          <Button onClick={() => navigate('/admin/settings')} variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            System Settings
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <Users className="h-5 w-5 mr-2 text-primary" />
              User Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Users</span>
                <span className="font-semibold">147</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Active Now</span>
                <span className="font-semibold">32</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Pending Approval</span>
                <span className="font-semibold">5</span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-4"
              onClick={() => navigate('/admin/users')}
            >
              View All Users
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Failed Login Attempts</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Password Resets</span>
                <span className="font-semibold">7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Security Alerts</span>
                <span className="font-semibold">2</span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-4"
              onClick={() => navigate('/admin/security')}
            >
              Security Dashboard
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <Database className="h-5 w-5 mr-2 text-primary" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Database Status</span>
                <span className="font-semibold text-green-500">Healthy</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">API Performance</span>
                <span className="font-semibold text-green-500">Good</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Storage Usage</span>
                <span className="font-semibold">42%</span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-4"
              onClick={() => navigate('/admin/system')}
            >
              System Monitoring
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-2">
                <p className="font-medium">User Added</p>
                <p className="text-sm text-muted-foreground">New user "Dr. Carlos Mendes" was added to the system</p>
                <p className="text-xs text-muted-foreground">10 minutes ago by Admin</p>
              </div>
              <div className="border-b pb-2">
                <p className="font-medium">Role Modified</p>
                <p className="text-sm text-muted-foreground">Permission "view_lab_reports" added to "Nurse" role</p>
                <p className="text-xs text-muted-foreground">2 hours ago by Admin</p>
              </div>
              <div className="border-b pb-2">
                <p className="font-medium">System Update</p>
                <p className="text-sm text-muted-foreground">System updated to version 2.4.1</p>
                <p className="text-xs text-muted-foreground">Yesterday at 23:15</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-4"
              onClick={() => navigate('/admin/activity')}
            >
              View All Activity
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col items-center justify-center"
                onClick={() => navigate('/admin/users/new')}
              >
                <Users className="h-6 w-6 mb-2" />
                <span>Add New User</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col items-center justify-center"
                onClick={() => navigate('/admin/roles')}
              >
                <Shield className="h-6 w-6 mb-2" />
                <span>Manage Roles</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col items-center justify-center"
                onClick={() => navigate('/admin/backup')}
              >
                <Database className="h-6 w-6 mb-2" />
                <span>Backup System</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col items-center justify-center"
                onClick={() => navigate('/admin/settings')}
              >
                <Settings className="h-6 w-6 mb-2" />
                <span>System Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
