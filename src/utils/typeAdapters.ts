
import { AIInsight, PatientInsight } from '@/types/patient';

export interface ComponentAIInsight {
  id: string;
  title: string;
  content: string;
  type: "info" | "warning" | "critical" | "success";
  source?: string;
  timestamp?: string;
}

/**
 * Adapts an AIInsight from the API to the format expected by the AIInsights component
 */
export const adaptToComponentAIInsight = (insight: AIInsight | PatientInsight): ComponentAIInsight => {
  // Map the insight type to one of the allowed component types
  let mappedType: "info" | "warning" | "critical" | "success" = "info";
  
  if ('severity' in insight) {
    // AIInsight type with severity property
    switch (insight.severity) {
      case 'high':
        mappedType = "critical";
        break;
      case 'medium':
        mappedType = "warning";
        break;
      case 'low':
        mappedType = "info";
        break;
      default:
        mappedType = "info";
    }
  } else if ('type' in insight) {
    // PatientInsight type with type property
    switch (insight.type) {
      case 'warning':
        mappedType = "warning";
        break;
      case 'critical':
        mappedType = "critical";
        break;
      case 'positive':
        mappedType = "success";
        break;
      case 'neutral':
      default:
        mappedType = "info";
    }
  }
  
  return {
    id: insight.id,
    title: insight.title,
    content: insight.content,
    type: mappedType,
    source: 'source' in insight ? insight.source : undefined,
    timestamp: 'created_at' in insight ? insight.created_at : 
              ('timestamp' in insight ? insight.timestamp : new Date().toISOString())
  };
};

/**
 * Adapts Component AI Insight format back to API AIInsight format
 */
export const adaptFromComponentAIInsight = (componentInsight: ComponentAIInsight): AIInsight => {
  // Map component type to API severity
  let severity: 'high' | 'medium' | 'low' = 'low';
  
  switch (componentInsight.type) {
    case 'critical':
      severity = 'high';
      break;
    case 'warning':
      severity = 'medium';
      break;
    case 'info':
    case 'success':
    default:
      severity = 'low';
      break;
  }
  
  return {
    id: componentInsight.id,
    patient_id: '', // This should be filled in by the caller
    title: componentInsight.title,
    content: componentInsight.content,
    category: 'general',
    severity,
    created_at: componentInsight.timestamp || new Date().toISOString()
  };
};
