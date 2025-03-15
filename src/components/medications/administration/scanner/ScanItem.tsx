
import React from 'react';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { ScanItemProps } from './types';
import { useTranslation } from '@/hooks/useTranslation';

const ScanItem: React.FC<ScanItemProps> = ({
  title,
  entity,
  entityType,
  entityName,
  isScanned,
  icon
}) => {
  const { t } = useTranslation();
  
  // Helper function to safely get the display text based on entity type
  const getDisplayText = () => {
    if (!entity) return "";
    
    if (entityType === 'patient' && 'name' in entity && 'mrn' in entity) {
      return `${entity.name} • ${entity.mrn}`;
    } else if (entityType === 'medication') {
      if (entityName) {
        return entityName;
      } else if ('medicationName' in entity) {
        return entity.medicationName;
      }
    }
    return "";
  };
  
  return (
    <Card className={`p-3 ${isScanned ? 'bg-green-50 border-green-200' : ''}`}>
      <div className="flex items-center text-sm font-medium mb-2">
        {icon}
        {title}
        {isScanned && <Check className="h-4 w-4 ml-auto text-green-600" />}
      </div>
      {entity && (
        <div className="text-xs">
          {getDisplayText()}
        </div>
      )}
    </Card>
  );
};

export default ScanItem;
