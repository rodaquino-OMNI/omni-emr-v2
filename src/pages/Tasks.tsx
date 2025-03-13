
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import TaskList from '@/components/tasks/TaskList';
import TaskFilters from '@/components/tasks/TaskFilters';
import { Task } from '@/components/tasks/TaskCard';
import TaskCompletionForm from '@/components/tasks/TaskCompletionForm';
import { 
  filterTasks, 
  TaskFilter,
  updateTaskStatus,
  completeTask,
  getTaskCompletionStats
} from '@/services/taskService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-6xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-semibold">{t('tasks')}</h1>
              
              {stats && (
                <div className="flex flex-wrap gap-3">
                  <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                    {t('total')}: {stats.total}
                  </div>
                  <div className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                    {t('completed')}: {stats.completed}
                  </div>
                  <div className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm">
                    {t('pending')}: {stats.pending}
                  </div>
                  <div className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm">
                    {t('delayed')}: {stats.delayed}
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as 'all' | 'delayed' | 'completed')}>
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="all">{t('allTasks')}</TabsTrigger>
                  <TabsTrigger value="delayed">{t('delayed')}</TabsTrigger>
                  <TabsTrigger value="completed">{t('completed')}</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                  <div className="space-y-4">
                    <TaskFilters 
                      filter={filter} 
                      onFilterChange={handleFilterChange}
                      searchTerm={searchTerm}
                      onSearchChange={handleSearchChange}
                    />
                    
                    <div className="glass-card p-6">
                      <TaskList 
                        tasks={filteredTasks} 
                        onMarkComplete={handleMarkComplete} 
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="delayed">
                  <div className="space-y-4">
                    <TaskFilters 
                      filter={filter} 
                      onFilterChange={handleFilterChange}
                      searchTerm={searchTerm}
                      onSearchChange={handleSearchChange}
                    />
                    
                    <div className="glass-card p-6">
                      <TaskList 
                        tasks={filteredTasks} 
                        onMarkComplete={handleMarkComplete} 
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="completed">
                  <div className="space-y-4">
                    <TaskFilters 
                      filter={filter} 
                      onFilterChange={handleFilterChange}
                      searchTerm={searchTerm}
                      onSearchChange={handleSearchChange}
                    />
                    
                    <div className="glass-card p-6">
                      <TaskList 
                        tasks={filteredTasks} 
                        showCompletionInfo={true}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
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
