
import React, { useState } from 'react';
import { 
  Shield, 
  KeyRound, 
  Clock,
  Bell,
  UserCog,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import SecurityControlItem from './SecurityControlItem';
import MFASetup from './MFASetup';
import PasswordUpdateForm from './PasswordUpdateForm';
import SessionTimeoutControl from './SessionTimeoutControl';

interface SecurityControlsProps {
  className?: string;
}

const SecurityControls: React.FC<SecurityControlsProps> = ({ className }) => {
  const { user } = useAuth();
  const [showMfaSetup, setShowMfaSetup] = useState(false);
  const [showPasswordUpdate, setShowPasswordUpdate] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);

  return (
    <div className={className}>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Security Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your security preferences and account protection
        </p>
      </div>

      <div className="mt-6 space-y-1">
        <SecurityControlItem
          icon={<Shield className="h-5 w-5" />}
          title="Two-Factor Authentication"
          description="Add an extra layer of security to your account"
          enabled={user?.mfaEnabled}
          action={
            <Button 
              onClick={() => setShowMfaSetup(true)}
              variant={user?.mfaEnabled ? "outline" : "default"}
              size="sm"
            >
              {user?.mfaEnabled ? 'Manage' : 'Enable'}
            </Button>
          }
        />

        <SecurityControlItem
          icon={<KeyRound className="h-5 w-5" />}
          title="Password"
          description="Change your account password"
          action={
            <Button 
              onClick={() => setShowPasswordUpdate(true)}
              variant="outline"
              size="sm"
            >
              Update
            </Button>
          }
        />

        <SessionTimeoutControl 
          sessionTimeout={sessionTimeout} 
          setSessionTimeout={setSessionTimeout}
        />

        <SecurityControlItem
          icon={<Bell className="h-5 w-5" />}
          title="Security Alerts"
          description="Get notified about important security events"
          action={
            <Button variant="outline" size="sm">
              Configure
            </Button>
          }
        />
      </div>

      {/* MFA Setup Dialog */}
      <Dialog open={showMfaSetup} onOpenChange={setShowMfaSetup}>
        <DialogContent>
          <MFASetup onClose={() => setShowMfaSetup(false)} />
        </DialogContent>
      </Dialog>

      {/* Password Update Dialog */}
      <Dialog open={showPasswordUpdate} onOpenChange={setShowPasswordUpdate}>
        <DialogContent>
          <PasswordUpdateForm onClose={() => setShowPasswordUpdate(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SecurityControls;
