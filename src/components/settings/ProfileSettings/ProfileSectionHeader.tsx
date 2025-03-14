
import React from 'react';

interface ProfileSectionHeaderProps {
  title: string;
  description: string;
}

const ProfileSectionHeader = ({ title, description }: ProfileSectionHeaderProps) => {
  return (
    <>
      <h2 className="text-lg font-medium mb-4">{title}</h2>
      <p className="text-muted-foreground mb-6">{description}</p>
    </>
  );
};

export default ProfileSectionHeader;
