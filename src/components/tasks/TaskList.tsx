
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import TaskCard, { Task } from './TaskCard';
import { format } from 'date-fns';

interface TaskListProps {
  tasks: Task[];
  onMarkComplete?: (task: Task) => void;
  showCompletionInfo?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onMarkComplete,
  showCompletionInfo = false
}) => {
  const { t } = useTranslation();

  if (tasks.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">{t('noTasksFound')}</p>
      </div>
    );
  }

  // Group tasks by date
  const groupedTasks: Record<string, Task[]> = {};
  
  tasks.forEach(task => {
    const date = typeof task.dueDate === 'string' 
      ? new Date(task.dueDate).toDateString() 
      : task.dueDate.toDateString();
    
    if (!groupedTasks[date]) {
      groupedTasks[date] = [];
    }
    
    groupedTasks[date].push(task);
  });
  
  // Sort dates
  const sortedDates = Object.keys(groupedTasks).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <div className="space-y-6">
      {sortedDates.map(date => (
        <div key={date} className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            {format(new Date(date), 'EEEE, MMMM d, yyyy')}
          </h3>
          
          <div className="space-y-3">
            {groupedTasks[date].map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onMarkComplete={onMarkComplete ? () => onMarkComplete(task) : undefined}
                showCompletionInfo={showCompletionInfo}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
