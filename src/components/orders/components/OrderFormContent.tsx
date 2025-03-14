
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { OrderType } from '@/types/orders';
import MedicationOrderForm from '../forms/MedicationOrderForm';
import LaboratoryOrderForm from '../forms/LaboratoryOrderForm';
import RadiologyOrderForm from '../forms/RadiologyOrderForm';
import ProcedureOrderForm from '../forms/ProcedureOrderForm';
import ConsultationOrderForm from '../forms/ConsultationOrderForm';

interface OrderFormContentProps {
  activeTab: OrderType;
  orderData: any;
  onDataChange: (data: any) => void;
}

const OrderFormContent = ({ 
  activeTab, 
  orderData, 
  onDataChange 
}: OrderFormContentProps) => {
  return (
    <div className="border rounded-md p-4">
      <TabsContent value="medication">
        <MedicationOrderForm 
          onDataChange={onDataChange} 
          data={orderData.medication}
        />
      </TabsContent>
      
      <TabsContent value="laboratory">
        <LaboratoryOrderForm 
          onDataChange={onDataChange} 
          data={orderData.laboratory}
        />
      </TabsContent>
      
      <TabsContent value="radiology">
        <RadiologyOrderForm 
          onDataChange={onDataChange} 
          data={orderData.radiology}
        />
      </TabsContent>
      
      <TabsContent value="procedure">
        <ProcedureOrderForm 
          onDataChange={onDataChange} 
          data={orderData.procedure}
        />
      </TabsContent>
      
      <TabsContent value="consultation">
        <ConsultationOrderForm 
          onDataChange={onDataChange} 
          data={orderData.consultation}
        />
      </TabsContent>
    </div>
  );
};

export default OrderFormContent;
