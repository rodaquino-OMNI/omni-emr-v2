
import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { Globe, UserPlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor' | 'nurse' | 'caregiver'>('patient');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, signUp, isAuthenticated, language, setLanguage } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log('Starting registration process...');
      console.log('Form data:', { email, name, role });
      
      await signUp(email, password, name, role);
      
      console.log('Registration successful');
      toast.success(language === 'pt' ? "Conta criada" : "Account created", {
        description: language === 'pt' 
          ? "Sua conta foi criada com sucesso. Por favor, verifique seu email." 
          : "Your account has been created successfully. Please check your email for verification.",
      });
      
      // Redirect to login page after successful registration
      navigate('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // More specific error messages
      let errorMessage = error.message || (language === 'pt' ? "Falha ao criar conta" : "Failed to create account");
      
      // Check for common Supabase errors
      if (error.message?.includes('User already registered')) {
        errorMessage = language === 'pt' 
          ? "Este email já está registrado. Tente fazer login." 
          : "This email is already registered. Try logging in instead.";
      }
      
      toast.error(language === 'pt' ? "Erro" : "Error", {
        description: errorMessage,
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
          <p className="text-muted-foreground">
            {language === 'pt' ? 'Criar uma nova conta' : 'Create a new account'}
          </p>
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
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                {language === 'pt' ? 'Nome Completo' : 'Full Name'}
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
                {language === 'pt' ? 'Função' : 'Role'}
              </label>
              <select
                id="role"
                className="w-full h-10 px-3 rounded-md border border-border bg-background"
                value={role}
                onChange={(e) => setRole(e.target.value as 'patient' | 'doctor' | 'nurse' | 'caregiver')}
                required
              >
                <option value="patient">{language === 'pt' ? 'Paciente' : 'Patient'}</option>
                <option value="doctor">{language === 'pt' ? 'Médico' : 'Doctor'}</option>
                <option value="nurse">{language === 'pt' ? 'Enfermeiro' : 'Nurse'}</option>
                <option value="caregiver">{language === 'pt' ? 'Cuidador' : 'Caregiver'}</option>
              </select>
            </div>
            
            <Button 
              type="submit" 
              className="w-full mt-6" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {language === 'pt' ? 'Processando...' : 'Processing...'}
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  {language === 'pt' ? 'Registrar' : 'Register'}
                </>
              )}
            </Button>
            
            <div className="pt-4 text-center text-sm">
              <p className="text-muted-foreground">
                {language === 'pt' ? 'Já tem uma conta?' : 'Already have an account?'}{" "}
                <Link to="/login" className="text-primary hover:underline">
                  {language === 'pt' ? 'Entrar' : 'Sign in'}
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
