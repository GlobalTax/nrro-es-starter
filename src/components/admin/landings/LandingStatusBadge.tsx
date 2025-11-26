import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/landingUtils";

interface LandingStatusBadgeProps {
  status: string;
}

export const LandingStatusBadge = ({ status }: LandingStatusBadgeProps) => {
  const displayStatus = status === 'needs_review' ? 'Needs Review' : 
                        status.charAt(0).toUpperCase() + status.slice(1);
  
  return (
    <Badge variant="outline" className={getStatusColor(status)}>
      {displayStatus}
    </Badge>
  );
};
