import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, RotateCcw, Clock, User } from 'lucide-react';
import { useLandingVersions } from '@/hooks/useLandingVersions';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

interface LandingVersionHistoryProps {
  landingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRestore?: (version: any) => void;
}

export const LandingVersionHistory = ({ 
  landingId, 
  open, 
  onOpenChange,
  onRestore 
}: LandingVersionHistoryProps) => {
  const { data: versions, isLoading } = useLandingVersions(landingId);

  const handleRestore = (version: any) => {
    if (onRestore) {
      onRestore(version.snapshot_json);
      toast.success(`Restaurando a versión ${version.version_number}`);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historial de Versiones
          </DialogTitle>
          <DialogDescription>
            Revisa y restaura versiones anteriores de esta landing page
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">Cargando historial...</div>
            </div>
          ) : !versions || versions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <History className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Sin historial</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                No hay versiones anteriores. El historial se creará automáticamente cuando edites esta landing.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {versions.map((version, index) => (
                <div 
                  key={version.id}
                  className="relative pl-8 pb-8 border-l-2 border-border last:border-l-0 last:pb-0"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                  
                  <div className="bg-card border rounded-lg p-4 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={index === 0 ? 'default' : 'secondary'}>
                            Versión {version.version_number}
                          </Badge>
                          {index === 0 && (
                            <Badge variant="outline" className="text-xs">
                              Actual
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium">
                          {version.change_summary || 'Sin descripción de cambios'}
                        </p>
                      </div>
                      
                      {index !== 0 && onRestore && (
                        <Button
                          onClick={() => handleRestore(version)}
                          variant="outline"
                          size="sm"
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Restaurar
                        </Button>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {format(new Date(version.created_at), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                        </span>
                      </div>
                      {version.created_by && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>Usuario</span>
                        </div>
                      )}
                    </div>

                    {/* Snapshot preview */}
                    <details className="text-xs">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                        Ver snapshot completo
                      </summary>
                      <pre className="mt-2 p-3 bg-muted rounded text-[10px] overflow-x-auto">
                        {JSON.stringify(version.snapshot_json, null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
