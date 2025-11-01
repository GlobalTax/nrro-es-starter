import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  description: string;
  className?: string;
}

export const StatCard = ({ label, value, description, className }: StatCardProps) => {
  return (
    <div 
      className={cn(
        "flex flex-col gap-4 p-8 rounded-lg bg-muted/50 transition-colors hover:bg-muted/70",
        className
      )}
    >
      {/* Label - mono, pequeño, mayúsculas */}
      <div className="text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      
      {/* Value - número grande */}
      <div className="text-5xl md:text-6xl font-display font-bold text-foreground">
        {value}
      </div>
      
      {/* Description - párrafo */}
      <p className="text-sm text-foreground/70 leading-relaxed">
        {description}
      </p>
    </div>
  );
};
