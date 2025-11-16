import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface CTAFinalSectionProps {
  title: string;
  description: string;
  primaryCta: {
    text: string;
    url: string;
  };
  secondaryCta?: {
    text: string;
    url: string;
  };
}

export const CTAFinalSection = ({
  title,
  description,
  primaryCta,
  secondaryCta,
}: CTAFinalSectionProps) => {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-normal mb-4">
            {title}
          </h2>
          
          <p className="text-xl mb-8 opacity-90">
            {description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <a href={primaryCta.url}>
                {primaryCta.text}
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            {secondaryCta && (
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <a href={secondaryCta.url}>
                  {secondaryCta.text}
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
