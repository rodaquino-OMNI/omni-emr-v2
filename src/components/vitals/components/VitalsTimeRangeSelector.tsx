
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { TimeRangeType } from '../types/vitalsTypes';

interface VitalsTimeRangeSelectorProps {
  selectedTimeRange: TimeRangeType;
  onChange: (timeRange: TimeRangeType) => void;
}

const VitalsTimeRangeSelector: React.FC<VitalsTimeRangeSelectorProps> = ({
  selectedTimeRange,
  onChange
}) => {
  const { t } = useTranslation();
  
  const timeRanges: { value: TimeRangeType; label: string }[] = [
    { value: '24h', label: t('24Hours', '24h') },
    { value: '3d', label: t('3Days', '3d') },
    { value: '7d', label: t('7Days', '7d') },
    { value: '30d', label: t('30Days', '30d') }
  ];
  
  return (
    <div className="flex gap-1">
      {timeRanges.map(range => (
        <Button
          key={range.value}
          variant={selectedTimeRange === range.value ? 'default' : 'outline'}
          size="sm"
          className="px-2 py-1 h-8 text-xs"
          onClick={() => onChange(range.value)}
          aria-pressed={selectedTimeRange === range.value}
          aria-label={`Show ${range.label} of data`}
        >
          {range.label}
        </Button>
      ))}
    </div>
  );
};

export default VitalsTimeRangeSelector;
