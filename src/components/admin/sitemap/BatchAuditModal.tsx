import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, XCircle, Loader2, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BatchAuditResult {
  sitePageId: string;
  url: string;
  success: boolean;
  overallScore?: number;
  error?: string;
}

interface BatchAuditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isRunning: boolean;
  progress: number;
  total: number;
  results: BatchAuditResult[];
  onCancel: () => void;
  onComplete?: () => void;
}

export function BatchAuditModal({
  open,
  onOpenChange,
  isRunning,
  progress,
  total,
  results,
  onCancel,
  onComplete,
}: BatchAuditModalProps) {
  const isComplete = progress >= total && total > 0;
  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;
  const progressPercentage = total > 0 ? (progress / total) * 100 : 0;
  
  // Estimate remaining time (10 seconds per page average)
  const remainingPages = total - progress;
  const estimatedMinutes = Math.ceil((remainingPages * 10) / 60);

  const getScoreColor = (score?: number) => {
    if (!score) return "text-muted-foreground";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const handleClose = () => {
    if (!isRunning) {
      onOpenChange(false);
      onComplete?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isComplete ? "Auditoría completada" : "Auditoría en progreso"}
          </DialogTitle>
          <DialogDescription>
            {isComplete 
              ? `Se han auditado ${total} páginas` 
              : `Auditando páginas del sitemap...`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Progress Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{progress} de {total} páginas</span>
              {isRunning && remainingPages > 0 && (
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  ~{estimatedMinutes} min restantes
                </span>
              )}
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Stats Summary */}
          {results.length > 0 && (
            <div className="flex gap-4 py-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm">{successCount} completadas</span>
              </div>
              {failCount > 0 && (
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm">{failCount} errores</span>
                </div>
              )}
            </div>
          )}

          {/* Results List */}
          <ScrollArea className="h-[300px] border rounded-md">
            <div className="p-2 space-y-1">
              {results.map((result, index) => (
                <div
                  key={result.sitePageId}
                  className={cn(
                    "flex items-center justify-between py-2 px-3 rounded-md text-sm",
                    result.success ? "bg-muted/50" : "bg-red-50 dark:bg-red-900/10"
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {result.success ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                    )}
                    <span className="truncate">
                      {new URL(result.url).pathname || '/'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.success && result.overallScore !== undefined ? (
                      <Badge 
                        variant="outline" 
                        className={cn("font-bold", getScoreColor(result.overallScore))}
                      >
                        {result.overallScore}
                      </Badge>
                    ) : result.error ? (
                      <span className="text-xs text-red-600 truncate max-w-[150px]">
                        {result.error}
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
              
              {/* Pending items indicator */}
              {isRunning && progress < total && (
                <div className="flex items-center gap-2 py-2 px-3 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Procesando siguiente página...</span>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            {isRunning ? (
              <Button variant="destructive" onClick={onCancel}>
                <AlertTriangle className="h-4 w-4 mr-2" />
                Cancelar auditoría
              </Button>
            ) : (
              <Button onClick={handleClose}>
                Cerrar
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
