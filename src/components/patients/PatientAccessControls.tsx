
import React, { useState } from 'react';
import { Shield, Lock, User, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase, logAuditEvent, encryptData } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface PatientAccessControlsProps {
  patientId: string;
  patientName: string;
}

interface AccessDelegate {
  id: string;
  name: string;
  email: string;
  relationship: string;
  accessLevel: 'full' | 'limited' | 'emergency';
}

const PatientAccessControls: React.FC<PatientAccessControlsProps> = ({ patientId, patientName }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [delegates, setDelegates] = useState<AccessDelegate[]>([
    // Mock data for demonstration
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      relationship: 'Spouse',
      accessLevel: 'full'
    },
    {
      id: '2',
      name: 'Michael Johnson',
      email: 'michael.johnson@example.com',
      relationship: 'Son',
      accessLevel: 'limited'
    }
  ]);
  const [showAddDelegate, setShowAddDelegate] = useState(false);
  const [newDelegate, setNewDelegate] = useState({
    name: '',
    email: '',
    relationship: '',
    accessLevel: 'limited' as 'full' | 'limited' | 'emergency'
  });
  
  const handleAddDelegate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    
    try {
      // In a real application, this would create a record in the database
      // and send an invitation email with secure verification
      
      // For demo purposes, just add to the local state
      const newDelegateEntry: AccessDelegate = {
        id: crypto.randomUUID(),
        ...newDelegate
      };
      
      setDelegates([...delegates, newDelegateEntry]);
      
      // Reset form
      setNewDelegate({
        name: '',
        email: '',
        relationship: '',
        accessLevel: 'limited'
      });
      
      setShowAddDelegate(false);
      
      // Log this action for audit trail
      if (user) {
        // Encrypt sensitive data
        const encryptedDetails = encryptData(JSON.stringify({
          delegate_name: newDelegate.name,
          delegate_email: newDelegate.email,
          relationship: newDelegate.relationship,
          access_level: newDelegate.accessLevel
        }));
        
        await logAuditEvent(
          user.id,
          'create',
          'access_delegation',
          patientId,
          { encrypted_details: encryptedDetails }
        );
      }
      
      toast({
        title: "Access delegate added",
        description: `Access for ${newDelegate.name} has been granted successfully.`
      });
    } catch (error) {
      console.error('Error adding delegate:', error);
      toast({
        title: "Failed to add delegate",
        description: "An error occurred while adding the access delegate.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const removeDelegate = async (delegateId: string) => {
    try {
      setLoading(true);
      
      // In a real application, this would remove the record from the database
      // For demo purposes, just remove from local state
      const delegateToRemove = delegates.find(d => d.id === delegateId);
      setDelegates(delegates.filter(d => d.id !== delegateId));
      
      // Log this action for audit trail
      if (user && delegateToRemove) {
        // Encrypt sensitive data
        const encryptedDetails = encryptData(JSON.stringify({
          delegate_name: delegateToRemove.name,
          delegate_email: delegateToRemove.email
        }));
        
        await logAuditEvent(
          user.id,
          'delete',
          'access_delegation',
          patientId,
          { encrypted_details: encryptedDetails }
        );
      }
      
      toast({
        title: "Access delegate removed",
        description: "Access has been revoked successfully."
      });
    } catch (error) {
      console.error('Error removing delegate:', error);
      toast({
        title: "Failed to remove delegate",
        description: "An error occurred while removing the access delegate.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Patient Access Controls</h2>
          <p className="text-muted-foreground">
            Manage who can access this patient's medical information.
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            className="h-10 bg-primary text-white rounded-md px-4 text-sm font-medium"
            onClick={() => setShowAddDelegate(!showAddDelegate)}
          >
            {showAddDelegate ? 'Cancel' : 'Add Delegate'}
          </button>
        </div>
      </div>
      
      {/* HIPAA compliance notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex items-center mb-2">
          <Shield className="h-5 w-5 mr-2 text-blue-500" />
          <h3 className="font-medium text-blue-800">HIPAA Compliant Access Controls</h3>
        </div>
        <p className="text-sm text-blue-700">
          Access delegations are securely managed in compliance with HIPAA regulations.
          All access grants and revocations are recorded in the security audit log.
        </p>
      </div>
      
      {/* Form to add new delegate */}
      {showAddDelegate && (
        <div className="border rounded-md p-4 bg-muted/10">
          <h3 className="font-medium mb-4">Add New Access Delegate</h3>
          
          <form onSubmit={handleAddDelegate}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="delegateName" className="text-sm font-medium">
                  Name
                </label>
                <input
                  id="delegateName"
                  className="w-full h-10 px-3 rounded-md border border-border bg-background"
                  value={newDelegate.name}
                  onChange={(e) => setNewDelegate({...newDelegate, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="delegateEmail" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="delegateEmail"
                  type="email"
                  className="w-full h-10 px-3 rounded-md border border-border bg-background"
                  value={newDelegate.email}
                  onChange={(e) => setNewDelegate({...newDelegate, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="relationship" className="text-sm font-medium">
                  Relationship to Patient
                </label>
                <input
                  id="relationship"
                  className="w-full h-10 px-3 rounded-md border border-border bg-background"
                  value={newDelegate.relationship}
                  onChange={(e) => setNewDelegate({...newDelegate, relationship: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="accessLevel" className="text-sm font-medium">
                  Access Level
                </label>
                <select
                  id="accessLevel"
                  className="w-full h-10 px-3 rounded-md border border-border bg-background"
                  value={newDelegate.accessLevel}
                  onChange={(e) => setNewDelegate({
                    ...newDelegate, 
                    accessLevel: e.target.value as 'full' | 'limited' | 'emergency'
                  })}
                  required
                >
                  <option value="full">Full Access</option>
                  <option value="limited">Limited Access</option>
                  <option value="emergency">Emergency Only</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="h-10 bg-primary text-white rounded-md px-4 text-sm font-medium"
                disabled={loading}
              >
                Add Access
                {loading && <span className="ml-2 animate-spin">↻</span>}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* List of current delegates */}
      <div className="border rounded-md overflow-hidden">
        <div className="bg-muted px-4 py-3 border-b">
          <h3 className="font-medium">Current Access Delegates</h3>
        </div>
        
        <div className="divide-y">
          {delegates.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No access delegates have been added yet.
            </div>
          ) : (
            delegates.map((delegate) => (
              <div key={delegate.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{delegate.name}</p>
                    <p className="text-sm text-muted-foreground">{delegate.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {delegate.relationship} • 
                      {delegate.accessLevel === 'full' && ' Full Access'}
                      {delegate.accessLevel === 'limited' && ' Limited Access'}
                      {delegate.accessLevel === 'emergency' && ' Emergency Only'}
                    </p>
                  </div>
                </div>
                
                <button
                  className="h-8 px-3 rounded-md border border-destructive/20 text-destructive text-sm hover:bg-destructive/10"
                  onClick={() => removeDelegate(delegate.id)}
                  disabled={loading}
                >
                  Revoke
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Access levels explanation */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border rounded-md p-4 bg-muted/10">
          <div className="flex items-center mb-2">
            <Lock className="h-5 w-5 mr-2 text-primary" />
            <h3 className="font-medium">Full Access</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Can view all medical information, history, prescriptions, and appointments.
            Ideal for close family members or primary caregivers.
          </p>
        </div>
        
        <div className="border rounded-md p-4 bg-muted/10">
          <div className="flex items-center mb-2">
            <Lock className="h-5 w-5 mr-2 text-amber-500" />
            <h3 className="font-medium">Limited Access</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Can view basic medical information and appointments, but not detailed
            medical history or sensitive information.
          </p>
        </div>
        
        <div className="border rounded-md p-4 bg-muted/10">
          <div className="flex items-center mb-2">
            <Lock className="h-5 w-5 mr-2 text-red-500" />
            <h3 className="font-medium">Emergency Only</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Can only access critical information in emergency situations.
            Access is time-limited and fully audited.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientAccessControls;
