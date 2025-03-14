
import React from 'react';
import { Button } from '@/components/ui/button';
import { TimeRangeType } from '../types/vitalsTypes';

interface TimeRangeSelectorProps {
  selectedTimeRange: TimeRangeType;
  onChange: (range: TimeRangeType) => void;
  size?: 'default' | 'sm';
}

const VitalsTimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ 
  selectedTimeRange, 
  onChange,
  size = 'default'
}) => {
  const buttonClass = size === 'sm' ? "h-7 text-xs px-2" : "";
  
  return (
    <div className="flex gap-1">
      <Button 
        variant={selectedTimeRange === '24h' ? 'default' : 'outline'} 
        size={size} 
        className={buttonClass}
        onClick={() => onChange('24h')}
      >
        24h
      </Button>
      <Button 
        variant={selectedTimeRange === '3d' ? 'default' : 'outline'} 
        size={size} 
        className={buttonClass}
        onClick={() => onChange('3d')}
      >
        3d
      </Button>
      <Button 
        variant={selectedTimeRange === '7d' ? 'default' : 'outline'} 
        size={size}
        className={buttonClass}
        onClick={() => onChange('7d')}
      >
        7d
      </Button>
      <Button 
        variant={selectedTimeRange === '30d' ? 'default' : 'outline'} 
        size={size}
        className={buttonClass}
        onClick={() => onChange('30d')}
      >
        30d
      </Button>
    </div>
  );
};

export default VitalsTimeRangeSelector;
