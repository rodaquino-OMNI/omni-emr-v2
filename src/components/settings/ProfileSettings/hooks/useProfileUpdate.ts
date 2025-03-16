
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { ProfileFormData } from '../types';
import { format } from 'date-fns';

export function useProfileUpdate(
  formData: ProfileFormData,
  setLastSynced: (time: string) => void,
  setSyncError: (error: string | null) => void
) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

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

  return {
    loading,
    updateProfile
  };
}
