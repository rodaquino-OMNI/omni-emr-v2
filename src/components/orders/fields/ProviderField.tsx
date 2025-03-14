
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';

interface ProviderFieldProps {
  editable?: boolean;
  onProviderChange?: (provider: string) => void;
}

const ProviderField = ({ 
  editable = false,
  onProviderChange 
}: ProviderFieldProps) => {
  const { language } = useTranslation();
  const { user } = useAuth();
  
  const providerName = user?.name || 'Unknown Provider';
  
  return (
    <div className="space-y-1.5">
      <Label htmlFor="provider">
        {language === 'pt' ? 'Médico Solicitante' : 'Ordering Provider'}
      </Label>
      {editable ? (
        <Input
          id="provider"
          value={providerName}
          onChange={(e) => onProviderChange && onProviderChange(e.target.value)}
        />
      ) : (
        <Input
          id="provider"
          value={providerName}
          disabled
          className="bg-muted"
        />
      )}
    </div>
  );
};

export default ProviderField;
