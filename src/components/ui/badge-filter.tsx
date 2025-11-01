import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface BadgeFilterProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
}

export const BadgeFilter = ({ label, active, onClick, onRemove }: BadgeFilterProps) => {
  // Support both onClick and onRemove patterns
  const handleClick = onRemove || onClick;
  
  return (
    <Badge
      variant={active ? "selected" : "secondary"}
      className="cursor-pointer gap-1"
      onClick={handleClick}
    >
      {label}
      {onRemove && <X className="h-3 w-3" />}
    </Badge>
  );
};
