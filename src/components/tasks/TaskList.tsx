
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import TaskCard, { Task } from './TaskCard';
import { EmptyPlaceholder } from '@/components/ui/empty-placeholder';
import { CalendarSearch } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TaskListProps {
  tasks: Task[];
  onMarkComplete?: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onMarkComplete }) => {
  const { t } = useTranslation();

  // Group and sort tasks by priority and due date
  const sortedTasks = [...tasks].sort((a, b) => {
    // First by status (pending first)
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    
    // Then by priority (urgent > high > medium > low)
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    const priorityDiff = priorityOrder[a.priority as keyof typeof priorityOrder] - 
                          priorityOrder[b.priority as keyof typeof priorityOrder];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Then by due date (sooner first)
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  // Identify delayed tasks
  const now = new Date();
  const tasksWithDelayStatus = sortedTasks.map(task => ({
    ...task,
    isDelayed: task.status === 'pending' && new Date(task.dueDate) < now
  }));

  // Empty state
  if (tasks.length === 0) {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon>
          <CalendarSearch className="h-12 w-12 text-muted-foreground/70" />
        </EmptyPlaceholder.Icon>
        <EmptyPlaceholder.Title>No tasks found</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          There are no tasks that match your current filters. Try adjusting your search or filters.
        </EmptyPlaceholder.Description>
      </EmptyPlaceholder>
    );
  }

  // Get AI insights about task list
  const getAIInsights = () => {
    const delayedCount = tasksWithDelayStatus.filter(t => t.isDelayed).length;
    const urgentCount = tasksWithDelayStatus.filter(t => t.priority === 'urgent' && t.status === 'pending').length;
    
    if (delayedCount > 0 || urgentCount > 0) {
      return (
        <div className="mb-4 p-4 border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 rounded-md">
          <h3 className="text-sm font-medium flex items-center gap-2 mb-1">
            <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">AI Assistant</Badge>
            Task Summary
          </h3>
          <p className="text-sm text-muted-foreground">
            {delayedCount > 0 && (
              <span className="text-red-600 dark:text-red-400 font-medium">{delayedCount} delayed tasks require attention. </span>
            )}
            {urgentCount > 0 && (
              <span className="text-amber-600 dark:text-amber-400 font-medium">{urgentCount} urgent tasks pending. </span>
            )}
            Prioritize these tasks to maintain patient care standards.
          </p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="space-y-4">
      {getAIInsights()}
      
      {tasksWithDelayStatus.map((task) => (
        <div 
          key={task.id} 
          className={task.isDelayed ? "relative animate-pulse-subtle" : "relative"}
        >
          {task.isDelayed && (
            <Badge 
              className="absolute -left-2 -top-2 z-10 bg-red-500 text-white border-none" 
              title="This task is delayed"
            >
              Delayed
            </Badge>
          )}
          <TaskCard 
            task={task} 
            onMarkComplete={onMarkComplete}
          />
        </div>
      ))}
    </div>
  );
};

export default TaskList;
