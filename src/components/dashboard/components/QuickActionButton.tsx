
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import type { QuickAction } from '../types/quickActionTypes';

interface QuickActionButtonProps {
  action: QuickAction;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ action }) => {
  return (
    <Button 
      variant="outline" 
      className={`h-auto py-4 flex flex-col items-center justify-center gap-2 ${action.color}`}
      asChild
    >
      <Link to={action.link}>
        {action.icon}
        <span className="text-sm font-medium">{action.title}</span>
      </Link>
    </Button>
  );
};

export default QuickActionButton;
