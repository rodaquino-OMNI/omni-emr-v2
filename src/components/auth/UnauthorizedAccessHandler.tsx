
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';

interface UnauthorizedAccessHandlerProps {
  message?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  showLogin?: boolean;
}

/**
 * Component that handles unauthorized access scenarios with appropriate messages and actions
 */
const UnauthorizedAccessHandler: React.FC<UnauthorizedAccessHandlerProps> = ({
  message,
  showBackButton = true,
  showHomeButton = true,
  showLogin = false
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  
  // Extract information from location state if available
  const state = location.state as any;
  const reason = state?.reason || 'forbidden';
  const requiredPermission = state?.requiredPermission;
  const requiredRoles = state?.requiredRoles;
  
  // Determine appropriate message based on reason and provided message
  const getDisplayMessage = () => {
    if (message) return message;
    
    switch (reason) {
      case 'forbidden_role':
        return requiredRoles 
          ? t('unauthorizedRoleMessage', `You need one of these roles: ${requiredRoles}`)
          : t('unauthorizedRoleGeneric', 'You don\'t have the necessary role to access this resource');
      
      case 'forbidden_permission':
        return requiredPermission
          ? t('unauthorizedPermissionMessage', `You need the "${requiredPermission}" permission to access this resource`)
          : t('unauthorizedPermissionGeneric', 'You don\'t have the necessary permissions to access this resource');
        
      case 'forbidden_patient':
        return t('unauthorizedPatientMessage', 'You don\'t have permission to access this patient\'s data');
        
      case 'needs_sector':
        return t('needsSectorMessage', 'Please select a sector to access this resource');
        
      default:
        return t('unauthorizedDefaultMessage', 'You don\'t have permission to access this resource');
    }
  };
  
  const displayMessage = getDisplayMessage();
  
  return (
    <div className="container flex items-center justify-center min-h-[80vh] p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto bg-destructive/10 p-3 rounded-full mb-4">
            <ShieldAlert className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle>{t('unauthorized', 'Access Denied')}</CardTitle>
          <CardDescription>
            {displayMessage}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isAuthenticated && (
            <p className="text-sm text-muted-foreground text-center">
              {t('unauthorizedLoginSuggestion', 'Please login with an account that has the required permissions.')}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          {showBackButton && (
            <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t('back', 'Back')}
            </Button>
          )}
          
          {showHomeButton && (
            <Button onClick={() => navigate('/')} className="gap-2">
              <Home className="h-4 w-4" />
              {t('home', 'Home')}
            </Button>
          )}
          
          {showLogin && !isAuthenticated && (
            <Button onClick={() => navigate('/login')} variant="default">
              {t('login', 'Login')}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default UnauthorizedAccessHandler;
