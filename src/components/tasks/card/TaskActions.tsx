
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlarmClock, FileEdit } from 'lucide-react';
import { Task } from './TaskCardTypes';

interface TaskActionsProps {
  task: Task;
  onMarkComplete?: () => void;
}

const TaskActions: React.FC<TaskActionsProps> = ({ task, onMarkComplete }) => {
  // Only show actions for pending tasks
  if (task.status !== 'pending') {
    return null;
  }
  
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {onMarkComplete && (
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 gap-1"
          onClick={onMarkComplete}
        >
          <CheckCircle className="h-3.5 w-3.5" />
          Complete
        </Button>
      )}
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 gap-1"
        onClick={() => console.log('Snooze task', task.id)}
      >
        <AlarmClock className="h-3.5 w-3.5" />
        Snooze
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 gap-1"
        onClick={() => console.log('Edit task', task.id)}
      >
        <FileEdit className="h-3.5 w-3.5" />
        Edit
      </Button>
    </div>
  );
};

export default TaskActions;
