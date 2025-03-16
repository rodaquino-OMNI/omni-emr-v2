
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  status: string;
  prescribedBy: string;
}

interface MedicationCardProps {
  medication: Medication;
  className?: string;
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'discontinued':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    case 'scheduled':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400';
  }
};

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const MedicationCard: React.FC<MedicationCardProps> = ({ medication, className }) => {
  return (
    <Link 
      to={`/medications/${medication.id}`} 
      className={cn(
        "block p-4 rounded-lg border border-border hover:border-primary/20 transition-colors hover:bg-accent/30",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{medication.name}</h3>
            <Badge 
              variant="secondary"
              className={cn("font-normal", getStatusStyles(medication.status))}
            >
              {medication.status === 'active' ? 'Active' : 
               medication.status === 'discontinued' ? 'Discontinued' : 
               medication.status === 'scheduled' ? 'Scheduled' : medication.status}
            </Badge>
          </div>
          
          <div className="text-sm text-muted-foreground mt-1">
            {medication.dosage}, {medication.frequency}
          </div>
          
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {formatDate(medication.startDate)}
                {medication.endDate && ` - ${formatDate(medication.endDate)}`}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              <span>{medication.prescribedBy}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MedicationCard;
