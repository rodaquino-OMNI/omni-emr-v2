
import React from 'react';
import { Button } from '@/components/ui/button';
import { TimeRangeType } from '../types/vitalsTypes';

interface VitalsTimeRangeSelectorProps {
  selectedTimeRange: TimeRangeType;
  onChange: (timeRange: TimeRangeType) => void;
  size?: 'sm' | 'md';
}

const VitalsTimeRangeSelector: React.FC<VitalsTimeRangeSelectorProps> = ({ 
  selectedTimeRange, 
  onChange,
  size = 'md'
}) => {
  const timeRanges: { label: string; value: TimeRangeType }[] = [
    { label: '24h', value: '24h' },
    { label: '3d', value: '3d' },
    { label: '7d', value: '7d' },
    { label: '30d', value: '30d' }
  ];
  
  return (
    <div className="flex space-x-1 rounded-md border bg-white p-0.5 shadow-sm">
      {timeRanges.map((range) => (
        <Button
          key={range.value}
          variant={selectedTimeRange === range.value ? "default" : "ghost"}
          size={size === 'sm' ? 'sm' : 'default'}
          className={`
            ${size === 'sm' ? 'h-7 px-2 text-xs' : 'h-8 px-3 text-sm'} 
            ${selectedTimeRange !== range.value ? 'hover:bg-slate-100 text-slate-700' : ''}
            rounded-sm
          `}
          onClick={() => onChange(range.value)}
        >
          {range.label}
        </Button>
      ))}
    </div>
  );
};

export default VitalsTimeRangeSelector;
