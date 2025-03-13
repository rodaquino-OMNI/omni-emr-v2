
import React from 'react';
import { Task } from './TaskCard';
import TaskList from './TaskList';
import TaskFilters from './TaskFilters';
import { TaskFilter } from '@/services/taskService';

interface TaskTabContentProps {
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filteredTasks: Task[];
  onMarkComplete?: (task: Task) => void;
  showCompletionInfo?: boolean;
}

const TaskTabContent: React.FC<TaskTabContentProps> = ({
  filter,
  onFilterChange,
  searchTerm,
  onSearchChange,
  filteredTasks,
  onMarkComplete,
  showCompletionInfo = false
}) => {
  return (
    <div className="space-y-4">
      <TaskFilters 
        filter={filter} 
        onFilterChange={onFilterChange}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
      />
      
      <div className="glass-card p-6">
        <TaskList 
          tasks={filteredTasks} 
          onMarkComplete={onMarkComplete}
          showCompletionInfo={showCompletionInfo}
        />
      </div>
    </div>
  );
};

export default TaskTabContent;
