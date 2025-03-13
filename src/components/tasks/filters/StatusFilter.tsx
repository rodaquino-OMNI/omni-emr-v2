
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
import { TaskStatus } from '../TaskCard';

interface StatusFilterProps {
  value: string;
  onChange: (value: TaskStatus | undefined) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-2">
      <h4 className="font-medium leading-none">{t('status')}</h4>
      <Select
        value={value || 'all'}
        onValueChange={(value) => onChange(value === 'all' ? undefined : value as TaskStatus)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default StatusFilter;
