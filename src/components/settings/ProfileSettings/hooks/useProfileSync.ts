
import { useEffect } from 'react';
import { supabase, logAuditEvent, logEnhancedAuditEvent } from '@/integrations/supabase/core';
import { useAuth } from '@/context/AuthContext';
import { ProfileData, ProfileFormData } from '../types';
import { format } from 'date-fns';

export function useProfileSync(
  setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>,
  setLastSynced: (time: string) => void
) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    // Enhanced HIPAA-compliant audit logging for profile data access
    const logProfileAccess = async () => {
      try {
        // Log using enhanced audit system for better HIPAA compliance
        await logEnhancedAuditEvent({
          userId: user.id,
          action: 'view',
          resourceType: 'profile',
          resourceId: user.id,
          patientId: user.role === 'patient' ? user.id : undefined,
          accessReason: 'profile_management',
          accessType: 'standard_access',
          details: {
            accessMethod: 'profile_component',
            applicationArea: 'user_settings'
          }
        });
      } catch (error) {
        // Fallback to standard audit logging if enhanced logging fails
        console.error('Error logging enhanced profile access:', error);
        try {
          await logAuditEvent(
            user.id,
            'view',
            'profile',
            user.id,
            { access_reason: 'profile_management' }
          );
        } catch (fallbackError) {
          console.error('Error with fallback logging profile access:', fallbackError);
          // Non-blocking error - we continue even if logging fails
        }
      }
    };
    
    logProfileAccess();
    
    // Set up subscription for real-time updates
    const profilesSubscription = supabase
      .channel('profiles-changes')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'profiles',
        filter: `id=eq.${user?.id}` 
      }, (payload) => {
        // Update local data when remote changes occur
        if (payload.new) {
          const profileData = payload.new as unknown as ProfileData;
          
          // Securely update the form data
          setFormData((current) => {
            const updatedData = {
              ...current,
              name: profileData.name || user?.name || current.name,
              email: profileData.email || user?.email || current.email,
              role: profileData.role || user?.role || current.role,
              department: profileData.department || current.department,
              phone: profileData.phone || current.phone,
              bio: profileData.bio || current.bio
            };
            
            // Enhanced audit logging for profile data sync
            try {
              logEnhancedAuditEvent({
                userId: user.id,
                action: 'sync',
                resourceType: 'profile',
                resourceId: user.id,
                accessReason: 'automatic_data_sync',
                accessType: 'system_sync',
                details: { 
                  profile_fields: Object.keys(updatedData),
                  sync_source: 'realtime_subscription',
                  sync_trigger: 'database_update'
                }
              }).catch(err => console.error('Error logging enhanced sync event:', err));
            } catch (error) {
              console.error('Error setting up enhanced sync audit:', error);
              
              // Fallback to standard audit logging
              logAuditEvent(
                user.id,
                'sync',
                'profile',
                user.id,
                { profile_fields: Object.keys(updatedData) }
              ).catch(err => console.error('Error logging sync event:', err));
            }
            
            return updatedData;
          });
          
          // Update last synced time
          setLastSynced(format(new Date(), 'PPpp'));
        }
      })
      .subscribe();
    
    return () => {
      // Clean up subscription
      supabase.removeChannel(profilesSubscription);
    };
  }, [user, setFormData, setLastSynced]);
}
