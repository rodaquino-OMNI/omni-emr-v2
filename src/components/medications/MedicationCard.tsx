
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Pill, Calendar, Clock } from 'lucide-react';

export type Medication = {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  status: "active" | "discontinued" | "scheduled";
  prescribedBy: string;
};

type MedicationCardProps = {
  medication: Medication;
  className?: string;
};

const MedicationCard = ({ medication, className }: MedicationCardProps) => {
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get status style
  const getStatusStyle = (status: Medication['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'discontinued':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link to={`/medications/${medication.id}`}>
      <div className={cn("glass-card p-4 cursor-pointer hover:shadow-md transition-shadow", className)}>
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-medical-red/10 flex items-center justify-center">
            <Pill className="h-5 w-5 text-medical-red" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium truncate">{medication.name}</h3>
              <span className="text-sm text-muted-foreground">({medication.dosage})</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{medication.frequency}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(medication.startDate)}</span>
                {medication.endDate && <span>- {formatDate(medication.endDate)}</span>}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <span className={cn("text-xs px-2 py-1 rounded-full capitalize", getStatusStyle(medication.status))}>
              {medication.status}
            </span>
            <span className="text-xs text-muted-foreground mt-1">{medication.prescribedBy}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MedicationCard;
