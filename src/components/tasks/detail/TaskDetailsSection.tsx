
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { User, Building, Calendar, Clock } from 'lucide-react';
import { Task } from '@/components/tasks/card/TaskCardTypes';
import { useTranslation } from '@/hooks/useTranslation';

interface TaskDetailsSectionProps {
  task: Task;
  isDelayed: boolean;
}

const TaskDetailsSection: React.FC<TaskDetailsSectionProps> = ({ task, isDelayed }) => {
  const { t } = useTranslation();
  
  // Format date
  const formatTaskDate = (date: string | Date) => {
    return format(new Date(date), 'PPpp');
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Task Details</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <span className="font-medium">Patient:</span>{' '}
              <Link to={`/patients/${task.patientId}`} className="text-primary hover:underline">
                {task.patientName}
              </Link>
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <span className="font-medium">Sector:</span>{' '}
              {task.sector}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <span className="font-medium">Due Date:</span>{' '}
              <span className={isDelayed ? "text-red-600" : ""}>
                {formatTaskDate(task.dueDate)}
              </span>
            </span>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Timeline</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <span className="font-medium">Created:</span>{' '}
              {formatTaskDate(task.createdAt)}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              <span className="font-medium">Last Updated:</span>{' '}
              {formatTaskDate(task.updatedAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsSection;
