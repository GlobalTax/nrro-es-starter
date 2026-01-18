import { ReactNode } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface DetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  onSave?: () => void;
  onDelete?: () => void;
  isSaving?: boolean;
  isDeleting?: boolean;
  saveLabel?: string;
  deleteLabel?: string;
  showFooter?: boolean;
  size?: 'default' | 'lg' | 'xl';
}

export const DetailSheet = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSave,
  onDelete,
  isSaving = false,
  isDeleting = false,
  saveLabel = 'Guardar',
  deleteLabel = 'Eliminar',
  showFooter = true,
  size = 'default',
}: DetailSheetProps) => {
  const sizeClasses = {
    default: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className={`${sizeClasses[size]} flex flex-col p-0`}>
        <SheetHeader className="px-6 py-4 border-b border-slate-100">
          <SheetTitle className="text-lg font-medium text-slate-900">
            {title}
          </SheetTitle>
          {description && (
            <SheetDescription className="text-sm text-slate-500">
              {description}
            </SheetDescription>
          )}
        </SheetHeader>

        <ScrollArea className="flex-1 px-6 py-4">{children}</ScrollArea>

        {showFooter && (onSave || onDelete) && (
          <SheetFooter className="px-6 py-4 border-t border-slate-100 flex-row justify-between gap-2">
            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-2" />
                    )}
                    {deleteLabel}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar registro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. El registro será eliminado
                      permanentemente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <div className="flex gap-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="border-slate-200"
              >
                Cancelar
              </Button>
              {onSave && (
                <Button
                  size="sm"
                  onClick={onSave}
                  disabled={isSaving}
                  className="bg-slate-900 hover:bg-slate-800"
                >
                  {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  {saveLabel}
                </Button>
              )}
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
