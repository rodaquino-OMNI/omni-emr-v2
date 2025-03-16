
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { TriageLevel } from '../types';

interface CurrentTriageLevelProps {
  triageLevel: TriageLevel | null;
}

const CurrentTriageLevel: React.FC<CurrentTriageLevelProps> = ({ triageLevel }) => {
  const { t } = useTranslation();

  if (!triageLevel) {
    return null;
  }

  // Get triage level color
  const getTriageLevelColor = (level: TriageLevel) => {
    switch(level) {
      case 'immediate':
        return 'bg-red-500 text-white';
      case 'emergent':
        return 'bg-orange-500 text-white';
      case 'urgent':
        return 'bg-yellow-500 text-white';
      case 'semi-urgent':
        return 'bg-blue-500 text-white';
      case 'non-urgent':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-medium mb-2">{t('currentTriageLevel')}</h3>
      <div className={`px-4 py-2 rounded-md inline-block ${getTriageLevelColor(triageLevel)}`}>
        {triageLevel === 'immediate' && t('immediate')}
        {triageLevel === 'emergent' && t('emergent')}
        {triageLevel === 'urgent' && t('urgent')}
        {triageLevel === 'semi-urgent' && t('semiUrgent')}
        {triageLevel === 'non-urgent' && t('nonUrgent')}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {t('triageTimestamp')}: {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
};

export default CurrentTriageLevel;
