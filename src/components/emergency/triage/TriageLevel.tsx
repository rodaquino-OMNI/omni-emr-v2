
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { TriageLevel } from '../types';

interface TriageLevelSelectorProps {
  onTriageSubmit: (level: TriageLevel) => void;
  canPerformTriage: boolean;
}

const TriageLevelSelector: React.FC<TriageLevelSelectorProps> = ({ 
  onTriageSubmit, 
  canPerformTriage 
}) => {
  const { t } = useTranslation();

  if (!canPerformTriage) {
    return null;
  }
  
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-medium mb-3">{t('assignTriageLevel')}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
        <Button 
          className="bg-red-500 hover:bg-red-600"
          onClick={() => onTriageSubmit('immediate')}
        >
          <AlertTriangle className="mr-1 h-4 w-4" />
          {t('immediate')}
        </Button>
        <Button
          className="bg-orange-500 hover:bg-orange-600"
          onClick={() => onTriageSubmit('emergent')}
        >
          <Clock className="mr-1 h-4 w-4" />
          {t('emergent')}
        </Button>
        <Button
          className="bg-yellow-500 hover:bg-yellow-600 text-black"
          onClick={() => onTriageSubmit('urgent')}
        >
          {t('urgent')}
        </Button>
        <Button
          className="bg-blue-500 hover:bg-blue-600"
          onClick={() => onTriageSubmit('semi-urgent')}
        >
          {t('semiUrgent')}
        </Button>
        <Button
          className="bg-green-500 hover:bg-green-600"
          onClick={() => onTriageSubmit('non-urgent')}
        >
          {t('nonUrgent')}
        </Button>
      </div>
    </div>
  );
};

export default TriageLevelSelector;
