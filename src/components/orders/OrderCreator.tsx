
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { 
  Pill, 
  Microscope, 
  ImageIcon, 
  Stethoscope, 
  UserPlus,
  Search,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  X 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { OrderType, Order } from '@/types/orders';
import MedicationOrderForm from './forms/MedicationOrderForm';
import LaboratoryOrderForm from './forms/LaboratoryOrderForm';
import RadiologyOrderForm from './forms/RadiologyOrderForm';
import ProcedureOrderForm from './forms/ProcedureOrderForm';
import ConsultationOrderForm from './forms/ConsultationOrderForm';
import AIVerificationModal from './AIVerificationModal';

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
  const [alerts, setAlerts] = useState<any[]>([]);
  const [showAIModal, setShowAIModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const orderTypes: { value: OrderType; label: string; icon: React.ReactNode }[] = [
    { value: 'medication', label: language === 'pt' ? 'Medicamento' : 'Medication', icon: <Pill className="h-4 w-4" /> },
    { value: 'laboratory', label: language === 'pt' ? 'Laboratório' : 'Laboratory', icon: <Microscope className="h-4 w-4" /> },
    { value: 'radiology', label: language === 'pt' ? 'Radiologia' : 'Radiology', icon: <ImageIcon className="h-4 w-4" /> },
    { value: 'procedure', label: language === 'pt' ? 'Procedimento' : 'Procedure', icon: <Stethoscope className="h-4 w-4" /> },
    { value: 'consultation', label: language === 'pt' ? 'Consulta' : 'Consultation', icon: <UserPlus className="h-4 w-4" /> }
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
  
  const checkForAlerts = async () => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would call an AI service
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulating AI-generated alerts for demonstration
      if (activeTab === 'medication') {
        const medicationName = orderData.medication?.medicationName?.toLowerCase() || '';
        
        // Generate mock alerts based on medication name
        if (medicationName.includes('warfarin') || medicationName.includes('coumadin')) {
          setAlerts([
            {
              type: 'warning',
              message: 'Potential interaction with patient\'s current aspirin therapy. Consider monitoring INR more frequently.',
              overridden: false
            }
          ]);
        } else if (medicationName.includes('penicillin') || medicationName.includes('amoxicillin')) {
          setAlerts([
            {
              type: 'critical',
              message: 'Patient has documented penicillin allergy. Consider alternative antibiotic.',
              overridden: false
            }
          ]);
        } else if (medicationName && Math.random() > 0.5) {
          // Random warning for demo purposes
          setAlerts([
            {
              type: 'info',
              message: 'This medication may cause drowsiness. Advise patient to avoid driving.',
              overridden: false
            }
          ]);
        } else {
          setAlerts([]);
        }
      } else {
        // For other order types
        setAlerts([]);
      }
      
      // Show AI verification modal only if there are alerts
      if (alerts.length > 0) {
        setShowAIModal(true);
      } else {
        submitOrder();
      }
    } catch (error) {
      console.error('Error checking for alerts:', error);
      toast({
        variant: 'destructive',
        title: language === 'pt' ? 'Erro' : 'Error',
        description: language === 'pt' 
          ? 'Falha ao verificar alertas. Deseja prosseguir mesmo assim?' 
          : 'Failed to check for alerts. Do you want to proceed anyway?'
      });
    } finally {
      setIsSubmitting(false);
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
  
  const handleAlertsDecision = (proceed: boolean, overrideReasons?: {[key: number]: string}) => {
    setShowAIModal(false);
    
    if (proceed) {
      // Update alerts with override reasons
      if (overrideReasons) {
        const updatedAlerts = alerts.map((alert, index) => ({
          ...alert,
          overridden: true,
          overriddenBy: user?.name,
          overriddenReason: overrideReasons[index] || 'Clinical decision'
        }));
        setAlerts(updatedAlerts);
      }
      
      // Submit the order with updated alerts
      submitOrder();
    }
  };
  
  return (
    <div className="space-y-6">
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
      
      <Tabs 
        defaultValue="medication" 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as OrderType)}
        className="w-full"
      >
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
        
        <div className="border rounded-md p-4">
          <TabsContent value="medication">
            <MedicationOrderForm 
              onDataChange={handleOrderDataChange} 
              data={orderData.medication}
            />
          </TabsContent>
          
          <TabsContent value="laboratory">
            <LaboratoryOrderForm 
              onDataChange={handleOrderDataChange} 
              data={orderData.laboratory}
            />
          </TabsContent>
          
          <TabsContent value="radiology">
            <RadiologyOrderForm 
              onDataChange={handleOrderDataChange} 
              data={orderData.radiology}
            />
          </TabsContent>
          
          <TabsContent value="procedure">
            <ProcedureOrderForm 
              onDataChange={handleOrderDataChange} 
              data={orderData.procedure}
            />
          </TabsContent>
          
          <TabsContent value="consultation">
            <ConsultationOrderForm 
              onDataChange={handleOrderDataChange} 
              data={orderData.consultation}
            />
          </TabsContent>
        </div>
      </Tabs>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          {language === 'pt' ? 'Cancelar' : 'Cancel'}
        </Button>
        <Button 
          onClick={checkForAlerts}
          disabled={isSubmitting || !validateOrder()}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
              {language === 'pt' ? 'Verificando...' : 'Verifying...'}
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {language === 'pt' ? 'Verificar e Enviar' : 'Verify & Submit'}
            </>
          )}
        </Button>
      </div>
      
      {showAIModal && (
        <AIVerificationModal
          alerts={alerts}
          onClose={() => setShowAIModal(false)}
          onProceed={handleAlertsDecision}
        />
      )}
    </div>
  );
};

export default OrderCreator;
