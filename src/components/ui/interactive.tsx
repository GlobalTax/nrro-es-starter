import * as React from "react";
import { cn } from "@/lib/utils";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

// ============================================
// Tooltip - Tooltip mejorado
// ============================================

export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

export const Tooltip = ({ children, content, side = "top", align = "center" }: TooltipProps) => {
  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            className={cn(
              "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-medium animate-in fade-in-0 zoom-in-95",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
            )}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-primary" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

// ============================================
// LoadingSpinner - Spinner de carga
// ============================================

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size = "md", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-block animate-spin rounded-full border-2 border-current border-t-transparent text-primary",
          {
            "h-4 w-4": size === "sm",
            "h-8 w-8": size === "md",
            "h-12 w-12": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
LoadingSpinner.displayName = "LoadingSpinner";

// ============================================
// Divider - Separador visual
// ============================================

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical";
  label?: string;
}

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  ({ className, orientation = "horizontal", label, ...props }, ref) => {
    if (label && orientation === "horizontal") {
      return (
        <div className={cn("relative", className)}>
          <div className="absolute inset-0 flex items-center">
            <hr ref={ref} className="w-full border-border" {...props} />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">{label}</span>
          </div>
        </div>
      );
    }

    return (
      <hr
        ref={ref}
        className={cn(
          orientation === "horizontal" ? "w-full border-t" : "h-full border-l",
          "border-border",
          className
        )}
        {...props}
      />
    );
  }
);
Divider.displayName = "Divider";

// ============================================
// ProgressBar - Barra de progreso
// ============================================

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, value, max = 100, showLabel = false, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        {showLabel && (
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-muted-foreground">Progreso</span>
            <span className="font-medium text-foreground">{Math.round(percentage)}%</span>
          </div>
        )}
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-accent transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);
ProgressBar.displayName = "ProgressBar";
