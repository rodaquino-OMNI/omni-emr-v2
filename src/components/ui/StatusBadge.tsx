
import React from 'react';
import { cn } from '@/lib/utils';
import { getStatusColorClass, getStatusLabel } from '@/utils/patientStatusUtils';
import { useTranslation } from '@/hooks/useTranslation';
import { PatientStatus } from '@/types/patientTypes';

interface StatusBadgeProps {
  status: PatientStatus;
  className?: string;
  size?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className, size = 'default' }) => {
  const { language } = useTranslation();
  
  const colorClass = getStatusColorClass(status);
  const label = getStatusLabel(status, language);
  
  const sizeClass = size === 'small' 
    ? 'px-1.5 py-0.5 text-xs' 
    : 'px-2 py-1 text-xs font-medium';
  
  return (
    <div className={cn("rounded-full inline-flex items-center", colorClass, sizeClass, className)}>
      {label}
    </div>
  );
};

export default StatusBadge;
