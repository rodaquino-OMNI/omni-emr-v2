
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface OrderHeaderProps {
  patientName?: string;
}

const OrderHeader = ({ patientName }: OrderHeaderProps) => {
  const { language } = useTranslation();
  
  return (
    <div className="space-y-1">
      <h2 className="text-2xl font-semibold tracking-tight">
        {language === 'pt' ? 'Novo Pedido' : 'New Order'}
      </h2>
      {patientName && (
        <p className="text-sm text-muted-foreground">
          {language === 'pt' ? 'Paciente' : 'Patient'}: {patientName}
        </p>
      )}
    </div>
  );
};

export default OrderHeader;
