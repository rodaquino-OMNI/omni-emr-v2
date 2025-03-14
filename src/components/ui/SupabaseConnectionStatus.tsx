
import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { checkConnectivity } from '@/utils/supabaseConnectivity';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SupabaseConnectionStatusProps {
  showLabel?: boolean;
  onStatusChange?: (isConnected: boolean) => void;
}

const SupabaseConnectionStatus: React.FC<SupabaseConnectionStatusProps> = ({
  showLabel = false,
  onStatusChange
}) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    const checkConnection = async () => {
      const status = await checkConnectivity();
      setIsConnected(status);
      if (onStatusChange) onStatusChange(status);
    };
    
    // Check on mount
    checkConnection();
    
    // Check every minute
    intervalId = setInterval(checkConnection, 60000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [onStatusChange]);
  
  const handleCheckConnection = async () => {
    setIsChecking(true);
    const status = await checkConnectivity(true); // Show toasts for manual check
    setIsConnected(status);
    if (onStatusChange) onStatusChange(status);
    setIsChecking(false);
  };
  
  return (
    <div className="flex items-center gap-2">
      {isConnected === null ? (
        <div className="h-4 w-4 rounded-full bg-gray-300 animate-pulse" />
      ) : isConnected ? (
        <CheckCircle className="h-4 w-4 text-green-500" />
      ) : (
        <XCircle className="h-4 w-4 text-red-500" />
      )}
      
      {showLabel && (
        <span className={isConnected ? "text-green-500" : "text-red-500"}>
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      )}
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-6 w-6" 
              onClick={handleCheckConnection}
              disabled={isChecking}
            >
              <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
              <span className="sr-only">Check connection</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Check Supabase connection</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default SupabaseConnectionStatus;
