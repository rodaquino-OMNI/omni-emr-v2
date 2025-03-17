
import React from 'react';
import { ClipboardCheck } from 'lucide-react';

const EmptyTaskState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <ClipboardCheck className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">No tasks found</h3>
      <p className="text-sm text-muted-foreground mt-1">
        There are no tasks matching your current filters.
      </p>
    </div>
  );
};

export default EmptyTaskState;
