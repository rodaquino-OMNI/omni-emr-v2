
import { format, isToday, isTomorrow, isYesterday } from 'date-fns';
import { Task } from '../card/TaskCardTypes';

// Function to group tasks by date
export const groupTasksByDate = (tasks: Task[]) => {
  const groupedTasks: { [key: string]: Task[] } = {};
  
  tasks.forEach(task => {
    const dueDate = new Date(task.dueDate);
    const dateKey = format(dueDate, 'yyyy-MM-dd');
    
    if (!groupedTasks[dateKey]) {
      groupedTasks[dateKey] = [];
    }
    
    groupedTasks[dateKey].push(task);
  });
  
  // Sort each group by priority and time
  Object.keys(groupedTasks).forEach(dateKey => {
    groupedTasks[dateKey].sort((a, b) => {
      // First sort by priority (urgent > high > medium > low)
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then sort by time
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  });
  
  // Sort date keys chronologically
  const sortedDates = Object.keys(groupedTasks).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );
  
  return { groupedTasks, sortedDates };
};

// Function to format date heading for task groups
export const formatDateHeading = (dateKey: string) => {
  const date = new Date(dateKey);
  
  if (isToday(date)) {
    return 'Today';
  } else if (isTomorrow(date)) {
    return 'Tomorrow';
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else {
    return format(date, 'EEEE, MMMM d, yyyy');
  }
};
