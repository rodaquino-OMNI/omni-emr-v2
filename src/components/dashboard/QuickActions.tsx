
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useTranslation } from '@/hooks/useTranslation';
import { Pill, Calendar, FileText, MessageSquare, Video, Users, ClipboardList, Activity, Droplet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

type QuickAction = {
  title: string;
  icon: React.ReactNode;
  link: string;
  color: string;
  permissionRequired?: string;
}

const QuickActions = () => {
  const { user } = useAuth();
  const { language } = useTranslation();
  const { t } = useTranslation();
  const permissions = usePermissions(user);

  const allActions: QuickAction[] = [
    // Clinical actions
    {
      title: language === 'pt' ? 'Nova Prescrição' : 'New Prescription',
      icon: <Pill className="h-5 w-5" />,
      link: '/prescribe',
      color: 'bg-blue-100 text-blue-800',
      permissionRequired: 'prescribe_medications'
    },
    {
      title: language === 'pt' ? 'Agendar Consulta' : 'Schedule Appointment',
      icon: <Calendar className="h-5 w-5" />,
      link: '/schedule',
      color: 'bg-green-100 text-green-800',
      permissionRequired: 'schedule_appointments'
    },
    {
      title: language === 'pt' ? 'Nova Evolução' : 'New Progress Note',
      icon: <FileText className="h-5 w-5" />,
      link: '/records',
      color: 'bg-purple-100 text-purple-800',
      permissionRequired: 'create_clinical_notes'
    },
    {
      title: language === 'pt' ? 'Telemedicina' : 'Telemedicine',
      icon: <Video className="h-5 w-5" />,
      link: '/telemedicine',
      color: 'bg-indigo-100 text-indigo-800',
      permissionRequired: 'telemedicine'
    },
    // Nursing actions
    {
      title: language === 'pt' ? 'Registrar Sinais Vitais' : 'Record Vital Signs',
      icon: <Activity className="h-5 w-5" />,
      link: '/vitals',
      color: 'bg-red-100 text-red-800',
      permissionRequired: 'document_vital_signs'
    },
    {
      title: language === 'pt' ? 'Balanço Hídrico' : 'Fluid Balance',
      icon: <Droplet className="h-5 w-5" />,
      link: '/fluid-balance',
      color: 'bg-blue-100 text-blue-800',
      permissionRequired: 'manage_fluid_balance'
    },
    {
      title: language === 'pt' ? 'Administrar Medicação' : 'Administer Medication',
      icon: <Pill className="h-5 w-5" />,
      link: '/medications',
      color: 'bg-green-100 text-green-800',
      permissionRequired: 'administer_medications'
    },
    // Administrative actions
    {
      title: language === 'pt' ? 'Gerenciar Usuários' : 'Manage Users',
      icon: <Users className="h-5 w-5" />,
      link: '/settings',
      color: 'bg-blue-100 text-blue-800',
      permissionRequired: 'all'
    },
    {
      title: language === 'pt' ? 'Relatórios' : 'Reports',
      icon: <ClipboardList className="h-5 w-5" />,
      link: '/dashboard',
      color: 'bg-green-100 text-green-800',
      permissionRequired: 'view_analytics'
    },
    // Patient actions
    {
      title: language === 'pt' ? 'Minhas Mensagens' : 'My Messages',
      icon: <MessageSquare className="h-5 w-5" />,
      link: '/messages',
      color: 'bg-green-100 text-green-800',
      permissionRequired: 'message_care_team'
    },
    {
      title: language === 'pt' ? 'Meus Medicamentos' : 'My Medications',
      icon: <Pill className="h-5 w-5" />,
      link: '/medications',
      color: 'bg-purple-100 text-purple-800',
      permissionRequired: 'view_own_medications'
    },
    {
      title: language === 'pt' ? 'Meus Registros' : 'My Records',
      icon: <FileText className="h-5 w-5" />,
      link: '/records',
      color: 'bg-indigo-100 text-indigo-800',
      permissionRequired: 'view_own_records'
    }
  ];

  // Filter actions based on user permissions
  const filteredActions = allActions.filter(action => {
    if (!action.permissionRequired) return true;
    return permissions.hasPermission(action.permissionRequired);
  });
  
  // Limit to 4 most relevant actions
  const displayActions = filteredActions.slice(0, 4);
  
  if (displayActions.length === 0) return null;

  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-semibold mb-4">
        {language === 'pt' ? 'Ações Rápidas' : 'Quick Actions'}
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayActions.map((action, index) => (
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
