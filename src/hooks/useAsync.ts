
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  run: (promise: Promise<T>, errorMessage?: string) => Promise<T | null>;
  reset: () => void;
  retry: () => Promise<T | null>;
}

/**
 * Hook for managing async operations with loading states, errors, and retries
 */
export function useAsync<T>(initialData: T | null = null): AsyncState<T> {
  const [data, setData] = useState<T | null>(initialData);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastPromise, setLastPromise] = useState<() => Promise<T>|null>(() => null);
  const { language } = useAuth();

  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setIsLoading(false);
  }, [initialData]);

  const run = useCallback(async (
    promise: Promise<T>,
    errorMessage?: string
  ): Promise<T | null> => {
    try {
      if (!promise || typeof promise.then !== 'function') {
        console.error("Invalid promise passed to useAsync.run", promise);
        throw new Error("Invalid promise passed to run function");
      }
      
      setIsLoading(true);
      setError(null);
      
      const result = await promise;
      
      // Ensure result is not undefined
      if (result === undefined) {
        console.warn("Promise resolved with undefined value");
      }
      
      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error("Error in useAsync.run:", error);
      setError(error);
      
      if (errorMessage) {
        const message = language === 'pt' 
          ? `Erro: ${errorMessage}`
          : `Error: ${errorMessage}`;
        
        toast.error(message, {
          description: error.message,
        });
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  const retry = useCallback(async (): Promise<T | null> => {
    if (!lastPromise) return null;
    
    const promise = lastPromise();
    if (!promise) return null;
    
    return run(promise);
  }, [lastPromise, run]);
  
  useEffect(() => {
    // Cleanup function to prevent state updates on unmounted component
    return () => {
      setData(null);
      setError(null);
      setIsLoading(false);
    };
  }, []);

  return { data, isLoading, error, run, reset, retry };
}
