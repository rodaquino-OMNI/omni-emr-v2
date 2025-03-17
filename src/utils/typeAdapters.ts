
import { AIInsight as PatientAIInsight } from '@/types/patient';
import { AIInsight as ComponentAIInsight } from '@/components/ai/AIInsights';

/**
 * Adapts AIInsight from component format to patient type format
 */
export const adaptAIInsight = (insight: ComponentAIInsight): PatientAIInsight => {
  return {
    id: insight.id,
    patient_id: 'auto-generated', // Default value
    category: insight.source || 'general',
    title: insight.title,
    description: insight.description,
    severity: mapSeverityFromType(insight.type),
    created_at: insight.timestamp?.toISOString() || new Date().toISOString(),
    source: insight.source,
    action_required: false,
    action_description: '',
  };
};

/**
 * Maps ComponentAIInsight type to PatientAIInsight severity
 */
const mapSeverityFromType = (type: 'info' | 'warning' | 'critical' | 'positive'): 'low' | 'medium' | 'high' | 'critical' => {
  switch (type) {
    case 'critical': return 'critical';
    case 'warning': return 'high';
    case 'positive': return 'low';
    case 'info':
    default: return 'medium';
  }
};

/**
 * Adapts PatientAIInsight to component format
 */
export const adaptToComponentAIInsight = (insight: PatientAIInsight): ComponentAIInsight => {
  return {
    id: insight.id,
    type: mapTypeFromSeverity(insight.severity),
    source: (insight.category || insight.source) as any,
    title: insight.title,
    description: insight.description,
    timestamp: new Date(insight.created_at),
  };
};

/**
 * Maps PatientAIInsight severity to ComponentAIInsight type
 */
const mapTypeFromSeverity = (severity: 'low' | 'medium' | 'high' | 'critical'): 'info' | 'warning' | 'critical' | 'positive' => {
  switch (severity) {
    case 'critical': return 'critical';
    case 'high': return 'warning';
    case 'low': return 'positive';
    case 'medium':
    default: return 'info';
  }
};
