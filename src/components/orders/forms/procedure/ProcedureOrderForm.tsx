
import React, { useState, useEffect } from 'react';
import { ProcedureOrder } from '@/types/orders';
import ProcedureNameField from './ProcedureNameField';
import LocationField from './LocationField';
import ScheduleDateField from './ScheduleDateField';
import InstructionsField from './InstructionsField';
import EquipmentField from './EquipmentField';
import ProcedurePrioritySelector from './ProcedurePrioritySelector';

interface ProcedureOrderFormProps {
  onDataChange: (data: Partial<ProcedureOrder>) => void;
  data?: Partial<ProcedureOrder>;
}

const ProcedureOrderForm = ({ onDataChange, data }: ProcedureOrderFormProps) => {
  const [formData, setFormData] = useState<Partial<ProcedureOrder>>(data || {
    procedureName: '',
    location: '',
    equipmentNeeded: [],
    priority: 'routine'
  });
  
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
    formData.scheduledTime ? new Date(formData.scheduledTime) : undefined
  );
  
  useEffect(() => {
    // Update parent with form data
    onDataChange({
      ...formData,
      scheduledTime: scheduledDate
    });
  }, [formData, scheduledDate, onDataChange]);
  
  const handleInputChange = (field: keyof ProcedureOrder, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  return (
    <div className="space-y-4">
      <ProcedureNameField
        value={formData.procedureName || ''}
        onChange={(value) => handleInputChange('procedureName', value)}
      />
      
      <LocationField
        value={formData.location || ''}
        onChange={(value) => handleInputChange('location', value)}
      />
      
      <ScheduleDateField
        value={scheduledDate}
        onChange={setScheduledDate}
      />
      
      <InstructionsField
        preInstructions={formData.preInstructions || ''}
        postInstructions={formData.postInstructions || ''}
        onPreInstructionsChange={(value) => handleInputChange('preInstructions', value)}
        onPostInstructionsChange={(value) => handleInputChange('postInstructions', value)}
      />
      
      <EquipmentField
        equipment={formData.equipmentNeeded || []}
        onEquipmentChange={(equipment) => handleInputChange('equipmentNeeded', equipment)}
      />
      
      <ProcedurePrioritySelector
        value={formData.priority || 'routine'}
        onChange={(value) => handleInputChange('priority', value)}
      />
    </div>
  );
};

export default ProcedureOrderForm;
