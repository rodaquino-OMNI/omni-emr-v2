
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
    // Try to fetch tasks from Supabase
    let query = supabase.from('tasks').select('*');
    
    // Apply filters directly in the database query when possible
    if (filter.patientId) query = query.eq('patient_id', filter.patientId);
    if (filter.sector) query = query.eq('sector', filter.sector);
    if (filter.status) query = query.eq('status', filter.status);
    if (filter.priority) query = query.eq('priority', filter.priority);
    if (filter.type) query = query.eq('type', filter.type);
    
    // Always sort by due date for consistency
    query = query.order('due_date', { ascending: true });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      // Client-side filtering for complex filters like showDelayed
      // that can't easily be done at the database level
      let filteredTasks = data as unknown as Task[];
      
      if (filter.showDelayed) {
        const now = new Date();
        filteredTasks = filteredTasks.filter(task => 
          new Date(task.dueDate) < now && task.status === 'pending'
        );
      }
      
      return filteredTasks;
    }
    
    // If no data from database, fall back to mock data with optimized filtering
    console.warn('No tasks found in database, using mock data');
  } catch (error) {
    console.error('Error fetching tasks from Supabase:', error);
    // Fall back to mock data with a warning
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
