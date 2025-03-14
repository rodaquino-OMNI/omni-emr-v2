
import { Task } from '../card/TaskCardTypes';
import { format } from 'date-fns';

/**
 * Groups tasks by date
 */
export const groupTasksByDate = (tasks: Task[]) => {
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
  
  return { groupedTasks, sortedDates };
};

/**
 * Formats a date string for display
 */
export const formatDateHeading = (dateString: string) => {
  return format(new Date(dateString), 'EEEE, MMMM d, yyyy');
};
