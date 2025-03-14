
import React, { useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  Pill, 
  Microscope, 
  ImageIcon, 
  Stethoscope, 
  UserPlus,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { OrderType, Order } from '@/types/orders';
import AIVerificationModal from './AIVerificationModal';
import OrderTypeSelector from './components/OrderTypeSelector';
import OrderFormContent from './components/OrderFormContent';
import OrderActionButtons from './components/OrderActionButtons';
import OrderHeader from './components/OrderHeader';
import { useOrderAlertsCheck } from './hooks/useOrderAlertsCheck';

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
  const { user } = useAuth();
  const { toast } = useToast();
  const { language } = useTranslation();
  const [activeTab, setActiveTab] = useState<OrderType>('medication');
  const [orderData, setOrderData] = useState<any>({});
  
  const {
    alerts,
    isSubmitting,
    showAIModal,
    setShowAIModal,
    checkForAlerts,
    handleAlertsDecision
  } = useOrderAlertsCheck();
  
  const orderTypes = [
    { value: 'medication' as OrderType, label: language === 'pt' ? 'Medicamento' : 'Medication', icon: <Pill className="h-4 w-4" /> },
    { value: 'laboratory' as OrderType, label: language === 'pt' ? 'Laboratório' : 'Laboratory', icon: <Microscope className="h-4 w-4" /> },
    { value: 'radiology' as OrderType, label: language === 'pt' ? 'Radiologia' : 'Radiology', icon: <ImageIcon className="h-4 w-4" /> },
    { value: 'procedure' as OrderType, label: language === 'pt' ? 'Procedimento' : 'Procedure', icon: <Stethoscope className="h-4 w-4" /> },
    { value: 'consultation' as OrderType, label: language === 'pt' ? 'Consulta' : 'Consultation', icon: <UserPlus className="h-4 w-4" /> }
  ];
  
  const handleOrderDataChange = (data: any) => {
    setOrderData(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        ...data
      }
    }));
  };
  
  const validateOrder = () => {
    // Basic validation logic would go here
    return true;
  };
  
  const handleVerifyOrder = async () => {
    const result = await checkForAlerts(activeTab, orderData);
    
    if (!result.hasAlerts) {
      submitOrder();
    }
  };
  
  const submitOrder = () => {
    if (!user) return;
    
    try {
      const newOrder: Order = {
        id: `order-${Date.now()}`,
        patientId,
        providerId: user.id,
        providerName: user.name,
        type: activeTab,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        details: orderData[activeTab] || {},
        priority: orderData[activeTab]?.priority || 'routine',
        alerts: alerts.length > 0 ? alerts : undefined
      };
      
      // This would be an API call in a real app
      console.log('New order created:', newOrder);
      
      toast({
        title: language === 'pt' ? 'Pedido criado' : 'Order created',
        description: language === 'pt' 
          ? 'O pedido foi criado com sucesso' 
          : 'The order has been created successfully'
      });
      
      onOrderCreated(newOrder);
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        variant: 'destructive',
        title: language === 'pt' ? 'Erro' : 'Error',
        description: language === 'pt' 
          ? 'Falha ao criar pedido' 
          : 'Failed to create order'
      });
    }
  };
  
  const onAlertsDecision = (proceed: boolean, overrideReasons?: {[key: number]: string}) => {
    const updatedAlerts = handleAlertsDecision(proceed, overrideReasons);
    
    if (proceed && updatedAlerts) {
      submitOrder();
    }
  };
  
  return (
    <div className="space-y-6">
      <OrderHeader patientName={patientName} />
      
      <Tabs 
        defaultValue="medication" 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as OrderType)}
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
