
import React from 'react';
import { cn } from '@/lib/utils';
import { getStatusColor } from '@/utils/patientStatusUtils';
import { useTranslation } from '@/hooks/useTranslation';
import { PatientStatus } from '@/types/patientTypes';

interface StatusBadgeProps {
  status: PatientStatus;
  className?: string;
  size?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className, size = 'default' }) => {
  const { language } = useTranslation();
  
  const getStatusLabel = (status: PatientStatus, lang: string): string => {
    const labels: Record<PatientStatus, Record<string, string>> = {
      [PatientStatus.ACTIVE]: { en: 'Active', pt: 'Ativo' },
      [PatientStatus.INACTIVE]: { en: 'Inactive', pt: 'Inativo' },
      [PatientStatus.DISCHARGED]: { en: 'Discharged', pt: 'Alta' },
      [PatientStatus.CRITICAL]: { en: 'Critical', pt: 'Crítico' },
      [PatientStatus.STABLE]: { en: 'Stable', pt: 'Estável' },
      [PatientStatus.HOSPITAL]: { en: 'In Hospital', pt: 'Hospitalizado' },
      [PatientStatus.HOME]: { en: 'At Home', pt: 'Em Casa' },
      [PatientStatus.IMPROVING]: { en: 'Improving', pt: 'Melhorando' }
    };
    
    return labels[status]?.[lang === 'pt' ? 'pt' : 'en'] || status;
  };
  
  const getStatusColorClass = (status: PatientStatus): string => {
    const color = getStatusColor(status);
    
    const colorMap: Record<string, string> = {
      'green': 'bg-green-100 text-green-800',
      'red': 'bg-red-100 text-red-800',
      'gray': 'bg-gray-100 text-gray-800',
      'blue': 'bg-blue-100 text-blue-800',
      'purple': 'bg-purple-100 text-purple-800',
      'teal': 'bg-teal-100 text-teal-800'
    };
    
    return colorMap[color] || 'bg-gray-100 text-gray-800';
  };
  
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
