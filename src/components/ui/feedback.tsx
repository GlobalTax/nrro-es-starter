import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info, XCircle, LucideIcon } from "lucide-react";

// ============================================
// Alert - Componente de alerta
// ============================================

const alertVariants = {
  info: {
    bg: "bg-[hsl(172_60%_15%_/_0.1)]",
    border: "border-[hsl(172_60%_15%)]",
    text: "text-[hsl(172_60%_15%)]",
    icon: Info,
  },
  success: {
    bg: "bg-[hsl(142_76%_36%_/_0.1)]",
    border: "border-[hsl(142_76%_36%)]",
    text: "text-[hsl(142_76%_36%)]",
    icon: CheckCircle2,
  },
  warning: {
    bg: "bg-[hsl(45_93%_47%_/_0.1)]",
    border: "border-[hsl(45_93%_47%)]",
    text: "text-[hsl(45_93%_47%)]",
    icon: AlertCircle,
  },
  error: {
    bg: "bg-[hsl(0_84.2%_60.2%_/_0.1)]",
    border: "border-[hsl(0_84.2%_60.2%)]",
    text: "text-[hsl(0_84.2%_60.2%)]",
    icon: XCircle,
  },
};

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  description?: string;
  icon?: boolean;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "info", title, description, icon = true, children, ...props }, ref) => {
    const variantStyles = alertVariants[variant];
    const Icon = variantStyles.icon;

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative rounded-lg border p-4",
          variantStyles.bg,
          variantStyles.border,
          className
        )}
        {...props}
      >
        <div className="flex gap-3">
          {icon && (
            <Icon className={cn("h-5 w-5 flex-shrink-0", variantStyles.text)} />
          )}
          <div className="flex-1">
            {title && (
              <h5 className={cn("mb-1 font-semibold", variantStyles.text)}>
                {title}
              </h5>
            )}
            {description && (
              <p className={cn("text-sm", variantStyles.text)}>
                {description}
              </p>
            )}
            {children && (
              <div className={cn("mt-2", variantStyles.text)}>
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);
Alert.displayName = "Alert";

// ============================================
// ErrorState - Estado de error
// ============================================

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: LucideIcon;
}

export const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  ({ className, title = "Ha ocurrido un error", description, action, icon: Icon = XCircle, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center py-16 text-center",
          className
        )}
        {...props}
      >
        <Icon className="h-16 w-16 text-destructive mb-4" strokeWidth={1.5} />
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground max-w-md mb-6">
            {description}
          </p>
        )}
        {action && <div>{action}</div>}
      </div>
    );
  }
);
ErrorState.displayName = "ErrorState";

// ============================================
// SuccessState - Estado de éxito
// ============================================

export interface SuccessStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const SuccessState = React.forwardRef<HTMLDivElement, SuccessStateProps>(
  ({ className, title = "¡Éxito!", description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center py-16 text-center",
          className
        )}
        {...props}
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-10 w-10 text-success" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground max-w-md mb-6">
            {description}
          </p>
        )}
        {action && <div>{action}</div>}
      </div>
    );
  }
);
SuccessState.displayName = "SuccessState";
