import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { OrderPriority, OrderStatus, OrderType } from '@/types/orders';

export interface OrderFormData {
  patientId: string;
  orderType: OrderType;
  priority: OrderPriority;
  providerId?: string;
  providerName?: string;
  notes?: string;
  status: OrderStatus;
  details: Record<string, any>;
}

export interface OrderEntryFormProps {
  initialData?: Partial<OrderFormData>;
  onSubmit: (data: OrderFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const OrderEntryForm: React.FC<OrderEntryFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const { user } = useAuth();
  const { t, language } = useTranslation();
  
  const [formData, setFormData] = useState<OrderFormData>({
    patientId: initialData?.patientId || '',
    orderType: initialData?.orderType || 'medication',
    priority: initialData?.priority || 'routine',
    providerId: initialData?.providerId || '',
    providerName: initialData?.providerName || '',
    notes: initialData?.notes || '',
    status: initialData?.status || 'pending',
    details: initialData?.details || {}
  });

  const [activeTab, setActiveTab] = useState<string>('basic');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDetailsChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        [name]: value
      }
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.patientId) {
      newErrors.patientId = t('patientIdRequired', 'Patient ID is required');
    }
    
    if (!formData.orderType) {
      newErrors.orderType = t('orderTypeRequired', 'Order type is required');
    }
    
    if (!formData.priority) {
      newErrors.priority = t('priorityRequired', 'Priority is required');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{t('orderDetails', 'Order Details')}</CardTitle>
          <CardDescription>
            {t('orderDetailsDescription', 'Enter the details for this order')}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="basic">{t('basicInfo', 'Basic Info')}</TabsTrigger>
              <TabsTrigger value="details">{t('orderSpecifics', 'Order Specifics')}</TabsTrigger>
              <TabsTrigger value="notes">{t('notes', 'Notes')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientId">
                    {t('patientId', 'Patient ID')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="patientId"
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleInputChange}
                    placeholder={t('enterPatientId', 'Enter patient ID')}
                    className={errors.patientId ? 'border-red-500' : ''}
                  />
                  {errors.patientId && (
                    <p className="text-red-500 text-sm">{errors.patientId}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="orderType">
                    {t('orderType', 'Order Type')} <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.orderType}
                    onValueChange={(value) => handleSelectChange('orderType', value)}
                  >
                    <SelectTrigger id="orderType" className={errors.orderType ? 'border-red-500' : ''}>
                      <SelectValue placeholder={t('selectOrderType', 'Select order type')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medication">{t('medication', 'Medication')}</SelectItem>
                      <SelectItem value="laboratory">{t('laboratory', 'Laboratory')}</SelectItem>
                      <SelectItem value="radiology">{t('radiology', 'Radiology')}</SelectItem>
                      <SelectItem value="consultation">{t('consultation', 'Consultation')}</SelectItem>
                      <SelectItem value="procedure">{t('procedure', 'Procedure')}</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.orderType && (
                    <p className="text-red-500 text-sm">{errors.orderType}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">
                    {t('priority', 'Priority')} <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => handleSelectChange('priority', value as OrderPriority)}
                  >
                    <SelectTrigger id="priority" className={errors.priority ? 'border-red-500' : ''}>
                      <SelectValue placeholder={t('selectPriority', 'Select priority')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">{t('routine', 'Routine')}</SelectItem>
                      <SelectItem value="urgent">{t('urgent', 'Urgent')}</SelectItem>
                      <SelectItem value="stat">{t('stat', 'STAT')}</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.priority && (
                    <p className="text-red-500 text-sm">{errors.priority}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="providerName">
                    {t('providerName', 'Provider Name')}
                  </Label>
                  <Input
                    id="providerName"
                    name="providerName"
                    value={formData.providerName}
                    onChange={handleInputChange}
                    placeholder={t('enterProviderName', 'Enter provider name')}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-md">
                <p className="text-sm text-muted-foreground">
                  {t('orderTypeSpecificFields', 'Order type specific fields will be displayed here based on the selected order type.')}
                </p>
              </div>
              
              {/* This section will be replaced by the specific order type form */}
              <div className="h-40 flex items-center justify-center border border-dashed rounded-md">
                <p className="text-muted-foreground">
                  {t('selectOrderTypeMessage', 'Please select an order type to see specific fields')}
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="notes" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">
                  {t('additionalNotes', 'Additional Notes')}
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes || ''}
                  onChange={handleInputChange}
                  placeholder={t('enterAdditionalNotes', 'Enter any additional notes or instructions')}
                  rows={5}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {t('cancel', 'Cancel')}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('submitting', 'Submitting...') : t('submitOrder', 'Submit Order')}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default OrderEntryForm;