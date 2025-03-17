
import React from 'react';
import { Task } from './TaskCardTypes';
import { Badge } from '@/components/ui/badge';

interface TaskHeaderProps {
  task: Task;
  isDelayed: boolean;
}

const TaskHeader: React.FC<TaskHeaderProps> = ({ task, isDelayed }) => {
  // Determine priority badge color
  const getPriorityBadge = () => {
    switch (task.priority) {
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
      case 'high':
        return <Badge variant="destructive" className="bg-orange-500">High</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-yellow-500 text-black">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return null;
    }
  };

  // Determine status badge
  const getStatusBadge = () => {
    switch (task.status) {
      case 'completed':
        return <Badge variant="outline" className="border-green-500 text-green-500">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="border-gray-500 text-gray-500">Cancelled</Badge>;
      case 'pending':
        return isDelayed 
          ? <Badge variant="destructive">Delayed</Badge>
          : null;
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-between items-start">
      <h3 className="font-medium">{task.title}</h3>
      <div className="flex gap-2">
        {getStatusBadge()}
        {getPriorityBadge()}
      </div>
    </div>
  );
};

export default TaskHeader;
