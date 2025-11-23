import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

// ============================================
// Breadcrumb - Navegación de migas de pan
// ============================================

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
}

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, items, ...props }, ref) => {
    return (
      <nav ref={ref} aria-label="Breadcrumb" className={cn("", className)} {...props}>
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={index} className="flex items-center gap-2">
                {item.href && !isLast ? (
                  <Link
                    to={item.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={cn(isLast && "font-medium text-foreground")}>
                    {item.label}
                  </span>
                )}
                {!isLast && <ChevronRight className="h-4 w-4" />}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
);
Breadcrumb.displayName = "Breadcrumb";

// ============================================
// NavTabs - Navegación por tabs
// ============================================

export interface NavTab {
  id: string;
  label: string;
  href?: string;
}

export interface NavTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: NavTab[];
  activeTab: string;
  onTabChange?: (tabId: string) => void;
}

export const NavTabs = React.forwardRef<HTMLDivElement, NavTabsProps>(
  ({ className, tabs, activeTab, onTabChange, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("border-b border-border", className)}
        {...props}
      >
        <nav className="flex gap-4" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            const handleClick = (e: React.MouseEvent) => {
              if (onTabChange && !tab.href) {
                e.preventDefault();
                onTabChange(tab.id);
              }
            };

            const className = cn(
              "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
            );

            if (tab.href) {
              return (
                <Link key={tab.id} to={tab.href} className={className}>
                  {tab.label}
                </Link>
              );
            }

            return (
              <button
                key={tab.id}
                onClick={handleClick}
                className={className}
                aria-current={isActive ? "page" : undefined}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    );
  }
);
NavTabs.displayName = "NavTabs";

// ============================================
// Stepper - Wizard steps
// ============================================

export interface Step {
  id: string;
  label: string;
  description?: string;
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: Step[];
  currentStep: number;
}

export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ className, steps, currentStep, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("", className)} {...props}>
        <ol className="flex items-center">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;

            return (
              <li
                key={step.id}
                className={cn(
                  "flex items-center",
                  index !== steps.length - 1 && "flex-1"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                      isCompleted &&
                        "border-accent bg-accent text-accent-foreground",
                      isCurrent &&
                        "border-accent bg-background text-accent",
                      !isCompleted &&
                        !isCurrent &&
                        "border-border bg-background text-muted-foreground"
                    )}
                  >
                    {isCompleted ? "✓" : stepNumber}
                  </div>
                  <div className="hidden md:block">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        (isCompleted || isCurrent)
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {step.label}
                    </p>
                    {step.description && (
                      <p className="text-xs text-muted-foreground">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
                {index !== steps.length - 1 && (
                  <div
                    className={cn(
                      "mx-4 h-0.5 flex-1 transition-colors",
                      isCompleted ? "bg-accent" : "bg-border"
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    );
  }
);
Stepper.displayName = "Stepper";
