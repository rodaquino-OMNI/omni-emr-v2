
import React from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "../../hooks/useTranslation";

type StatusType = "hospital" | "home" | "discharged" | "critical" | "stable" | "improving";

type StatusBadgeProps = {
  status: StatusType;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const StatusBadge = ({ status, className, size = "md" }: StatusBadgeProps) => {
  const { language } = useTranslation();
  
  const statusConfig = {
    hospital: {
      color: "bg-medical-blue text-white",
      label: language === 'pt' ? "Hospital" : "Hospital"
    },
    home: {
      color: "bg-medical-green text-white",
      label: language === 'pt' ? "Cuidados Domiciliares" : "Home Care"
    },
    discharged: {
      color: "bg-medical-gray text-foreground",
      label: language === 'pt' ? "Alta" : "Discharged"
    },
    critical: {
      color: "bg-medical-red text-white",
      label: language === 'pt' ? "Crítico" : "Critical"
    },
    stable: {
      color: "bg-medical-green text-white",
      label: language === 'pt' ? "Estável" : "Stable"
    },
    improving: {
      color: "bg-medical-yellow text-foreground",
      label: language === 'pt' ? "Melhorando" : "Improving"
    }
  };
  
  const config = statusConfig[status];
  
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-2.5 py-0.5",
    lg: "text-sm px-3 py-1"
  };
  
  return (
    <span className={cn(
      "inline-flex items-center rounded-full font-medium",
      sizeClasses[size],
      config.color,
      className
    )}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
      {config.label}
    </span>
  );
};

export default StatusBadge;
