
import React, { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { logAuditEvent } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const PasswordUpdateForm = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  return (
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
  );
};

export default PasswordUpdateForm;
