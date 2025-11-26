import { Badge } from "@/components/ui/badge";
import { getCategoryColor } from "@/lib/landingUtils";

interface LandingCategoryBadgeProps {
  category: string;
}

export const LandingCategoryBadge = ({ category }: LandingCategoryBadgeProps) => {
  return (
    <Badge className={getCategoryColor(category)}>
      {category}
    </Badge>
  );
};
