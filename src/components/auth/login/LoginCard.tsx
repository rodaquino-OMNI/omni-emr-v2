
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Language } from '@/types/auth';

interface LoginCardProps {
  t: (key: string) => string;
  language: Language;
  isSupabaseConnected: boolean;
  children: React.ReactNode;
}

const LoginCard: React.FC<LoginCardProps> = ({ 
  children, 
  t, 
  language, 
  isSupabaseConnected 
}) => {
  return (
    <Card className="w-full shadow-lg">
      <CardContent className="pt-6 pb-6">
        {children}
      </CardContent>
    </Card>
  );
};

export default LoginCard;
