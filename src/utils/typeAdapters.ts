
import { AIInsight as PatientInsight } from '@/types/patient';

interface ComponentAIInsight {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  source?: string;
  timestamp: string;
  patient_id?: string;
}

/**
 * Adapts a PatientInsight to the format expected by the AI Insights component
 */
export const adaptToComponentAIInsight = (insight: PatientInsight): ComponentAIInsight => {
  // Map severity to type
  let type: 'info' | 'warning' | 'critical' | 'success';
  switch (insight.severity) {
    case 'critical':
      type = 'critical';
      break;
    case 'high':
      type = 'warning';
      break;
    case 'medium':
      type = 'warning';
      break;
    case 'low':
      type = 'info';
      break;
    default:
      type = 'info';
  }

  return {
    id: insight.id,
    title: insight.title,
    description: insight.description,
    type,
    source: insight.source || 'AI Analysis',
    timestamp: insight.created_at,
    patient_id: insight.patient_id
  };
};

/**
 * Adapts a component AIInsight to the PatientInsight format
 */
export const adaptToPatientInsight = (insight: ComponentAIInsight): PatientInsight => {
  // Map type to severity
  let severity: 'low' | 'medium' | 'high' | 'critical';
  switch (insight.type) {
    case 'critical':
      severity = 'critical';
      break;
    case 'warning':
      severity = 'high';
      break;
    case 'info':
      severity = 'low';
      break;
    case 'success':
      severity = 'low';
      break;
    default:
      severity = 'medium';
  }

  return {
    id: insight.id,
    title: insight.title,
    description: insight.description,
    severity,
    created_at: insight.timestamp,
    patient_id: insight.patient_id || '',
    source: insight.source,
    category: insight.type
  };
};
