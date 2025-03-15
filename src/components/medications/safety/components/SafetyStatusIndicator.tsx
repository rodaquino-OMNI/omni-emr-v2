
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { CheckCircle, AlertTriangle, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SafetyStatusIndicatorProps {
  hasPassed: boolean;
}

export function SafetyStatusIndicator({ hasPassed }: SafetyStatusIndicatorProps) {
  const { t } = useTranslation();
  
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg mt-2 animate-fade-in ${
      hasPassed 
        ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
        : "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
    }`}>
      <div className="flex items-center">
        {hasPassed ? (
          <>
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
            <span className="font-medium text-green-800 dark:text-green-300">{t('safetyCheckPassed')}</span>
          </>
        ) : (
          <>
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
            <span className="font-medium text-amber-800 dark:text-amber-300">{t('safetyCheckFailed')}</span>
          </>
        )}
      </div>
      
      <Badge variant="outline" className={`flex items-center px-2 py-1 ${
        hasPassed
          ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50"
          : "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50"
      }`}>
        <Shield className="h-3 w-3 mr-1" />
        {hasPassed ? t('safetyVerified') || 'Safety Verified' : t('actionRequired') || 'Action Required'}
      </Badge>
    </div>
  );
}
