import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SyncProgressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
  summary: {
    pagesAdded: number;
    pagesUpdated: number;
    pagesArchived: number;
    pagesTotal: number;
  } | null;
  error: string | null;
}

export const SyncProgressModal = ({
  open,
  onOpenChange,
  isLoading,
  summary,
  error,
}: SyncProgressModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isLoading ? 'Sincronizando...' : error ? 'Error' : 'Sincronización Completada'}
          </DialogTitle>
          <DialogDescription>
            {isLoading && 'Comparando sitemap.xml con la base de datos...'}
            {!isLoading && !error && 'La sincronización ha finalizado correctamente'}
            {error && 'Ocurrió un error durante la sincronización'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Loading state */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-sm text-muted-foreground">
                Esto puede tardar unos segundos...
              </p>
            </div>
          )}

          {/* Success state */}
          {!isLoading && summary && !error && (
            <div className="space-y-4">
              <div className="flex items-center justify-center py-4">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                    {summary.pagesAdded}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-500 mt-1">
                    Páginas nuevas
                  </div>
                </div>

                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                    {summary.pagesUpdated}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-500 mt-1">
                    Actualizadas
                  </div>
                </div>

                <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                    {summary.pagesArchived}
                  </div>
                  <div className="text-xs text-orange-600 dark:text-orange-500 mt-1">
                    Archivadas
                  </div>
                </div>

                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                    {summary.pagesTotal}
                  </div>
                  <div className="text-xs text-purple-600 dark:text-purple-500 mt-1">
                    Total en sitemap
                  </div>
                </div>
              </div>

              <Button onClick={() => onOpenChange(false)} className="w-full">
                Cerrar
              </Button>
            </div>
          )}

          {/* Error state */}
          {!isLoading && error && (
            <div className="space-y-4">
              <div className="flex items-center justify-center py-4">
                <XCircle className="h-16 w-16 text-red-600" />
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full"
              >
                Cerrar
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};