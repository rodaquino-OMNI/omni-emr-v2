
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { CheckCircle, AlertTriangle } from 'lucide-react';

interface SafetyStatusIndicatorProps {
  hasPassed: boolean;
}

export function SafetyStatusIndicator({ hasPassed }: SafetyStatusIndicatorProps) {
  const { t } = useTranslation();
  
  return hasPassed ? (
    <div className="flex items-center text-green-600 mt-2">
      <CheckCircle className="mr-2 h-4 w-4" />
      {t('safetyCheckPassed')}
    </div>
  ) : (
    <div className="flex items-center text-amber-600 mt-2">
      <AlertTriangle className="mr-2 h-4 w-4" />
      {t('safetyCheckFailed')}
    </div>
  );
}
