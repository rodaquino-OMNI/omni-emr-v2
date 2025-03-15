
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-green-100 text-green-800 hover:bg-green-200/80 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/40",
        warning:
          "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200/80 dark:bg-yellow-900/30 dark:text-yellow-300 dark:hover:bg-yellow-900/40",
        info:
          "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200/80 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/40",
        ai:
          "border-transparent bg-purple-100 text-purple-800 hover:bg-purple-200/80 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/40",
        data:
          "border-transparent bg-cyan-100 text-cyan-800 hover:bg-cyan-200/80 dark:bg-cyan-900/30 dark:text-cyan-300 dark:hover:bg-cyan-900/40",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
