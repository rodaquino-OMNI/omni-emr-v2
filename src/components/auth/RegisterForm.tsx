import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, UserPlus, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { UserRole, Language } from '@/types/auth';
import { useAuth } from '@/context/AuthContext';

interface RegisterFormProps {
  language: Language;
  t: (key: string) => string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ language, t }) => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('patient');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [registrationComplete, setRegistrationComplete] = useState(false);
  
  // Clinical roles that require admin approval
  const clinicalRoles: UserRole[] = ['doctor', 'nurse', 'specialist', 'pharmacist', 'lab_technician', 'radiology_technician'];
  const isClinicalRole = clinicalRoles.includes(role);
  
  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!name.trim()) {
      errors.name = language === 'pt' ? 'Nome é obrigatório' : 'Name is required';
    }
    
    if (!email.trim()) {
      errors.email = language === 'pt' ? 'Email é obrigatório' : 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = language === 'pt' ? 'Email inválido' : 'Invalid email format';
    }
    
    if (!password) {
      errors.password = language === 'pt' ? 'Senha é obrigatória' : 'Password is required';
    } else if (password.length < 6) {
      errors.password = language === 'pt' 
        ? 'A senha deve ter pelo menos 6 caracteres' 
        : 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = language === 'pt' 
        ? 'As senhas não coincidem' 
        : 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await signUp(email, password, name, role);
      
      if (result.success) {
        setRegistrationComplete(true);
        
        if (isClinicalRole) {
          toast.success(
            language === 'pt' ? 'Conta criada com sucesso!' : 'Account created successfully!',
            { 
              description: language === 'pt'
                ? 'Sua conta requer aprovação administrativa. Você receberá um email quando for aprovada.'
                : 'Your account requires administrative approval. You will receive an email when approved.'
            }
          );
        } else {
          toast.success(
            language === 'pt' ? 'Conta criada com sucesso!' : 'Account created successfully!',
            { 
              description: language === 'pt'
                ? 'Por favor, verifique seu email para confirmar sua conta.'
                : 'Please check your email to confirm your account.'
            }
          );
        }
      } else if (result.error) {
        const errorMessage = result.error.message || (language === 'pt' 
          ? 'Erro ao criar conta' 
          : 'Error creating account');
        
        toast.error(language === 'pt' ? 'Erro no registro' : 'Registration error', {
          description: errorMessage
        });
      }
    } catch (error: any) {
      toast.error(language === 'pt' ? 'Erro no registro' : 'Registration error', {
        description: error.message || (language === 'pt' 
          ? 'Ocorreu um erro ao processar seu registro' 
          : 'An error occurred while processing your registration')
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (registrationComplete) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        
        <h2 className="text-2xl font-bold">
          {language === 'pt' ? 'Registro concluído!' : 'Registration complete!'}
        </h2>
        
        {isClinicalRole ? (
          <div className="space-y-4">
            <p>
              {language === 'pt' 
                ? 'Sua conta requer aprovação administrativa antes que você possa fazer login.' 
                : 'Your account requires administrative approval before you can log in.'}
            </p>
            <p>
              {language === 'pt'
                ? 'Você receberá um email quando sua conta for aprovada.'
                : 'You will receive an email when your account is approved.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p>
              {language === 'pt'
                ? 'Por favor, verifique seu email para confirmar sua conta.'
                : 'Please check your email to verify your account.'}
            </p>
            <p>
              {language === 'pt'
                ? 'Depois de verificar seu email, você poderá fazer login.'
                : 'After verifying your email, you will be able to log in.'}
            </p>
          </div>
        )}
        
        <Button onClick={() => navigate('/login')} className="mt-4">
          {language === 'pt' ? 'Ir para o login' : 'Go to login'}
        </Button>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">
          {language === 'pt' ? 'Nome completo' : 'Full name'}
        </Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (validationErrors.name) {
              setValidationErrors({...validationErrors, name: ''});
            }
          }}
          placeholder={language === 'pt' ? 'Seu nome completo' : 'Your full name'}
          disabled={isSubmitting}
          className={validationErrors.name ? 'border-destructive' : ''}
        />
        {validationErrors.name && (
          <p className="text-xs text-destructive mt-1">{validationErrors.name}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">
          {language === 'pt' ? 'Email' : 'Email'}
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (validationErrors.email) {
              setValidationErrors({...validationErrors, email: ''});
            }
          }}
          placeholder={language === 'pt' ? 'seu.email@exemplo.com' : 'your.email@example.com'}
          disabled={isSubmitting}
          className={validationErrors.email ? 'border-destructive' : ''}
        />
        {validationErrors.email && (
          <p className="text-xs text-destructive mt-1">{validationErrors.email}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">
          {language === 'pt' ? 'Senha' : 'Password'}
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (validationErrors.password) {
              setValidationErrors({...validationErrors, password: ''});
            }
          }}
          placeholder="••••••••"
          disabled={isSubmitting}
          className={validationErrors.password ? 'border-destructive' : ''}
        />
        {validationErrors.password && (
          <p className="text-xs text-destructive mt-1">{validationErrors.password}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">
          {language === 'pt' ? 'Confirmar senha' : 'Confirm password'}
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (validationErrors.confirmPassword) {
              setValidationErrors({...validationErrors, confirmPassword: ''});
            }
          }}
          placeholder="••••••••"
          disabled={isSubmitting}
          className={validationErrors.confirmPassword ? 'border-destructive' : ''}
        />
        {validationErrors.confirmPassword && (
          <p className="text-xs text-destructive mt-1">{validationErrors.confirmPassword}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">
          {language === 'pt' ? 'Tipo de usuário' : 'User type'}
        </Label>
        <Select 
          value={role} 
          onValueChange={(value) => setRole(value as UserRole)}
          disabled={isSubmitting}
        >
          <SelectTrigger>
            <SelectValue placeholder={language === 'pt' ? 'Selecione um tipo' : 'Select a type'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="patient">
              {language === 'pt' ? 'Paciente' : 'Patient'}
            </SelectItem>
            <SelectItem value="caregiver">
              {language === 'pt' ? 'Cuidador' : 'Caregiver'}
            </SelectItem>
            <SelectItem value="doctor">
              {language === 'pt' ? 'Médico' : 'Doctor'}
            </SelectItem>
            <SelectItem value="nurse">
              {language === 'pt' ? 'Enfermeiro' : 'Nurse'}
            </SelectItem>
            <SelectItem value="specialist">
              {language === 'pt' ? 'Especialista' : 'Specialist'}
            </SelectItem>
            <SelectItem value="pharmacist">
              {language === 'pt' ? 'Farmacêutico' : 'Pharmacist'}
            </SelectItem>
            <SelectItem value="administrative">
              {language === 'pt' ? 'Administrativo' : 'Administrative'}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isClinicalRole && (
        <Alert variant="default" className="bg-amber-50 border-amber-300">
          <AlertDescription>
            {language === 'pt' 
              ? 'Contas de equipe clínica requerem aprovação administrativa antes de serem ativadas.'
              : 'Clinical staff accounts require administrative approval before being activated.'}
          </AlertDescription>
        </Alert>
      )}
      
      <Button 
        type="submit" 
        className="w-full mt-6" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            {language === 'pt' ? 'Registrando...' : 'Registering...'}
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4 mr-2" />
            {language === 'pt' ? 'Criar conta' : 'Create account'}
          </>
        )}
      </Button>
      
      <div className="text-center mt-4">
        <p className="text-sm text-muted-foreground">
          {language === 'pt' ? 'Já tem uma conta?' : 'Already have an account?'}
          <Link to="/login" className="text-primary hover:underline ml-1">
            {language === 'pt' ? 'Entrar' : 'Sign in'}
          </Link>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;
