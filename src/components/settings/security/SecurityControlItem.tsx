
import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface SecurityControlItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

const SecurityControlItem: React.FC<SecurityControlItemProps> = ({
  icon: Icon,
  title,
  description,
  action
}) => {
  return (
    <div className="flex flex-wrap justify-between gap-4 items-center py-3 border-b border-border last:border-0 last:pb-0">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary/10 rounded-md text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-sm font-medium">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="ml-auto">{action}</div>
    </div>
  );
};

export default SecurityControlItem;
