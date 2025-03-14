
import React from 'react';
import { Task } from '../card/TaskCardTypes';
import TaskCard from '../TaskCard';
import { formatDateHeading } from '../utils/taskGrouping';

interface TaskDateGroupProps {
  date: string;
  tasks: Task[];
  onMarkComplete?: (task: Task) => void;
  showCompletionInfo?: boolean;
}

const TaskDateGroup: React.FC<TaskDateGroupProps> = ({ 
  date, 
  tasks, 
  onMarkComplete, 
  showCompletionInfo 
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">
        {formatDateHeading(date)}
      </h3>
      
      <div className="space-y-3">
        {tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onMarkComplete={onMarkComplete ? () => onMarkComplete(task) : undefined}
            showCompletionInfo={showCompletionInfo}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskDateGroup;
