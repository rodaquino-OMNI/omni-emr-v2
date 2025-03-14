
import React from 'react';
import { Shield } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const SecurityBanner = () => {
  const { t } = useTranslation();
  
  return (
    <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md flex items-start gap-2">
      <Shield className="h-4 w-4 text-green-500 mt-0.5" />
      <div>
        <p className="font-medium mb-1">{t('hipaaComplianceTitle')}</p>
        <p>{t('hipaaComplianceDescription')}</p>
      </div>
    </div>
  );
};

export default SecurityBanner;
