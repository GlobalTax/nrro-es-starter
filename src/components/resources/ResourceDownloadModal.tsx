import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { FileText, Download, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Resource } from "@/hooks/useResources";

interface ResourceDownloadModalProps {
  resource: Resource | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  company: z.string().optional(),
  acceptsMarketing: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

export const ResourceDownloadModal = ({
  resource,
  open,
  onOpenChange,
}: ResourceDownloadModalProps) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      acceptsMarketing: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!resource) return;

    setIsSubmitting(true);

    try {
      // Register the download (lead capture)
      const { error } = await supabase.from("resource_downloads").insert({
        resource_id: resource.id,
        name: data.name,
        email: data.email,
        company: data.company || null,
        accepts_marketing: data.acceptsMarketing,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
      });

      if (error) throw error;

      // Open the file URL
      if (resource.file_url) {
        window.open(resource.file_url, "_blank");
      }

      toast.success(t("resources.downloadSuccess", "¡Descarga iniciada!"));
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error submitting download:", error);
      toast.error(t("resources.downloadError", "Error al procesar la descarga"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!resource) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-xl">
              {t("resources.downloadTitle", "Descargar recurso")}
            </DialogTitle>
          </div>
          <DialogDescription>
            {t(
              "resources.downloadDescription",
              "Completa tus datos para acceder al recurso:"
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Resource preview */}
        <div className="p-3 rounded-lg bg-muted/50 border border-border/50 mb-4">
          <p className="font-medium text-foreground line-clamp-2">
            {resource.title}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {t(`resources.types.${resource.type}`, resource.type)}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("resources.form.name", "Nombre")} *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("resources.form.namePlaceholder", "Tu nombre")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("resources.form.email", "Email")} *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t("resources.form.emailPlaceholder", "tu@email.com")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("resources.form.company", "Empresa")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("resources.form.companyPlaceholder", "Tu empresa")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="acceptsMarketing"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-normal text-muted-foreground cursor-pointer">
                      {t(
                        "resources.form.acceptsMarketing",
                        "Acepto recibir contenido y novedades por email"
                      )}
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("resources.form.processing", "Procesando...")}
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  {t("resources.form.submit", "Descargar ahora")}
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              {t(
                "resources.form.privacy",
                "Tus datos serán tratados conforme a nuestra política de privacidad"
              )}
            </p>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
