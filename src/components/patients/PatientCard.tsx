
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, User, UserPlus, UserMinus } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { useTranslation } from '@/hooks/useTranslation';
import TranslatedText from '@/components/common/TranslatedText';

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

  return (
    <Link 
      to={`/patients/${patient.id}`} 
      className={cn("block py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-md px-2 -mx-2", className)}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar>
            <AvatarImage src={undefined} alt={patient.name} />
            <AvatarFallback>{getInitials(patient.name)}</AvatarFallback>
          </Avatar>
          
          {patient.isCritical && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1">
              <AlertTriangle className="h-3 w-3" />
            </div>
          )}
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
          </div>
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
