
import React from 'react';

interface SecurityControlItemProps {
  title: string;
  description: string;
  enabled?: boolean;
  onChange?: () => void;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

const SecurityControlItem = ({ 
  title, 
  description, 
  enabled, 
  onChange, 
  icon, 
  action 
}: SecurityControlItemProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-start gap-3">
        {icon && <div className="mt-0.5 text-muted-foreground">{icon}</div>}
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      
      {onChange ? (
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer"
            checked={enabled}
            onChange={onChange}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      ) : action}
    </div>
  );
};

export default SecurityControlItem;
