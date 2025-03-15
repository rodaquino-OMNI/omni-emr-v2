
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Printer, Clock, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

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
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          {patientName} 
          <span className="text-muted-foreground font-normal text-base">
            - {t('vitalSignsSummary')}
          </span>
        </h2>
        <p className="text-sm text-muted-foreground">
          {t('lastRecordedTime', { time: '2 hours ago' })}
        </p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="gap-1">
          <Clock className="h-4 w-4" />
          {t('viewHistory')}
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <Button variant="outline" size="sm" className="gap-1">
          <Printer className="h-4 w-4" />
          {t('print')}
        </Button>
        
        {canManageVitals && (
          <Button 
            size="sm" 
            className="gap-1 bg-green-600 hover:bg-green-700"
            onClick={onRecordVitals}
          >
            <PlusCircle className="h-4 w-4" />
            {t('recordVitals')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default VitalsHeader;
