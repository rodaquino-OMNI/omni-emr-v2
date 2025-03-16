
import { useSessionTimeoutHook } from './auth/useSessionTimeoutHook';
import { Languages } from '../types/auth';

interface UseSessionTimeoutProps {
  isAuthenticated: boolean;
  language: Languages;
  onTimeout: () => Promise<void>;
}

export const useSessionTimeout = (props: UseSessionTimeoutProps) => {
  // Simply forward to the new implementation
  return useSessionTimeoutHook(props);
};
