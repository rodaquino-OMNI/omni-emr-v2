
import React from 'react';
import { Clock } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import SecurityControlItem from './SecurityControlItem';

export interface SessionTimeoutControlProps {
  sessionTimeout: number;
  setSessionTimeout: (timeout: number) => void;
}

const SessionTimeoutControl: React.FC<SessionTimeoutControlProps> = ({
  sessionTimeout,
  setSessionTimeout
}) => {
  const handleSliderChange = (value: number[]) => {
    setSessionTimeout(value[0]);
  };

  return (
    <SecurityControlItem
      icon={<Clock className="h-5 w-5" />}
      title="Session Timeout"
      description={`Auto-logout after ${sessionTimeout} minutes of inactivity`}
      action={
        <div className="w-32">
          <Slider
            value={[sessionTimeout]}
            min={5}
            max={60}
            step={5}
            onValueChange={handleSliderChange}
          />
        </div>
      }
    />
  );
};

export default SessionTimeoutControl;
