
import React from 'react';
import { cn } from '@/lib/utils';
import { PrescriptionItem } from '@/services/prescriptionService';
import { Pill, Stethoscope, FlaskConical, Scan } from 'lucide-react';

type PrescriptionItemCardProps = {
  item: PrescriptionItem;
  className?: string;
};

const PrescriptionItemCard = ({ item, className }: PrescriptionItemCardProps) => {
  // Get icon based on prescription type
  const getTypeIcon = (type: PrescriptionItem['type']) => {
    switch (type) {
      case 'medication':
        return <Pill className="h-5 w-5 text-medical-red" />;
      case 'procedure':
        return <Stethoscope className="h-5 w-5 text-medical-blue" />;
      case 'lab_test':
        return <FlaskConical className="h-5 w-5 text-medical-green" />;
      case 'imaging':
        return <Scan className="h-5 w-5 text-medical-purple" />;
      default:
        return <Pill className="h-5 w-5 text-medical-red" />;
    }
  };
  
  // Get background color based on type
  const getTypeStyle = (type: PrescriptionItem['type']) => {
    switch (type) {
      case 'medication':
        return 'bg-medical-red/10';
      case 'procedure':
        return 'bg-medical-blue/10';
      case 'lab_test':
        return 'bg-medical-green/10';
      case 'imaging':
        return 'bg-medical-purple/10';
      default:
        return 'bg-gray-100';
    }
  };
  
  // Get status style
  const getStatusStyle = (status: PrescriptionItem['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Format type for display
  const formatType = (type: PrescriptionItem['type']) => {
    switch (type) {
      case 'medication':
        return 'Medication';
      case 'procedure':
        return 'Procedure';
      case 'lab_test':
        return 'Lab Test';
      case 'imaging':
        return 'Imaging';
      default:
        return type;
    }
  };

  return (
    <div className={cn("glass-card p-4", className)}>
      <div className="flex items-center gap-4">
        <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", getTypeStyle(item.type))}>
          {getTypeIcon(item.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium truncate">{item.name}</h3>
            <span className={cn("text-xs px-2 py-1 rounded-full capitalize", getStatusStyle(item.status))}>
              {item.status}
            </span>
          </div>
          
          <div className="text-sm text-muted-foreground mt-1">
            <span className="font-medium capitalize">{formatType(item.type)}</span>
            {item.dosage && (
              <> • <span>{item.dosage}</span></>
            )}
            {item.frequency && (
              <> • <span>{item.frequency}</span></>
            )}
          </div>
          
          {item.instructions && (
            <div className="mt-2 text-sm">
              <strong>Instructions:</strong> {item.instructions}
            </div>
          )}
          
          {(item.startDate || item.endDate) && (
            <div className="mt-1 text-xs text-muted-foreground">
              {item.startDate && (
                <span>Start: {new Date(item.startDate).toLocaleDateString()}</span>
              )}
              {item.startDate && item.endDate && <span> • </span>}
              {item.endDate && (
                <span>End: {new Date(item.endDate).toLocaleDateString()}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionItemCard;
