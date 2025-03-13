
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Only auto-redirect authenticated users to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [navigate, isAuthenticated]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Welcome to OmniCare</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Comprehensive healthcare management platform for medical professionals
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <Button size="lg" onClick={() => navigate('/dashboard')}>
              Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <>
              <Button size="lg" onClick={() => navigate('/login')}>
                Sign In <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/register')}>
                Create Account
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
