
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import SecurityControlItem from './SecurityControlItem';
import { Clock } from 'lucide-react';

interface SessionTimeoutControlProps {
  sessionTimeout?: string;
  setSessionTimeout?: (value: string) => void;
}

const SessionTimeoutControl = ({ 
  sessionTimeout = '30', 
  setSessionTimeout 
}: SessionTimeoutControlProps) => {
  const { language } = useTranslation();
  const [localTimeout, setLocalTimeout] = useState(sessionTimeout);
  
  const handleTimeoutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setLocalTimeout(newValue);
    if (setSessionTimeout) {
      setSessionTimeout(newValue);
    }
  };
  
  return (
    <SecurityControlItem
      icon={<Clock className="h-5 w-5" />}
      title={language === 'pt' ? 'Tempo de Inatividade' : 'Session Timeout'}
      description={language === 'pt' ? 
        'Tempo até que sua sessão seja encerrada automaticamente após inatividade' : 
        'Time until your session automatically logs out after inactivity'}
      action={
        <div className="w-32">
          <select
            id="sessionTimeout"
            className="w-full h-9 px-2 rounded-md border border-border bg-background"
            value={localTimeout}
            onChange={handleTimeoutChange}
          >
            <option value="15">15 {language === 'pt' ? 'minutos' : 'minutes'}</option>
            <option value="30">30 {language === 'pt' ? 'minutos' : 'minutes'}</option>
            <option value="60">1 {language === 'pt' ? 'hora' : 'hour'}</option>
            <option value="120">2 {language === 'pt' ? 'horas' : 'hours'}</option>
            <option value="240">4 {language === 'pt' ? 'horas' : 'hours'}</option>
          </select>
        </div>
      }
    />
  );
};

export default SessionTimeoutControl;
