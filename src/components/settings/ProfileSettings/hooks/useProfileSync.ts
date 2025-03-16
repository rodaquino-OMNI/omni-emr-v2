
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { ProfileData, ProfileFormData } from '../types';
import { format } from 'date-fns';

export function useProfileSync(
  setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>,
  setLastSynced: (time: string) => void
) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
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
          setFormData((current) => ({
            ...current,
            name: profileData.name || user?.name || current.name,
            email: profileData.email || user?.email || current.email,
            role: profileData.role || user?.role || current.role,
            department: profileData.department || current.department,
            phone: profileData.phone || current.phone,
            bio: profileData.bio || current.bio
          }));
          
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
