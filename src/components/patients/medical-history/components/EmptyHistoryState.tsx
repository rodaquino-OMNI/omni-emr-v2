
import React from 'react';
import { ClipboardList, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

interface EmptyHistoryStateProps {
  onAddNew?: () => void;
  type?: string;
}

const EmptyHistoryState: React.FC<EmptyHistoryStateProps> = ({ 
  onAddNew,
  type = 'medical-history'
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border border-dashed rounded-lg bg-muted/10">
      <div className="mb-4 p-3 rounded-full bg-muted">
        <ClipboardList className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">
        {type === 'medical-history' 
          ? t('noMedicalHistoryEntries', 'No Medical History') 
          : t('noRecords', 'No Records')}
      </h3>
      <p className="text-muted-foreground max-w-md mb-6">
        {type === 'medical-history'
          ? t('noMedicalHistoryDescription', 'There are no medical history entries for this patient yet.')
          : t('noRecordsDescription', 'There are no records available for this patient yet.')}
      </p>
      
      {onAddNew && (
        <Button onClick={onAddNew} className="gap-1">
          <PlusCircle className="h-4 w-4" />
          {type === 'medical-history'
            ? t('addMedicalHistoryEntry', 'Add Medical History')
            : t('addRecord', 'Add Record')}
        </Button>
      )}
    </div>
  );
};

export default EmptyHistoryState;
