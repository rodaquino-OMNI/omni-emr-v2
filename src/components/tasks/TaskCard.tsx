
import React from 'react';
import { cn } from '@/lib/utils';
import TaskIcon from './card/TaskIcon';
import TaskHeader from './card/TaskHeader';
import TaskDetails from './card/TaskDetails';
import TaskCompletionInfo from './card/TaskCompletionInfo';
import TaskActions from './card/TaskActions';
import { Task, TaskCardProps } from './card/TaskCardTypes';

// Re-export types from TaskCardTypes for backward compatibility
export type { Task, TaskPriority, TaskStatus, TaskType } from './card/TaskCardTypes';

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onMarkComplete, 
  className,
  showCompletionInfo = false
}) => {
  const now = new Date();
  const dueDate = new Date(task.dueDate);
  const isDelayed = dueDate < now && task.status === 'pending';

  return (
    <div className={cn(
      "glass-card p-4 border-l-4 transition-all",
      task.status === 'completed' 
        ? "border-l-green-500" 
        : isDelayed 
          ? "border-l-red-500" 
          : "border-l-blue-500",
      className
    )}>
      <div className="flex items-start gap-3">
        <TaskIcon 
          type={task.type} 
          className={cn(
            "p-2 rounded-md",
            task.status === 'completed' 
              ? "bg-green-100" 
              : isDelayed 
                ? "bg-red-100" 
                : "bg-blue-100"
          )}
        />

        <div className="flex-1">
          <TaskHeader task={task} isDelayed={isDelayed} />
          <TaskDetails task={task} isDelayed={isDelayed} />
          
          {showCompletionInfo && <TaskCompletionInfo task={task} />}
          
          <TaskActions task={task} onMarkComplete={onMarkComplete} />
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
