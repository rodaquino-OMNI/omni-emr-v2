
import React from 'react';
import { Task } from './TaskCardTypes';
import { Clock, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { format } from 'date-fns';

interface TaskCompletionInfoProps {
  task: Task;
}

const TaskCompletionInfo: React.FC<TaskCompletionInfoProps> = ({ task }) => {
  const { t } = useTranslation();

  if (task.status !== 'completed' || !task.completedAt) {
    return null;
  }

  // Format date
  const formatTaskDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'MMM dd, yyyy HH:mm');
  };

  return (
    <div className="mt-3 p-2 bg-green-50 rounded-md">
      <div className="text-sm text-green-800">
        <div className="flex items-center gap-1">
          <CheckCircle2 className="h-4 w-4" />
          <span className="font-medium">{t('completedBy')}:</span> {task.completedByName}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <Clock className="h-4 w-4" />
          <span className="font-medium">{t('completedAt')}:</span> {formatTaskDate(task.completedAt)}
        </div>
        {task.completionNotes && (
          <div className="mt-1">
            <span className="font-medium">{t('notes')}:</span> {task.completionNotes}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCompletionInfo;
