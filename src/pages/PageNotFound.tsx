import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Home, AlertTriangle } from 'lucide-react';

const PageNotFound = () => {
  const { language } = useTranslation();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="mb-6 flex justify-center">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <h2 className="text-2xl font-semibold mb-4">
          {language === 'pt' ? 'Página não encontrada' : 'Page Not Found'}
        </h2>
        
        <p className="text-muted-foreground mb-8">
          {language === 'pt' 
            ? 'A página que você está procurando não existe ou foi movida.'
            : 'The page you are looking for doesn\'t exist or has been moved.'}
        </p>
        
        <Button asChild>
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            {language === 'pt' ? 'Voltar para o início' : 'Back to Home'}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default PageNotFound;