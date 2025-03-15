
import React from 'react';
import { Tabs } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTranslation } from '@/hooks/useTranslation';
import { Order } from '@/types/orders';
import { Badge } from '@/components/ui/badge';
import { Brain, ShieldCheck } from 'lucide-react';
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
      
      <Alert variant="transition" className="animate-fade-in">
        <Brain className="h-5 w-5" />
        <AlertDescription className="flex justify-between items-center">
          <span>
            {language === 'pt' 
              ? 'Este pedido será verificado pela IA para garantir a segurança do paciente.' 
              : 'This order will be verified by AI to ensure patient safety.'}
          </span>
          <Badge variant="ai" className="ml-2">AI-Powered</Badge>
        </AlertDescription>
      </Alert>
      
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
      
      <div className="flex items-center justify-end mt-4 p-3 bg-purple-50 rounded-md border border-purple-200 dark:bg-purple-950/20 dark:border-purple-800/40">
        <div className="flex-1">
          <div className="flex items-center">
            <ShieldCheck className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
            <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
              {language === 'pt' 
                ? 'Verificação de segurança pela IA' 
                : 'AI Safety Verification'}
            </span>
          </div>
          <p className="text-xs text-purple-700 dark:text-purple-400 mt-0.5 ml-7">
            {language === 'pt' 
              ? 'Seu pedido será analisado para garantir a segurança do paciente' 
              : 'Your order will be analyzed to ensure patient safety'}
          </p>
        </div>
        
        <OrderActionButtons 
          onCancel={onCancel}
          onVerify={handleVerifyOrder}
          isSubmitting={isSubmitting}
          isValid={validateOrder()}
        />
      </div>
      
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
