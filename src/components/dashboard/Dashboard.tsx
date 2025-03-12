
import React from 'react';
import { Activity, Users, Calendar, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';
import PatientList from '../patients/PatientList';

type DashboardProps = {
  className?: string;
};

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
};

const StatCard = ({ title, value, icon, trend, className }: StatCardProps) => (
  <div className={cn("glass-card p-6", className)}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-semibold mt-1">{value}</h3>
        {trend && (
          <p className={cn(
            "text-xs mt-1 flex items-center",
            trend.positive ? "text-medical-green" : "text-medical-red"
          )}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </p>
        )}
      </div>
      <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
        {icon}
      </div>
    </div>
  </div>
);

const Dashboard = ({ className }: DashboardProps) => {
  // Sample data
  const stats = [
    { 
      title: "Total Patients", 
      value: 248, 
      icon: <Users className="h-5 w-5" />,
      trend: { value: "3.2% from last month", positive: true }
    },
    { 
      title: "Hospital Patients", 
      value: 86, 
      icon: <Activity className="h-5 w-5" />,
      trend: { value: "2.1% from last week", positive: false }
    },
    { 
      title: "Home Care Patients", 
      value: 162, 
      icon: <ClipboardList className="h-5 w-5" />,
      trend: { value: "5.3% from last month", positive: true }
    },
    { 
      title: "Scheduled Today", 
      value: 24, 
      icon: <Calendar className="h-5 w-5" /> 
    }
  ];

  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard 
            key={index} 
            title={stat.title} 
            value={stat.value} 
            icon={stat.icon} 
            trend={stat.trend}
          />
        ))}
      </div>
      
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Patients</h2>
        <PatientList limit={5} showViewAll />
      </div>
    </div>
  );
};

export default Dashboard;
