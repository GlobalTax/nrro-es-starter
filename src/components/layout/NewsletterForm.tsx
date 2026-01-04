import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";

const newsletterSchema = z.object({
  email: z.string().email(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "consent_required" }),
  }),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

export const NewsletterForm = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
      consent: false as unknown as true,
    },
  });

  const consentValue = watch("consent");

  const onSubmit = async (data: NewsletterFormData) => {
    setIsSubmitting(true);

    try {
      // Check if email already exists
      const { data: existing } = await supabase
        .from("newsletter_subscriptions")
        .select("id")
        .eq("email", data.email)
        .maybeSingle();

      if (existing) {
        toast({
          title: t("newsletter.errorTitle"),
          description: t("newsletter.alreadySubscribed"),
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Insert new subscription
      const { error } = await supabase.from("newsletter_subscriptions").insert({
        email: data.email,
        consent: data.consent,
        source_page: window.location.pathname,
        source_site: "es",
        is_active: true,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: t("newsletter.successTitle"),
        description: t("newsletter.successDescription"),
      });
      reset();

      // Reset success state after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast({
        title: t("newsletter.errorTitle"),
        description: t("newsletter.errorDescription"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex items-center gap-2 text-primary-foreground/80">
        <CheckCircle2 className="h-5 w-5 text-green-400" />
        <span className="text-sm">{t("newsletter.successTitle")}</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h4 className="text-base font-medium text-primary-foreground">
          {t("newsletter.title")}
        </h4>
        <p className="text-sm text-primary-foreground/60">
          {t("newsletter.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder={t("newsletter.emailPlaceholder")}
              className="pl-9 bg-background/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-primary-foreground/40"
              {...register("email")}
            />
          </div>
          <Button
            type="submit"
            size="default"
            disabled={isSubmitting}
            className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/20"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t("newsletter.subscribe")
            )}
          </Button>
        </div>

        {errors.email && (
          <p className="text-xs text-red-400">{t("newsletter.invalidEmail")}</p>
        )}

        <div className="flex items-start gap-2">
          <Checkbox
            id="newsletter-consent"
            checked={consentValue}
            onCheckedChange={(checked) =>
              setValue("consent", checked as unknown as true)
            }
            className="mt-0.5 border-primary-foreground/30 data-[state=checked]:bg-primary-foreground/20 data-[state=checked]:border-primary-foreground/40"
          />
          <label
            htmlFor="newsletter-consent"
            className="text-xs text-primary-foreground/60 leading-relaxed cursor-pointer"
          >
            {t("newsletter.consent")}
          </label>
        </div>

        {errors.consent && (
          <p className="text-xs text-red-400">{t("newsletter.consentRequired")}</p>
        )}
      </form>
    </div>
  );
};
