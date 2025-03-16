
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SecurityControls from './security/SecurityControls';
import SecurityAuditLog from './SecurityAuditLog';
import HipaaComplianceBanner from './security/HipaaComplianceBanner';
import ComplianceInformation from './security/ComplianceInformation';
import PasswordUpdateForm from './security/PasswordUpdateForm';
import MFASetup from './security/MFASetup';

const SecuritySettings = () => {
  const [showPasswordUpdateForm, setShowPasswordUpdateForm] = useState(false);
  const [showMFASetup, setShowMFASetup] = useState(false);
  
  const handleClosePasswordForm = () => {
    setShowPasswordUpdateForm(false);
  };
  
  const handleCloseMFASetup = () => {
    setShowMFASetup(false);
  };
  
  return (
    <div className="space-y-6">
      <HipaaComplianceBanner />
      
      {showPasswordUpdateForm && (
        <PasswordUpdateForm onClose={handleClosePasswordForm} />
      )}
      
      {showMFASetup && (
        <MFASetup onClose={handleCloseMFASetup} />
      )}
      
      <Tabs defaultValue="controls" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="controls">Security Controls</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="controls" className="space-y-4 py-4">
          <SecurityControls 
            onShowPasswordUpdate={() => setShowPasswordUpdateForm(true)}
            onShowMFASetup={() => setShowMFASetup(true)}
          />
        </TabsContent>
        
        <TabsContent value="audit" className="space-y-4 py-4">
          <SecurityAuditLog />
        </TabsContent>
        
        <TabsContent value="compliance" className="space-y-4 py-4">
          <ComplianceInformation />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecuritySettings;
