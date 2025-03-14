
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderType } from '@/types/orders';
import { useTranslation } from '@/hooks/useTranslation';

interface OrderTypeSelectorProps {
  orderTypes: { 
    value: OrderType; 
    label: string; 
    icon: React.ReactNode 
  }[];
  activeTab: OrderType;
  onChangeTab: (value: OrderType) => void;
}

const OrderTypeSelector = ({ 
  orderTypes, 
  activeTab, 
  onChangeTab 
}: OrderTypeSelectorProps) => {
  return (
    <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
      {orderTypes.map((type) => (
        <TabsTrigger 
          key={type.value} 
          value={type.value} 
          className="flex items-center gap-2"
        >
          {type.icon}
          <span className="hidden md:inline">{type.label}</span>
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default OrderTypeSelector;
