
import React from 'react';
import { Task } from './card/TaskCardTypes';
import TaskDateGroup from './components/TaskDateGroup';
import EmptyTaskState from './components/EmptyTaskState';
import { groupTasksByDate } from './utils/taskGrouping';

interface TaskListProps {
  tasks: Task[];
  onMarkComplete?: (task: Task) => void;
  showCompletionInfo?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onMarkComplete,
  showCompletionInfo = false
}) => {
  if (tasks.length === 0) {
    return <EmptyTaskState />;
  }

  // Group and sort tasks by date
  const { groupedTasks, sortedDates } = groupTasksByDate(tasks);

  return (
    <div className="space-y-6">
      {sortedDates.map(date => (
        <TaskDateGroup
          key={date}
          date={date}
          tasks={groupedTasks[date]}
          onMarkComplete={onMarkComplete}
          showCompletionInfo={showCompletionInfo}
        />
      ))}
    </div>
  );
};

export default TaskList;
