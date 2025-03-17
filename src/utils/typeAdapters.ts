
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
    type: mapCategoryToType(insight.category),
    content: insight.description,
    patient_id: undefined // This is set when necessary by the component
  };
};

/**
 * Maps insight category to component type
 */
const mapCategoryToType = (
  category: "critical" | "warning" | "info" | "success"
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
      return "info";
  }
};

// Alias for backward compatibility
export const adaptAIInsight = adaptToComponentAIInsight;

// Export ComponentAIInsight type
export type { ComponentAIInsight };
