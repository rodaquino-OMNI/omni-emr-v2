
import React from 'react';
import { Pill, FileText, Stethoscope, UserRound } from 'lucide-react';
import { TaskType } from './TaskCardTypes';

interface TaskIconProps {
  type: TaskType;
  className?: string;
}

const TaskIcon: React.FC<TaskIconProps> = ({ type, className }) => {
  const getTaskIcon = () => {
    switch (type) {
      case 'medication':
        return <Pill className="h-5 w-5" />;
      case 'examination':
        return <FileText className="h-5 w-5" />;
      case 'consultation':
        return <Stethoscope className="h-5 w-5" />;
      case 'procedure':
        return <Stethoscope className="h-5 w-5" />;
      case 'followup':
        return <UserRound className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className={className}>
      {getTaskIcon()}
    </div>
  );
};

export default TaskIcon;
