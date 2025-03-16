
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Patient } from '@/types/patientTypes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  ChevronLeft, 
  UserPlus, 
  UserMinus, 
  Calendar, 
  HeartPulse,
  AlertCircle,
  ClipboardList,
  Phone
} from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { useTranslation } from '@/hooks/useTranslation';
import { calculatePatientAge } from '@/utils/patientUtils';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';

type PatientDetailHeaderProps = {
  patient: Patient;
  hasCriticalInsights?: boolean;
  onAssignmentToggle?: () => void;
};

const PatientDetailHeader: React.FC<PatientDetailHeaderProps> = ({ 
  patient, 
  hasCriticalInsights = false,
  onAssignmentToggle
}) => {
  const navigate = useNavigate();
  const { language } = useTranslation();
  
  // Format date to display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className={cn(
      "glass-card p-6",
      patient.status === 'critical' && "border-l-4 border-red-500"
    )}>
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-start">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/patients')}
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors -ml-2"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            {language === 'pt' ? 'Voltar para pacientes' : 'Back to patients'}
          </Button>
          
          <div className="flex items-center gap-2">
            {hasCriticalInsights && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="destructive" className="flex items-center gap-1 animate-pulse">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {language === 'pt' ? 'Alerta crítico' : 'Critical alert'}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{language === 'pt' ? 'Este paciente tem alertas críticos' : 'This patient has critical alerts'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            <StatusBadge status={patient.status} size="lg" />
            
            {onAssignmentToggle && (
              <Button
                onClick={onAssignmentToggle}
                variant={patient.is_assigned ? "destructive" : "default"}
                className="ml-2"
                size="sm"
              >
                {patient.is_assigned ? (
                  <>
                    <UserMinus className="h-4 w-4 mr-2" />
                    {language === 'pt' ? 'Desatribuir' : 'Unassign'}
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    {language === 'pt' ? 'Atribuir a mim' : 'Assign to me'}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center gap-4 mt-2">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              {patient.first_name} {patient.last_name}
              {patient.status === 'critical' && (
                <span className="inline-block ml-2">
                  <HeartPulse className="h-5 w-5 text-red-500 inline" />
                </span>
              )}
            </h1>
            
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(patient.date_of_birth)}</span>
                <span className="ml-1">
                  ({calculatePatientAge(patient.date_of_birth)} {language === 'pt' ? 'anos' : 'yrs'})
                </span>
              </div>
              
              {patient.gender && (
                <div>
                  {patient.gender === 'male' 
                    ? (language === 'pt' ? 'Masculino' : 'Male') 
                    : (language === 'pt' ? 'Feminino' : 'Female')}
                </div>
              )}
              
              {patient.room_number && (
                <div>
                  {language === 'pt' ? 'Quarto' : 'Room'}: {patient.room_number}
                </div>
              )}
              
              <div>
                MRN: {patient.mrn}
              </div>
            </div>
            
            {patient.emergency_contact_name && patient.emergency_contact_phone && (
              <div className="mt-3 flex items-center gap-1 text-sm">
                <Badge variant="outline" className="gap-1">
                  <Phone className="h-3 w-3" />
                  {language === 'pt' ? 'Contato de emergência' : 'Emergency contact'}:
                  {patient.emergency_contact_name} ({patient.emergency_contact_phone})
                </Badge>
              </div>
            )}
          </div>
          
          {patient.status === 'critical' && (
            <div className="bg-red-50 dark:bg-red-950/30 p-3 rounded-md border border-red-200 dark:border-red-900">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-300 font-medium">
                <AlertTriangle className="h-5 w-5" />
                <span>{language === 'pt' ? 'Atenção necessária' : 'Attention required'}</span>
              </div>
              <div className="text-sm mt-1 text-red-700 dark:text-red-400">
                {language === 'pt' 
                  ? 'Este paciente requer atenção médica imediata' 
                  : 'This patient requires immediate medical attention'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Import cn utility
import { cn } from '@/lib/utils';

export default PatientDetailHeader;
