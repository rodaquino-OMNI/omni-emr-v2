
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

const EmptyTaskState: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="text-center p-8">
      <p className="text-muted-foreground">{t('noTasksFound')}</p>
    </div>
  );
};

export default EmptyTaskState;
