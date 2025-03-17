
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PatientCareTasksTabProps } from './index';
import { Task } from '@/components/tasks/card/TaskCardTypes';
import { TaskFilter, filterTasks } from '@/services/tasks';
import TaskTabContent from '@/components/tasks/TaskTabContent';
import TaskCompletionForm from '@/components/tasks/TaskCompletionForm';
import { useQueryClient } from '@tanstack/react-query';

const PatientCareTasksTab: React.FC<PatientCareTasksTabProps> = ({ patientId }) => {
  const queryClient = useQueryClient();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<TaskFilter>({ patientId });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [completionDialogOpen, setCompletionDialogOpen] = useState(false);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await filterTasks({ patientId });
      setTasks(data);
      setFilteredTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }, [patientId]);

  // Initialize by fetching tasks
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Apply filters when filter or searchTerm changes
  useEffect(() => {
    const applyFilters = async () => {
      try {
        // Apply searchTerm filter client-side
        let result = tasks;
        
        if (searchTerm.trim()) {
          const lowerSearchTerm = searchTerm.toLowerCase();
          result = result.filter(task => 
            task.title.toLowerCase().includes(lowerSearchTerm) || 
            (task.description && task.description.toLowerCase().includes(lowerSearchTerm))
          );
        }
        
        // Apply other filters (these would normally go to the API)
        if (Object.keys(filter).length > 0) {
          // For client-side filtering, we'll filter the already filtered results by searchTerm
          if (filter.status) {
            result = result.filter(task => task.status === filter.status);
          }
          
          if (filter.priority) {
            result = result.filter(task => task.priority === filter.priority);
          }
          
          if (filter.type) {
            result = result.filter(task => task.type === filter.type);
          }
          
          if (filter.showDelayed) {
            const now = new Date();
            result = result.filter(task => {
              const dueDate = new Date(task.dueDate);
              return task.status === 'pending' && dueDate < now;
            });
          }
        }
        
        setFilteredTasks(result);
      } catch (error) {
        console.error('Error applying filters:', error);
      }
    };
    
    applyFilters();
  }, [tasks, filter, searchTerm]);

  // Handle task completion
  const handleMarkComplete = (task: Task) => {
    setSelectedTask(task);
    setCompletionDialogOpen(true);
  };

  // After successful task completion
  const handleCompletionSuccess = () => {
    // Refetch tasks
    fetchTasks();
    // Invalidate related queries if needed
    queryClient.invalidateQueries({
      queryKey: ['tasks', patientId]
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Care Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center p-6">
              <div className="animate-pulse text-muted-foreground">Loading tasks...</div>
            </div>
          ) : (
            <TaskTabContent
              filter={filter}
              onFilterChange={setFilter}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filteredTasks={filteredTasks}
              onMarkComplete={handleMarkComplete}
            />
          )}
        </CardContent>
      </Card>

      {/* Task completion dialog */}
      {selectedTask && (
        <TaskCompletionForm
          task={selectedTask}
          open={completionDialogOpen}
          onOpenChange={setCompletionDialogOpen}
          onSuccess={handleCompletionSuccess}
        />
      )}
    </div>
  );
};

export default PatientCareTasksTab;
