import { ReactNode } from "react";
import { cn } from "@/lib/utils";

// ============================================
// Overline - Texto pequeño uppercase
// ============================================

interface OverlineProps {
  children: ReactNode;
  className?: string;
}

export const Overline = ({ children, className = "" }: OverlineProps) => (
  <div className={cn("text-overline", className)}>
    {children}
  </div>
);

// ============================================
// SectionHeader - Header de sección
// ============================================

interface SectionHeaderProps {
  overline?: string;
  title: string;
  description?: string;
  className?: string;
  centered?: boolean;
}

export const SectionHeader = ({ 
  overline, 
  title, 
  description, 
  className = "",
  centered = false,
}: SectionHeaderProps) => (
  <div className={cn("mb-12", centered && "text-center mx-auto", className)}>
    {overline && <Overline className="mb-3">{overline}</Overline>}
    <h2 className="mb-4">{title}</h2>
    {description && (
      <p className={cn("text-lead", centered ? "max-w-2xl mx-auto" : "max-w-2xl")}>{description}</p>
    )}
  </div>
);

// ============================================
// Heading - Componente de encabezado flexible
// ============================================

interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  gradient?: boolean;
  className?: string;
}

export const Heading = ({ 
  level = 2, 
  children, 
  gradient = false,
  className = "" 
}: HeadingProps) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <Tag className={cn(gradient && "gradient-text", className)}>
      {children}
    </Tag>
  );
};

// ============================================
// Lead - Texto destacado
// ============================================

interface LeadProps {
  children: ReactNode;
  className?: string;
}

export const Lead = ({ children, className = "" }: LeadProps) => (
  <p className={cn("text-lg md:text-xl text-muted-foreground leading-relaxed", className)}>
    {children}
  </p>
);

// ============================================
// Body - Texto de cuerpo
// ============================================

interface BodyProps {
  children: ReactNode;
  className?: string;
}

export const Body = ({ children, className = "" }: BodyProps) => (
  <p className={cn("text-base text-foreground leading-relaxed", className)}>
    {children}
  </p>
);

// ============================================
// Small - Texto pequeño
// ============================================

interface SmallProps {
  children: ReactNode;
  className?: string;
}

export const Small = ({ children, className = "" }: SmallProps) => (
  <p className={cn("text-sm text-muted-foreground", className)}>
    {children}
  </p>
);

// ============================================
// GradientText - Texto con gradiente
// ============================================

interface GradientTextProps {
  children: ReactNode;
  className?: string;
}

export const GradientText = ({ children, className = "" }: GradientTextProps) => (
  <span className={cn("gradient-text", className)}>
    {children}
  </span>
);
