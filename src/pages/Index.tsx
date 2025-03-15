
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Languages } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import TranslatedText from '@/components/common/TranslatedText';
import { Link } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const isAuthenticated = auth?.isAuthenticated || false;
  const { t, language } = useTranslation();
  
  useEffect(() => {
    // Only auto-redirect authenticated users to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [navigate, isAuthenticated]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">
          {t('appName')}
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          {t('appDescription')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <Button size="lg" onClick={() => navigate('/dashboard')}>
              {t('goToDashboard')} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <>
              <Button size="lg" onClick={() => navigate('/login')}>
                {language === 'pt' ? 'Entre na sua conta' : 'Sign in'} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/register')}>
                {t('createAccount')}
              </Button>
            </>
          )}
        </div>
        
        <div className="mt-12">
          <Button variant="link" asChild className="gap-2">
            <Link to="/translation-diagnostics">
              <Languages className="h-4 w-4" />
              {language === 'pt' ? 'Diagnóstico de Traduções' : 'Translation Diagnostics'}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
