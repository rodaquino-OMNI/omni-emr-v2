
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Bell, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

export interface CriticalResult {
  id: string;
  patientId: string;
  patientName: string;
  resultType: 'lab' | 'imaging' | 'vital';
  resultName: string;
  resultValue: string;
  normalRange?: string;
  timestamp: Date | string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date | string;
  severity: 'critical' | 'urgent' | 'abnormal';
}

interface CriticalResultAlertProps {
  result: CriticalResult;
  onAcknowledge: (resultId: string) => void;
  onView: (resultId: string) => void;
}

export function CriticalResultAlert({ 
  result, 
  onAcknowledge, 
  onView 
}: CriticalResultAlertProps) {
  const { t } = useTranslation();
  
  const getSeverityStyles = () => {
    switch (result.severity) {
      case 'critical':
        return 'border-red-700 bg-red-50 text-red-800';
      case 'urgent':
        return 'border-amber-700 bg-amber-50 text-amber-800';
      case 'abnormal':
        return 'border-yellow-700 bg-yellow-50 text-yellow-800';
      default:
        return '';
    }
  };
  
  const getSeverityIcon = () => {
    switch (result.severity) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'urgent':
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case 'abnormal':
        return <Bell className="h-5 w-5 text-yellow-600" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };
  
  return (
    <Alert className={`border-l-4 ${getSeverityStyles()} mb-4`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          {getSeverityIcon()}
          <div className="ml-2">
            <AlertTitle className="text-base font-semibold">
              {result.severity === 'critical' ? t('criticalResult') :
                result.severity === 'urgent' ? t('urgentResult') : t('abnormalResult')}
            </AlertTitle>
            <AlertDescription className="mt-1">
              <p className="font-medium">{result.patientName} - {result.resultName}</p>
              <p className="text-sm">
                {t('value')}: <span className="font-bold">{result.resultValue}</span>
                {result.normalRange && <span> ({t('normalRange')}: {result.normalRange})</span>}
              </p>
            </AlertDescription>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onView(result.id)}
          >
            {t('view')}
          </Button>
          
          {!result.acknowledged && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => onAcknowledge(result.id)}
            >
              {t('acknowledge')}
            </Button>
          )}
        </div>
      </div>
    </Alert>
  );
}
