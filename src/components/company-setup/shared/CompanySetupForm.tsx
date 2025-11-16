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
  landingVariant: 'calculator' | 'nie-hell' | 'tech-startup' | 'express';
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
  submitButtonText = 'Submit',
  showAllFields = true,
}: CompanySetupFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
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
        title: 'Success!',
        description: 'Thank you for your interest. We\'ll contact you soon.',
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
        title: 'Error',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="John Smith"
            className="mt-1"
          />
          {errors.name && (
            <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="john@example.com"
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
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="+34 600 000 000"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                {...register('company_name')}
                placeholder="Acme Inc"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="country_origin">Country of Origin *</Label>
            <Select onValueChange={(value) => setValue('country_origin', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select your country" />
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
              <Label htmlFor="timeline">Timeline</Label>
              <Select onValueChange={(value) => setValue('timeline', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="When do you need this?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate (ASAP)</SelectItem>
                  <SelectItem value="1-month">Within 1 month</SelectItem>
                  <SelectItem value="3-months">Within 3 months</SelectItem>
                  <SelectItem value="6-months">Within 6 months</SelectItem>
                  <SelectItem value="exploring">Just exploring</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="company_stage">Company Stage</Label>
              <Select onValueChange={(value) => setValue('company_stage', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Your current situation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="idea">Just an idea</SelectItem>
                  <SelectItem value="registered-abroad">Registered abroad</SelectItem>
                  <SelectItem value="ready-to-register">Ready to register</SelectItem>
                  <SelectItem value="relocating">Relocating existing company</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="message">Additional Information</Label>
            <Textarea
              id="message"
              {...register('message')}
              placeholder="Tell us about your project..."
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
            Submitting...
          </>
        ) : (
          submitButtonText
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        By submitting, you agree to our privacy policy. We'll never share your data.
      </p>

      {/* Footer with Navarro Tax Legal Branding */}
      <div className="mt-6 pt-6 border-t text-center">
        <p className="text-sm text-muted-foreground mb-3">
          Service provided by:
        </p>
        <div className="flex items-center justify-center gap-2 mb-3">
          <img 
            src="/assets/logos/navarro-tax-legal.svg" 
            alt="Navarro Tax Legal" 
            className="h-8"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Barcelona Bar Association • Tax Advisors Registry
        </p>
      </div>
    </form>
  );
};
