
import { Task, TaskPriority, TaskStatus, TaskType } from "@/components/tasks/card/TaskCardTypes";
import { mockTasks } from "./mockTasks";
import { supabase } from "@/integrations/supabase/client";

// Filter tasks by multiple criteria
export interface TaskFilter {
  patientId?: string;
  sector?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  type?: TaskType;
  showDelayed?: boolean;
}

// Check if any filters are active
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

// Optimized filter tasks function with better performance
export const filterTasks = async (filter: TaskFilter): Promise<Task[]> => {
  try {
    // Check if we have tasks table in Supabase yet
    const { error } = await supabase.from('tasks').select('count').limit(1).single();
    
    if (error) {
      // Table doesn't exist yet, use mock data
      console.warn('No tasks table found in Supabase, using mock data');
      throw new Error('No tasks table found');
    }
    
    console.log('Supabase tasks table exists, but we need to implement the queries');
    // Since we don't have proper implementation yet, fall back to mock data
    throw new Error('Tasks table implementation incomplete');
  } catch (error) {
    console.warn('Falling back to mock tasks data due to Supabase error');
  }
  
  // Use mock data with optimized filtering
  const now = new Date();
  
  // Fast path for no filters
  if (!hasActiveFilters(filter)) {
    return [...mockTasks].sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
  }
  
  // Create predicate functions for each active filter for better performance
  const predicates: ((task: Task) => boolean)[] = [];
  
  if (filter.patientId) predicates.push(task => task.patientId === filter.patientId);
  if (filter.sector) predicates.push(task => task.sector === filter.sector);
  if (filter.status) predicates.push(task => task.status === filter.status);
  if (filter.priority) predicates.push(task => task.priority === filter.priority);
  if (filter.type) predicates.push(task => task.type === filter.type);
  
  if (filter.showDelayed) {
    predicates.push(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate < now && task.status === 'pending';
    });
  }
  
  // Apply all predicates in a single pass
  const filteredTasks = mockTasks.filter(task => 
    predicates.every(predicate => predicate(task))
  );
  
  // Sort by due date
  return filteredTasks.sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );
};
