
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface DelayedFilterProps {
  checked: boolean;
  onChange: (checked: boolean | undefined) => void;
}

const DelayedFilter: React.FC<DelayedFilterProps> = ({ checked, onChange }) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id="show-delayed" 
        checked={checked}
        onCheckedChange={(checked) => 
          onChange(checked ? true : undefined)
        }
      />
      <Label htmlFor="show-delayed" className="text-sm font-normal">
        Show only delayed tasks
      </Label>
    </div>
  );
};

export default DelayedFilter;
