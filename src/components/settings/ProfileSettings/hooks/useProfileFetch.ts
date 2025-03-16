
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { ProfileData, ProfileFormData } from '../types';
import { format } from 'date-fns';

export function useProfileFetch() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || '',
    department: '',
    phone: '',
    bio: ''
  });
  const [isFetching, setIsFetching] = useState(true);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProfileDetails = async () => {
      if (!user) {
        setIsFetching(false);
        return;
      }
      
      setSyncError(null);
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Use profile data from database with type assertion to include new fields
          const profileData = data as unknown as ProfileData;
          setFormData({
            name: profileData.name || user.name,
            email: profileData.email || user.email,
            role: profileData.role || user.role,
            department: profileData.department || '',
            phone: profileData.phone || '',
            bio: profileData.bio || ''
          });
          
          // Set last synced time
          setLastSynced(format(new Date(), 'PPpp'));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setSyncError('Failed to load profile data');
        toast.error('Failed to load profile data');
      } finally {
        setIsFetching(false);
      }
    };
    
    fetchProfileDetails();
  }, [user]);

  return {
    formData,
    setFormData,
    isFetching,
    lastSynced,
    setLastSynced,
    syncError,
    setSyncError
  };
}
