
import React from 'react';
import { Shield } from 'lucide-react';

const ComplianceNotice = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-blue-800">
      <div className="flex items-center mb-2">
        <Shield className="h-5 w-5 mr-2" />
        <h3 className="font-medium">HIPAA Security Compliance</h3>
      </div>
      <p className="text-sm">
        These audit logs track all security-relevant activities in accordance with HIPAA requirements.
        The logs are immutable and include user identification, timestamps, actions performed, and affected resources.
      </p>
    </div>
  );
};

export default ComplianceNotice;
