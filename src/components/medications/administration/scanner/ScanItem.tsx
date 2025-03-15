
import React from 'react';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { ScanItemProps } from './types';

const ScanItem: React.FC<ScanItemProps> = ({
  title,
  entity,
  entityType,
  entityName,
  isScanned,
  icon
}) => {
  return (
    <Card className={`p-3 ${isScanned ? 'bg-green-50 border-green-200' : ''}`}>
      <div className="flex items-center text-sm font-medium mb-2">
        {icon}
        {title}
        {isScanned && <Check className="h-4 w-4 ml-auto text-green-600" />}
      </div>
      {entity && (
        <div className="text-xs">
          {entityType === 'patient' 
            ? `${entity.name} • ${entity.mrn}` 
            : entityName || entity.medicationName}
        </div>
      )}
    </Card>
  );
};

export default ScanItem;
