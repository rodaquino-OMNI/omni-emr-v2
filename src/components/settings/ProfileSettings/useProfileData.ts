
import { useProfileFetch } from './hooks/useProfileFetch';
import { useProfileSync } from './hooks/useProfileSync';
import { useProfileUpdate } from './hooks/useProfileUpdate';

export function useProfileData() {
  // Get profile data and state
  const {
    formData,
    setFormData,
    isFetching,
    lastSynced,
    setLastSynced,
    syncError,
    setSyncError
  } = useProfileFetch();
  
  // Set up real-time sync
  useProfileSync(setFormData, setLastSynced);
  
  // Get profile update functionality
  const { loading, updateProfile } = useProfileUpdate(
    formData,
    setLastSynced,
    setSyncError
  );

  const handleInputChange = (field: keyof typeof formData, value: string) => {
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
