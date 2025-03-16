
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { ProfileData, ProfileFormData } from '../types';
import { format } from 'date-fns';
import { logAuditEvent } from '@/integrations/supabase/client';

export function useProfileSync(
  setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>,
  setLastSynced: (time: string) => void
) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    // Log profile data access for HIPAA compliance
    const logProfileAccess = async () => {
      try {
        await logAuditEvent(
          user.id,
          'view',
          'profile',
          user.id,
          { access_reason: 'profile_management' }
        );
      } catch (error) {
        console.error('Error logging profile access:', error);
        // Non-blocking error - we continue even if logging fails
      }
    };
    
    logProfileAccess();
    
    // Set up subscription for real-time updates
    const profilesSubscription = supabase
      .channel('profiles-changes')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'profiles',
        filter: `id=eq.${user?.id}` 
      }, (payload) => {
        // Update local data when remote changes occur
        if (payload.new) {
          const profileData = payload.new as unknown as ProfileData;
          
          // Securely update the form data
          setFormData((current) => {
            const updatedData = {
              ...current,
              name: profileData.name || user?.name || current.name,
              email: profileData.email || user?.email || current.email,
              role: profileData.role || user?.role || current.role,
              department: profileData.department || current.department,
              phone: profileData.phone || current.phone,
              bio: profileData.bio || current.bio
            };
            
            // Log the profile data sync for audit purposes
            try {
              logAuditEvent(
                user.id,
                'sync',
                'profile',
                user.id,
                { profile_fields: Object.keys(updatedData) }
              ).catch(err => console.error('Error logging sync event:', err));
            } catch (error) {
              console.error('Error setting up sync audit:', error);
            }
            
            return updatedData;
          });
          
          // Update last synced time
          setLastSynced(format(new Date(), 'PPpp'));
        }
      })
      .subscribe();
    
    return () => {
      // Clean up subscription
      supabase.removeChannel(profilesSubscription);
    };
  }, [user, setFormData, setLastSynced]);
}
