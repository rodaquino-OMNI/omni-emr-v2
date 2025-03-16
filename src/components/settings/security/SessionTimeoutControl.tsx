
import React from 'react';
import { Clock } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useTranslation } from '@/hooks/useTranslation';
import SecurityControlItem from './SecurityControlItem';

export interface SessionTimeoutControlProps {
  sessionTimeout: number;
  setSessionTimeout: (value: number) => void;
}

const SessionTimeoutControl: React.FC<SessionTimeoutControlProps> = ({
  sessionTimeout,
  setSessionTimeout
}) => {
  const { t } = useTranslation();
  
  const handleChange = (value: number[]) => {
    setSessionTimeout(value[0]);
  };
  
  return (
    <SecurityControlItem
      icon={Clock}
      title={t('sessionTimeout')}
      description={t('adjustSessionTimeout')}
      action={
        <div className="flex flex-col items-end gap-2 w-40">
          <div className="flex items-center justify-between w-full">
            <span className="text-sm text-muted-foreground">5m</span>
            <span className="text-sm font-medium">{sessionTimeout}m</span>
            <span className="text-sm text-muted-foreground">60m</span>
          </div>
          <Slider
            defaultValue={[sessionTimeout]}
            min={5}
            max={60}
            step={5}
            onValueChange={handleChange}
            className="w-full"
          />
        </div>
      }
    />
  );
};

export default SessionTimeoutControl;
