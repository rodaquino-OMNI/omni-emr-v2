
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import SecurityControlItem from './SecurityControlItem';
import { useAuth } from '@/context/AuthContext';

interface SessionTimeoutControlProps {
  sessionTimeout: number;
  setSessionTimeout: (value: number) => void;
}

const SessionTimeoutControl: React.FC<SessionTimeoutControlProps> = ({ 
  sessionTimeout, 
  setSessionTimeout 
}) => {
  const { language } = useTranslation();
  const { setSessionTimeoutMinutes } = useAuth();
  
  const handleTimeoutChange = (value: string) => {
    const timeout = parseInt(value, 10);
    setSessionTimeout(timeout);
    setSessionTimeoutMinutes(timeout);
  };
  
  return (
    <SecurityControlItem
      icon={Clock}
      title={language === 'pt' ? 'Tempo limite de sessão' : 'Session Timeout'}
      description={language === 'pt' 
        ? 'Defina o tempo de inatividade antes que a sessão expire' 
        : 'Set inactivity time before session expires'}
      action={
        <div className="flex items-center space-x-2">
          <Label htmlFor="session-timeout" className="sr-only">
            {language === 'pt' ? 'Tempo limite de sessão' : 'Session Timeout'}
          </Label>
          <Select
            value={sessionTimeout.toString()}
            onValueChange={handleTimeoutChange}
          >
            <SelectTrigger id="session-timeout" className="w-[150px]">
              <SelectValue placeholder="30 minutes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 {language === 'pt' ? 'minutos' : 'minutes'}</SelectItem>
              <SelectItem value="15">15 {language === 'pt' ? 'minutos' : 'minutes'}</SelectItem>
              <SelectItem value="30">30 {language === 'pt' ? 'minutos' : 'minutes'}</SelectItem>
              <SelectItem value="60">1 {language === 'pt' ? 'hora' : 'hour'}</SelectItem>
              <SelectItem value="120">2 {language === 'pt' ? 'horas' : 'hours'}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
    />
  );
};

export default SessionTimeoutControl;
