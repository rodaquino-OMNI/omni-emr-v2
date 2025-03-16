
import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, RefreshCw, Table } from 'lucide-react';
import { checkConnectivity } from '@/utils/supabaseConnectivity';
import { checkTableExists } from '@/utils/supabaseTableCheck';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

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
  const [tableStatus, setTableStatus] = useState<{[key: string]: boolean | null}>({
    appointments: null
  });
  
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    const checkConnection = async () => {
      try {
        const status = await checkConnectivity();
        setIsConnected(status);
        if (onStatusChange) onStatusChange(status);
        
        // If connected, check if appointments table exists using the safe function
        if (status) {
          try {
            const appoExists = await checkTableExists('appointments');
            setTableStatus(prev => ({...prev, appointments: appoExists}));
          } catch (error) {
            console.error('Error checking appointments table:', error);
            setTableStatus(prev => ({...prev, appointments: false}));
          }
        }
      } catch (error) {
        console.error('Error checking connection:', error);
        setIsConnected(false);
        if (onStatusChange) onStatusChange(false);
      }
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
    try {
      const status = await checkConnectivity();
      setIsConnected(status);
      if (onStatusChange) onStatusChange(status);
      
      // If connected, check if appointments table exists using the safe function
      if (status) {
        try {
          const appoExists = await checkTableExists('appointments');
          setTableStatus(prev => ({...prev, appointments: appoExists}));
          
          if (!appoExists) {
            toast.error('Appointments table not found', {
              description: 'The appointments table does not exist in the database. This may cause functionality issues.',
              duration: 8000,
            });
          } else {
            toast.success('Appointments table exists', {
              description: 'The appointments table is properly configured in Supabase.',
              duration: 3000,
            });
          }
        } catch (error) {
          console.error('Error checking appointments table:', error);
          setTableStatus(prev => ({...prev, appointments: false}));
          toast.error('Table check failed', {
            description: 'Could not verify if the appointments table exists.',
            duration: 5000,
          });
        }
      }
    } catch (error) {
      console.error('Error checking connection:', error);
      setIsConnected(false);
      if (onStatusChange) onStatusChange(false);
      
      toast.error('Connection check failed', {
        description: 'Could not verify connection to Supabase.',
        duration: 5000,
      });
    } finally {
      setIsChecking(false);
    }
  };
  
  const checkAppointmentsTable = async () => {
    setIsChecking(true);
    try {
      const appoExists = await checkTableExists('appointments');
      setTableStatus(prev => ({...prev, appointments: appoExists}));
      
      if (!appoExists) {
        toast.error('Appointments table not found', {
          description: 'The appointments table does not exist in the database. This may cause functionality issues.',
          duration: 8000,
        });
      } else {
        toast.success('Appointments table exists', {
          description: 'The appointments table is properly configured in Supabase.',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error checking appointments table:', error);
      toast.error('Table check failed', {
        description: 'Could not verify if the appointments table exists.',
        duration: 5000,
      });
    } finally {
      setIsChecking(false);
    }
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
      
      {isConnected && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-0 h-6 w-6" 
                onClick={checkAppointmentsTable}
                disabled={isChecking}
              >
                <Table className={`h-4 w-4 ${tableStatus.appointments === null ? '' : tableStatus.appointments ? 'text-green-500' : 'text-red-500'}`} />
                <span className="sr-only">Check appointments table</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Check if appointments table exists</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default SupabaseConnectionStatus;
