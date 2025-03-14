
import React, { useState, useEffect } from 'react';
import { LaboratoryOrder } from '@/types/orders';
import LabTestSelector from './LabTestSelector';
import TestSelectionList from './TestSelectionList';
import FrequencySelector from './FrequencySelector';
import ClinicalReasonField from './ClinicalReasonField';
import SpecimenTypeField from './SpecimenTypeField';
import PrioritySelector from './PrioritySelector';
import CollectionInstructionsField from './CollectionInstructionsField';

interface LaboratoryOrderFormProps {
  onDataChange: (data: Partial<LaboratoryOrder>) => void;
  data?: Partial<LaboratoryOrder>;
}

const LaboratoryOrderForm = ({ onDataChange, data }: LaboratoryOrderFormProps) => {
  const [formData, setFormData] = useState<Partial<LaboratoryOrder>>(data || {
    tests: [],
    frequency: 'once',
    clinicalReason: '',
    priority: 'routine'
  });
  
  useEffect(() => {
    onDataChange(formData);
  }, [formData, onDataChange]);
  
  const handleInputChange = (field: keyof LaboratoryOrder, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const addTest = (test: string) => {
    setFormData(prev => ({
      ...prev,
      tests: [...(prev.tests || []), test]
    }));
  };
  
  const removeTest = (testToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tests: (prev.tests || []).filter(test => test !== testToRemove)
    }));
  };
  
  return (
    <div className="space-y-4">
      <LabTestSelector 
        onAddTest={addTest}
      />
      
      <TestSelectionList
        tests={formData.tests || []}
        onRemoveTest={removeTest}
      />
      
      <FrequencySelector
        value={formData.frequency || 'once'}
        onChange={(value) => handleInputChange('frequency', value)}
      />
      
      <ClinicalReasonField
        value={formData.clinicalReason || ''}
        onChange={(value) => handleInputChange('clinicalReason', value)}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SpecimenTypeField
          value={formData.specimenType || ''}
          onChange={(value) => handleInputChange('specimenType', value)}
        />
        
        <PrioritySelector
          value={formData.priority || 'routine'}
          onChange={(value) => handleInputChange('priority', value as 'routine' | 'urgent' | 'stat')}
        />
      </div>
      
      <CollectionInstructionsField
        value={formData.collectionInstructions || ''}
        onChange={(value) => handleInputChange('collectionInstructions', value)}
      />
    </div>
  );
};

export default LaboratoryOrderForm;
