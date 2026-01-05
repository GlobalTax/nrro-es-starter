import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateResource, useUpdateResource, AdminResource } from "@/hooks/useAdminResources";
import { resourceTypes, resourceCategories } from "@/hooks/useResources";
import { useEffect } from "react";

const resourceFormSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().optional(),
  type: z.enum(["country_guide", "template", "webinar", "white_paper"]),
  category: z.enum(["accounting", "corporate_legal", "governance", "payroll", "tax", "transfer_pricing", "treasury"]),
  file_url: z.string().url("URL inválida").optional().or(z.literal("")),
  thumbnail_url: z.string().optional(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  published_at: z.string().optional(),
});

type ResourceFormValues = z.infer<typeof resourceFormSchema>;

interface ResourceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource?: AdminResource | null;
}

const typeLabels: Record<string, string> = {
  country_guide: "Guía de País",
  template: "Plantilla",
  webinar: "Webinar",
  white_paper: "White Paper",
};

const categoryLabels: Record<string, string> = {
  accounting: "Contabilidad",
  corporate_legal: "Mercantil",
  governance: "Gobierno Corporativo",
  payroll: "Nóminas",
  tax: "Fiscal",
  transfer_pricing: "Precios de Transferencia",
  treasury: "Tesorería",
};

export const ResourceFormDialog = ({
  open,
  onOpenChange,
  resource,
}: ResourceFormDialogProps) => {
  const createMutation = useCreateResource();
  const updateMutation = useUpdateResource();

  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "template",
      category: "tax",
      file_url: "",
      thumbnail_url: "",
      is_featured: false,
      is_active: true,
      published_at: new Date().toISOString(),
    },
  });

  useEffect(() => {
    if (resource) {
      form.reset({
        title: resource.title,
        description: resource.description || "",
        type: resource.type,
        category: resource.category,
        file_url: resource.file_url || "",
        thumbnail_url: resource.thumbnail_url || "",
        is_featured: resource.is_featured || false,
        is_active: resource.is_active ?? true,
        published_at: resource.published_at || new Date().toISOString(),
      });
    } else {
      form.reset({
        title: "",
        description: "",
        type: "template",
        category: "tax",
        file_url: "",
        thumbnail_url: "",
        is_featured: false,
        is_active: true,
        published_at: new Date().toISOString(),
      });
    }
  }, [resource, form]);

  const onSubmit = async (values: ResourceFormValues) => {
    const resourceData = {
      title: values.title,
      type: values.type,
      category: values.category,
      description: values.description || null,
      file_url: values.file_url || null,
      thumbnail_url: values.thumbnail_url || null,
      published_at: values.published_at || null,
      is_featured: values.is_featured,
      is_active: values.is_active,
      countries: null,
      personas: null,
    };

    if (resource) {
      await updateMutation.mutateAsync({ id: resource.id, ...resourceData });
    } else {
      await createMutation.mutateAsync(resourceData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {resource ? "Editar Recurso" : "Nuevo Recurso"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Guía: Cómo Constituir una Empresa..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Breve descripción del recurso (1-2 líneas)"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {resourceTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {typeLabels[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {resourceCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {categoryLabels[category]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="file_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL del Archivo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://ejemplo.com/documento.pdf"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="thumbnail_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de Imagen de Portada</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://ejemplo.com/imagen.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-8">
              <FormField
                control={form.control}
                name="is_featured"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Destacado</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Activo (visible)</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Guardando..."
                  : resource
                  ? "Actualizar"
                  : "Crear"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
