
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { Globe, UserCheck } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, login, isAuthenticated, language, setLanguage } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      toast({
        title: "Welcome back",
        description: "You have successfully logged in.",
      });
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: error.message || t('invalidCredentials'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">{t('appName')}</h1>
          <p className="text-muted-foreground">{t('signIn')}</p>
        </div>
        
        <div className="glass-card p-8">
          <div className="flex justify-end mb-4">
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={() => {
                  const nextLang = language === 'en' ? 'pt' : language === 'pt' ? 'es' : 'en';
                  setLanguage(nextLang);
                }}
              >
                <Globe className="h-4 w-4" />
                {language === 'en' ? 'English' : language === 'pt' ? 'Português' : 'Español'}
              </Button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                {t('email')}
              </label>
              <input
                id="email"
                type="email"
                className="w-full h-10 px-3 rounded-md border border-border bg-background"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@medcare.com"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                {t('password')}
              </label>
              <input
                id="password"
                type="password"
                className="w-full h-10 px-3 rounded-md border border-border bg-background"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full mt-6" 
              disabled={isSubmitting}
            >
              <UserCheck className="mr-2 h-4 w-4" />
              {t('signIn')}
            </Button>
            
            <div className="pt-4 text-center text-sm">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Register
                </Link>
              </p>
              
              <div className="mt-4 pt-4 border-t border-border">
                <p>Demo accounts:</p>
                <p>admin@medcare.com</p>
                <p>doctor@medcare.com</p>
                <p>nurse@medcare.com</p>
                <p className="mt-1">Password: any</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
