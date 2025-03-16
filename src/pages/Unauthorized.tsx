
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldX, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto flex max-w-md flex-col items-center justify-center space-y-6 text-center">
        <div className="rounded-full bg-destructive/10 p-6">
          <ShieldX className="h-12 w-12 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold tracking-tighter">{t('unauthorized')}</h1>
        <p className="text-muted-foreground">
          {t('accessDenied')}. {t('insufficientPermissions')}.
        </p>
        <p className="text-muted-foreground">
          {t('contactAdmin')}.
        </p>
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            {t('back')}
          </Button>
          <Button onClick={() => navigate('/login')}>
            {t('signIn')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
