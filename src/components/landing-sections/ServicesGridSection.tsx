import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

interface ServiceItem {
  title: string;
  description: string;
  features: string[];
}

interface ServicesGridSectionProps {
  title: string;
  subtitle?: string;
  services: ServiceItem[];
}

export const ServicesGridSection = ({ title, subtitle, services }: ServicesGridSectionProps) => {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container">
        {subtitle && (
          <h2 className="font-mono font-light text-xs md:text-sm tracking-wide uppercase text-foreground/70 mb-3 text-center">
            {subtitle}
          </h2>
        )}
        <h2 className="text-3xl md:text-4xl font-normal text-center mb-16 text-foreground">
          {title}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <Card key={index} className="border-border/50 hover:border-primary/30 transition-colors">
              <CardHeader>
                <CardTitle className="text-xl font-normal">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
