import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';

interface CalculatorCTASectionProps {
  title: string;
  description: string;
  ctaText: string;
  ctaUrl?: string;
}

export const CalculatorCTASection = ({
  title,
  description,
  ctaText,
  ctaUrl = '#calculadora',
}: CalculatorCTASectionProps) => {
  return (
    <section id="calculadora" className="py-16 bg-primary/5">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Calculator className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-normal mb-4 text-foreground">
            {title}
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {description}
          </p>
          
          <Button size="lg" asChild>
            <a href={ctaUrl}>
              <Calculator className="mr-2 h-5 w-5" />
              {ctaText}
            </a>
          </Button>
          
          <p className="text-sm text-muted-foreground mt-4">
            Sin compromiso • Respuesta inmediata • 100% confidencial
          </p>
        </div>
      </div>
    </section>
  );
};
