
import React from 'react';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

const RouteErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  
  let errorMessage = 'An unexpected error occurred';
  let statusCode: number | undefined;
  
  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    errorMessage = error.statusText || error.data?.message || 'An error occurred while loading this page';
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }
  
  const getStatusMessage = () => {
    switch (statusCode) {
      case 404:
        return 'The page you are looking for does not exist.';
      case 403:
        return 'You do not have permission to access this page.';
      case 401:
        return 'You need to be logged in to access this page.';
      case 500:
        return 'An internal server error occurred.';
      default:
        return 'Something went wrong while loading this page.';
    }
  };
  
  return (
    <div className="container flex flex-col items-center justify-center min-h-screen p-4">
      <Alert variant="destructive" className="max-w-md mb-6">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Error {statusCode}</AlertTitle>
        <AlertDescription>
          {statusCode ? getStatusMessage() : errorMessage}
        </AlertDescription>
      </Alert>
      
      <div className="flex gap-4">
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Page
        </Button>
        
        <Button 
          className="gap-2"
          onClick={() => navigate('/')}
        >
          <Home className="h-4 w-4" />
          Go Home
        </Button>
      </div>
      
      <div className="mt-8 text-sm text-muted-foreground">
        <p>If this problem persists, please contact support.</p>
      </div>
    </div>
  );
};

export default RouteErrorBoundary;
