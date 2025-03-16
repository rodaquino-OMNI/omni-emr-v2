
import React, { ReactNode } from 'react';

export interface SecurityControlItemProps {
  icon: ReactNode;
  title: string;
  description: string;
  action: ReactNode;
  enabled?: boolean;
}

const SecurityControlItem: React.FC<SecurityControlItemProps> = ({
  icon,
  title,
  description,
  action,
  enabled
}) => {
  return (
    <div className="flex items-start justify-between py-4 border-b border-border">
      <div className="flex gap-4">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <div className="space-y-1">
          <div className="flex items-center">
            <h3 className="font-medium">{title}</h3>
            {enabled !== undefined && (
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {enabled ? 'Enabled' : 'Disabled'}
              </span>
            )}
          </div>
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
