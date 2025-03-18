
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        // Session should be set by now via onAuthStateChange in AuthContext
      } catch (err: any) {
        console.error('Error in auth callback:', err);
        setError(err.message || 'Authentication error');
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse">
          <h1 className="text-2xl font-semibold text-primary">OmniCare</h1>
          <p className="text-muted-foreground">Completing authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-primary mb-2">Authentication Error</h1>
          <p className="text-destructive mb-4">{error}</p>
          <a href="/login" className="text-primary hover:underline">
            Return to login
          </a>
        </div>
      </div>
    );
  }

  // Redirect to dashboard directly instead of sector selection
  return <Navigate to="/dashboard" replace />;
};

export default AuthCallback;
