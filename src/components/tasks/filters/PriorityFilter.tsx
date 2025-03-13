
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TaskPriority } from '../TaskCard';

interface PriorityFilterProps {
  value: string;
  onChange: (value: TaskPriority | undefined) => void;
}

const PriorityFilter: React.FC<PriorityFilterProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-2">
      <h4 className="font-medium leading-none">{t('priority')}</h4>
      <Select
        value={value || 'all'}
        onValueChange={(value) => onChange(value === 'all' ? undefined : value as TaskPriority)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All priorities" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PriorityFilter;
