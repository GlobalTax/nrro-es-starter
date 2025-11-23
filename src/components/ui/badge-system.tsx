import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { themeConfig } from "@/components/design-system/theme-config";

// ============================================
// BadgeArea - Badge para áreas de servicio
// ============================================

const badgeAreaVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-smooth",
  {
    variants: {
      area: {
        fiscal: "bg-[hsl(172_60%_15%_/_0.1)] text-[hsl(172_60%_15%)]",
        legal: "bg-[hsl(190_63%_6%_/_0.1)] text-[hsl(190_63%_6%)]",
        laboral: "bg-[hsl(142_76%_36%_/_0.1)] text-[hsl(142_76%_36%)]",
        contable: "bg-[hsl(195_3%_62%_/_0.1)] text-[hsl(195_3%_62%)]",
        "asesoria-empresas": "bg-[hsl(191_48%_9%_/_0.1)] text-[hsl(191_48%_9%)]",
      },
    },
    defaultVariants: {
      area: "fiscal",
    },
  }
);

export interface BadgeAreaProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeAreaVariants> {}

export const BadgeArea = React.forwardRef<HTMLDivElement, BadgeAreaProps>(
  ({ className, area, children, ...props }, ref) => {
    const label = children || (area && themeConfig.serviceAreas[area]?.label) || "";
    return (
      <div
        ref={ref}
        className={cn(badgeAreaVariants({ area }), className)}
        {...props}
      >
        {label}
      </div>
    );
  }
);
BadgeArea.displayName = "BadgeArea";

// ============================================
// BadgeStatus - Badge para estados
// ============================================

const badgeStatusVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-smooth",
  {
    variants: {
      status: {
        active: "bg-[hsl(142_76%_36%_/_0.1)] text-[hsl(142_76%_36%)]",
        pending: "bg-[hsl(45_93%_47%_/_0.1)] text-[hsl(45_93%_47%)]",
        completed: "bg-[hsl(172_60%_15%_/_0.1)] text-[hsl(172_60%_15%)]",
        cancelled: "bg-[hsl(0_84.2%_60.2%_/_0.1)] text-[hsl(0_84.2%_60.2%)]",
        draft: "bg-[hsl(195_3%_62%_/_0.1)] text-[hsl(195_3%_62%)]",
      },
    },
    defaultVariants: {
      status: "active",
    },
  }
);

export interface BadgeStatusProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeStatusVariants> {}

export const BadgeStatus = React.forwardRef<HTMLDivElement, BadgeStatusProps>(
  ({ className, status, children, ...props }, ref) => {
    const label = children || (status && themeConfig.statuses[status]?.label) || "";
    return (
      <div
        ref={ref}
        className={cn(badgeStatusVariants({ status }), className)}
        {...props}
      >
        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
        {label}
      </div>
    );
  }
);
BadgeStatus.displayName = "BadgeStatus";

// ============================================
// BadgePriority - Badge para prioridades
// ============================================

const badgePriorityVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-smooth",
  {
    variants: {
      priority: {
        low: "bg-[hsl(195_3%_62%_/_0.1)] text-[hsl(195_3%_62%)]",
        medium: "bg-[hsl(45_93%_47%_/_0.1)] text-[hsl(45_93%_47%)]",
        high: "bg-[hsl(24_70%_50%_/_0.1)] text-[hsl(24_70%_50%)]",
        urgent: "bg-[hsl(0_84.2%_60.2%_/_0.1)] text-[hsl(0_84.2%_60.2%)]",
      },
    },
    defaultVariants: {
      priority: "medium",
    },
  }
);

export interface BadgePriorityProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgePriorityVariants> {}

export const BadgePriority = React.forwardRef<HTMLDivElement, BadgePriorityProps>(
  ({ className, priority, children, ...props }, ref) => {
    const label = children || (priority && themeConfig.priorities[priority]?.label) || "";
    return (
      <div
        ref={ref}
        className={cn(badgePriorityVariants({ priority }), className)}
        {...props}
      >
        {label}
      </div>
    );
  }
);
BadgePriority.displayName = "BadgePriority";

// ============================================
// BadgePill - Badge redondeado grande
// ============================================

const badgePillVariants = cva(
  "inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-smooth",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground",
        gradient: "bg-gradient-accent text-primary-foreground shadow-soft",
        outline: "border border-border bg-transparent text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgePillProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgePillVariants> {}

export const BadgePill = React.forwardRef<HTMLDivElement, BadgePillProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgePillVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
BadgePill.displayName = "BadgePill";

// ============================================
// BadgeCount - Badge con contador
// ============================================

export interface BadgeCountProps extends React.HTMLAttributes<HTMLDivElement> {
  count: number;
  max?: number;
}

export const BadgeCount = React.forwardRef<HTMLDivElement, BadgeCountProps>(
  ({ className, count, max = 99, ...props }, ref) => {
    const displayCount = count > max ? `${max}+` : count;
    
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-semibold text-destructive-foreground",
          className
        )}
        {...props}
      >
        {displayCount}
      </div>
    );
  }
);
BadgeCount.displayName = "BadgeCount";
