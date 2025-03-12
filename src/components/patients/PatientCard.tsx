
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import StatusBadge from '../ui/StatusBadge';

export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: string;
  roomNumber?: string;
  status: "hospital" | "home" | "discharged" | "critical" | "stable" | "improving";
  diagnosis: string;
  imageUrl?: string;
};

type PatientCardProps = {
  patient: Patient;
  className?: string;
};

const PatientCard = ({ patient, className }: PatientCardProps) => {
  return (
    <Link to={`/patients/${patient.id}`}>
      <div className={cn("glass-card p-4 cursor-pointer", className)}>
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-medical-blue-light flex items-center justify-center text-medical-blue font-medium text-lg overflow-hidden">
            {patient.imageUrl ? (
              <img 
                src={patient.imageUrl} 
                alt={patient.name} 
                className="h-full w-full object-cover"
              />
            ) : (
              patient.name.charAt(0)
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{patient.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{patient.age} yrs</span>
              <span>•</span>
              <span>{patient.gender}</span>
              {patient.roomNumber && (
                <>
                  <span>•</span>
                  <span className="font-medium">Room {patient.roomNumber}</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <StatusBadge status={patient.status} />
            <span className="text-xs text-muted-foreground mt-1">{patient.diagnosis}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PatientCard;
