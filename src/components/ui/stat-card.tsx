import { cn } from "@/lib/utils";
import { useCountUp } from "@/hooks/useCountUp";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  description: string;
  className?: string;
  icon?: LucideIcon;
  delay?: number;
}

export const StatCard = ({ 
  label, 
  value, 
  description, 
  className,
  icon: Icon,
  delay = 0
}: StatCardProps) => {
  // Extraer número del valor (ej: "300+" -> 300)
  const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
  const suffix = value.replace(/[0-9]/g, ''); // Extraer "+", "%", etc.
  
  const { count, ref } = useCountUp({ 
    end: numericValue,
    duration: 2000,
  });

  return (
    <div 
      ref={ref}
      className={cn(
        "flex flex-col gap-4 p-8 rounded-xl",
        "bg-muted/50 border border-border",
        "shadow-sm hover:shadow-xl",
        "hover:-translate-y-1 transition-all duration-300",
        "opacity-0 animate-fade-in",
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards'
      }}
    >
      {/* Icon opcional */}
      {Icon && (
        <div className="flex items-center justify-between">
          <Icon className="h-8 w-8 text-accent/60" />
        </div>
      )}
      
      {/* Label */}
      <div className="text-xs font-sans font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      
      {/* Value con contador animado */}
      <div className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-foreground leading-tight">
        {count}{suffix}
      </div>
      
      {/* Description */}
      <p className="text-base text-foreground/70 leading-relaxed">
        {description}
      </p>
    </div>
  );
};
