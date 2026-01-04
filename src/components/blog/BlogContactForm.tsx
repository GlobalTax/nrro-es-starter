import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

const formSchema = z.object({
  name: z.string().min(2, "El nombre es requerido").max(100),
  email: z.string().email("Email inválido").max(255),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres").max(1000),
});

type FormData = z.infer<typeof formSchema>;

interface BlogContactFormProps {
  articleTitle: string;
  articleSlug: string;
}

export const BlogContactForm = ({ articleTitle, articleSlug }: BlogContactFormProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("submit-contact", {
        body: {
          ...data,
          subject: `Consulta desde artículo: ${articleTitle}`,
          source: `blog/${articleSlug}`,
        },
      });

      if (error) throw error;

      setIsSubmitted(true);
      reset();
      toast({
        title: t('contact.successTitle'),
        description: t('contact.successDescription'),
      });
    } catch (error) {
      toast({
        title: t('contact.errorTitle'),
        description: t('contact.errorDescription'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mt-12">
        <div className="flex items-center gap-3 text-primary">
          <CheckCircle className="h-6 w-6" />
          <div>
            <h4 className="font-semibold">{t('contact.thankYou')}</h4>
            <p className="text-sm text-muted-foreground">{t('contact.weWillContact')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 border border-border rounded-lg p-6 mt-12">
      <h4 className="font-semibold text-lg mb-2">{t('blog.contactFormTitle')}</h4>
      <p className="text-sm text-muted-foreground mb-6">{t('blog.contactFormSubtitle')}</p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              placeholder={t('contact.name')}
              {...register("name")}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Input
              type="email"
              placeholder={t('contact.email')}
              {...register("email")}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>
        <div>
          <Textarea
            placeholder={t('blog.contactFormPlaceholder')}
            rows={3}
            {...register("message")}
            className={errors.message ? "border-destructive" : ""}
          />
          {errors.message && (
            <p className="text-xs text-destructive mt-1">{errors.message.message}</p>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          {t('blog.sendQuery')}
        </Button>
      </form>
    </div>
  );
};
