
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Patient } from '@/types/patientTypes';
import StatusBadge from '@/components/ui/StatusBadge';
import { AlertTriangle, User, Calendar, MapPin, UserPlus, UserMinus } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface PatientDetailHeaderProps {
  patient: Patient;
  hasCriticalInsights: boolean;
  onAssignmentToggle?: () => void;
}

const PatientDetailHeader: React.FC<PatientDetailHeaderProps> = ({
  patient,
  hasCriticalInsights,
  onAssignmentToggle
}) => {
  const { language } = useTranslation();
  
  const age = patient.age || 
    (patient.date_of_birth ? 
      Math.floor((new Date().getTime() - new Date(patient.date_of_birth).getTime()) / 31557600000) 
      : 0);
  
  return (
    <div className="glass-card p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Avatar/Profile section */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
            
            {hasCriticalInsights && (
              <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-red-500 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-2xl font-bold">
              {patient.name || `${patient.first_name} ${patient.last_name}`}
            </h2>
            
            <div className="flex flex-wrap gap-x-4 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                <span>
                  {`${age} ${language === 'pt' ? 'anos' : 'yrs'}`}
                  {patient.gender && `, ${patient.gender}`}
                </span>
              </div>
              
              {patient.date_of_birth && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {new Date(patient.date_of_birth).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              {patient.room_number && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>
                    {language === 'pt' ? 'Quarto ' : 'Room '}{patient.room_number}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Status and actions */}
        <div className="flex flex-wrap items-center gap-3 ml-auto mt-2 md:mt-0">
          <StatusBadge status={patient.status} />
          
          {onAssignmentToggle && (
            <Button
              variant={patient.is_assigned ? "outline" : "default"}
              size="sm"
              className="flex items-center gap-1"
              onClick={onAssignmentToggle}
            >
              {patient.is_assigned ? (
                <>
                  <UserMinus className="h-4 w-4" />
                  <span>{language === 'pt' ? 'Desatribuir' : 'Unassign'}</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>{language === 'pt' ? 'Atribuir a mim' : 'Assign to me'}</span>
                </>
              )}
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm"
            asChild
          >
            <Link to={`/patients/${patient.id}/profile`}>
              {language === 'pt' ? 'Editar perfil' : 'Edit profile'}
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            asChild
          >
            <Link to={`/patients/${patient.id}/medical-history`}>
              {language === 'pt' ? 'Histórico médico' : 'Medical history'}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailHeader;
