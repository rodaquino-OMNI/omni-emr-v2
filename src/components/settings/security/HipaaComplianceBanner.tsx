
import React from 'react';
import { Shield } from 'lucide-react';

const HipaaComplianceBanner = () => {
  return (
    <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <Shield className="h-5 w-5 text-green-500" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800">HIPAA Compliant Security</h3>
          <div className="text-sm text-green-700">
            This system implements security measures in accordance with HIPAA requirements, including
            data encryption, access controls, and security audit logging.
          </div>
        </div>
      </div>
    </div>
  );
};

export default HipaaComplianceBanner;
