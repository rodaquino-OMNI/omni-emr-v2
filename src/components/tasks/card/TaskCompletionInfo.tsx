
import React from 'react';
import { format } from 'date-fns';
import { CheckCircle, User } from 'lucide-react';
import { Task } from './TaskCardTypes';

interface TaskCompletionInfoProps {
  task: Task;
}

const TaskCompletionInfo: React.FC<TaskCompletionInfoProps> = ({ task }) => {
  // Only show for completed tasks
  if (task.status !== 'completed' || !task.completedAt) {
    return null;
  }
  
  return (
    <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
      <div className="flex items-center gap-1">
        <CheckCircle className="h-3.5 w-3.5 text-green-500" />
        <span>
          Completed on {format(new Date(task.completedAt), 'MMM dd, yyyy HH:mm')}
        </span>
      </div>
      
      {task.completedByName && (
        <div className="flex items-center gap-1 mt-1">
          <User className="h-3.5 w-3.5" />
          <span>By: {task.completedByName}</span>
        </div>
      )}
      
      {task.completionNotes && (
        <div className="mt-1">
          <span className="font-medium">Notes:</span> {task.completionNotes}
        </div>
      )}
    </div>
  );
};

export default TaskCompletionInfo;
