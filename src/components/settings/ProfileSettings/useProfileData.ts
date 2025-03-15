
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProfileData, ProfileFormData } from './types';
import { format } from 'date-fns';

export function useProfileData() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || '',
    department: '',
    phone: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
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
          setFormData(current => ({
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
  }, [user]);

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to update your profile');
      return;
    }
    
    setLoading(true);
    setSyncError(null);
    
    try {
      // Add a timestamp for the update
      const timestamp = new Date().toISOString();
      
      // Update profile in the database including new fields
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          email: formData.email,
          department: formData.department,
          phone: formData.phone,
          bio: formData.bio,
          updated_at: timestamp
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Set last synced time
      setLastSynced(format(new Date(), 'PPpp'));
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setSyncError('Failed to update profile');
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    formData,
    loading,
    isFetching,
    lastSynced,
    syncError,
    updateProfile,
    handleInputChange
  };
}
