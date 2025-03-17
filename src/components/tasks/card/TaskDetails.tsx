
import React from 'react';
import { format } from 'date-fns';
import { Clock, User } from 'lucide-react';
import { Task } from './TaskCardTypes';

interface TaskDetailsProps {
  task: Task;
  isDelayed: boolean;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task, isDelayed }) => {
  return (
    <div className="mt-1 text-sm text-muted-foreground">
      {task.description && (
        <p className="mb-1">{task.description}</p>
      )}
      
      <div className="flex items-center gap-1 text-xs">
        <Clock className={`h-3.5 w-3.5 ${isDelayed ? 'text-red-500' : ''}`} />
        <span className={isDelayed ? 'text-red-500 font-medium' : ''}>
          {format(new Date(task.dueDate), 'MMM dd, yyyy HH:mm')}
        </span>
      </div>
      
      <div className="flex items-center gap-1 text-xs mt-1">
        <User className="h-3.5 w-3.5" />
        <span>Patient: {task.patientName}</span>
      </div>
    </div>
  );
};

export default TaskDetails;
