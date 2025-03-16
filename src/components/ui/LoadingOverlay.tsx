
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  children: React.ReactNode;
  transparent?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isLoading, 
  text, 
  children, 
  transparent = false,
}) => {
  const overlayClass = transparent 
    ? 'bg-background/70' 
    : 'bg-background/95';

  return (
    <div className="relative">
      {children}
      
      {isLoading && (
        <div className={`absolute inset-0 ${overlayClass} flex flex-col items-center justify-center z-50`}>
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          {text && (
            <p className="mt-2 text-muted-foreground">{text}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LoadingOverlay;
