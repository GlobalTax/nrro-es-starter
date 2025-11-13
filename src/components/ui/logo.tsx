import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import logoFull from "@/assets/logos/navarro-tax-legal.svg";
import logoFullWhite from "@/assets/logos/navarro-tax-legal-white.svg";
import logoCompact from "@/assets/logos/navarro.svg";
import logoCompactWhite from "@/assets/logos/navarro-white.svg";

interface LogoProps {
  variant?: "full" | "compact";
  color?: "dark" | "light";
  className?: string;
  asLink?: boolean;
  to?: string;
}

export const Logo = ({ 
  variant = "full", 
  color = "dark", 
  className,
  asLink = true,
  to = "/"
}: LogoProps) => {
  const getLogoSrc = () => {
    if (variant === "full") {
      return color === "light" ? logoFullWhite : logoFull;
    }
    return color === "light" ? logoCompactWhite : logoCompact;
  };

  const logoImage = (
    <img
      src={getLogoSrc()}
      alt="Navarro Tax Legal"
      className="h-full w-auto"
    />
  );

  if (!asLink) {
    return (
      <div className={cn("inline-block", className)}>
        {logoImage}
      </div>
    );
  }

  return (
    <Link 
      to={to}
      className={cn("inline-block group transition-opacity hover:opacity-80", className)}
      aria-label="Navarro Tax Legal - Inicio"
    >
      {logoImage}
    </Link>
  );
};
