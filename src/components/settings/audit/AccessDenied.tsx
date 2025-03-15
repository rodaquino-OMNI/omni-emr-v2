
import React from 'react';
import { ShieldAlert, Lock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const AccessDenied = () => {
  return (
    <div className="max-w-md mx-auto my-12">
      <Card className="border-t-4 border-t-red-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <ShieldAlert className="h-5 w-5" />
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="my-6 flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
              <Lock className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">You don't have permission to access this page</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The Security Audit Log is restricted to administrators only due to the sensitive nature of the information.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" variant="default" onClick={() => window.history.back()}>
            Go Back
          </Button>
          <Button className="w-full" variant="outline">
            <ExternalLink className="mr-2 h-4 w-4" />
            Request Access
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AccessDenied;
