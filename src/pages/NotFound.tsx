
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto flex max-w-md flex-col items-center justify-center space-y-6 text-center">
        <div className="rounded-full bg-primary/10 p-6">
          <FileQuestion className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tighter">404</h1>
        <p className="text-xl font-semibold">{t('pageNotFound')}</p>
        <p className="text-muted-foreground">
          {t('pageNotFoundMessage', 'The page you are looking for doesn\'t exist or has been moved.')}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            {t('back')}
          </Button>
          <Button 
            className="gap-2"
            onClick={() => navigate('/')}
          >
            <Home className="h-4 w-4" />
            {t('home', 'Home')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
