
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface EquipmentFieldProps {
  equipment: string[];
  onEquipmentChange: (equipment: string[]) => void;
}

const EquipmentField = ({ equipment, onEquipmentChange }: EquipmentFieldProps) => {
  const { language } = useTranslation();
  const [equipmentItem, setEquipmentItem] = useState('');
  
  const addEquipment = () => {
    if (equipmentItem.trim()) {
      onEquipmentChange([...equipment, equipmentItem.trim()]);
      setEquipmentItem('');
    }
  };
  
  const removeEquipment = (item: string) => {
    onEquipmentChange(equipment.filter(i => i !== item));
  };
  
  return (
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
        {equipment.map((item, index) => (
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
  );
};

export default EquipmentField;
