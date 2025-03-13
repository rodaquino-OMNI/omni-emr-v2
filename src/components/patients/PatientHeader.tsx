
import React from 'react';
import { Link } from 'react-router-dom';
import { Patient } from './PatientCard';
import StatusBadge from '../ui/StatusBadge';
import { AlertCircle, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIInsight } from '../ai/AIInsights';

type PatientHeaderProps = {
  patient: Patient;
  hasCriticalInsights: boolean;
};

const PatientHeader = ({ patient, hasCriticalInsights }: PatientHeaderProps) => {
  return (
    <div className="glass-card p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
        <div className="h-20 w-20 rounded-full bg-medical-blue-light flex items-center justify-center text-medical-blue text-2xl font-semibold">
          {patient.name.charAt(0)}
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <h1 className="text-2xl font-semibold">{patient.name}</h1>
            <StatusBadge status={patient.status} size="lg" />
            
            {hasCriticalInsights && (
              <div className="flex items-center gap-1 text-red-500 animate-pulse-subtle">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Critical alerts</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-muted-foreground">
            <div>{patient.age} years, {patient.gender}</div>
            {patient.roomNumber && <div>Room: {patient.roomNumber}</div>}
            <div>Diagnosis: {patient.diagnosis}</div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          <Link to={`/prescribe/${patient.id}`}>
            <Button size="sm" className="flex items-center gap-1">
              <ClipboardList className="h-4 w-4" />
              Prescribe
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PatientHeader;
