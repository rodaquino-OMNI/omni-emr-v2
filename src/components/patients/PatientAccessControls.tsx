
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Shield, UserPlus, UserMinus, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface PatientAccessControlsProps {
  patientId: string;
  hasAccess: boolean;
  isBreakGlass?: boolean;
  canManageAccess?: boolean;
}

const PatientAccessControls: React.FC<PatientAccessControlsProps> = ({
  patientId,
  hasAccess,
  isBreakGlass = false,
  canManageAccess = false
}) => {
  const { language } = useTranslation();
  const { user } = useAuth();
  const [accessStatus, setAccessStatus] = useState(hasAccess);
  const [breakGlassStatus, setBreakGlassStatus] = useState(isBreakGlass);
  const [loading, setLoading] = useState(false);

  const handleToggleAccess = async () => {
    setLoading(true);
    try {
      // This would be an API call in a real application
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAccessStatus(!accessStatus);
      
      if (accessStatus) {
        toast.info(language === 'pt' ? 'Acesso removido' : 'Access removed');
      } else {
        toast.success(language === 'pt' ? 'Acesso concedido' : 'Access granted');
      }
    } catch (error) {
      toast.error(language === 'pt' ? 'Erro ao alterar acesso' : 'Error changing access');
      console.error('Error toggling access:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBreakGlassAccess = async () => {
    setLoading(true);
    try {
      // This would be an API call in a real application
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBreakGlassStatus(true);
      setAccessStatus(true);
      
      toast.success(language === 'pt' ? 'Acesso de emergência concedido' : 'Emergency access granted');
    } catch (error) {
      toast.error(language === 'pt' ? 'Erro ao conceder acesso de emergência' : 'Error granting emergency access');
      console.error('Error with break glass access:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeBreakGlass = async () => {
    setLoading(true);
    try {
      // This would be an API call in a real application
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBreakGlassStatus(false);
      
      toast.info(language === 'pt' ? 'Acesso de emergência revogado' : 'Emergency access revoked');
    } catch (error) {
      toast.error(language === 'pt' ? 'Erro ao revogar acesso de emergência' : 'Error revoking emergency access');
      console.error('Error revoking break glass access:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          {language === 'pt' ? 'Controles de Acesso' : 'Access Controls'}
        </CardTitle>
        <CardDescription>
          {language === 'pt' 
            ? 'Gerencie o acesso a este registro do paciente' 
            : 'Manage access to this patient record'}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">
                {language === 'pt' ? 'Status de Acesso' : 'Access Status'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === 'pt' 
                  ? 'Seu acesso atual a este registro' 
                  : 'Your current access to this record'}
              </p>
            </div>
            
            <Badge 
              variant={accessStatus ? "outline" : "destructive"} 
              className={accessStatus 
                ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400"
                : ""}
            >
              {accessStatus 
                ? (language === 'pt' ? 'Acesso Concedido' : 'Access Granted') 
                : (language === 'pt' ? 'Sem Acesso' : 'No Access')}
            </Badge>
          </div>
          
          {breakGlassStatus && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md dark:bg-amber-950/20 dark:border-amber-800/30">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <div className="text-sm text-amber-800 dark:text-amber-300">
                {language === 'pt' 
                  ? 'Acesso de emergência ativo. Isso será registrado para fins de auditoria.' 
                  : 'Emergency access active. This will be logged for audit purposes.'}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex flex-wrap gap-2">
        {canManageAccess && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleAccess}
            disabled={loading}
            className="flex items-center gap-1"
          >
            {accessStatus 
              ? <><UserMinus className="h-4 w-4" /> {language === 'pt' ? 'Remover Acesso' : 'Remove Access'}</>
              : <><UserPlus className="h-4 w-4" /> {language === 'pt' ? 'Conceder Acesso' : 'Grant Access'}</>}
          </Button>
        )}
        
        {!accessStatus && (
          <Button
            variant="secondary" 
            size="sm"
            onClick={handleBreakGlassAccess}
            disabled={loading}
            className="flex items-center gap-1"
          >
            <Eye className="h-4 w-4" />
            {language === 'pt' ? 'Acesso de Emergência' : 'Emergency Access'}
          </Button>
        )}
        
        {breakGlassStatus && (
          <Button
            variant="outline" 
            size="sm"
            onClick={handleRevokeBreakGlass}
            disabled={loading}
            className="flex items-center gap-1 border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400"
          >
            <EyeOff className="h-4 w-4" />
            {language === 'pt' ? 'Revogar Acesso de Emergência' : 'Revoke Emergency Access'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PatientAccessControls;
