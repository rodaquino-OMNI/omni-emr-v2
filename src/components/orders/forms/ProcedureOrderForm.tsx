
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { ProcedureOrder } from '@/types/orders';

interface ProcedureOrderFormProps {
  onDataChange: (data: Partial<ProcedureOrder>) => void;
  data?: Partial<ProcedureOrder>;
}

const ProcedureOrderForm = ({ onDataChange, data }: ProcedureOrderFormProps) => {
  const { language } = useTranslation();
  const [formData, setFormData] = useState<Partial<ProcedureOrder>>(data || {
    procedureName: '',
    location: '',
    equipmentNeeded: [],
    priority: 'routine'
  });
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
    formData.scheduledTime ? new Date(formData.scheduledTime) : undefined
  );
  const [equipmentItem, setEquipmentItem] = useState('');
  
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
  
  const addEquipment = () => {
    if (equipmentItem.trim()) {
      setFormData(prev => ({
        ...prev,
        equipmentNeeded: [...(prev.equipmentNeeded || []), equipmentItem.trim()]
      }));
      setEquipmentItem('');
    }
  };
  
  const removeEquipment = (item: string) => {
    setFormData(prev => ({
      ...prev,
      equipmentNeeded: (prev.equipmentNeeded || []).filter(i => i !== item)
    }));
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="procedure-name">
          {language === 'pt' ? 'Nome do Procedimento' : 'Procedure Name'}
        </Label>
        <Input
          id="procedure-name"
          placeholder={language === 'pt' ? 'Ex: Endoscopia Digestiva' : 'Ex: Digestive Endoscopy'}
          value={formData.procedureName || ''}
          onChange={(e) => handleInputChange('procedureName', e.target.value)}
        />
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="location">
          {language === 'pt' ? 'Local' : 'Location'}
        </Label>
        <Input
          id="location"
          placeholder={language === 'pt' ? 'Ex: Centro Cirúrgico 3' : 'Ex: Surgical Center 3'}
          value={formData.location || ''}
          onChange={(e) => handleInputChange('location', e.target.value)}
        />
      </div>
      
      <div className="space-y-1.5">
        <Label>
          {language === 'pt' ? 'Data e Hora Programadas' : 'Scheduled Date and Time'}
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {scheduledDate ? format(scheduledDate, 'PPP') : (language === 'pt' ? 'Selecionar data' : 'Select date')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={scheduledDate}
              onSelect={setScheduledDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="pre-instructions">
          {language === 'pt' ? 'Instruções Pré-Procedimento' : 'Pre-Procedure Instructions'}
        </Label>
        <Textarea
          id="pre-instructions"
          placeholder={language === 'pt' ? 'Instruções para antes do procedimento...' : 'Instructions for before the procedure...'}
          value={formData.preInstructions || ''}
          onChange={(e) => handleInputChange('preInstructions', e.target.value)}
          rows={2}
        />
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="post-instructions">
          {language === 'pt' ? 'Instruções Pós-Procedimento' : 'Post-Procedure Instructions'}
        </Label>
        <Textarea
          id="post-instructions"
          placeholder={language === 'pt' ? 'Instruções para após o procedimento...' : 'Instructions for after the procedure...'}
          value={formData.postInstructions || ''}
          onChange={(e) => handleInputChange('postInstructions', e.target.value)}
          rows={2}
        />
      </div>
      
      <div className="space-y-1.5">
        <Label>
          {language === 'pt' ? 'Equipamento Necessário' : 'Equipment Needed'}
        </Label>
        <div className="flex gap-2">
          <Input
            placeholder={language === 'pt' ? 'Adicionar equipamento...' : 'Add equipment...'}
            value={equipmentItem}
            onChange={(e) => setEquipmentItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addEquipment())}
          />
          <Button type="button" onClick={addEquipment} variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {(formData.equipmentNeeded || []).map((item, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1 py-1.5">
              {item}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 rounded-full ml-1"
                onClick={() => removeEquipment(item)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="space-y-1.5">
        <Label>
          {language === 'pt' ? 'Prioridade' : 'Priority'}
        </Label>
        <RadioGroup 
          value={formData.priority || "routine"}
          onValueChange={(value: 'routine' | 'urgent' | 'stat') => handleInputChange('priority', value)}
        >
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="routine" id="priority-routine" />
              <Label htmlFor="priority-routine">
                {language === 'pt' ? 'Rotina' : 'Routine'}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="urgent" id="priority-urgent" />
              <Label htmlFor="priority-urgent">
                {language === 'pt' ? 'Urgente' : 'Urgent'}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="stat" id="priority-stat" />
              <Label htmlFor="priority-stat">
                {language === 'pt' ? 'Imediato' : 'STAT'}
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default ProcedureOrderForm;
