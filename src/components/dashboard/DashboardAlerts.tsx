
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { AlertTriangle, Info, Activity, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

type AlertItem = {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  time: string;
  link: string;
}

const DashboardAlerts = () => {
  const { user } = useAuth();
  const { language } = useTranslation();

  const getMockAlerts = (): AlertItem[] => {
    if (!user) return [];

    // Base alerts for all users
    const baseAlerts: AlertItem[] = [
      {
        id: '1',
        type: 'info',
        title: language === 'pt' ? 'Atualização do Sistema' : 'System Update',
        description: language === 'pt' 
          ? 'Atualização programada para hoje às 23:00'
          : 'Scheduled system update today at 11:00 PM',
        time: '2h ago',
        link: '/notifications'
      }
    ];

    // Role-specific alerts
    if (user.role === 'doctor') {
      return [
        {
          id: '2',
          type: 'critical',
          title: language === 'pt' ? 'Resultados Críticos' : 'Critical Results',
          description: language === 'pt'
            ? 'Resultados de laboratório críticos para paciente João Silva'
            : 'Critical lab results for patient John Smith',
          time: '15m ago',
          link: '/patients/p123/records'
        },
        {
          id: '3',
          type: 'warning',
          title: language === 'pt' ? 'Prescrição Pendente' : 'Pending Prescription',
          description: language === 'pt'
            ? '3 prescrições aguardando sua aprovação'
            : '3 prescriptions awaiting your approval',
          time: '1h ago',
          link: '/prescriptions?status=pending'
        },
        ...baseAlerts
      ];
    }

    if (user.role === 'nurse') {
      return [
        {
          id: '4',
          type: 'warning',
          title: language === 'pt' ? 'Medicações Atrasadas' : 'Overdue Medications',
          description: language === 'pt'
            ? '4 medicações atrasadas para administração'
            : '4 medications overdue for administration',
          time: '30m ago',
          link: '/medications?status=overdue'
        },
        {
          id: '5',
          type: 'info',
          title: language === 'pt' ? 'Coleta de Sinais Vitais' : 'Vital Signs Collection',
          description: language === 'pt'
            ? 'Lembrete para coleta de sinais vitais às 14:00'
            : 'Reminder for vital signs collection at 2:00 PM',
          time: '45m ago',
          link: '/vitals'
        },
        ...baseAlerts
      ];
    }

    return baseAlerts;
  };

  const alerts = getMockAlerts();
  
  if (alerts.length === 0) return null;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Bell className="h-5 w-5" />
          {language === 'pt' ? 'Alertas' : 'Alerts'}
        </h2>
        <Link 
          to="/notifications" 
          className="text-sm text-primary hover:underline"
        >
          {language === 'pt' ? 'Ver todos' : 'View all'}
        </Link>
      </div>
      
      <div className="space-y-3">
        {alerts.map((alert) => (
          <Link to={alert.link} key={alert.id}>
            <div className={cn(
              "p-4 rounded-md flex items-start gap-3 hover:bg-accent/50 transition-colors",
              alert.type === 'critical' && "bg-red-50 text-red-800",
              alert.type === 'warning' && "bg-amber-50 text-amber-800",
              alert.type === 'info' && "bg-blue-50 text-blue-800"
            )}>
              <div className="mt-0.5">
                {alert.type === 'critical' && <AlertTriangle className="h-5 w-5" />}
                {alert.type === 'warning' && <Activity className="h-5 w-5" />}
                {alert.type === 'info' && <Info className="h-5 w-5" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium">{alert.title}</h3>
                  <span className="text-xs">{alert.time}</span>
                </div>
                <p className="text-sm mt-1">{alert.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardAlerts;
