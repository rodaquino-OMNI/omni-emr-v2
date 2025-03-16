
import React from 'react';
import { Shield } from 'lucide-react';
import { Language } from '@/types/auth';

interface HipaaBannerProps {
  language: Language;
}

export const HipaaBanner: React.FC<HipaaBannerProps> = ({ language }) => {
  return (
    <div className="bg-blue-50 text-blue-800 px-4 py-2 flex items-center gap-2 text-sm border-b border-blue-100">
      <Shield className="h-4 w-4" />
      <span>
        {language === 'pt'
          ? 'Seus dados de saúde são protegidos sob regulamentos HIPAA e LGPD. O acesso às suas informações é criptografado e auditado.'
          : 'Your health data is protected under HIPAA regulations. Access to your information is encrypted and audited.'}
      </span>
    </div>
  );
};
