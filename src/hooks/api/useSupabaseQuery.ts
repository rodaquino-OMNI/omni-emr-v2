
import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { handleApiError, handleDatabaseError } from '@/utils/errorHandling';
import { toast } from '@/hooks/use-toast';

/**
 * Generic hook for Supabase data fetching with react-query caching
 */
export function useSupabaseQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        return await queryFn();
      } catch (error) {
        throw handleApiError(error, 'Failed to fetch data');
      }
    },
    ...options,
  });
}

/**
 * Get records from a Supabase table with caching
 */
export function useSupabaseTable<T>(
  table: string,
  options: {
    queryKey?: string[];
    select?: string;
    filters?: Record<string, any>;
    order?: { column: string; ascending: boolean };
    limit?: number;
    enabled?: boolean;
    staleTime?: number;
    cacheTime?: number;
  } = {}
) {
  const {
    queryKey = [table],
    select = '*',
    filters = {},
    order,
    limit,
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    cacheTime = 10 * 60 * 1000, // 10 minutes
  } = options;

  return useQuery({
    queryKey,
    queryFn: async () => {
      let query = supabase.from(table).select(select);
      
      // Apply filters
      Object.entries(filters).forEach(([column, value]) => {
        if (value !== undefined) {
          query = query.eq(column, value);
        }
      });
      
      // Apply ordering
      if (order) {
        query = query.order(order.column, { ascending: order.ascending });
      }
      
      // Apply limit
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw handleDatabaseError(error, 'fetch', table);
      }
      
      return data as T[];
    },
    enabled,
    staleTime,
    gcTime: cacheTime,
  });
}

/**
 * Generic mutation hook for Supabase operations
 */
export function useSupabaseMutation<T, V>(
  mutationFn: (variables: V) => Promise<T>,
  options: {
    onSuccessMessage?: string;
    invalidateQueries?: string[];
  } = {}
) {
  const queryClient = useQueryClient();
  const { onSuccessMessage, invalidateQueries = [] } = options;
  
  return useMutation({
    mutationFn: async (variables: V) => {
      try {
        return await mutationFn(variables);
      } catch (error) {
        throw handleApiError(error, 'Operation failed');
      }
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      invalidateQueries.forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      });
      
      // Show success message if provided
      if (onSuccessMessage) {
        toast({
          title: 'Success',
          description: onSuccessMessage,
          variant: 'success'
        });
      }
    },
  });
}

/**
 * Execute a Supabase transaction that spans multiple operations
 * Note: This is implemented using Supabase's API which doesn't have native transaction support,
 * so we need to handle errors and rollback manually when needed
 */
export async function executeTransaction<T>(
  operations: Array<() => Promise<any>>,
  rollbackOperations: Array<() => Promise<any>> = [],
  options: {
    transactionName: string;
    successMessage?: string;
  }
): Promise<T> {
  const { transactionName, successMessage } = options;
  let results: any[] = [];
  
  try {
    // Execute each operation sequentially
    for (const operation of operations) {
      const result = await operation();
      results.push(result);
    }
    
    // Show success message if provided
    if (successMessage) {
      toast({
        title: 'Success',
        description: successMessage,
        variant: 'success'
      });
    }
    
    // Return the last result by default, or the entire results array
    return results[results.length - 1] as T;
  } catch (error) {
    console.error(`Transaction "${transactionName}" failed:`, error);
    
    // Attempt to perform rollback operations if provided
    if (rollbackOperations.length > 0) {
      try {
        for (const rollbackOp of rollbackOperations) {
          await rollbackOp();
        }
        console.log(`Rollback for transaction "${transactionName}" completed successfully`);
      } catch (rollbackError) {
        console.error(`Rollback for transaction "${transactionName}" failed:`, rollbackError);
      }
    }
    
    throw handleTransactionError(error, transactionName);
  }
}

/**
 * Handle transaction errors with appropriate error messages
 */
function handleTransactionError(error: any, transactionName: string): Error {
  // Format error message for transaction errors
  const baseMessage = `Transaction "${transactionName}" failed: `;
  
  if (error?.message) {
    return new Error(`${baseMessage}${error.message}`);
  }
  
  if (typeof error === 'string') {
    return new Error(`${baseMessage}${error}`);
  }
  
  return new Error(`${baseMessage}Unknown error`);
}
