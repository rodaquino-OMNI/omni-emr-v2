
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import SidebarItem from '../SidebarItem';
import { useTranslation } from '@/hooks/useTranslation';
import { Stethoscope, BookUser, FileHeart, FlaskConical, ClipboardCheck, Droplet, Pill, Activity, Calendar, FileText, Video, Users, MessageSquare, ClipboardList } from 'lucide-react';

// Define the quick actions mapping for different roles
const quickActionsMap = {
  // Doctor quick actions
  doctor: [
    {
      name: 'New Consultation',
      path: '/schedule',
      icon: Calendar,
      translationKey: 'newConsultation',
      priority: 0
    },
    {
      name: 'Visit Notes',
      path: '/visit-notes',
      icon: ClipboardCheck,
      translationKey: 'visitNotes',
      priority: 0
    },
    {
      name: 'Patient Records',
      path: '/records',
      icon: BookUser,
      translationKey: 'patientRecords',
      priority: 0
    },
    {
      name: 'New Prescription',
      path: '/prescribe',
      icon: FileHeart,
      translationKey: 'newPrescription',
      priority: 0
    }
  ],
  
  // Nurse quick actions
  nurse: [
    {
      name: 'Medication Administration',
      path: '/medications',
      icon: Pill,
      translationKey: 'medicationAdministration',
      priority: 0
    },
    {
      name: 'Fluid Balance',
      path: '/fluid-balance',
      icon: Droplet,
      translationKey: 'fluidBalance',
      priority: 0
    },
    {
      name: 'Visit Notes',
      path: '/visit-notes',
      icon: ClipboardCheck,
      translationKey: 'visitNotes',
      priority: 0
    },
    {
      name: 'Vital Signs',
      path: '/vitals',
      icon: Activity,
      translationKey: 'vitals',
      priority: 0
    }
  ],
  
  // Administrative staff quick actions
  administrative: [
    {
      name: 'Schedule Appointment',
      path: '/schedule',
      icon: Calendar,
      translationKey: 'scheduleAppointment',
      priority: 0
    },
    {
      name: 'Manage Patients',
      path: '/patients',
      icon: Users,
      translationKey: 'managePatients',
      priority: 0
    },
    {
      name: 'Visit Notes',
      path: '/visit-notes',
      icon: ClipboardCheck,
      translationKey: 'visitNotes',
      priority: 0
    },
    {
      name: 'Patient Records',
      path: '/records',
      icon: FileText,
      translationKey: 'patientRecords',
      priority: 0
    }
  ],
  
  // Lab technician quick actions
  lab_technician: [
    {
      name: 'Lab Orders',
      path: '/orders',
      icon: FlaskConical,
      translationKey: 'labOrders',
      priority: 0
    },
    {
      name: 'Patient Records',
      path: '/records',
      icon: FileText,
      translationKey: 'patientRecords',
      priority: 0
    }
  ],
  
  // Pharmacist quick actions
  pharmacist: [
    {
      name: 'Verify Prescriptions',
      path: '/prescriptions',
      icon: ClipboardList,
      translationKey: 'verifyPrescriptions',
      priority: 0
    },
    {
      name: 'Medication Records',
      path: '/medications',
      icon: Pill,
      translationKey: 'medicationRecords',
      priority: 0
    }
  ],
  
  // Patient quick actions
  patient: [
    {
      name: 'My Appointments',
      path: '/schedule',
      icon: Calendar,
      translationKey: 'myAppointments',
      priority: 0
    },
    {
      name: 'My Medications',
      path: '/medications',
      icon: Pill,
      translationKey: 'myMedications',
      priority: 0
    },
    {
      name: 'My Records',
      path: '/records',
      icon: FileText,
      translationKey: 'myRecords',
      priority: 0
    },
    {
      name: 'Messages',
      path: '/messages',
      icon: MessageSquare,
      translationKey: 'messages',
      priority: 0
    }
  ]
};

interface QuickActionsProps {
  onItemClick?: () => void;
}

const QuickActions = ({ onItemClick }: QuickActionsProps) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  // Get quick actions for current user role
  const getUserQuickActions = () => {
    if (!user) return [];
    
    return quickActionsMap[user.role as keyof typeof quickActionsMap] || [];
  };
  
  // Get appropriate quick actions based on user role
  const roleSpecificQuickActions = getUserQuickActions();
  
  // Don't render section if no quick actions
  if (!user || roleSpecificQuickActions.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-4">
      <div className="px-3 py-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {t('quickActions')}
        </h3>
      </div>
      {roleSpecificQuickActions.map((action) => (
        <SidebarItem
          key={action.path}
          item={action}
          onClick={onItemClick}
        />
      ))}
    </div>
  );
};

export default QuickActions;
