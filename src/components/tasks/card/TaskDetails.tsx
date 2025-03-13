
import React from 'react';
import { Link } from 'react-router-dom';
import { Task, TaskPriority } from './TaskCardTypes';
import { useTranslation } from '@/hooks/useTranslation';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface TaskDetailsProps {
  task: Task;
  isDelayed: boolean;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task, isDelayed }) => {
  const { t } = useTranslation();

  // Format date
  const formatTaskDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'MMM dd, yyyy HH:mm');
  };

  // Get priority color
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm">
      <div className="flex items-center gap-1 text-muted-foreground">
        <span className="font-medium">{t('patient')}:</span>
        <Link to={`/patients/${task.patientId}`} className="hover:underline text-primary">
          {task.patientName}
        </Link>
      </div>
      
      <div className="flex items-center gap-1 text-muted-foreground">
        <span className="font-medium">{t('sector')}:</span>
        <span>{task.sector}</span>
      </div>
      
      <div className="flex items-center gap-1 text-muted-foreground">
        <span className="font-medium">{t('dueDate')}:</span>
        <span className={isDelayed ? "text-red-600 font-medium" : ""}>
          {formatTaskDate(task.dueDate)}
        </span>
      </div>
      
      <div className="flex items-center gap-1 text-muted-foreground">
        <span className="font-medium">{t('priority')}:</span>
        <Badge className={cn("capitalize", getPriorityColor(task.priority))}>
          {task.priority}
        </Badge>
      </div>
    </div>
  );
};

export default TaskDetails;
