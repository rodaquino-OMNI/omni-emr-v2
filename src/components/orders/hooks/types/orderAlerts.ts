
export interface OrderAlert {
  id: string;
  type: 'info' | 'warning' | 'critical';
  title?: string;
  message: string;
  details?: any;
  severity?: 'info' | 'warning' | 'error';
  timestamp?: string;
  requiresAcknowledgement?: boolean;
  source?: string;
  overridden: boolean;
  overriddenReason?: string;
  overriddenBy?: string;
}

export enum AlertType {
  DRUG_INTERACTION = 'warning',
  ALLERGY = 'critical',
  DUPLICATE_ORDER = 'info',
  INAPPROPRIATE_DOSE = 'warning',
  CONTRAINDICATION = 'critical',
  GUIDELINE_DEVIATION = 'warning',
  AGE_INAPPROPRIATE = 'warning',
  WORKFLOW = 'info'
}

export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

export interface AlertDecision {
  alertId: string;
  action: 'acknowledge' | 'override' | 'cancel';
  reason?: string;
  timestamp: string;
  userId: string;
}
