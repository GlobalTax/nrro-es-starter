import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Download, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Resource } from "@/hooks/useResources";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteConfig } from "@/hooks/useSiteConfig";

interface ResourceDownloadFormProps {
  resource: Resource;
}

const formSchema = z.object({
  name: z.string().min(2, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  company: z.string().optional(),
  acceptMarketing: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export const ResourceDownloadForm = ({ resource }: ResourceDownloadFormProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const siteConfig = useSiteConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      acceptMarketing: false,
    },
  });

  const texts = {
    es: {
      title: "Descarga gratuita",
      subtitle: "Completa el formulario para acceder al recurso",
      name: "Nombre completo",
      email: "Email corporativo",
      company: "Empresa (opcional)",
      marketing: "Acepto recibir comunicaciones sobre recursos y novedades",
      submit: "Descargar ahora",
      submitting: "Procesando...",
      successTitle: "¡Descarga lista!",
      successMessage: "El recurso se está descargando. También te hemos enviado un email con el enlace.",
      errorTitle: "Error",
      errorMessage: "No se pudo procesar la solicitud. Inténtalo de nuevo.",
    },
    en: {
      title: "Free download",
      subtitle: "Fill out the form to access the resource",
      name: "Full name",
      email: "Work email",
      company: "Company (optional)",
      marketing: "I agree to receive communications about resources and updates",
      submit: "Download now",
      submitting: "Processing...",
      successTitle: "Download ready!",
      successMessage: "The resource is downloading. We've also sent you an email with the link.",
      errorTitle: "Error",
      errorMessage: "Could not process the request. Please try again.",
    },
    ca: {
      title: "Descàrrega gratuïta",
      subtitle: "Omple el formulari per accedir al recurs",
      name: "Nom complet",
      email: "Email corporatiu",
      company: "Empresa (opcional)",
      marketing: "Accepto rebre comunicacions sobre recursos i novetats",
      submit: "Descarregar ara",
      submitting: "Processant...",
      successTitle: "Descàrrega llesta!",
      successMessage: "El recurs s'està descarregant. També t'hem enviat un email amb l'enllaç.",
      errorTitle: "Error",
      errorMessage: "No s'ha pogut processar la sol·licitud. Torna-ho a provar.",
    },
  };

  const t = texts[language] || texts.es;

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Record the download lead via edge function (sends emails)
      const { error } = await supabase.functions.invoke("submit-contact", {
        body: {
          name: values.name,
          email: values.email,
          company: values.company || '',
          subject: `Descarga: ${resource.title}`,
          message: `Solicitud de descarga del recurso: ${resource.title} (${resource.type})`,
          source_site: siteConfig.sourceSite,
        },
      });

      if (error) throw error;

      // Increment download count
      await supabase
        .from("resources")
        .update({ download_count: (resource.download_count || 0) + 1 })
        .eq("id", resource.id);

      // Trigger download
      if (resource.file_url) {
        window.open(resource.file_url, "_blank");
      }

      setIsSuccess(true);
      toast({
        title: t.successTitle,
        description: t.successMessage,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: t.errorTitle,
        description: t.errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {t.successTitle}
        </h3>
        <p className="text-muted-foreground text-sm">
          {t.successMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Download className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">
          {t.title}
        </h3>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        {t.subtitle}
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.name}</FormLabel>
                <FormControl>
                  <Input placeholder="Juan García" {...field} />
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
                <FormLabel>{t.email}</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="juan@empresa.com" {...field} />
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
                <FormLabel>{t.company}</FormLabel>
                <FormControl>
                  <Input placeholder="Empresa S.L." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="acceptMarketing"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal text-muted-foreground leading-tight">
                  {t.marketing}
                </FormLabel>
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.submitting}
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                {t.submit}
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};
