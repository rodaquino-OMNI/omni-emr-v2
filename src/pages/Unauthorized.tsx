
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { requiredPermission } = location.state || {};

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center max-w-md p-6">
        <ShieldAlert className="h-16 w-16 mx-auto text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Unauthorized Access</h1>
        <p className="text-muted-foreground mb-6">
          {requiredPermission 
            ? `You don't have the required permission: ${requiredPermission.replace(/_/g, ' ')}`
            : "You don't have permission to access this resource"}
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Please contact your system administrator if you believe you should have access to this area.
        </p>
        <Button onClick={() => navigate(-1)} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
