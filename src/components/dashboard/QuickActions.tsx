
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useQuickActions } from './hooks/useQuickActions';
import QuickActionButton from './components/QuickActionButton';

const QuickActions = () => {
  const { language } = useTranslation();
  const { displayActions, hasActions } = useQuickActions();
  
  if (!hasActions) return null;

  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-semibold mb-4">
        {language === 'pt' ? 'Ações Rápidas' : 'Quick Actions'}
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayActions.map((action, index) => (
          <QuickActionButton key={index} action={action} />
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
