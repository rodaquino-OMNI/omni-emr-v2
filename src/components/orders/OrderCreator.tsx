
import React from 'react';
import { Tabs } from '@/components/ui/tabs';
import { useTranslation } from '@/hooks/useTranslation';
import { Order } from '@/types/orders';
import AIVerificationModal from './AIVerificationModal';
import OrderTypeSelector from './components/OrderTypeSelector';
import OrderFormContent from './components/OrderFormContent';
import OrderActionButtons from './components/OrderActionButtons';
import OrderHeader from './components/OrderHeader';
import { getOrderTypeOptions } from './components/OrderTypeOptions';
import { useOrderCreator } from './hooks/useOrderCreator';

interface OrderCreatorProps {
  patientId: string;
  patientName?: string;
  onOrderCreated: (order: Order) => void;
  onCancel: () => void;
}

const OrderCreator = ({ 
  patientId, 
  patientName, 
  onOrderCreated, 
  onCancel 
}: OrderCreatorProps) => {
  const { language } = useTranslation();
  
  const {
    activeTab,
    setActiveTab,
    orderData,
    alerts,
    isSubmitting,
    showAIModal,
    setShowAIModal,
    handleOrderDataChange,
    validateOrder,
    handleVerifyOrder,
    onAlertsDecision
  } = useOrderCreator(patientId, onOrderCreated);
  
  const orderTypes = getOrderTypeOptions({ language });
  
  return (
    <div className="space-y-6">
      <OrderHeader patientName={patientName} />
      
      <Tabs 
        defaultValue="medication" 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as any)}
        className="w-full"
      >
        <OrderTypeSelector 
          orderTypes={orderTypes} 
          activeTab={activeTab}
          onChangeTab={(value) => setActiveTab(value)}
        />
        
        <OrderFormContent 
          activeTab={activeTab}
          orderData={orderData}
          onDataChange={handleOrderDataChange}
        />
      </Tabs>
      
      <OrderActionButtons 
        onCancel={onCancel}
        onVerify={handleVerifyOrder}
        isSubmitting={isSubmitting}
        isValid={validateOrder()}
      />
      
      {showAIModal && (
        <AIVerificationModal
          alerts={alerts}
          onClose={() => setShowAIModal(false)}
          onProceed={onAlertsDecision}
        />
      )}
    </div>
  );
};

export default OrderCreator;
