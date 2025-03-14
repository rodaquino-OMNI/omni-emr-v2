
import { useState, useEffect } from 'react';

/**
 * A hook to handle async operations
 * @param asyncFunction - The async function to execute
 * @param immediate - Whether to execute the function immediately
 * @returns Object containing data, error, isLoading, and execute function
 */
export const useAsync = <T>(
  asyncFunction: () => Promise<T> | T,
  immediate = true
) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await asyncFunction();
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);

  return { data, error, isLoading, execute };
};
