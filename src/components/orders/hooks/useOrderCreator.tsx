
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { OrderType, Order } from '@/types/orders';
import { useOrderAlertsCheck } from './useOrderAlertsCheck';

export const useOrderCreator = (
  patientId: string,
  onOrderCreated: (order: Order) => void
) => {
  const { user } = useAuth();
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
      // Format dates as ISO strings for compatibility
      const currentDate = new Date().toISOString();
      
      const newOrder: Order = {
        id: `order-${Date.now()}`,
        patientId,
        doctorId: user.id,
        orderType: activeTab,
        priority: orderData[activeTab]?.priority || 'routine',
        status: 'pending',
        orderDate: currentDate,
        notes: orderData[activeTab]?.notes,
        createdAt: currentDate,
        updatedAt: currentDate
      };
      
      // This would be an API call in a real app
      console.log('New order created:', newOrder);
      
      toast({
        title: language === 'pt' ? 'Pedido criado' : 'Order created',
        description: language === 'pt' 
          ? 'O pedido foi criado com sucesso' 
          : 'The order has been created successfully',
        variant: "success"
      });
      
      onOrderCreated(newOrder);
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: language === 'pt' ? 'Erro' : 'Error',
        description: language === 'pt' 
          ? 'Falha ao criar pedido' 
          : 'Failed to create order',
        variant: "destructive"
      });
    }
  };
  
  const onAlertsDecision = (proceed: boolean, overrideReasons?: {[key: number]: string}) => {
    const updatedAlerts = handleAlertsDecision(proceed, overrideReasons);
    
    if (proceed && updatedAlerts) {
      submitOrder();
    }
  };
  
  return {
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
  };
};
