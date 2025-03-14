
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { useTranslation } from '@/hooks/useTranslation';

interface TaskDelayWarningProps {
  isDelayed: boolean;
  dueDate: string | Date;
}

const TaskDelayWarning: React.FC<TaskDelayWarningProps> = ({ isDelayed, dueDate }) => {
  const { t, language } = useTranslation();
  
  if (!isDelayed) return null;
  
  // Format date
  const formatTaskDate = (date: string | Date) => {
    return format(new Date(date), 'PPpp');
  };

  return (
    <div className="bg-red-50 border border-red-100 rounded-md p-3 mb-4 flex items-center gap-2">
      <AlertTriangle className="h-5 w-5 text-red-600" />
      <span className="text-red-700">
        {language === 'pt' 
          ? `Esta tarefa está atrasada. Deveria ter sido concluída em ${formatTaskDate(dueDate)}.`
          : `This task is delayed. It was due on ${formatTaskDate(dueDate)}.`
        }
      </span>
    </div>
  );
};

export default TaskDelayWarning;
