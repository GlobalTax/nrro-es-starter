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
    <section className="py-16 bg-muted/30">
      <div className="container">
        <h2 className="text-3xl font-normal text-center mb-4 text-foreground">
          {title}
        </h2>
        {subtitle && (
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="bg-background">
              <CardHeader>
                <CardTitle className="text-xl font-normal">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
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
