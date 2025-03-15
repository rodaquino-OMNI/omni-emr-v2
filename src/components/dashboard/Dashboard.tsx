import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Users, Calendar, ClipboardList, ArrowRight, AlertTriangle, Pill, FileText, MessageSquare, Video, Droplet, ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import PatientList from '../patients/PatientList';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../ui/button';
import { useAuth } from '@/context/AuthContext';
import RoleDashboardKPIs from './RoleDashboardKPIs';
import DashboardAlerts from './DashboardAlerts';
import QuickActions from './QuickActions';

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
  const { user } = useAuth();
  
  const getStats = () => {
    const baseStats = [
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
    
    if (user?.role === 'nurse') {
      return [
        { 
          title: language === 'pt' ? "Medicamentos Pendentes" : "Medications Due", 
          value: 18, 
          icon: <Pill className="h-5 w-5" />,
          linkTo: "/medications?status=due",
          className: "border-green-200 bg-green-50", 
        },
        { 
          title: language === 'pt' ? "Balanço Hídrico Pendente" : "Fluid Balance Due", 
          value: 12, 
          icon: <Droplet className="h-5 w-5" />,
          linkTo: "/fluid-balance",
          className: "border-blue-200 bg-blue-50",
        },
        { 
          title: language === 'pt' ? "Notas de Visita" : "Visit Notes", 
          value: 7, 
          icon: <ClipboardCheck className="h-5 w-5" />,
          linkTo: "/visit-notes",
          className: "border-amber-200 bg-amber-50",
        },
        { 
          title: language === 'pt' ? "Avaliações Pendentes" : "Pending Assessments", 
          value: 9, 
          icon: <FileText className="h-5 w-5" />,
          linkTo: "/tasks?type=assessment",
          className: "border-purple-200 bg-purple-50",
        },
        ...baseStats
      ];
    }

    if (user?.role === 'doctor') {
      return [
        ...baseStats,
        { 
          title: language === 'pt' ? "Prescrições Pendentes" : "Pending Prescriptions", 
          value: 7, 
          icon: <Pill className="h-5 w-5" />,
          linkTo: "/prescriptions?status=pending"
        },
        { 
          title: language === 'pt' ? "Resultados Críticos" : "Critical Results", 
          value: 3, 
          icon: <AlertTriangle className="h-5 w-5" />,
          className: "border-red-200 bg-red-50",
          linkTo: "/records?status=critical"
        }
      ];
    }
    
    if (user?.role === 'nurse' && user.role !== 'nurse') {
      return [
        ...baseStats,
        { 
          title: language === 'pt' ? "Medicamentos Pendentes" : "Medications Due", 
          value: 18, 
          icon: <Pill className="h-5 w-5" />,
          linkTo: "/medications?status=due"
        },
        { 
          title: language === 'pt' ? "Avaliações Pendentes" : "Pending Assessments", 
          value: 9, 
          icon: <FileText className="h-5 w-5" />,
          linkTo: "/tasks?type=assessment"
        }
      ];
    }
    
    if (user?.role === 'admin') {
      return [
        ...baseStats,
        { 
          title: language === 'pt' ? "Ocupação de Leitos" : "Bed Occupancy", 
          value: "78%", 
          icon: <Activity className="h-5 w-5" />,
          trend: { 
            value: language === 'pt' ? "4.5% da última semana" : "4.5% from last week", 
            positive: true 
          },
          linkTo: "/admin/resources"
        },
        { 
          title: language === 'pt' ? "Alocação de Pessoal" : "Staff Allocation", 
          value: "92%", 
          icon: <Users className="h-5 w-5" />,
          linkTo: "/admin/staff"
        }
      ];
    }

    return baseStats;
  };

  const stats = getStats();

  return (
    <div className={cn("space-y-6", className)}>
      {user?.role === 'nurse' && <QuickActions />}
      {user?.role === 'doctor' && <QuickActions />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard 
            key={index} 
            title={stat.title} 
            value={stat.value} 
            icon={stat.icon} 
            trend={stat.trend}
            linkTo={stat.linkTo}
            className={stat.className}
          />
        ))}
      </div>
      <RoleDashboardKPIs />
      <DashboardAlerts />
      {user?.role !== 'doctor' && user?.role !== 'nurse' && <QuickActions />}
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
