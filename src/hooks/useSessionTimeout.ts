
import { useSessionTimeoutHook } from './auth/useSessionTimeoutHook';
import { Language } from '../types/auth';

interface UseSessionTimeoutProps {
  isAuthenticated: boolean;
  language: Language;
  onTimeout: () => Promise<void>;
}

export const useSessionTimeout = (props: UseSessionTimeoutProps) => {
  // Simply forward to the new implementation
  return useSessionTimeoutHook(props);
};
