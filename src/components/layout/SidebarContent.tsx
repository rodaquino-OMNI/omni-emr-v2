
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import SidebarItem from './SidebarItem';
import SidebarUserProfile from './SidebarUserProfile';
import SidebarLogo from './SidebarLogo';
import SidebarSectorSelector from './SidebarSectorSelector';
import { Home, Users, Calendar, FileText, Package2, Settings, HelpCircle, Droplet } from 'lucide-react';

interface SidebarContentProps {
  onItemClick?: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ onItemClick }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const role = user?.role || 'unauthenticated';
  
  // Define navigation items for each role
  const getNavigationItems = () => {
    // Common navigation items for all authenticated users
    const commonItems = [
      {
        label: t('dashboard', 'Dashboard'),
        icon: Home,
        to: '/dashboard'
      }
    ];
    
    // Role-specific navigation items
    switch(role) {
      case 'doctor':
      case 'physician':
        return [
          ...commonItems,
          {
            label: t('patients', 'Patients'),
            icon: Users,
            to: '/patients'
          },
          {
            label: t('schedule', 'Schedule'),
            icon: Calendar,
            to: '/schedule'
          },
          {
            label: t('clinicalDocumentation', 'Documentation'),
            icon: FileText,
            to: '/clinical-documentation'
          },
          {
            label: t('medications', 'Medications'),
            icon: Package2,
            to: '/medications'
          }
        ];
      case 'nurse':
        return [
          ...commonItems,
          {
            label: t('patients', 'Patients'),
            icon: Users,
            to: '/patients'
          },
          {
            label: t('tasks', 'Tasks'),
            icon: FileText,
            to: '/tasks'
          },
          {
            label: t('vitalSigns', 'Vital Signs'),
            icon: Home,
            to: '/vital-signs'
          },
          {
            label: t('medications', 'Medications'),
            icon: Package2,
            to: '/medications'
          },
          {
            label: t('medicationAdministration', 'Med Administration'),
            icon: Package2,
            to: '/medication-administration'
          },
          {
            label: t('clinicalDocumentation', 'Documentation'),
            icon: FileText,
            to: '/clinical-documentation'
          },
          {
            label: t('criticalResults', 'Critical Results'),
            icon: HelpCircle,
            to: '/critical-results'
          },
          {
            label: t('fluidBalance', 'Fluid Balance'),
            icon: Droplet,
            to: '/fluid-balance'
          },
          {
            label: t('appointments', 'Appointments'),
            icon: Calendar,
            to: '/appointments'
          },
          {
            label: t('schedule', 'Schedule'),
            icon: Calendar,
            to: '/schedule'
          }
        ];
      case 'admin':
        return [
          ...commonItems,
          {
            label: t('users', 'Users'),
            icon: Users,
            to: '/users'
          },
          {
            label: t('settings', 'Settings'),
            icon: Settings,
            to: '/settings'
          }
        ];
      default:
        return commonItems;
    }
  };
  
  // Footer navigation items (same for all users)
  const footerItems = [
    {
      label: t('settings', 'Settings'),
      icon: Settings,
      to: '/settings'
    },
    {
      label: t('help', 'Help & Support'),
      icon: HelpCircle,
      to: '/help'
    }
  ];
  
  // Check if user is a clinical role that needs sector selection
  const isClinicalRole = ['doctor', 'nurse', 'medical_staff'].includes(role);
  
  const navItems = getNavigationItems();
  
  return (
    <div className="flex h-full flex-col">
      <div className="px-3 py-2">
        <SidebarLogo />
      </div>
      
      {/* Profile information */}
      <div className="px-3 py-2">
        {user && <SidebarUserProfile user={user} onItemClick={onItemClick} />}
      </div>
      
      {/* Sector Selector for clinical roles */}
      {isClinicalRole && <SidebarSectorSelector />}
      
      {/* Navigation Items */}
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-2 text-sm font-medium gap-1">
          {navItems.map((item, index) => (
            <SidebarItem 
              key={index}
              label={item.label}
              icon={item.icon}
              to={item.to}
              onClick={onItemClick}
            />
          ))}
        </nav>
      </div>
      
      {/* Footer Items */}
      <div className="mt-auto border-t border-sidebar-border bg-muted/40 pt-2">
        <div className="grid items-start px-2 py-2 text-sm font-medium gap-1">
          {footerItems.map((item, index) => (
            <SidebarItem 
              key={index} 
              label={item.label} 
              icon={item.icon} 
              to={item.to}
              onClick={onItemClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarContent;
