
import React from 'react';
import { CriticalResult } from './CriticalResultAlert';
import { useTranslation } from '@/hooks/useTranslation';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertTriangle, CheckCircle2, User } from 'lucide-react';

interface CriticalResultDetailProps {
  result: CriticalResult;
  onClose: () => void;
  onAcknowledge: () => void;
}

export function CriticalResultDetail({ 
  result, 
  onClose, 
  onAcknowledge 
}: CriticalResultDetailProps) {
  const { t } = useTranslation();
  
  const formatDate = (date: Date | string) => {
    if (!date) return '';
    return format(new Date(date), 'PPpp');
  };
  
  const getStatusIndicator = () => {
    if (result.acknowledged) {
      return (
        <div className="flex items-center text-green-600 mb-4">
          <CheckCircle2 className="mr-2 h-5 w-5" />
          <span>
            {t('acknowledgedBy')} {result.acknowledgedBy} {t('on')} {formatDate(result.acknowledgedAt as string)}
          </span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center text-amber-600 mb-4">
        <AlertTriangle className="mr-2 h-5 w-5" />
        <span>{t('pendingAcknowledgment')}</span>
      </div>
    );
  };
  
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-lg">{t('criticalResultDetails')}</DialogTitle>
      </DialogHeader>
      
      {getStatusIndicator()}
      
      <div className="grid grid-cols-2 gap-4 py-2">
        <div>
          <p className="text-sm text-muted-foreground">{t('patient')}</p>
          <p className="font-medium">{result.patientName}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">{t('resultType')}</p>
          <p className="font-medium">
            {result.resultType === 'lab' ? t('laboratoryResult') :
             result.resultType === 'imaging' ? t('imagingResult') : t('vitalSign')}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">{t('resultName')}</p>
          <p className="font-medium">{result.resultName}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">{t('reportedAt')}</p>
          <p className="font-medium">{formatDate(result.timestamp)}</p>
        </div>
        
        <div className="col-span-2">
          <p className="text-sm text-muted-foreground">{t('value')}</p>
          <p className="font-bold text-lg">
            {result.resultValue}
            {result.normalRange && (
              <span className="text-sm font-normal ml-2 text-muted-foreground">
                ({t('normalRange')}: {result.normalRange})
              </span>
            )}
          </p>
        </div>
      </div>

      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={onClose}>
          {t('close')}
        </Button>
        
        {!result.acknowledged && (
          <Button onClick={onAcknowledge}>
            {t('acknowledge')}
          </Button>
        )}
      </DialogFooter>
    </>
  );
}
