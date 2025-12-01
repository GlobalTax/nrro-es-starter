import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdateSitePage } from "@/hooks/useSitePages";
import type { SitePage } from "@/hooks/useSitePages";
import { ExternalLink } from "lucide-react";

const redirectSchema = z.object({
  redirect_url: z.string().url("Debe ser una URL válida").min(1, "La URL es requerida"),
});

type RedirectFormValues = z.infer<typeof redirectSchema>;

interface RedirectDialogProps {
  page: SitePage | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RedirectDialog = ({ page, isOpen, onClose }: RedirectDialogProps) => {
  const updatePage = useUpdateSitePage();

  const form = useForm<RedirectFormValues>({
    resolver: zodResolver(redirectSchema),
    defaultValues: {
      redirect_url: page?.redirect_url || "",
    },
  });

  const onSubmit = async (data: RedirectFormValues) => {
    if (!page) return;

    await updatePage.mutateAsync({
      id: page.id,
      data: {
        redirect_url: data.redirect_url,
        status: 'archived', // Archivar al crear redirección
      },
    });

    onClose();
  };

  const handleRemoveRedirect = async () => {
    if (!page) return;

    await updatePage.mutateAsync({
      id: page.id,
      data: {
        redirect_url: null,
        status: 'published', // Reactivar al eliminar redirección
      },
    });

    onClose();
  };

  if (!page) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configurar Redirección 301</DialogTitle>
          <DialogDescription>
            Define una redirección permanente (301) para esta página. La página será archivada automáticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 bg-muted rounded-lg text-sm">
            <div className="font-medium mb-1">Página actual:</div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="flex-1 truncate">{page.url}</span>
              <a
                href={page.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="redirect_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de destino</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://nrro.es/nueva-pagina"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Los visitantes serán redirigidos automáticamente a esta URL
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2">
                {page.redirect_url && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleRemoveRedirect}
                    disabled={updatePage.isPending}
                  >
                    Eliminar Redirección
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={updatePage.isPending}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={updatePage.isPending}>
                  {updatePage.isPending ? "Guardando..." : "Guardar Redirección"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
