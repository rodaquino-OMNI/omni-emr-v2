
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SecurityControlItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action: React.ReactNode;
}

const SecurityControlItem: React.FC<SecurityControlItemProps> = ({
  icon: Icon,
  title,
  description,
  action
}) => {
  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div className="flex items-start gap-4">
        <div className="bg-primary/10 p-2 rounded-full">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div>
        {action}
      </div>
    </div>
  );
};

export default SecurityControlItem;
