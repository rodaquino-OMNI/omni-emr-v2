
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useTranslation } from '../../hooks/useTranslation';
import SidebarLogo from './SidebarLogo';
import SidebarItem from './SidebarItem';
import SidebarUserProfile from './SidebarUserProfile';
import { sidebarItems } from '@/config/sidebarConfig';
import { Link } from 'react-router-dom';
import { Stethoscope, BookUser, FileHeart, FlaskConical, ClipboardCheck } from 'lucide-react';

interface SidebarContentProps {
  onItemClick?: () => void;
}

const SidebarContent = ({ onItemClick }: SidebarContentProps) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const permissions = usePermissions(user);
  
  // Create quick actions for doctors
  const doctorQuickActions = [
    {
      name: 'New Consultation',
      path: '/schedule',
      icon: Stethoscope,
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
    },
    {
      name: 'Lab Orders',
      path: '/orders',
      icon: FlaskConical,
      translationKey: 'labOrders',
      priority: 0
    }
  ];
  
  // Filter items based on user permissions and role
  let visibleItems = sidebarItems
    .filter(item => {
      // If user is not logged in, don't show any restricted items
      if (!user) return !item.permissionRequired;
      
      // If no permission required, show to everyone
      if (!item.permissionRequired) return true;
      
      // Check if user has the required permission
      return permissions.hasPermission(item.permissionRequired);
    })
    .sort((a, b) => a.priority - b.priority);
  
  // For doctor role, add quick actions at the top
  if (user?.role === 'doctor') {
    visibleItems = [...doctorQuickActions, ...visibleItems];
  }
  
  return (
    <>
      <SidebarLogo />
      
      <div className="px-3 space-y-1 flex-1 overflow-y-auto">
        {/* Doctor quick actions section */}
        {user?.role === 'doctor' && (
          <div className="mb-4">
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t('quickActions')}
              </h3>
            </div>
            {doctorQuickActions.map((action) => (
              <SidebarItem
                key={action.path}
                item={action}
                onClick={onItemClick}
              />
            ))}
          </div>
        )}
        
        {/* Regular menu items */}
        {visibleItems
          .filter(item => !doctorQuickActions.some(action => action.path === item.path))
          .map((item) => (
            <SidebarItem
              key={item.path}
              item={item}
              onClick={onItemClick}
            />
          ))}
      </div>
      
      <SidebarUserProfile user={user} onClick={onItemClick} />
    </>
  );
};

export default SidebarContent;
