
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { Globe, UserCheck, Github, Mail } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, login, loginWithSocial, isAuthenticated, language, setLanguage } = useAuth();
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

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'twitter') => {
    try {
      await loginWithSocial(provider);
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      toast({
        title: "Error",
        description: error.message || `Could not sign in with ${provider}`,
        variant: "destructive",
      });
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
                  // Toggle between Portuguese and English only
                  const nextLang = language === 'pt' ? 'en' : 'pt';
                  setLanguage(nextLang);
                }}
              >
                <Globe className="h-4 w-4" />
                {language === 'pt' ? 'Português' : 'English'}
              </Button>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={() => handleSocialLogin('google')}
            >
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
              </svg>
              Continue with Google
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={() => handleSocialLogin('facebook')}
            >
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="facebook" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path fill="currentColor" d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"></path>
              </svg>
              Continue with Facebook
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={() => handleSocialLogin('twitter')}
            >
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="twitter" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path fill="currentColor" d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path>
              </svg>
              Continue with X
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {language === 'pt' ? 'Ou continue com' : 'Or continue with'}
              </span>
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
                {language === 'pt' ? 'Não tem uma conta?' : "Don't have an account?"}
                <Link to="/register" className="text-primary hover:underline ml-1">
                  {language === 'pt' ? 'Registrar' : 'Register'}
                </Link>
              </p>
              
              <div className="mt-4 pt-4 border-t border-border">
                <p>{language === 'pt' ? 'Contas de demonstração:' : 'Demo accounts:'}</p>
                <p>admin@omnicare.com</p>
                <p>doctor@omnicare.com</p>
                <p>nurse@omnicare.com</p>
                <p className="mt-1">{language === 'pt' ? 'Senha: qualquer' : 'Password: any'}</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
