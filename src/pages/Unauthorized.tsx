
import React from 'react';
import UnauthorizedAccessHandler from '@/components/auth/UnauthorizedAccessHandler';

const Unauthorized: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <UnauthorizedAccessHandler 
        showBackButton={true}
        showHomeButton={true}
        showLogin={true}
      />
    </div>
  );
};

export default Unauthorized;
