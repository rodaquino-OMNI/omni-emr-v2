
import React from 'react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading...'
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-pulse">
        <h1 className="text-2xl font-semibold text-primary">OmniCare</h1>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};
