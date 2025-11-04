import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, FileText } from "lucide-react";
import { JobPosition } from "@/types/jobPosition";

interface JobPositionCardProps {
  position: JobPosition;
  onViewDetails: (position: JobPosition) => void;
}

export const JobPositionCard = ({ position, onViewDetails }: JobPositionCardProps) => {
  const previewText = position.description 
    ? position.description.substring(0, 120) + "..." 
    : "Descripción no disponible";

  return (
    <Card className="hover-lift h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-normal">{position.title}</h3>
            {position.is_featured && (
              <Badge variant="default" className="ml-2">Destacado</Badge>
            )}
          </div>
          
          <Badge variant="outline" className="mb-3">{position.department}</Badge>
          
          <div className="space-y-2 mb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{position.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{position.contract_type} • {position.working_hours}</span>
            </div>
            {position.salary_range && (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>{position.salary_range}</span>
              </div>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {previewText}
          </p>
        </div>
        
        <Button 
          onClick={() => onViewDetails(position)} 
          variant="outline"
          className="w-full"
        >
          Ver detalles
        </Button>
      </CardContent>
    </Card>
  );
};
