
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import TaskCard, { Task } from './TaskCard';
import { EmptyPlaceholder } from '@/components/ui/empty-placeholder';
import { CalendarSearch } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onMarkComplete?: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onMarkComplete }) => {
  const { t } = useTranslation();

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

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onMarkComplete={onMarkComplete}
        />
      ))}
    </div>
  );
};

export default TaskList;
