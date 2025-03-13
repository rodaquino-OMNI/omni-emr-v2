
import React from 'react';
import { Shield } from 'lucide-react';
import HipaaComplianceBanner from './security/HipaaComplianceBanner';
import PasswordUpdateForm from './security/PasswordUpdateForm';
import SecurityControls from './security/SecurityControls';
import ComplianceInformation from './security/ComplianceInformation';
import SecurityAuditLog from './SecurityAuditLog';

const SecuritySettings = () => {
  return (
    <div className="space-y-8">
      {/* HIPAA Compliance Banner */}
      <HipaaComplianceBanner />
      
      {/* Password Update Form */}
      <PasswordUpdateForm />
      
      {/* Security Controls */}
      <div className="border-t border-border pt-6">
        <h2 className="text-lg font-medium mb-4">HIPAA Security Controls</h2>
        <SecurityControls />
      </div>
      
      {/* Security compliance information */}
      <div className="border-t border-border pt-6">
        <h2 className="text-lg font-medium mb-4">HIPAA Compliance Information</h2>
        <ComplianceInformation />
      </div>
      
      {/* Security Audit Log */}
      <div className="border-t border-border pt-6">
        <SecurityAuditLog />
      </div>
    </div>
  );
};

export default SecuritySettings;
