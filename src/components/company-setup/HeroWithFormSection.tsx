import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Shield, Clock, Users } from 'lucide-react';
import { CompanySetupForm } from './shared/CompanySetupForm';

interface HeroWithFormSectionProps {
  badge?: string;
  title: string;
  subtitle: string;
  trustPoints?: string[];
  primaryCta?: {
    text: string;
    url: string;
  };
  formTitle?: string;
  formSubtitle?: string;
}

export const HeroWithFormSection = ({
  badge,
  title,
  subtitle,
  trustPoints = [],
  formTitle = "Get Your Free Consultation",
  formSubtitle = "Average response time: 2 hours"
}: HeroWithFormSectionProps) => {
  return (
    <section className="relative min-h-[90vh] bg-gradient-to-br from-primary via-primary to-accent overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            {badge && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20">
                <Shield className="w-4 h-4 text-accent-foreground" />
                <span className="text-sm font-medium text-primary-foreground">{badge}</span>
              </div>
            )}
            
            <h1 className="hero-title !text-4xl sm:!text-5xl lg:!text-6xl xl:!text-7xl">
              {title}
            </h1>
            
            <p className="text-lg lg:text-xl text-primary-foreground/80 max-w-xl leading-relaxed">
              {subtitle}
            </p>

            {/* Trust Points */}
            {trustPoints.length > 0 && (
              <div className="space-y-3 pt-4">
                {trustPoints.map((point, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-accent-foreground flex-shrink-0" />
                    <span className="text-primary-foreground/90">{point}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Social Proof */}
            <div className="flex flex-wrap gap-6 pt-6 border-t border-primary-foreground/20">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-accent-foreground" />
                <span className="text-sm text-primary-foreground/80">
                  <strong className="text-primary-foreground">300+</strong> companies established
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent-foreground" />
                <span className="text-sm text-primary-foreground/80">
                  <strong className="text-primary-foreground">4-6 weeks</strong> average time
                </span>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="lg:pl-8">
            <div className="bg-background rounded-2xl shadow-2xl p-6 lg:p-8 border border-border">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  {formTitle}
                </h2>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4" />
                  {formSubtitle}
                </p>
              </div>

              <CompanySetupForm 
                landingVariant="company-setup-spain"
                showAllFields={false}
              />

              {/* Trust badges under form */}
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>100% Secure</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>No obligation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
