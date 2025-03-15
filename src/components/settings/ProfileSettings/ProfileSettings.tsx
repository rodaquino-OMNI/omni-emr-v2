
import React from 'react';
import ProfileSectionHeader from './ProfileSectionHeader';
import ProfileForm from './ProfileForm';
import ProfileLoadingState from './ProfileLoadingState';
import { useProfileData } from './useProfileData';
import RoleDashboardKPIs from '@/components/dashboard/RoleDashboardKPIs';
import DataSyncIndicator from './DataSyncIndicator';
import DatabaseActivityIndicator from './DatabaseActivityIndicator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Database, Shield } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const ProfileSettings = () => {
  const { 
    formData, 
    loading, 
    isFetching, 
    lastSynced, 
    syncError,
    updateProfile, 
    handleInputChange 
  } = useProfileData();
  const { language } = useTranslation();

  if (isFetching) {
    return <ProfileLoadingState />;
  }

  return (
    <div className="space-y-6">
      <Alert className="bg-gradient-to-r from-cyan-50/80 to-blue-50/80 border-cyan-200 dark:from-cyan-950/30 dark:to-blue-950/30 dark:border-cyan-800/50">
        <Database className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
        <AlertDescription className="text-cyan-800 dark:text-cyan-300">
          {language === 'pt' 
            ? 'Seus dados são automaticamente sincronizados com nosso banco de dados seguro.' 
            : 'Your data is automatically synchronized with our secure database.'}
        </AlertDescription>
      </Alert>
      
      <DataSyncIndicator 
        loading={loading} 
        lastSynced={lastSynced || undefined}
        hasError={!!syncError}
        errorMessage={syncError || undefined}
      />
      
      <div>
        <ProfileSectionHeader 
          title={language === 'pt' ? "Informações do Perfil" : "Profile Information"}
          description={language === 'pt' 
            ? "Atualize as informações do seu perfil e configurações da conta." 
            : "Update your account's profile information and settings."}
        />
        
        <ProfileForm 
          formData={formData}
          loading={loading}
          onSubmit={updateProfile}
          onInputChange={handleInputChange}
        />
      </div>
      
      <DatabaseActivityIndicator lastUpdated={lastSynced || undefined} />
      
      {/* Performance Metrics - Last Block */}
      <div className="mt-8 border-t border-border pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
          <h3 className="font-medium">
            {language === 'pt' ? "Estatísticas do Usuário" : "User Statistics"}
          </h3>
        </div>
        <RoleDashboardKPIs />
      </div>
    </div>
  );
};

export default ProfileSettings;
