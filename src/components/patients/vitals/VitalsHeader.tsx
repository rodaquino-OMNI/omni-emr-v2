
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { FileText, Printer, PlusCircle } from 'lucide-react';

interface VitalsHeaderProps {
  patientName: string;
  canManageVitals: boolean;
  onRecordVitals: () => void;
}

const VitalsHeader: React.FC<VitalsHeaderProps> = ({
  patientName,
  canManageVitals,
  onRecordVitals
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold">{patientName}</h2>
      
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="gap-1.5">
          <FileText className="h-4 w-4" />
          {t('viewHistory')}
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Printer className="h-4 w-4" />
          {t('print')}
        </Button>
        {canManageVitals && (
          <Button size="sm" className="gap-1.5" onClick={onRecordVitals}>
            <PlusCircle className="h-4 w-4" />
            {t('recordVitals')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default VitalsHeader;
