
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  className?: string;
  iconContainerClassName?: string;
  iconClassName?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  className = "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
  iconContainerClassName = "bg-blue-100 dark:bg-blue-800/50",
  iconClassName = "text-blue-600 dark:text-blue-400"
}) => {
  return (
    <Card className={className}>
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-blue-800 dark:text-blue-300">{title}</p>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">{value}</p>
        </div>
        <div className={`h-10 w-10 rounded-full ${iconContainerClassName} flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${iconClassName}`} />
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
