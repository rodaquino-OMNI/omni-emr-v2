
import React from 'react';
import { AlertTriangle, AlertCircle, AlertOctagon, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface InteractionSeverityBadgeProps {
  severity: string;
  className?: string;
  showTooltip?: boolean;
}

const InteractionSeverityBadge: React.FC<InteractionSeverityBadgeProps> = ({ 
  severity, 
  className,
  showTooltip = true
}) => {
  const getSeverityDetails = () => {
    switch (severity.toLowerCase()) {
      case 'high':
      case 'severe':
        return {
          bg: 'bg-red-100 dark:bg-red-950/30',
          text: 'text-red-800 dark:text-red-300',
          border: 'border border-red-200 dark:border-red-800',
          icon: <AlertOctagon className="h-4 w-4 text-red-600 dark:text-red-400 mr-1" />,
          label: 'High',
          description: 'Potentially dangerous interaction that requires immediate attention'
        };
      case 'medium':
      case 'moderate':
        return {
          bg: 'bg-amber-100 dark:bg-amber-950/30',
          text: 'text-amber-800 dark:text-amber-300',
          border: 'border border-amber-200 dark:border-amber-800',
          icon: <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mr-1" />,
          label: 'Moderate',
          description: 'Interaction may be significant and may require monitoring'
        };
      case 'low':
      case 'minor':
        return {
          bg: 'bg-blue-100 dark:bg-blue-950/30',
          text: 'text-blue-800 dark:text-blue-300',
          border: 'border border-blue-200 dark:border-blue-800',
          icon: <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-1" />,
          label: 'Minor',
          description: 'Interaction has limited clinical significance'
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-800/50',
          text: 'text-gray-800 dark:text-gray-300',
          border: 'border border-gray-200 dark:border-gray-700',
          icon: <ShieldAlert className="h-4 w-4 text-gray-600 dark:text-gray-400 mr-1" />,
          label: severity || 'Unknown',
          description: 'Interaction with unknown or unspecified severity'
        };
    }
  };

  const details = getSeverityDetails();
  
  const badge = (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", 
      details.bg, 
      details.text,
      details.border,
      className
    )}>
      {details.icon}
      {details.label}
    </span>
  );
  
  if (!showTooltip) return badge;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="font-medium">{details.label} Severity</p>
          <p className="text-xs mt-1">{details.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InteractionSeverityBadge;
