
import React, { useState } from 'react';
import { Save, KeyRound } from 'lucide-react';

const SecuritySettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password update logic
    console.log('Password updated');
    
    // Reset form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-8">
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
              >
                <KeyRound className="h-4 w-4" />
                Update Password
              </button>
            </div>
          </div>
        </form>
      </div>
      
      <div className="border-t border-border pt-6">
        <h2 className="text-lg font-medium mb-4">Security Options</h2>
        
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
              Automatically log out after a period of inactivity.
            </p>
          </div>
          
          <button
            type="button"
            className="h-10 bg-primary text-white rounded-md px-4 text-sm font-medium flex items-center gap-1 mt-4"
          >
            <Save className="h-4 w-4" />
            Save Security Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
