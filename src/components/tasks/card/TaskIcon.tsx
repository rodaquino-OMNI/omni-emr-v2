
import React from 'react';
import { cn } from '@/lib/utils';
import { Pill, Stethoscope, Calendar, Scissors, ArrowRight } from 'lucide-react';

interface TaskIconProps {
  type: string;
  className?: string;
}

const TaskIcon: React.FC<TaskIconProps> = ({ type, className }) => {
  // Select icon based on task type
  const renderIcon = () => {
    switch (type) {
      case 'medication':
        return <Pill className="h-5 w-5" />;
      case 'examination':
        return <Stethoscope className="h-5 w-5" />;
      case 'consultation':
        return <Calendar className="h-5 w-5" />;
      case 'procedure':
        return <Scissors className="h-5 w-5" />;
      case 'followup':
        return <ArrowRight className="h-5 w-5" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };

  return (
    <div className={cn("flex-shrink-0 flex items-center justify-center", className)}>
      {renderIcon()}
    </div>
  );
};

export default TaskIcon;
