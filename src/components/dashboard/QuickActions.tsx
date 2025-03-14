
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Pill, Calendar, FileText, MessageSquare, Video, Users, ClipboardList, Activity, Droplet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

type QuickAction = {
  title: string;
  icon: React.ReactNode;
  link: string;
  color: string;
}

const QuickActions = () => {
  const { user } = useAuth();
  const { language } = useTranslation();

  const getRoleActions = (): QuickAction[] => {
    if (!user) return [];

    const doctorActions: QuickAction[] = [
      {
        title: language === 'pt' ? 'Nova Prescrição' : 'New Prescription',
        icon: <Pill className="h-5 w-5" />,
        link: '/prescribe', // Fixed: changed from '/prescribe-medication' to '/prescribe'
        color: 'bg-blue-100 text-blue-800'
      },
      {
        title: language === 'pt' ? 'Agendar Consulta' : 'Schedule Appointment',
        icon: <Calendar className="h-5 w-5" />,
        link: '/schedule', // Fixed: changed from '/schedule/new' to '/schedule'
        color: 'bg-green-100 text-green-800'
      },
      {
        title: language === 'pt' ? 'Nova Evolução' : 'New Progress Note',
        icon: <FileText className="h-5 w-5" />,
        link: '/records', // Fixed: changed from '/records/new' to '/records'
        color: 'bg-purple-100 text-purple-800'
      },
      {
        title: language === 'pt' ? 'Telemedicina' : 'Telemedicine',
        icon: <Video className="h-5 w-5" />,
        link: '/telemedicine',
        color: 'bg-indigo-100 text-indigo-800'
      }
    ];

    const nurseActions: QuickAction[] = [
      {
        title: language === 'pt' ? 'Registrar Sinais Vitais' : 'Record Vital Signs',
        icon: <Activity className="h-5 w-5" />,
        link: '/vitals', // Fixed: changed from '/vitals/new' to '/vitals'
        color: 'bg-red-100 text-red-800'
      },
      {
        title: language === 'pt' ? 'Balanço Hídrico' : 'Fluid Balance',
        icon: <Droplet className="h-5 w-5" />,
        link: '/fluid-balance', // Fixed: changed from '/fluid-balance/new' to '/fluid-balance'
        color: 'bg-blue-100 text-blue-800'
      },
      {
        title: language === 'pt' ? 'Administrar Medicação' : 'Administer Medication',
        icon: <Pill className="h-5 w-5" />,
        link: '/medications', // Fixed: kept as is, but removed query param
        color: 'bg-green-100 text-green-800'
      },
      {
        title: language === 'pt' ? 'Evolução de Enfermagem' : 'Nursing Note',
        icon: <FileText className="h-5 w-5" />,
        link: '/records', // Fixed: changed from '/records/new?type=nursing' to '/records'
        color: 'bg-purple-100 text-purple-800'
      }
    ];

    const adminActions: QuickAction[] = [
      {
        title: language === 'pt' ? 'Gerenciar Usuários' : 'Manage Users',
        icon: <Users className="h-5 w-5" />,
        link: '/settings', // Fixed: changed from '/admin/users' to '/settings'
        color: 'bg-blue-100 text-blue-800'
      },
      {
        title: language === 'pt' ? 'Relatórios' : 'Reports',
        icon: <ClipboardList className="h-5 w-5" />,
        link: '/dashboard', // Fixed: changed from '/admin/reports' to '/dashboard'
        color: 'bg-green-100 text-green-800'
      },
      {
        title: language === 'pt' ? 'Auditoria' : 'Audit Log',
        icon: <FileText className="h-5 w-5" />,
        link: '/settings', // Fixed: changed from '/admin/audit' to '/settings'
        color: 'bg-purple-100 text-purple-800'
      },
      {
        title: language === 'pt' ? 'Configurações' : 'Settings',
        icon: <Calendar className="h-5 w-5" />,
        link: '/settings',
        color: 'bg-indigo-100 text-indigo-800'
      }
    ];

    const patientActions: QuickAction[] = [
      {
        title: language === 'pt' ? 'Agendar Consulta' : 'Schedule Appointment',
        icon: <Calendar className="h-5 w-5" />,
        link: '/schedule', // Fixed: changed from '/schedule/new' to '/schedule'
        color: 'bg-blue-100 text-blue-800'
      },
      {
        title: language === 'pt' ? 'Mensagens' : 'Messages',
        icon: <MessageSquare className="h-5 w-5" />,
        link: '/messages',
        color: 'bg-green-100 text-green-800'
      },
      {
        title: language === 'pt' ? 'Meus Medicamentos' : 'My Medications',
        icon: <Pill className="h-5 w-5" />,
        link: '/medications',
        color: 'bg-purple-100 text-purple-800'
      },
      {
        title: language === 'pt' ? 'Meus Registros' : 'My Records',
        icon: <FileText className="h-5 w-5" />,
        link: '/records',
        color: 'bg-indigo-100 text-indigo-800'
      }
    ];

    switch (user.role) {
      case 'doctor':
        return doctorActions;
      case 'nurse':
        return nurseActions;
      case 'admin':
        return adminActions;
      case 'patient':
        return patientActions;
      default:
        return doctorActions.slice(0, 2);
    }
  };

  const actions = getRoleActions();
  
  if (actions.length === 0) return null;

  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-semibold mb-4">
        {language === 'pt' ? 'Ações Rápidas' : 'Quick Actions'}
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <Button 
            key={index} 
            variant="outline" 
            className={`h-auto py-4 flex flex-col items-center justify-center gap-2 ${action.color}`}
            asChild
          >
            <Link to={action.link}>
              {action.icon}
              <span className="text-sm font-medium">{action.title}</span>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
