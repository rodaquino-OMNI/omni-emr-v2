
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';
;
;
import { Task } from '@/components/tasks/card/TaskCardTypes';
import TaskCompletionForm from '@/components/tasks/TaskCompletionForm';
import { 
  filterTasks, 
  TaskFilter,
  getTaskCompletionStats
} from '@/services/tasks';
import TaskPageHeader from '@/components/tasks/TaskPageHeader';
import TaskTabs from '@/components/tasks/TaskTabs';

const TasksPage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // State for filters
  const [filter, setFilter] = useState<TaskFilter>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'delayed' | 'completed'>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCompletionDialogOpen, setIsCompletionDialogOpen] = useState(false);
  
  // Update the filter when the tab changes
  useEffect(() => {
    if (activeTab === 'delayed') {
      setFilter(prev => ({ ...prev, showDelayed: true, status: 'pending' }));
    } else if (activeTab === 'completed') {
      setFilter(prev => ({ ...prev, status: 'completed' }));
    } else {
      setFilter(prev => {
        const { showDelayed, ...rest } = prev;
        return rest;
      });
    }
  }, [activeTab]);
  
  // Fetch tasks with filters
  const { data: tasks = [], isLoading, refetch } = useQuery({
    queryKey: ['tasks', filter],
    queryFn: () => filterTasks(filter),
  });

  // Fetch task completion statistics
  const { data: stats } = useQuery({
    queryKey: ['taskStats'],
    queryFn: getTaskCompletionStats,
  });
  
  // Handle filter changes
  const handleFilterChange = (newFilter: TaskFilter) => {
    setFilter(newFilter);
    // If showDelayed changes, update the tab accordingly
    if (newFilter.showDelayed) {
      setActiveTab('delayed');
    } else if (activeTab === 'delayed' && !newFilter.showDelayed) {
      setActiveTab('all');
    }
  };
  
  // Handle search changes
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };
  
  // Filter tasks by search term
  const filteredTasks = tasks.filter(task => {
    if (!searchTerm.trim()) return true;
    const search = searchTerm.toLowerCase();
    return (
      task.title.toLowerCase().includes(search) ||
      task.patientName.toLowerCase().includes(search) ||
      task.sector.toLowerCase().includes(search)
    );
  });
  
  // Handle mark as complete
  const handleMarkComplete = (task: Task) => {
    setSelectedTask(task);
    setIsCompletionDialogOpen(true);
  };
  
  // Handle completion success
  const handleCompletionSuccess = () => {
    refetch();
  };
  
  return (
    <div className="max-w-6xl mx-auto w-full">
          <div className="max-w-6xl mx-auto w-full">
            <TaskPageHeader stats={stats} />
            
            <div className="space-y-6">
              <TaskTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                filter={filter}
                onFilterChange={handleFilterChange}
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                filteredTasks={filteredTasks}
                onMarkComplete={handleMarkComplete}
              />
            
          </div>
        </main>
      </div>
      
      {/* Task Completion Dialog */}
      {selectedTask && (
        <TaskCompletionForm
          task={selectedTask}
          open={isCompletionDialogOpen}
          onOpenChange={setIsCompletionDialogOpen}
          onSuccess={handleCompletionSuccess}
        />
      )}
    </div>
  );
};

export default TasksPage;
