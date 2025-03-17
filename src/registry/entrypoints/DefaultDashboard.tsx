
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ClipboardList, Activity, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const DefaultDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Welcome, {user?.name || 'User'}</h1>
        <div className="flex space-x-2">
          <Button onClick={() => navigate('/profile')}>
            <UserPlus className="h-4 w-4 mr-2" />
            My Profile
          </Button>
          <Button onClick={() => navigate('/settings')} variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <Activity className="h-5 w-5 mr-2 text-primary" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">System Status</span>
                <span className="font-semibold text-green-500">Online</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Current Version</span>
                <span className="font-semibold">2.4.1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Last Login</span>
                <span className="font-semibold">Today, 08:30</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <ClipboardList className="h-5 w-5 mr-2 text-primary" />
              Quick Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="justify-start" onClick={() => navigate('/profile')}>
                My Profile
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate('/settings')}>
                Settings
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate('/help')}>
                Help Center
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate('/contact')}>
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-6">
        <CardHeader className="pb-2">
          <CardTitle>System Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-b pb-2">
              <p className="font-medium">Scheduled Maintenance</p>
              <p className="text-sm text-muted-foreground">
                System maintenance is scheduled for this Saturday from 2:00 AM to
                4:00 AM. Some services may be temporarily unavailable during this time.
              </p>
              <p className="text-xs text-muted-foreground">Posted 2 days ago</p>
            </div>
            <div className="border-b pb-2">
              <p className="font-medium">New Feature: Improved Medical Records Interface</p>
              <p className="text-sm text-muted-foreground">
                We've updated the medical records interface for better usability
                and faster access to patient information.
              </p>
              <p className="text-xs text-muted-foreground">Posted 1 week ago</p>
            </div>
            <div className="pb-2">
              <p className="font-medium">Updated Privacy Policy</p>
              <p className="text-sm text-muted-foreground">
                Our privacy policy has been updated in accordance with new data
                protection regulations.
              </p>
              <p className="text-xs text-muted-foreground">Posted 2 weeks ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DefaultDashboard;
