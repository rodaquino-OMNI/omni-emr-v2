
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface MutationOptions<T, V> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
}

/**
 * Custom hook for API mutations with standardized loading and error handling
 */
export function useApiMutation<T, V = any>(
  mutationFn: (variables: V) => Promise<T>,
  options: MutationOptions<T, V> = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const { onSuccess, onError, successMessage } = options;

  const mutate = async (variables: V): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await mutationFn(variables);
      setData(result);
      
      if (successMessage) {
        toast({
          title: 'Success',
          description: successMessage,
          variant: 'success'
        });
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      // Create a standardized error object
      const errorObj = new Error(err instanceof Error ? err.message : 'Operation failed');
      setError(errorObj);
      
      if (onError) {
        onError(errorObj);
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setIsLoading(false);
  };

  return {
    mutate,
    isLoading,
    error,
    data,
    errorMessage: error ? error.message : null,
    reset
  };
}
