
import React from 'react';
import { Shield } from 'lucide-react';

const SecurityBanner = () => {
  return (
    <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md flex items-start gap-2">
      <Shield className="h-4 w-4 text-green-500 mt-0.5" />
      <div>
        <p className="font-medium mb-1">HIPAA Compliance & Security</p>
        <p>This medical record system follows FHIR standards and HIPAA security requirements. All access to this data is logged and encrypted for patient safety.</p>
      </div>
    </div>
  );
};

export default SecurityBanner;
