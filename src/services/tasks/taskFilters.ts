
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
    // We'll implement Supabase queries when the tasks table is created
    // For now, we'll use mock data
    console.warn('Using mock tasks data until tasks table is created in Supabase');
    
    // This would be the implementation if the tasks table existed
    // const query = supabase.from('tasks').select('*');
    
    // if (filter.patientId) query.eq('patient_id', filter.patientId);
    // if (filter.sector) query.eq('sector', filter.sector); 
    // if (filter.status) query.eq('status', filter.status);
    // if (filter.priority) query.eq('priority', filter.priority);
    // if (filter.type) query.eq('type', filter.type);
    
    // if (filter.showDelayed) {
    //   const now = new Date().toISOString();
    //   query.lt('due_date', now).eq('status', 'pending');
    // }
    
    // const { data, error } = await query;
    
    // if (error) throw error;
    // return data as Task[];
    
    // Intentionally throw an error to trigger the fallback
    throw new Error('Tasks table not implemented yet');
  } catch (error) {
    console.warn('Falling back to mock tasks data');
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
