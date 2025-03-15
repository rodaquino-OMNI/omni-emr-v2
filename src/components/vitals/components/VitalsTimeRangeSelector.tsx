
import React from 'react';
import { Toggle } from '@/components/ui/toggle';
import { TimeRangeType } from '../types/vitalsTypes';
import { useTranslation } from '@/hooks/useTranslation';

interface VitalsTimeRangeSelectorProps {
  selectedTimeRange: TimeRangeType;
  onChange: (range: TimeRangeType) => void;
  size?: 'sm' | 'md';
}

const VitalsTimeRangeSelector: React.FC<VitalsTimeRangeSelectorProps> = ({ 
  selectedTimeRange,
  onChange,
  size = 'md'
}) => {
  const { t } = useTranslation();
  
  const timeRanges: { value: TimeRangeType; label: string }[] = [
    { value: '24h', label: '24h' },
    { value: '3d', label: '3d' },
    { value: '7d', label: '7d' },
    { value: '30d', label: '30d' },
  ];
  
  const toggleClasses = size === 'sm' 
    ? 'px-2 py-1 text-xs h-7' 
    : 'px-3 py-1 text-sm';

  return (
    <div className="inline-flex bg-muted rounded-md p-1 gap-0.5">
      {timeRanges.map((range) => (
        <Toggle
          key={range.value}
          pressed={selectedTimeRange === range.value}
          onPressedChange={() => onChange(range.value)}
          className={toggleClasses}
          variant="outline"
          size="sm"
        >
          {range.label}
        </Toggle>
      ))}
    </div>
  );
};

export default VitalsTimeRangeSelector;
