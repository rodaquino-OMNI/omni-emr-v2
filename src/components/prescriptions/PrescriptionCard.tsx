
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Prescription } from '@/services/prescriptionService';
import { ClipboardList, Calendar, ChevronRight } from 'lucide-react';

type PrescriptionCardProps = {
  prescription: Prescription;
  className?: string;
};

const PrescriptionCard = ({ prescription, className }: PrescriptionCardProps) => {
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get status style
  const getStatusStyle = (status: Prescription['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link to={`/prescriptions/${prescription.id}`}>
      <div className={cn("glass-card p-4 cursor-pointer hover:shadow-md transition-shadow", className)}>
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-medical-purple/10 flex items-center justify-center">
            <ClipboardList className="h-5 w-5 text-medical-purple" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-medium truncate">
                Prescription for {prescription.patientName}
              </h3>
              <span className={cn("text-xs px-2 py-1 rounded-full capitalize", getStatusStyle(prescription.status))}>
                {prescription.status}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(prescription.date)}</span>
              </div>
              <div>
                By: {prescription.doctorName}
              </div>
            </div>
          </div>
          
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
        
        {prescription.items.length > 0 && (
          <div className="mt-3 border-t pt-2">
            <p className="text-xs text-muted-foreground">
              {prescription.items.length} item{prescription.items.length !== 1 ? 's' : ''}: 
              {prescription.items.map(item => item.name).join(', ')}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
};

export default PrescriptionCard;
