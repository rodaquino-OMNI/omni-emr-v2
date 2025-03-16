
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import TranslatedText from '@/components/common/TranslatedText';

const EmptyHistoryState: React.FC<{ onAddNew: () => void, type: string }> = ({ onAddNew, type }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed rounded-lg border-muted">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium mb-2">
          <TranslatedText textKey={`no${type}Found`} fallback={`No ${type} records found`} />
        </h3>
        <p className="text-muted-foreground">
          <TranslatedText textKey={`add${type}Description`} fallback={`Add a new ${type} record to keep track of the patient's health information.`} />
        </p>
      </div>
      
      <Button onClick={onAddNew} className="flex items-center">
        <PlusCircle className="mr-2 h-4 w-4" />
        <TranslatedText textKey={`add${type}`} fallback={`Add ${type}`} />
      </Button>
    </div>
  );
};

export default EmptyHistoryState;
