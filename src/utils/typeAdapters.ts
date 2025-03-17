
import { ComponentAIInsight, PatientInsight } from "@/types/patient";

/**
 * Adapts patient insights to the format expected by the AI Insight component
 */
export const adaptToComponentAIInsight = (
  insight: PatientInsight
): ComponentAIInsight => {
  return {
    id: insight.id,
    title: insight.title,
    description: insight.description,
    severity: insight.severity,
    created_at: insight.created_at,
    source: insight.source,
    // Ensure type is always one of the allowed values
    type: mapCategoryToType(insight.category),
    content: insight.description, // Make sure content is always set
    timestamp: insight.timestamp || insight.created_at,
    patient_id: insight.patient_id
  };
};

/**
 * Maps insight category to component type
 */
const mapCategoryToType = (
  category: string
): "critical" | "warning" | "info" | "success" => {
  switch (category) {
    case "critical":
      return "critical";
    case "warning":
      return "warning";
    case "info":
      return "info";
    case "success":
      return "success";
    default:
      return "info"; // Default fallback
  }
};

// Alias for backward compatibility
export const adaptAIInsight = adaptToComponentAIInsight;

// Export ComponentAIInsight type
export type { ComponentAIInsight };
