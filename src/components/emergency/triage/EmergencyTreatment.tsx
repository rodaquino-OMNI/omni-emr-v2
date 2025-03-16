
import React from 'react';
import { Stethoscope, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

interface EmergencyTreatmentProps {
  canTreatEmergency: boolean;
  isPhysician: boolean;
  onInitiateTreatment: () => void;
}

const EmergencyTreatment: React.FC<EmergencyTreatmentProps> = ({
  canTreatEmergency,
  isPhysician,
  onInitiateTreatment
}) => {
  const { t } = useTranslation();

  if (!canTreatEmergency) {
    return null;
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-medium mb-3">{t('emergencyTreatment')}</h3>
      <div className="space-y-2">
        <Button
          className="w-full justify-start"
          onClick={onInitiateTreatment}
        >
          <Stethoscope className="mr-2 h-4 w-4" />
          {t('initiateTreatment')}
        </Button>
        {isPhysician && (
          <Button
            className="w-full justify-start"
            variant="outline"
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            {t('orderEmergencyDiagnostics')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmergencyTreatment;
