
import React from 'react';
import { AlertTriangle, AlertCircle, AlertOctagon } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractionSeverityBadgeProps {
  severity: string;
  className?: string;
}

const InteractionSeverityBadge: React.FC<InteractionSeverityBadgeProps> = ({ severity, className }) => {
  const getSeverityDetails = () => {
    switch (severity.toLowerCase()) {
      case 'high':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: <AlertOctagon className="h-4 w-4 text-red-500 mr-1" />,
          label: 'High'
        };
      case 'medium':
      case 'moderate':
        return {
          bg: 'bg-amber-100',
          text: 'text-amber-800',
          icon: <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />,
          label: 'Moderate'
        };
      case 'low':
      case 'minor':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          icon: <AlertCircle className="h-4 w-4 text-blue-500 mr-1" />,
          label: 'Minor'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: <AlertCircle className="h-4 w-4 text-gray-500 mr-1" />,
          label: severity
        };
    }
  };

  const details = getSeverityDetails();

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", 
      details.bg, 
      details.text,
      className
    )}>
      {details.icon}
      {details.label}
    </span>
  );
};

export default InteractionSeverityBadge;
