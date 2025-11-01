import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeHeroProps {
  children: ReactNode;
  variant?: "dark" | "light";
  className?: string;
}

export const BadgeHero = ({ 
  children, 
  variant = "dark", 
  className 
}: BadgeHeroProps) => {
  return (
    <span 
      className={cn(
        variant === "dark" ? "badge-hero" : "badge-hero-light",
        className
      )}
    >
      {children}
    </span>
  );
};
