
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { ShieldX, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Unauthorized = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center max-w-md px-4">
        <div className="mb-6 bg-red-100 h-24 w-24 rounded-full flex items-center justify-center mx-auto">
          <ShieldX className="h-12 w-12 text-red-600" />
        </div>
        <h1 className="text-2xl font-semibold mb-3">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You don't have permission to access this page. Please contact your administrator if you believe this is a mistake.
        </p>
        <Button asChild>
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('back')} to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
