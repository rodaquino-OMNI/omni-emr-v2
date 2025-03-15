
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface MedicationAdministrationHeaderProps {
  canAdministerMedications: boolean;
  onAddAdministration: () => void;
}

const MedicationAdministrationHeader: React.FC<MedicationAdministrationHeaderProps> = ({
  canAdministerMedications,
  onAddAdministration
}) => {
  const { t } = useTranslation();
  
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>{t('medicationAdministrationRecord')}</CardTitle>
      {canAdministerMedications && (
        <Button size="sm" onClick={onAddAdministration}>
          <PlusCircle className="h-4 w-4 mr-1" />
          {t('recordAdministration')}
        </Button>
      )}
    </CardHeader>
  );
};

export default MedicationAdministrationHeader;
