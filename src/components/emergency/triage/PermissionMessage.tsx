
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface PermissionMessageProps {
  canPerformTriage: boolean;
  canTreatEmergency: boolean;
}

const PermissionMessage: React.FC<PermissionMessageProps> = ({
  canPerformTriage,
  canTreatEmergency
}) => {
  const { t } = useTranslation();

  if (canPerformTriage || canTreatEmergency) {
    return null;
  }

  return (
    <div className="p-4 bg-muted rounded-lg">
      <p className="text-muted-foreground">
        {t('noEmergencyCarePermissions')}
      </p>
    </div>
  );
};

export default PermissionMessage;
