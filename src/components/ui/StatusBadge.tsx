
import React from "react";
import { cn } from "@/lib/utils";

type StatusType = "hospital" | "home" | "discharged" | "critical" | "stable" | "improving";

type StatusBadgeProps = {
  status: StatusType;
  className?: string;
};

const statusConfig = {
  hospital: {
    color: "bg-medical-blue text-white",
    label: "Hospital"
  },
  home: {
    color: "bg-medical-green text-white",
    label: "Home Care"
  },
  discharged: {
    color: "bg-medical-gray text-foreground",
    label: "Discharged"
  },
  critical: {
    color: "bg-medical-red text-white",
    label: "Critical"
  },
  stable: {
    color: "bg-medical-green text-white",
    label: "Stable"
  },
  improving: {
    color: "bg-medical-yellow text-foreground",
    label: "Improving"
  }
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      config.color,
      className
    )}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
      {config.label}
    </span>
  );
};

export default StatusBadge;
