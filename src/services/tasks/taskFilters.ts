
import { Task, TaskPriority, TaskStatus, TaskType } from "@/components/tasks/card/TaskCardTypes";
import { mockTasks } from "./mockTasks";

// Filter tasks by multiple criteria
export interface TaskFilter {
  patientId?: string;
  sector?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  type?: TaskType;
  showDelayed?: boolean;
}

export const filterTasks = async (filter: TaskFilter): Promise<Task[]> => {
  // Optimize by creating a single filter function that combines all criteria
  const now = new Date();
  
  // Fast path for no filters
  if (!hasActiveFilters(filter)) {
    const sortedTasks = [...mockTasks].sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
    return sortedTasks;
  }

  // Filter in a single pass through the array
  const filteredTasks = mockTasks.filter(task => {
    // Check each filter criteria
    if (filter.patientId && task.patientId !== filter.patientId) return false;
    if (filter.sector && task.sector !== filter.sector) return false;
    if (filter.status && task.status !== filter.status) return false;
    if (filter.priority && task.priority !== filter.priority) return false;
    if (filter.type && task.type !== filter.type) return false;
    
    // Special handling for delayed tasks
    if (filter.showDelayed) {
      const dueDate = new Date(task.dueDate);
      if (!(dueDate < now && task.status === 'pending')) return false;
    }
    
    // If we made it here, the task passed all filters
    return true;
  });
  
  // Sort by due date (ascending)
  return filteredTasks.sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );
};

// Helper function to check if any filters are active
function hasActiveFilters(filter: TaskFilter): boolean {
  return Boolean(
    filter.patientId || 
    filter.sector || 
    filter.status || 
    filter.priority || 
    filter.type || 
    filter.showDelayed
  );
}
