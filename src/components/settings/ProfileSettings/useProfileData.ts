
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProfileData, ProfileFormData } from './types';

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
  
  useEffect(() => {
    const fetchProfileDetails = async () => {
      if (!user) {
        setIsFetching(false);
        return;
      }
      
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
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsFetching(false);
      }
    };
    
    fetchProfileDetails();
  }, [user]);

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to update your profile');
      return;
    }
    
    setLoading(true);
    
    try {
      // Update profile in the database including new fields
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          email: formData.email,
          department: formData.department,
          phone: formData.phone,
          bio: formData.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
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
    updateProfile,
    handleInputChange
  };
}
