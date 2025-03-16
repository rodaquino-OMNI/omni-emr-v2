
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
  overridden?: boolean;
  overriddenReason?: string;
  overriddenBy?: string;
}

export enum AlertType {
  DRUG_INTERACTION = 'DRUG_INTERACTION',
  ALLERGY = 'ALLERGY',
  DUPLICATE_ORDER = 'DUPLICATE_ORDER',
  INAPPROPRIATE_DOSE = 'INAPPROPRIATE_DOSE',
  CONTRAINDICATION = 'CONTRAINDICATION',
  GUIDELINE_DEVIATION = 'GUIDELINE_DEVIATION',
  AGE_INAPPROPRIATE = 'AGE_INAPPROPRIATE',
  WORKFLOW = 'WORKFLOW'
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
