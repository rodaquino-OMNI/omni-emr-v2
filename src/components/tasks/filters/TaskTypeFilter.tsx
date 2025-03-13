
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
import { Pill, FileText, Stethoscope, Clock } from 'lucide-react';

interface TaskTypeFilterProps {
  value: string;
  onChange: (value: string | undefined) => void;
}

const TaskTypeFilter: React.FC<TaskTypeFilterProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-2">
      <h4 className="font-medium leading-none">{t('taskType')}</h4>
      <Select
        value={value || 'all'}
        onValueChange={(value) => onChange(value === 'all' ? undefined : value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All types" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="medication">
              <div className="flex items-center gap-2">
                <Pill className="h-4 w-4" />
                <span>Medication</span>
              </div>
            </SelectItem>
            <SelectItem value="examination">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Examination</span>
              </div>
            </SelectItem>
            <SelectItem value="consultation">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                <span>Consultation</span>
              </div>
            </SelectItem>
            <SelectItem value="procedure">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                <span>Procedure</span>
              </div>
            </SelectItem>
            <SelectItem value="followup">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Follow-up</span>
              </div>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TaskTypeFilter;
