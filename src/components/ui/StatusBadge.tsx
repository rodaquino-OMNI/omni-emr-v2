
import React from 'react';
import { cn } from '@/lib/utils';
import { getStatusColorClass, getStatusLabel } from '@/utils/patientStatusUtils';
import { useTranslation } from '@/hooks/useTranslation';
import { PatientStatus } from '@/types/patientTypes';

interface StatusBadgeProps {
  status: PatientStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const { language } = useTranslation();
  
  const colorClass = getStatusColorClass(status);
  const label = getStatusLabel(status, language);
  
  return (
    <div className={cn("px-2 py-1 rounded-full text-xs font-medium inline-flex items-center", colorClass, className)}>
      {label}
    </div>
  );
};

export default StatusBadge;
