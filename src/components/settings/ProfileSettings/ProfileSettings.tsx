
import React from 'react';
import ProfileSectionHeader from './ProfileSectionHeader';
import ProfileForm from './ProfileForm';
import ProfileLoadingState from './ProfileLoadingState';
import { useProfileData } from './useProfileData';

const ProfileSettings = () => {
  const { formData, loading, isFetching, updateProfile, handleInputChange } = useProfileData();

  if (isFetching) {
    return <ProfileLoadingState />;
  }

  return (
    <div className="space-y-6">
      <div>
        <ProfileSectionHeader 
          title="Profile Information"
          description="Update your account's profile information and settings."
        />
        
        <ProfileForm 
          formData={formData}
          loading={loading}
          onSubmit={updateProfile}
          onInputChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default ProfileSettings;
