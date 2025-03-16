
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from './useTranslation';

interface UseFetchWithOptimisticUpdatesProps<TData, TUpdate, TError> {
  queryKey: QueryKey;
  fetchFn: () => Promise<TData>;
  updateFn: (data: TUpdate) => Promise<any>;
  optimisticUpdate: (oldData: TData | undefined, newData: TUpdate) => TData;
  onUpdateSuccess?: (data: any) => void;
  onUpdateError?: (error: TError) => void;
  successMessage?: string;
  errorMessage?: string;
}

/**
 * Custom hook that combines React Query with optimistic updates
 * for better UX during data mutations
 */
export function useFetchWithOptimisticUpdates<TData, TUpdate, TError = Error>({
  queryKey,
  fetchFn,
  updateFn,
  optimisticUpdate,
  onUpdateSuccess,
  onUpdateError,
  successMessage,
  errorMessage
}: UseFetchWithOptimisticUpdatesProps<TData, TUpdate, TError>) {
  const { language } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  // Query to fetch data
  const query = useQuery<TData, TError>({
    queryKey,
    queryFn: fetchFn
  });

  // Mutation to update data with optimistic updates
  const mutation = useMutation({
    mutationFn: updateFn,
    onMutate: async (newData: TUpdate) => {
      setIsSubmitting(true);
      
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey });
      
      // Snapshot the previous value
      const previousData = queryClient.getQueryData<TData>(queryKey);
      
      // Optimistically update to the new value
      queryClient.setQueryData<TData>(queryKey, (old) => 
        optimisticUpdate(old, newData)
      );
      
      // Return a context object with the snapshotted value
      return { previousData };
    },
    onSuccess: (data, _, context) => {
      // Show success message if provided
      if (successMessage) {
        toast.success(successMessage);
      }
      
      // Invalidate and refetch to ensure data is up to date
      queryClient.invalidateQueries({ queryKey });
      
      // Call success callback if provided
      if (onUpdateSuccess) {
        onUpdateSuccess(data);
      }
    },
    onError: (error: TError, _, context) => {
      // Revert to the previous value
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      
      // Show error message
      toast.error(
        errorMessage || 
        (language === 'pt' 
          ? 'Erro ao atualizar os dados' 
          : 'Error updating data')
      );
      
      // Call error callback if provided
      if (onUpdateError) {
        onUpdateError(error);
      }
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isSubmitting,
    update: mutation.mutate,
    updateAsync: mutation.mutateAsync
  };
}
