
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, AlertTriangle, User, UserPlus, UserMinus, Clock, CircleX, HeartPulse } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { useTranslation } from '@/hooks/useTranslation';
import TranslatedText from '@/components/common/TranslatedText';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Export the Patient type so it can be imported in other files
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  roomNumber?: string | null;
  status: "hospital" | "home" | "discharged" | "critical" | "stable" | "improving";
  isAssigned: boolean;
  isCritical?: boolean;
  mrn: string;
  diagnosis?: string;
  lastUpdated?: string;
  alerts?: Array<{
    type: 'critical' | 'warning' | 'info';
    message: string;
  }>;
  onToggleAssignment?: (e: React.MouseEvent) => void;
}

export type PatientCardProps = {
  patient: Patient;
  className?: string;
};

const PatientCard = ({ patient, className }: PatientCardProps) => {
  const { language } = useTranslation();
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Get critical status indicator
  const getCriticalIndicator = () => {
    if (patient.status === 'critical' || patient.isCritical) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-md animate-pulse">
                <AlertCircle className="h-3 w-3" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{language === 'pt' ? 'Paciente em estado crítico' : 'Patient in critical condition'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return null;
  };

  // Get alert badges
  const getAlertBadges = () => {
    if (!patient.alerts || patient.alerts.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {patient.alerts.map((alert, index) => {
          const icon = alert.type === 'critical' ? 
            <HeartPulse className="h-3 w-3 mr-1" /> : 
            alert.type === 'warning' ? 
              <AlertTriangle className="h-3 w-3 mr-1" /> : 
              <CircleX className="h-3 w-3 mr-1" />;
              
          const bgColor = alert.type === 'critical' ? 
            'bg-red-100 text-red-800 border-red-200' : 
            alert.type === 'warning' ? 
              'bg-amber-100 text-amber-800 border-amber-200' : 
              'bg-blue-100 text-blue-800 border-blue-200';
              
          return (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className={cn("text-xs", bgColor)}>
                    {icon}
                    {alert.type}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{alert.message}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    );
  };

  return (
    <Link 
      to={`/patients/${patient.id}`} 
      className={cn(
        "block py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-md px-2 -mx-2",
        patient.status === 'critical' && "border-l-4 border-red-500 pl-1",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar>
            <AvatarImage src={undefined} alt={patient.name} />
            <AvatarFallback>{getInitials(patient.name)}</AvatarFallback>
          </Avatar>
          
          {getCriticalIndicator()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="font-medium text-foreground flex items-center gap-2">
            {patient.name}
            {patient.isAssigned && (
              <Badge variant="outline" className="ml-2 bg-primary/10">
                <User className="h-3 w-3 mr-1" />
                <TranslatedText
                  textKey="assigned"
                  fallback={language === 'pt' ? 'Atribuído' : 'Assigned'}
                />
              </Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground flex flex-wrap gap-2">
            <span>
              {patient.age} {language === 'pt' ? 'anos' : 'yrs'}
              {patient.gender && `, ${patient.gender === 'male' ? (language === 'pt' ? 'Masculino' : 'Male') : 
                patient.gender === 'female' ? (language === 'pt' ? 'Feminino' : 'Female') : 
                language === 'pt' ? 'Outro' : 'Other'}`}
            </span>
            {patient.roomNumber && (
              <span>• {language === 'pt' ? 'Quarto' : 'Room'} {patient.roomNumber}</span>
            )}
            <span>• MRN: {patient.mrn}</span>
            {patient.lastUpdated && (
              <span className="flex items-center text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {patient.lastUpdated}
              </span>
            )}
          </div>
          
          {getAlertBadges()}
          
          {patient.diagnosis && (
            <div className="mt-1 text-xs text-muted-foreground italic truncate">
              {patient.diagnosis}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <StatusBadge status={patient.status} />
          
          {patient.onToggleAssignment && (
            <Button
              size="icon"
              variant={patient.isAssigned ? "destructive" : "default"}
              className="h-8 w-8"
              onClick={patient.onToggleAssignment}
              title={patient.isAssigned ? 
                (language === 'pt' ? 'Remover atribuição' : 'Unassign') : 
                (language === 'pt' ? 'Atribuir a mim' : 'Assign to me')
              }
            >
              {patient.isAssigned ? (
                <UserMinus className="h-4 w-4" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PatientCard;
