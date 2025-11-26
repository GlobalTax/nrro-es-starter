import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProcessStep {
  number: number;
  title: string;
  description: string;
  duration?: string;
}

interface ProcessStepsSectionProps {
  title: string;
  subtitle?: string;
  steps: ProcessStep[];
}

export const ProcessStepsSection = ({ title, subtitle, steps }: ProcessStepsSectionProps) => {
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
        
        <div className="max-w-4xl mx-auto space-y-8">
          {steps.map((step) => (
            <div key={step.number} className="flex gap-6 group">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-normal">
                  {step.number}
                </div>
              </div>
              <div className="flex-1 pb-8 border-b border-border/50 last:border-0">
                <h3 className="text-xl font-normal mb-2 text-foreground">{step.title}</h3>
                {step.duration && (
                  <span className="text-sm text-primary font-mono mb-3 inline-block">{step.duration}</span>
                )}
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
