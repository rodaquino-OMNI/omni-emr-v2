
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface TaskFooterProps {
  patientId: string;
}

const TaskFooter: React.FC<TaskFooterProps> = ({ patientId }) => {
  return (
    <div className="flex justify-between border-t pt-4 mt-4">
      <Button variant="ghost" size="sm" className="gap-1" asChild>
        <Link to="/tasks">
          <ArrowLeft className="h-4 w-4" />
          Back to Tasks
        </Link>
      </Button>
      
      <Button variant="ghost" size="sm" className="gap-1" asChild>
        <Link to={`/patients/${patientId}`}>
          View Patient
        </Link>
      </Button>
    </div>
  );
};

export default TaskFooter;
