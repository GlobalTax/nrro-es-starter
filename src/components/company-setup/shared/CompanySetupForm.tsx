import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company_name: z.string().optional(),
  country_origin: z.string().min(1, 'Please select your country'),
  industry: z.string().optional(),
  estimated_revenue: z.string().optional(),
  timeline: z.string().optional(),
  company_stage: z.string().optional(),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CompanySetupFormProps {
  landingVariant: 'calculator' | 'nie-hell' | 'tech-startup' | 'express' | 'herencias-barcelona';
  conversionType?: string;
  calculatorData?: any;
  onSuccess?: () => void;
  submitButtonText?: string;
  showAllFields?: boolean;
}

export const CompanySetupForm = ({
  landingVariant,
  conversionType,
  calculatorData,
  onSuccess,
  submitButtonText,
  showAllFields = true,
}: CompanySetupFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Get UTM parameters from URL
      const urlParams = new URLSearchParams(window.location.search);
      const utm_data = {
        utm_campaign: urlParams.get('utm_campaign') || undefined,
        utm_source: urlParams.get('utm_source') || undefined,
        utm_medium: urlParams.get('utm_medium') || undefined,
        utm_term: urlParams.get('utm_term') || undefined,
        utm_content: urlParams.get('utm_content') || undefined,
      };

      const payload = {
        ...data,
        landing_variant: landingVariant,
        conversion_type: conversionType,
        calculator_data: calculatorData,
        landing_page_url: window.location.href,
        referrer: document.referrer || undefined,
        ...utm_data,
      };

      const { data: result, error } = await supabase.functions.invoke('submit-company-setup-lead', {
        body: payload,
      });

      if (error) throw error;

      toast({
        title: t('shared.form.success.title'),
        description: t('shared.form.success.description'),
      });

      // Track conversion event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'lead_captured', {
          variant: landingVariant,
          conversion_type: conversionType,
          lead_score: result.leadScore,
          priority: result.priority,
        });
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error submitting lead:', error);
      toast({
        title: t('shared.form.error.title'),
        description: error.message || t('shared.form.error.description'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const buttonText = submitButtonText || (landingVariant === 'herencias-barcelona' ? t('shared.form.herenciasButton') : t('shared.form.submit'));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">{t('shared.form.fullName')}</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder={t('shared.form.fullNamePlaceholder')}
            className="mt-1"
          />
          {errors.name && (
            <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">{t('shared.form.email')}</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder={t('shared.form.emailPlaceholder')}
            className="mt-1"
          />
          {errors.email && (
            <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      {showAllFields && (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">{t('shared.form.phone')}</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder={t('shared.form.phonePlaceholder')}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="company_name">{t('shared.form.companyName')}</Label>
              <Input
                id="company_name"
                {...register('company_name')}
                placeholder={t('shared.form.companyNamePlaceholder')}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="country_origin">{t('shared.form.country')}</Label>
            <Select onValueChange={(value) => setValue('country_origin', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder={t('shared.form.countryPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UK">United Kingdom</SelectItem>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="FR">France</SelectItem>
                <SelectItem value="DE">Germany</SelectItem>
                <SelectItem value="IT">Italy</SelectItem>
                <SelectItem value="NL">Netherlands</SelectItem>
                <SelectItem value="BE">Belgium</SelectItem>
                <SelectItem value="CH">Switzerland</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="AU">Australia</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.country_origin && (
              <p className="text-sm text-destructive mt-1">{errors.country_origin.message}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timeline">{t('shared.form.timeline')}</Label>
              <Select onValueChange={(value) => setValue('timeline', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={t('shared.form.timelinePlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">{t('shared.form.timelineOptions.immediate')}</SelectItem>
                  <SelectItem value="1-month">{t('shared.form.timelineOptions.1month')}</SelectItem>
                  <SelectItem value="3-months">{t('shared.form.timelineOptions.3months')}</SelectItem>
                  <SelectItem value="6-months">{t('shared.form.timelineOptions.6months')}</SelectItem>
                  <SelectItem value="exploring">{t('shared.form.timelineOptions.exploring')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="company_stage">{t('shared.form.companyStage')}</Label>
              <Select onValueChange={(value) => setValue('company_stage', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={t('shared.form.companyStagePlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="idea">{t('shared.form.companyStageOptions.idea')}</SelectItem>
                  <SelectItem value="registered-abroad">{t('shared.form.companyStageOptions.registeredAbroad')}</SelectItem>
                  <SelectItem value="ready-to-register">{t('shared.form.companyStageOptions.readyToRegister')}</SelectItem>
                  <SelectItem value="relocating">{t('shared.form.companyStageOptions.relocating')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="message">{t('shared.form.message')}</Label>
            <Textarea
              id="message"
              {...register('message')}
              placeholder={t('shared.form.messagePlaceholder')}
              className="mt-1 min-h-[100px]"
            />
          </div>
        </>
      )}

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('shared.form.submitting')}
          </>
        ) : (
          buttonText
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        {t('shared.form.privacy')}
      </p>

      {/* Footer with Navarro Tax Legal Branding */}
      <div className="mt-6 pt-6 border-t text-center">
        <p className="text-sm text-muted-foreground mb-3">
          {t('shared.form.providedBy')}
        </p>
        <div className="flex items-center justify-center gap-2 mb-3">
          <img 
            src="/assets/logos/navarro-tax-legal.svg" 
            alt="Navarro Tax Legal" 
            className="h-8"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {t('shared.form.certifications')}
        </p>
      </div>
    </form>
  );
};
