
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
  overridden: boolean; // Changed from optional to required
  overriddenReason?: string;
  overriddenBy?: string;
}

// Fix duplicate enum values by using string values instead of direct assignments
export enum AlertType {
  DRUG_INTERACTION = 'warning',
  ALLERGY = 'critical',
  DUPLICATE_ORDER = 'info',
  INAPPROPRIATE_DOSE = 'warning_dose',
  CONTRAINDICATION = 'critical_contra',
  GUIDELINE_DEVIATION = 'warning_guideline',
  AGE_INAPPROPRIATE = 'warning_age',
  WORKFLOW = 'info_workflow'
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
