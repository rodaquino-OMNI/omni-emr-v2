import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskTabContent from './TaskTabContent';
import { Task } from './card/TaskCardTypes';
import { TaskFilter } from '@/services/tasks';

interface TaskTabsProps {
  activeTab: 'all' | 'delayed' | 'completed';
  setActiveTab: (tab: 'all' | 'delayed' | 'completed') => void;
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filteredTasks: Task[];
  onMarkComplete: (task: Task) => void;
}

const TaskTabs: React.FC<TaskTabsProps> = ({
  activeTab,
  setActiveTab,
  filter,
  onFilterChange,
  searchTerm,
  onSearchChange,
  filteredTasks,
  onMarkComplete
}) => {
  const { t } = useTranslation();
  
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={(value: string) => setActiveTab(value as 'all' | 'delayed' | 'completed')}
    >
      <TabsList className="grid w-full max-w-md grid-cols-3">
        <TabsTrigger value="all">{t('allTasks')}</TabsTrigger>
        <TabsTrigger value="delayed">{t('delayed')}</TabsTrigger>
        <TabsTrigger value="completed">{t('completed')}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        <TaskTabContent
          filter={filter}
          onFilterChange={onFilterChange}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          filteredTasks={filteredTasks}
          onMarkComplete={onMarkComplete}
        />
      </TabsContent>
      
      <TabsContent value="delayed">
        <TaskTabContent
          filter={filter}
          onFilterChange={onFilterChange}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          filteredTasks={filteredTasks}
          onMarkComplete={onMarkComplete}
        />
      </TabsContent>
      
      <TabsContent value="completed">
        <TaskTabContent
          filter={filter}
          onFilterChange={onFilterChange}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          filteredTasks={filteredTasks}
          showCompletionInfo={true}
        />
      </TabsContent>
    </Tabs>
  );
};

export default TaskTabs;
