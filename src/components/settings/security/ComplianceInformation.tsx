
import React from 'react';
import { Lock, Shield } from 'lucide-react';

const ComplianceInformation = () => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="border rounded-md p-4 bg-muted/10">
        <div className="flex items-center mb-2">
          <Lock className="h-5 w-5 mr-2 text-primary" />
          <h3 className="font-medium">Data Encryption</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          All sensitive data is encrypted both in transit (using HTTPS) and at rest (using AES-256 encryption), 
          ensuring HIPAA compliance for Protected Health Information (PHI).
        </p>
      </div>
      
      <div className="border rounded-md p-4 bg-muted/10">
        <div className="flex items-center mb-2">
          <Shield className="h-5 w-5 mr-2 text-primary" />
          <h3 className="font-medium">Role-Based Access</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Access to patient information is strictly controlled based on user roles.
          Patients can only access their own data, and healthcare providers have limited access based on their role.
        </p>
      </div>
    </div>
  );
};

export default ComplianceInformation;
