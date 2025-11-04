import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, FileText, CheckCircle2 } from "lucide-react";
import { JobPosition } from "@/types/jobPosition";
import ReactMarkdown from "react-markdown";

interface JobPositionModalProps {
  position: JobPosition | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (position: JobPosition) => void;
}

export const JobPositionModal = ({
  position,
  open,
  onOpenChange,
  onApply,
}: JobPositionModalProps) => {
  if (!position) return null;

  const handleApply = () => {
    onApply(position);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl mb-2">{position.title}</DialogTitle>
              <DialogDescription className="flex flex-wrap gap-2 items-center">
                <Badge variant="outline">{position.department}</Badge>
                <span className="flex items-center gap-1 text-sm">
                  <MapPin className="h-3 w-3" />
                  {position.location}
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <Clock className="h-3 w-3" />
                  {position.contract_type} • {position.working_hours}
                </span>
                {position.salary_range && (
                  <span className="flex items-center gap-1 text-sm">
                    <FileText className="h-3 w-3" />
                    {position.salary_range}
                  </span>
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Descripción */}
          <div>
            <h4 className="text-lg font-normal mb-3">Sobre el puesto</h4>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{position.description || "Descripción no disponible"}</ReactMarkdown>
            </div>
          </div>

          {/* Responsabilidades */}
          {position.responsibilities.length > 0 && (
            <div>
              <h4 className="text-lg font-normal mb-3">Responsabilidades</h4>
              <ul className="space-y-2">
                {position.responsibilities.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requisitos */}
          {position.requirements.length > 0 && (
            <div>
              <h4 className="text-lg font-normal mb-3">Requisitos</h4>
              <ul className="space-y-2">
                {position.requirements.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleApply} size="lg" className="w-full">
            Aplicar a esta posición
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
