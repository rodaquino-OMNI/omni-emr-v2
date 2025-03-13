
import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Users, Calendar, ClipboardList, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import PatientList from '../patients/PatientList';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../ui/button';

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
  linkTo: string;
};

const StatCard = ({ title, value, icon, trend, className, linkTo }: StatCardProps) => {
  const { language } = useTranslation();
  
  return (
    <Link to={linkTo} className="block">
      <div className={cn("glass-card p-6 hover:shadow-md transition-shadow", className)}>
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
    </Link>
  );
};

const Dashboard = ({ className }: DashboardProps) => {
  const { language } = useTranslation();
  
  // Sample data with translations
  const stats = [
    { 
      title: language === 'pt' ? "Total de Pacientes" : "Total Patients", 
      value: 248, 
      icon: <Users className="h-5 w-5" />,
      trend: { 
        value: language === 'pt' ? "3.2% do último mês" : "3.2% from last month", 
        positive: true 
      },
      linkTo: "/patients"
    },
    { 
      title: language === 'pt' ? "Pacientes no Hospital" : "Hospital Patients", 
      value: 86, 
      icon: <Activity className="h-5 w-5" />,
      trend: { 
        value: language === 'pt' ? "2.1% da última semana" : "2.1% from last week", 
        positive: false 
      },
      linkTo: "/patients?status=hospital"
    },
    { 
      title: language === 'pt' ? "Pacientes em Casa" : "Home Care Patients", 
      value: 162, 
      icon: <ClipboardList className="h-5 w-5" />,
      trend: { 
        value: language === 'pt' ? "5.3% do último mês" : "5.3% from last month", 
        positive: true 
      },
      linkTo: "/patients?status=home"
    },
    { 
      title: language === 'pt' ? "Agendados Hoje" : "Scheduled Today", 
      value: 24, 
      icon: <Calendar className="h-5 w-5" />,
      linkTo: "/schedule"
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
            linkTo={stat.linkTo}
          />
        ))}
      </div>
      
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {language === 'pt' ? 'Pacientes Recentes' : 'Recent Patients'}
          </h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/patients" className="flex items-center gap-1">
              {language === 'pt' ? 'Ver todos' : 'View all'}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <PatientList limit={5} showViewAll />
      </div>
    </div>
  );
};

export default Dashboard;
