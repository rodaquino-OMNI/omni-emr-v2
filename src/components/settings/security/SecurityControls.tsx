
import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { logAuditEvent } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import SecurityControlItem from './SecurityControlItem';
import SessionTimeoutControl from './SessionTimeoutControl';

const SecurityControls = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [dataEncryptionEnabled, setDataEncryptionEnabled] = useState(true);
  const [accessControlsEnabled, setAccessControlsEnabled] = useState(true);
  const [auditLoggingEnabled, setAuditLoggingEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  const saveSecuritySettings = async () => {
    setLoading(true);
    
    try {
      // In a real application, this would update security settings in a database
      // For demo purposes, we'll just simulate success
      
      // Log the security settings update event
      if (user) {
        await logAuditEvent(
          user.id,
          'update',
          'system_security',
          'settings',
          { 
            two_factor: twoFactorEnabled,
            session_timeout: sessionTimeout,
            data_encryption: dataEncryptionEnabled,
            access_controls: accessControlsEnabled,
            audit_logging: auditLoggingEnabled
          }
        );
      }
      
      toast({
        title: "Security controls updated",
        description: "Your security control settings have been successfully updated."
      });
    } catch (error) {
      console.error('Error updating security controls:', error);
      toast({
        title: "Update failed",
        description: "Failed to update security controls. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <SecurityControlItem 
        title="Two-Factor Authentication"
        description="Add additional security to your account using two-factor authentication."
        enabled={twoFactorEnabled}
        onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
      />
      
      <SecurityControlItem 
        title="Data Encryption at Rest"
        description="Encrypt sensitive data when stored in the database for HIPAA compliance."
        enabled={dataEncryptionEnabled}
        onChange={() => setDataEncryptionEnabled(!dataEncryptionEnabled)}
      />
      
      <SecurityControlItem 
        title="Access Controls"
        description="Enable strict role-based access controls for patient data."
        enabled={accessControlsEnabled}
        onChange={() => setAccessControlsEnabled(!accessControlsEnabled)}
      />
      
      <SecurityControlItem 
        title="Security Audit Logging"
        description="Record all security events for compliance and auditing."
        enabled={auditLoggingEnabled}
        onChange={() => setAuditLoggingEnabled(!auditLoggingEnabled)}
      />
      
      <SessionTimeoutControl 
        sessionTimeout={sessionTimeout}
        setSessionTimeout={setSessionTimeout}
      />
      
      <button
        type="button"
        className="h-10 bg-primary text-white rounded-md px-4 text-sm font-medium flex items-center gap-1 mt-4"
        onClick={saveSecuritySettings}
        disabled={loading}
      >
        <Save className="h-4 w-4" />
        Save Security Settings
        {loading && <span className="ml-2 animate-spin">↻</span>}
      </button>
    </div>
  );
};

export default SecurityControls;
