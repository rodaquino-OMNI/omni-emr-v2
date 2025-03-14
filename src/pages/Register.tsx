
import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { Globe, UserPlus, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { checkPasswordStrength, checkPasswordLeak } from '@/utils/auth/securityUtils';
import { Progress } from '@/components/ui/progress';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor' | 'nurse' | 'caregiver'>('patient');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '' });
  const [isPasswordLeaked, setIsPasswordLeaked] = useState(false);
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);
  
  const { user, signUp, isAuthenticated, language, setLanguage } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Check password strength and leaked status when password changes
  useEffect(() => {
    if (password.length >= 8) {
      const strength = checkPasswordStrength(password);
      setPasswordStrength(strength);
      
      // Debounce the password leak check to avoid too many API calls
      const checkLeakTimer = setTimeout(async () => {
        setIsCheckingPassword(true);
        try {
          const isLeaked = await checkPasswordLeak(password);
          setIsPasswordLeaked(isLeaked);
        } finally {
          setIsCheckingPassword(false);
        }
      }, 800);
      
      return () => clearTimeout(checkLeakTimer);
    } else {
      setPasswordStrength({ score: 0, feedback: '' });
      setIsPasswordLeaked(false);
    }
  }, [password]);

  // Get password strength color based on score
  const getStrengthColor = () => {
    if (passwordStrength.score <= 4) return "bg-destructive";
    if (passwordStrength.score <= 6) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password before submission
    if (password.length < 8) {
      toast.error(language === 'pt' ? "Senha muito curta" : "Password too short", {
        description: language === 'pt' 
          ? "Sua senha deve ter pelo menos 8 caracteres." 
          : "Your password must be at least 8 characters long."
      });
      return;
    }
    
    if (passwordStrength.score < 4) {
      toast.error(language === 'pt' ? "Senha fraca" : "Weak password", {
        description: language === 'pt' 
          ? "Sua senha não é forte o suficiente. Use uma combinação de letras maiúsculas, minúsculas, números e símbolos." 
          : "Your password is not strong enough. Use a mix of uppercase, lowercase, numbers, and symbols."
      });
      return;
    }
    
    if (isPasswordLeaked) {
      toast.error(language === 'pt' ? "Senha comprometida" : "Compromised password", {
        description: language === 'pt' 
          ? "Esta senha foi encontrada em vazamentos de dados. Por favor escolha outra senha." 
          : "This password has been found in data breaches. Please choose a different password."
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Starting registration process...');
      console.log('Form data:', { email, name, role });
      
      const result = await signUp(email, password, name, role);
      
      console.log('Registration successful, result:', result);
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
                className={`w-full h-10 px-3 rounded-md border ${
                  isPasswordLeaked ? 'border-destructive' : 'border-border'
                } bg-background`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              
              {/* Password strength indicator */}
              {password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">
                      {language === 'pt' ? 'Força da senha' : 'Password strength'}
                    </span>
                    <span className="font-medium">
                      {passwordStrength.score > 6 
                        ? (language === 'pt' ? 'Forte' : 'Strong')
                        : passwordStrength.score > 3 
                          ? (language === 'pt' ? 'Média' : 'Medium') 
                          : (language === 'pt' ? 'Fraca' : 'Weak')}
                    </span>
                  </div>
                  <Progress value={passwordStrength.score * 10} className={`h-1.5 ${getStrengthColor()}`} />
                  
                  {passwordStrength.feedback && (
                    <p className="text-xs text-muted-foreground">{passwordStrength.feedback}</p>
                  )}
                  
                  {/* Password leak status */}
                  {password.length >= 8 && (
                    <div className={`flex items-center gap-1.5 text-xs mt-1 
                      ${isCheckingPassword 
                        ? 'text-muted-foreground' 
                        : isPasswordLeaked 
                          ? 'text-destructive' 
                          : 'text-emerald-500'}`}
                    >
                      {isCheckingPassword ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>{language === 'pt' ? 'Verificando senha...' : 'Checking password...'}</span>
                        </>
                      ) : isPasswordLeaked ? (
                        <>
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>
                            {language === 'pt' 
                              ? 'Esta senha foi encontrada em vazamentos de dados' 
                              : 'This password was found in data breaches'}
                          </span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-3.5 w-3.5" />
                          <span>
                            {language === 'pt'
                              ? 'Senha não encontrada em vazamentos conhecidos'
                              : 'Password not found in known breaches'}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
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
              disabled={isSubmitting || isCheckingPassword || isPasswordLeaked || password.length < 8 || passwordStrength.score < 4}
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
