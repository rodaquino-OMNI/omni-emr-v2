
import React from 'react';
import { AlertCircle } from 'lucide-react';

const AccessDenied = () => {
  return (
    <div className="p-4 border border-yellow-400 bg-yellow-50 rounded-md mb-4 text-center">
      <AlertCircle className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
      <h3 className="text-lg font-medium text-yellow-800">Access Restricted</h3>
      <p className="text-yellow-700">You do not have permission to view security audit logs.</p>
    </div>
  );
};

export default AccessDenied;
