
import React from 'react';
import { cn } from '@/lib/utils';
import { PrescriptionItem } from '@/services/prescriptionService';
import { Pill, Stethoscope, FlaskConical, Scan, Calendar, Clock, FileText } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
        return 'bg-medical-red/10 border-medical-red/20';
      case 'procedure':
        return 'bg-medical-blue/10 border-medical-blue/20';
      case 'lab_test':
        return 'bg-medical-green/10 border-medical-green/20';
      case 'imaging':
        return 'bg-medical-purple/10 border-medical-purple/20';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };
  
  // Get status style
  const getStatusStyle = (status: PrescriptionItem['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
    <div className={cn("rounded-lg overflow-hidden border", getTypeStyle(item.type), className)}>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", getTypeStyle(item.type))}>
            {getTypeIcon(item.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-medium truncate">{item.name}</h3>
              <span className={cn("text-xs px-2 py-1 rounded-full capitalize border", getStatusStyle(item.status))}>
                {item.status}
              </span>
            </div>
            
            <div className="text-sm text-muted-foreground mt-1">
              {formatType(item.type)}
              {item.dosage && (
                <> • <span className="font-medium">{item.dosage}</span></>
              )}
            </div>
          </div>
        </div>
        
        {item.frequency && (
          <div className="flex items-center gap-2 mt-3 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{item.frequency}</span>
            {item.duration && (
              <span className="text-muted-foreground">({item.duration})</span>
            )}
          </div>
        )}
        
        {(item.startDate || item.endDate) && (
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            {item.startDate && (
              <span>Start: {new Date(item.startDate).toLocaleDateString()}</span>
            )}
            {item.startDate && item.endDate && <span>•</span>}
            {item.endDate && (
              <span>End: {new Date(item.endDate).toLocaleDateString()}</span>
            )}
          </div>
        )}
        
        {item.instructions && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center gap-2 text-sm mb-1">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Instructions</span>
            </div>
            <p className="text-sm">{item.instructions}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionItemCard;
