import * as React from "react";
import { cn } from "@/lib/utils";

// ============================================
// Container - Contenedor principal
// ============================================

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "xl", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full px-4 sm:px-6 lg:px-8",
          {
            "max-w-3xl": size === "sm",
            "max-w-5xl": size === "md",
            "max-w-6xl": size === "lg",
            "max-w-7xl": size === "xl",
            "max-w-full": size === "full",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Container.displayName = "Container";

// ============================================
// Section - Sección de página
// ============================================

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing = "lg", ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          {
            "py-0": spacing === "none",
            "py-8 md:py-12": spacing === "sm",
            "py-12 md:py-16": spacing === "md",
            "py-16 md:py-20": spacing === "lg",
            "py-20 md:py-28": spacing === "xl",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Section.displayName = "Section";

// ============================================
// Grid - Grid responsive
// ============================================

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4 | 6;
  gap?: number;
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, columns = 3, gap = 6, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid",
          {
            "grid-cols-1": columns === 1,
            "grid-cols-1 md:grid-cols-2": columns === 2,
            "grid-cols-1 md:grid-cols-2 lg:grid-cols-3": columns === 3,
            "grid-cols-1 md:grid-cols-2 lg:grid-cols-4": columns === 4,
            "grid-cols-2 md:grid-cols-3 lg:grid-cols-6": columns === 6,
          },
          `gap-${gap}`,
          className
        )}
        {...props}
      />
    );
  }
);
Grid.displayName = "Grid";

// ============================================
// Stack - Flex vertical
// ============================================

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: number;
  align?: "start" | "center" | "end" | "stretch";
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, spacing = 4, align = "stretch", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col",
          `gap-${spacing}`,
          {
            "items-start": align === "start",
            "items-center": align === "center",
            "items-end": align === "end",
            "items-stretch": align === "stretch",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Stack.displayName = "Stack";

// ============================================
// Cluster - Flex horizontal
// ============================================

export interface ClusterProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: number;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between";
  wrap?: boolean;
}

export const Cluster = React.forwardRef<HTMLDivElement, ClusterProps>(
  ({ className, spacing = 4, align = "center", justify = "start", wrap = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          `gap-${spacing}`,
          {
            "items-start": align === "start",
            "items-center": align === "center",
            "items-end": align === "end",
            "items-stretch": align === "stretch",
            "justify-start": justify === "start",
            "justify-center": justify === "center",
            "justify-end": justify === "end",
            "justify-between": justify === "between",
            "flex-wrap": wrap,
          },
          className
        )}
        {...props}
      />
    );
  }
);
Cluster.displayName = "Cluster";

// ============================================
// Hero - Layout para hero sections
// ============================================

export interface HeroProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "centered" | "split";
}

export const Hero = React.forwardRef<HTMLDivElement, HeroProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden",
          {
            "py-20 md:py-28": variant === "default",
            "py-20 md:py-28 text-center": variant === "centered",
            "grid gap-12 py-20 md:grid-cols-2 md:items-center md:py-28": variant === "split",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Hero.displayName = "Hero";

// ============================================
// SplitLayout - Layout 50/50
// ============================================

export interface SplitLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  reverse?: boolean;
  imagePosition?: "left" | "right";
}

export const SplitLayout = React.forwardRef<HTMLDivElement, SplitLayoutProps>(
  ({ className, reverse = false, imagePosition = "right", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid gap-8 md:grid-cols-2 md:items-center md:gap-12",
          {
            "md:flex-row-reverse": reverse || imagePosition === "left",
          },
          className
        )}
        {...props}
      />
    );
  }
);
SplitLayout.displayName = "SplitLayout";
