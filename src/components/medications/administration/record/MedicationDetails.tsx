
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface MedicationDetailsProps {
  administeredBy?: string;
  administeredAt?: string;
  notes?: string;
}

const MedicationDetails: React.FC<MedicationDetailsProps> = ({
  administeredBy,
  administeredAt,
  notes
}) => {
  const { t } = useTranslation();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          {t('details')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="font-medium">{t('administrationDetails')}</div>
        <div className="mt-2 space-y-1 text-sm">
          {administeredBy && (
            <div>
              <span className="font-semibold">{t('by')}:</span> {administeredBy}
            </div>
          )}
          {administeredAt && (
            <div>
              <span className="font-semibold">{t('at')}:</span> {administeredAt}
            </div>
          )}
          {notes && (
            <div>
              <span className="font-semibold">{t('notes')}:</span> {notes}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MedicationDetails;
