
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Check, X, AlertCircle, Droplets } from 'lucide-react';

interface MedicationActionsProps {
  recordId: string;
  status: string;
  isIV?: boolean;
  canAdminister: boolean;
  onAdminister: (id: string) => void;
  onHold: (id: string) => void;
  onMissed: (id: string) => void;
  onCalculateIV: (id: string) => void;
}

const MedicationActions: React.FC<MedicationActionsProps> = ({
  recordId,
  status,
  isIV,
  canAdminister,
  onAdminister,
  onHold,
  onMissed,
  onCalculateIV
}) => {
  const { t } = useTranslation();

  if (status !== 'scheduled' || !canAdminister) {
    return null;
  }

  return (
    <div className="flex space-x-2">
      <Button variant="outline" size="sm" onClick={() => onAdminister(recordId)}>
        <Check className="h-3 w-3 mr-1" />
        {t('administer')}
      </Button>
      <Button variant="outline" size="sm" onClick={() => onHold(recordId)}>
        <X className="h-3 w-3 mr-1" />
        {t('hold')}
      </Button>
      <Button variant="outline" size="sm" onClick={() => onMissed(recordId)}>
        <AlertCircle className="h-3 w-3 mr-1" />
        {t('missed')}
      </Button>
      {isIV && (
        <Button variant="outline" size="sm" onClick={() => onCalculateIV(recordId)}>
          <Droplets className="h-3 w-3 mr-1" />
          {t('ivRate')}
        </Button>
      )}
    </div>
  );
};

export default MedicationActions;
