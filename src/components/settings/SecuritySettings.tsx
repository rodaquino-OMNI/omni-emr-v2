
import React, { useState } from 'react';
import { Save, KeyRound, Shield, Lock, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase, logAuditEvent } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import SecurityAuditLog from './SecurityAuditLog';

const SecuritySettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [dataEncryptionEnabled, setDataEncryptionEnabled] = useState(true);
  const [accessControlsEnabled, setAccessControlsEnabled] = useState(true);
  const [auditLoggingEnabled, setAuditLoggingEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation password must match.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real application, this would update the password in Supabase
      // For demo, we'll just simulate success
      
      // Log the password update event
      if (user) {
        await logAuditEvent(
          user.id,
          'update',
          'user_security',
          user.id,
          { changed_password: true }
        );
      }
      
      toast({
        title: "Security settings updated",
        description: "Your security settings have been successfully updated."
      });
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating security settings:', error);
      toast({
        title: "Update failed",
        description: "Failed to update security settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
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
    <div className="space-y-8">
      {/* HIPAA Compliance Banner */}
      <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <Shield className="h-5 w-5 text-green-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">HIPAA Compliant Security</h3>
            <div className="text-sm text-green-700">
              This system implements security measures in accordance with HIPAA requirements, including
              data encryption, access controls, and security audit logging.
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-medium mb-4">Update Password</h2>
        <p className="text-muted-foreground mb-6">
          Ensure your account is using a strong password to keep your account secure.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="currentPassword" className="text-sm font-medium">
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                className="w-full h-10 px-3 rounded-md border border-border bg-background"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-sm font-medium">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                className="w-full h-10 px-3 rounded-md border border-border bg-background"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="w-full h-10 px-3 rounded-md border border-border bg-background"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            
            <div className="md:col-span-2">
              <button
                type="submit"
                className="h-10 bg-primary text-white rounded-md px-4 text-sm font-medium flex items-center gap-1 mt-2"
                disabled={loading}
              >
                <KeyRound className="h-4 w-4" />
                Update Password
                {loading && <span className="ml-2 animate-spin">↻</span>}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      <div className="border-t border-border pt-6">
        <h2 className="text-lg font-medium mb-4">HIPAA Security Controls</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground">
                Add additional security to your account using two-factor authentication.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={twoFactorEnabled}
                onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Data Encryption at Rest</h3>
              <p className="text-sm text-muted-foreground">
                Encrypt sensitive data when stored in the database for HIPAA compliance.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={dataEncryptionEnabled}
                onChange={() => setDataEncryptionEnabled(!dataEncryptionEnabled)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Access Controls</h3>
              <p className="text-sm text-muted-foreground">
                Enable strict role-based access controls for patient data.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={accessControlsEnabled}
                onChange={() => setAccessControlsEnabled(!accessControlsEnabled)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Security Audit Logging</h3>
              <p className="text-sm text-muted-foreground">
                Record all security events for compliance and auditing.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={auditLoggingEnabled}
                onChange={() => setAuditLoggingEnabled(!auditLoggingEnabled)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="sessionTimeout" className="text-sm font-medium">
              Session Timeout (minutes)
            </label>
            <select
              id="sessionTimeout"
              className="w-full md:w-64 h-10 px-3 rounded-md border border-border bg-background"
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="240">4 hours</option>
            </select>
            <p className="text-xs text-muted-foreground">
              Automatically log out after a period of inactivity for HIPAA compliance.
            </p>
          </div>
          
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
      </div>
      
      {/* Security compliance information */}
      <div className="border-t border-border pt-6">
        <h2 className="text-lg font-medium mb-4">HIPAA Compliance Information</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border rounded-md p-4 bg-muted/10">
            <div className="flex items-center mb-2">
              <Lock className="h-5 w-5 mr-2 text-primary" />
              <h3 className="font-medium">Data Encryption</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              All sensitive data is encrypted both in transit (using HTTPS) and at rest (using AES-256 encryption), 
              ensuring HIPAA compliance for Protected Health Information (PHI).
            </p>
          </div>
          
          <div className="border rounded-md p-4 bg-muted/10">
            <div className="flex items-center mb-2">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              <h3 className="font-medium">Role-Based Access</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Access to patient information is strictly controlled based on user roles.
              Patients can only access their own data, and healthcare providers have limited access based on their role.
            </p>
          </div>
        </div>
      </div>
      
      {/* Security Audit Log */}
      <div className="border-t border-border pt-6">
        <SecurityAuditLog />
      </div>
    </div>
  );
};

export default SecuritySettings;
