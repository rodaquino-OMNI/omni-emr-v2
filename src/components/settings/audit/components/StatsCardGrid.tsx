
import React from 'react';
import { User, ShieldAlert, FileText } from 'lucide-react';
import StatCard from './StatCard';

const StatsCardGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Successful Logins" 
        value={142} 
        icon={User}
        className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
        iconContainerClassName="bg-green-100 dark:bg-green-800/50"
        iconClassName="text-green-600 dark:text-green-400"
      />
      
      <StatCard 
        title="Failed Attempts" 
        value={17} 
        icon={ShieldAlert}
        className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
        iconContainerClassName="bg-red-100 dark:bg-red-800/50"
        iconClassName="text-red-600 dark:text-red-400"
      />
      
      <StatCard 
        title="Data Access Events" 
        value={89} 
        icon={FileText}
        className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
        iconContainerClassName="bg-blue-100 dark:bg-blue-800/50"
        iconClassName="text-blue-600 dark:text-blue-400"
      />
      
      <StatCard 
        title="Critical Actions" 
        value={36} 
        icon={ShieldAlert}
        className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
        iconContainerClassName="bg-amber-100 dark:bg-amber-800/50"
        iconClassName="text-amber-600 dark:text-amber-400"
      />
    </div>
  );
};

export default StatsCardGrid;
