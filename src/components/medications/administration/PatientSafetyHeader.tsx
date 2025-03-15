
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from '@/components/ui/card';
import { AlertTriangle, User, IdCard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PatientData {
  id: string;
  name: string;
  allergies: string[];
  roomNumber: string;
  mrn: string;
}

interface PatientSafetyHeaderProps {
  patient: PatientData;
  className?: string;
}

const PatientSafetyHeader = ({ patient, className }: PatientSafetyHeaderProps) => {
  const { t } = useTranslation();
  
  return (
    <Card className={cn("p-4", className)}>
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <User className="h-5 w-5 text-blue-700" />
          </div>
          <div>
            <div className="font-medium">{patient.name}</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <IdCard className="h-3 w-3 mr-1" />
              {t('mrn')}: {patient.mrn} • {t('room')}: {patient.roomNumber}
            </div>
          </div>
        </div>
        
        {patient.allergies.length > 0 && (
          <div className="mt-2 md:mt-0">
            <div className="bg-red-50 border border-red-200 rounded-md p-2">
              <div className="flex items-center text-sm font-medium text-red-800">
                <AlertTriangle className="h-4 w-4 mr-1 text-red-600" />
                {t('allergies')}:
              </div>
              <div className="mt-1 text-sm text-red-700">
                {patient.allergies.join(', ')}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PatientSafetyHeader;
