
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { Globe, UserPlus } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor' | 'nurse' | 'caregiver'>('patient');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, signUp, isAuthenticated, language, setLanguage } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await signUp(email, password, name, role);
      toast({
        title: "Account created",
        description: "Your account has been created successfully. Please check your email for verification.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
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
          <p className="text-muted-foreground">Create a new account</p>
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
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full h-10 px-3 rounded-md border border-border bg-background"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
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
                minLength={6}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Role
              </label>
              <select
                id="role"
                className="w-full h-10 px-3 rounded-md border border-border bg-background"
                value={role}
                onChange={(e) => setRole(e.target.value as 'patient' | 'doctor' | 'nurse' | 'caregiver')}
                required
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="caregiver">Caregiver</option>
              </select>
            </div>
            
            <Button 
              type="submit" 
              className="w-full mt-6" 
              disabled={isSubmitting}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Register
            </Button>
            
            <div className="pt-4 text-center text-sm">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
