
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Medication } from '../MedicationCard';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MedicationHeaderProps {
  medication: Medication;
  getStatusStyle: (status: string) => string;
}

const MedicationHeader: React.FC<MedicationHeaderProps> = ({ 
  medication, 
  getStatusStyle 
}) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold">{medication.name}</h1>
          <div className="flex items-center gap-2 mt-1 text-muted-foreground">
            <span>{medication.dosage}</span>
            <span>•</span>
            <span>{medication.frequency}</span>
          </div>
        </div>
        
        <Badge 
          className={cn(
            "px-3 py-1.5 text-sm",
            getStatusStyle(medication.status)
          )}
        >
          {medication.status === 'active' ? 'Active' : 
           medication.status === 'discontinued' ? 'Discontinued' : 
           medication.status === 'scheduled' ? 'Scheduled' : medication.status}
        </Badge>
      </div>
      
      <div className="mt-6 flex flex-col sm:flex-row justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Prescribed by:</span> {medication.prescribedBy}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="font-medium text-foreground">Patient:</span>{' '}
            <Link to={`/patients/${medication.patientId}`} className="text-primary hover:underline">
              View Patient
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MedicationHeader;
