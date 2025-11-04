import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SectionHeader } from "@/components/ui/typography";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Send, Shield } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

const formSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  phone: z.string().trim().min(9, "Teléfono inválido").max(20),
  country: z.string().trim().min(2, "Selecciona tu país de origen").max(100),
  jobSituation: z.string().min(1, "Selecciona tu situación laboral"),
  transferDate: z.string().min(1, "Indica tu fecha estimada de traslado"),
  message: z.string().trim().max(2000).optional(),
  privacy: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar la política de privacidad",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export const LeyBeckhamContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { trackFormSubmit } = useAnalytics();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      country: "",
      jobSituation: "",
      transferDate: "",
      message: "",
      privacy: false,
    },
  });

  const mapTransferDateToEstimatedDate = (transferDate: string): string => {
    const today = new Date();
    let estimatedDate = new Date(today);

    switch (transferDate) {
      case "ya-estoy":
        // Ya está en España, usar fecha de hoy
        break;
      case "1-3-meses":
        estimatedDate.setMonth(today.getMonth() + 2); // Promedio de 2 meses
        break;
      case "3-6-meses":
        estimatedDate.setMonth(today.getMonth() + 4); // Promedio de 4 meses
        break;
      case "6-12-meses":
        estimatedDate.setMonth(today.getMonth() + 9); // Promedio de 9 meses
        break;
      case "mas-12-meses":
        estimatedDate.setMonth(today.getMonth() + 18); // Promedio de 18 meses
        break;
      default:
        estimatedDate.setMonth(today.getMonth() + 6); // Default: 6 meses
    }

    return estimatedDate.toISOString().split('T')[0]; // Formato: YYYY-MM-DD
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      const estimatedMoveDate = mapTransferDateToEstimatedDate(data.transferDate);

      const { error } = await supabase.functions.invoke("process-ley-beckham-lead", {
        body: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          country: data.country,
          jobSituation: data.jobSituation,
          estimatedMoveDate: estimatedMoveDate,
          message: data.message || "",
        },
      });

      if (error) throw error;

      trackFormSubmit("ley_beckham_contact", {
        form_location: "ley-beckham-landing",
        landing_source: "google-ads-ley-beckham",
        conversion_label: "ley_beckham_lead",
      });

      toast({
        title: "¡Solicitud enviada con éxito!",
        description: "Nos pondremos en contacto contigo en menos de 24 horas para analizar tu caso.",
      });

      form.reset();
    } catch (error) {
      console.error("Error al enviar formulario:", error);
      toast({
        variant: "destructive",
        title: "Error al enviar",
        description: "Ha ocurrido un error. Por favor, inténtalo de nuevo o contacta por teléfono.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-20 md:py-28 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="font-mono font-light text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-4">
            Consulta Gratuita
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal leading-tight mb-4">
            Solicita tu Análisis de Elegibilidad
          </h2>
          <p className="text-body max-w-2xl mx-auto">
            Completa el formulario y te contactaremos en menos de 24 horas para evaluar tu caso sin compromiso
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="bg-card border border-border/50">
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre completo *</FormLabel>
                          <FormControl>
                            <Input placeholder="Tu nombre" {...field} />
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
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="tu@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono *</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+34 600 000 000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>País de origen *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: Reino Unido, Francia..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="jobSituation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Situación laboral *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="contrato-espana">Contrato de trabajo en España</SelectItem>
                              <SelectItem value="directivo">Directivo/Administrador</SelectItem>
                              <SelectItem value="autonomo">Autónomo</SelectItem>
                              <SelectItem value="emprendedor">Emprendedor/Fundador</SelectItem>
                              <SelectItem value="traslado-interno">Traslado interno empresa</SelectItem>
                              <SelectItem value="otro">Otro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="transferDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha estimada de traslado *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ya-estoy">Ya estoy en España (menos de 6 meses)</SelectItem>
                              <SelectItem value="1-3-meses">En 1-3 meses</SelectItem>
                              <SelectItem value="3-6-meses">En 3-6 meses</SelectItem>
                              <SelectItem value="6-12-meses">En 6-12 meses</SelectItem>
                              <SelectItem value="mas-12-meses">Más de 12 meses</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensaje o consulta (opcional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Cuéntanos más sobre tu situación..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="privacy"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal cursor-pointer">
                            Acepto la{" "}
                            <a href="/privacy" className="text-primary underline" target="_blank">
                              política de privacidad
                            </a>{" "}
                            y el tratamiento de mis datos personales *
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col gap-4">
                    <Button type="submit" size="lg" disabled={isSubmitting} className="w-full text-base">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Solicitar Consulta Gratuita sobre Ley Beckham
                        </>
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" />
                        <span>100% Confidencial</span>
                      </div>
                      <span>•</span>
                      <span>Respuesta en 24h</span>
                      <span>•</span>
                      <span>Sin compromiso</span>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Este formulario es específico para consultas sobre la Ley Beckham. Para otros servicios,{" "}
            <a href="/contact" className="text-primary underline">
              visita nuestra página de contacto
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
};
