
import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { UserCircle, UserPlus, UserMinus, AlertCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface PatientCardProps {
  patient: {
    id: string;
    name: string;
    age: number;
    gender: string;
    roomNumber?: string;
    status: any;
    isAssigned?: boolean;
    isCritical?: boolean;
    mrn: string;
    onToggleAssignment?: (e: React.MouseEvent) => void;
  };
  className?: string;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, className }) => {
  const { language } = useTranslation();
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'stable':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'improving':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'active':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'discharged':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  const genderLabel = patient.gender === 'male' ? 
    (language === 'pt' ? 'Masculino' : 'Male') : 
    (language === 'pt' ? 'Feminino' : 'Female');
  
  return (
    <Card className={cn("p-4 hover:bg-accent/10 transition-colors", className)}>
      <div className="flex items-center gap-4">
        <Link 
          to={`/patients/${patient.id}`} 
          className="flex-1 flex items-center gap-4"
        >
          <Avatar className="w-10 h-10 bg-primary/10">
            <AvatarFallback>
              <UserCircle className="h-6 w-6 text-primary" />
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="font-medium text-foreground truncate">
                {patient.name}
              </div>
              
              {patient.isCritical && (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            
            <div className="text-sm text-muted-foreground flex flex-wrap gap-x-2">
              <span>{patient.age} {language === 'pt' ? 'anos' : 'yrs'}</span>
              <span>•</span>
              <span>{genderLabel}</span>
              <span>•</span>
              <span>MRN: {patient.mrn}</span>
              {patient.roomNumber && (
                <>
                  <span>•</span>
                  <span>{language === 'pt' ? 'Quarto' : 'Room'}: {patient.roomNumber}</span>
                </>
              )}
            </div>
          </div>
        </Link>
        
        <div className="flex items-center gap-2">
          <Badge 
            variant="secondary" 
            className={cn("capitalize", getStatusColor(patient.status))}
          >
            {patient.status}
          </Badge>
          
          {patient.onToggleAssignment && (
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "p-2 h-8 w-8", 
                patient.isAssigned ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"
              )}
              onClick={patient.onToggleAssignment}
              title={patient.isAssigned ? 
                (language === 'pt' ? 'Remover atribuição' : 'Unassign patient') : 
                (language === 'pt' ? 'Atribuir paciente' : 'Assign patient')
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
    </Card>
  );
};

export default PatientCard;
