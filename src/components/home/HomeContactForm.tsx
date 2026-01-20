import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Send, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { LanguageLink } from "@/components/ui/language-link";

const createFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(2, t("validation.nameRequired")),
    email: z.string().email(t("validation.emailInvalid")),
    company: z.string().optional(),
    message: z.string().min(10, t("validation.messageRequired")),
    privacy: z.boolean().refine((val) => val === true, {
      message: t("validation.privacyRequired"),
    }),
  });

type FormValues = z.infer<ReturnType<typeof createFormSchema>>;

export const HomeContactForm = () => {
  const { t } = useTranslation();
  const { trackFormSubmit } = useAnalytics();
  const siteConfig = useSiteConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(createFormSchema(t)),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
      privacy: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("submit-contact", {
        body: {
          name: values.name,
          email: values.email,
          company: values.company,
          message: values.message,
          subject: "Consulta desde Home",
          source_site: siteConfig.sourceSite,
        },
      });

      if (error) throw error;

      trackFormSubmit("home_contact_form", { source: "home" });
      setIsSuccess(true);
      form.reset();

      toast({
        title: t("homeContact.success.title"),
        description: t("homeContact.success.description"),
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: t("common.error"),
        description: t("common.errorDescription"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-muted/30 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start max-w-6xl mx-auto">
          {/* Left column: Text */}
          <div className="space-y-6">
            <p className="text-sm font-medium tracking-widest uppercase text-primary">
              {t("homeContact.overline")}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-tight text-foreground font-display font-normal">
              {t("homeContact.title")}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
              {t("homeContact.subtitle")}
            </p>
            
            <div className="pt-4 space-y-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <span>{t("homeContact.benefit1")}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <span>{t("homeContact.benefit2")}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <span>{t("homeContact.benefit3")}</span>
              </div>
            </div>
          </div>

          {/* Right column: Form */}
          <div className="bg-background rounded-2xl p-8 shadow-sm border border-border/50">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center py-12 text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {t("homeContact.success.title")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("homeContact.success.description")}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setIsSuccess(false)}
                    className="mt-4"
                  >
                    {t("homeContact.sendAnother")}
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder={t("homeContact.name")}
                                  className="h-12 bg-muted/30 border-border/50 focus:border-primary"
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
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder={t("homeContact.email")}
                                  className="h-12 bg-muted/30 border-border/50 focus:border-primary"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder={t("homeContact.company")}
                                className="h-12 bg-muted/30 border-border/50 focus:border-primary"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                placeholder={t("homeContact.message")}
                                className="min-h-[120px] bg-muted/30 border-border/50 focus:border-primary resize-none"
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
                              <label className="text-sm text-muted-foreground cursor-pointer">
                                {t("homeContact.privacy")}{" "}
                                <LanguageLink
                                  to="/privacidad"
                                  className="text-primary hover:underline"
                                >
                                  {t("homeContact.privacyLink")}
                                </LanguageLink>
                              </label>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 group"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <div className="h-4 w-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                            {t("homeContact.sending")}
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            {t("homeContact.submit")}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </span>
                        )}
                      </Button>
                    </form>
                  </Form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
