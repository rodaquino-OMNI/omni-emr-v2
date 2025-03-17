
import * as React from "react";

// Replace empty interface with type extension
export type EmptyPlaceholderProps = React.HTMLAttributes<HTMLDivElement>;

const EmptyPlaceholder = React.forwardRef<HTMLDivElement, EmptyPlaceholderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className="flex h-full w-full flex-col items-center justify-center space-y-4 pb-8 pt-6 text-center"
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);
EmptyPlaceholder.displayName = "EmptyPlaceholder";

export { EmptyPlaceholder };
