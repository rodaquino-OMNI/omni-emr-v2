
import React from 'react';
import { Task } from '@/components/tasks/card/TaskCardTypes';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Package2 } from 'lucide-react';

import TaskStatusBadges from './TaskStatusBadges';
import TaskDelayWarning from './TaskDelayWarning';
import TaskDetailsSection from './TaskDetailsSection';
import TaskActionsSection from './TaskActionsSection';
import TaskFooter from './TaskFooter';

interface TaskDetailCardProps {
  task: Task;
  isDelayed: boolean;
  onStatusChange: (status: 'pending' | 'completed' | 'cancelled') => void;
}

const TaskDetailCard: React.FC<TaskDetailCardProps> = ({ task, isDelayed, onStatusChange }) => {
  // Get task icon based on type
  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'medication':
        return <Package2 className="h-5 w-5" />;
      default:
        return <Package2 className="h-5 w-5" />;
    }
  };
  
  return (
    <Card className={cn(
      "shadow-lg border-t-4",
      isDelayed ? "border-t-red-500" : "border-t-blue-500"
    )}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              {getTaskIcon(task.type)}
              {task.title}
            </CardTitle>
            <CardDescription>
              {task.description || `Task ID: ${task.id}`}
            </CardDescription>
          </div>
          <TaskStatusBadges priority={task.priority} status={task.status} />
        </div>
      </CardHeader>
      
      <CardContent>
        <TaskDelayWarning isDelayed={isDelayed} dueDate={task.dueDate} />
        
        <TaskDetailsSection task={task} isDelayed={isDelayed} />
        
        <Separator className="my-4" />
        
        <TaskActionsSection status={task.status} onStatusChange={onStatusChange} />
      </CardContent>
      
      <CardFooter>
        <TaskFooter patientId={task.patientId} />
      </CardFooter>
    </Card>
  );
};

export default TaskDetailCard;
