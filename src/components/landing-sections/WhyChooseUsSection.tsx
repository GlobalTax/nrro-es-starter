import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface Credential {
  icon: LucideIcon;
  value: string;
  label: string;
  description?: string;
}

interface WhyChooseUsSectionProps {
  title: string;
  subtitle?: string;
  credentials: Credential[];
}

export const WhyChooseUsSection = ({ title, subtitle, credentials }: WhyChooseUsSectionProps) => {
  return (
    <section className="py-20 md:py-28 bg-neutral-50">
      <div className="container">
        {subtitle && (
          <h2 className="font-mono font-light text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-3 text-center">
            {subtitle}
          </h2>
        )}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-normal text-foreground">
            {title}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {credentials.map((credential, index) => {
            const Icon = credential.icon;
            return (
              <div 
                key={index} 
                className="flex flex-col gap-4 p-8 rounded-xl bg-white border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-2xl font-normal text-foreground">
                    {credential.value}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground mb-1">
                    {credential.label}
                  </div>
                  {credential.description && (
                    <p className="text-sm text-foreground/70">
                      {credential.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
