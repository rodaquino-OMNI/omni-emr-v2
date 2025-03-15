
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface ViewOnlyPermissionWarningProps {
  show: boolean;
}

const ViewOnlyPermissionWarning: React.FC<ViewOnlyPermissionWarningProps> = ({ show }) => {
  const { t } = useTranslation();

  if (!show) return null;
  
  return (
    <div className="mt-4 p-3 bg-muted rounded-md">
      <p className="text-sm text-muted-foreground">
        {t('viewOnlyMedicationAdministration')}
      </p>
    </div>
  );
};

export default ViewOnlyPermissionWarning;
