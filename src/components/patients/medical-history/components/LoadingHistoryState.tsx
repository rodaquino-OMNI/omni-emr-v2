
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

const LoadingHistoryState = () => {
  const { t } = useTranslation();
  
  return (
    <div className="flex justify-center items-center py-12">
      <div className="h-6 w-6 border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      <span className="ml-2 text-muted-foreground">{t('loadingHistory')}</span>
    </div>
  );
};

export default LoadingHistoryState;
