import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Schema will be created with translations inside the component
const createFormSchema = (t: (key: string) => string) => z.object({
  name: z.string().trim().min(2, t('serviceForm.validation.nameMin')).max(100),
  email: z.string().trim().email(t('serviceForm.validation.emailInvalid')).max(255),
  phone: z.string().trim().optional(),
  company: z.string().trim().max(100).optional(),
  message: z.string().trim().min(10, t('serviceForm.validation.messageMin')).max(1000),
  privacy: z.boolean().refine(val => val === true, t('serviceForm.validation.privacyRequired')),
});

interface ServiceContactFormProps {
  serviceName: string;
}

export const ServiceContactForm = ({ serviceName }: ServiceContactFormProps) => {
  const { trackFormSubmit } = useAnalytics();
  const { t } = useLanguage();
  const siteConfig = useSiteConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = createFormSchema(t);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      message: `${t('serviceForm.defaultMessage')} ${serviceName}`,
      privacy: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.functions.invoke('submit-contact', {
        body: {
          name: values.name,
          email: values.email,
          company: values.company || '',
          subject: `Consulta sobre servicio: ${serviceName}`,
          message: values.message,
          source_site: siteConfig.sourceSite,
        },
      });

      if (error) throw error;

      // Track form submission
      trackFormSubmit("servicio_consulta", {
        service_name: serviceName,
        has_phone: !!values.phone,
        has_company: !!values.company,
      });
      
      toast.success(t('serviceForm.success.title'), {
        description: t('serviceForm.success.description'),
      });
      
      form.reset({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: `${t('serviceForm.defaultMessage')} ${serviceName}`,
        privacy: false,
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(t('serviceForm.error.title'), {
        description: t('serviceForm.error.description'),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('serviceForm.name.label')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('serviceForm.name.placeholder')} {...field} />
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
                <FormLabel>{t('serviceForm.email.label')}</FormLabel>
                <FormControl>
                  <Input type="email" placeholder={t('serviceForm.email.placeholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('serviceForm.phone.label')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('serviceForm.phone.placeholder')} {...field} />
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
                <FormLabel>{t('serviceForm.company.label')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('serviceForm.company.placeholder')} {...field} />
                </FormControl>
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
              <FormLabel>{t('serviceForm.message.label')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('serviceForm.message.placeholder')}
                  className="min-h-[120px] resize-none"
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
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal">
                  {t('serviceForm.privacy.label')}
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="lg"
          className="w-full md:w-auto bg-black text-white hover:bg-black/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('serviceForm.button.sending')}
            </>
          ) : (
            t('serviceForm.button.submit')
          )}
        </Button>
      </form>
    </Form>
  );
};
