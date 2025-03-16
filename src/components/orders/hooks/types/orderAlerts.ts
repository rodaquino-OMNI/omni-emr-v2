
export interface OrderAlert {
  type: 'critical' | 'warning' | 'info';
  message: string;
  overridden: boolean;
  overriddenReason?: string;
  severity: 'critical' | 'moderate' | 'low'; // Added severity property for alertLogging.ts
}
