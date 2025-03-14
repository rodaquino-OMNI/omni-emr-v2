
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import TranslatedText from '@/components/common/TranslatedText';

const EmptyHistoryState = () => {
  const { t } = useTranslation();
  
  return (
    <div className="text-center py-8 text-muted-foreground">
      <TranslatedText textKey="noHistoricalUpdates" />
    </div>
  );
};

export default EmptyHistoryState;
