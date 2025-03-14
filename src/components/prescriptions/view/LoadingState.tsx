
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

type LoadingStateProps = {
  error: string | null;
};

const LoadingState = ({ error }: LoadingStateProps) => {
  if (error) {
    return (
      <>
        <div className="mb-6">
          <Link to="/prescriptions" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to prescriptions</span>
          </Link>
        </div>
        
        <div className="glass-card p-6">
          <div className="text-center py-8">
            <h2 className="text-xl font-medium text-destructive mb-2">{error}</h2>
            <p className="text-muted-foreground mb-4">The requested prescription could not be loaded.</p>
            <Link to="/prescriptions">
              <Button>Back to Prescriptions</Button>
            </Link>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <div className="text-center py-8">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
      <p className="mt-2 text-muted-foreground">Loading prescription...</p>
    </div>
  );
};

export default LoadingState;
